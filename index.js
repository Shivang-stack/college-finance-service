const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');
const { promisify } = require('util');

const isDevelopment = process.env.ENV === 'development';

const REDIS_URL = isDevelopment ?
  'redis://127.0.0.1:6379':'redis://127.0.0.1:6379' 
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

const redis = require('redis');
const client = redis.createClient(REDIS_URL);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a new user with auto-incremental id
app.post('/api/register', (req, res) => {
  const user = req.body;
  const wallet = new Wallet();
  wallet.balance=0
  client.incr('users:id', (err, id) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      user.id = id;
      user.publicKey =wallet.publicKey
      user.balance =wallet.balance
      user.keyPair =wallet.keyPair
      client.hmset(`users:${id}`, user, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          return res.status(201).json({ message: 'User registered successfully!' });
        }
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  client.keys('users:*', (err, keys) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    let userFound = false;
    let userKey;

    keys.forEach(key => {
      client.type(key, (err, type) => {
        if (err) {
          console.error(err);
        } else if (type === 'hash') {
          client.hgetall(key, (err, user) => {
            if (err) {
              console.error(err);
            } else if (user && user.email === email && user.password === password) {
              // User found with matching email and password
              userFound = true;
              userKey = user.id;
            }
          });
        }
      });
    });

    // No user found with matching email and password
    setTimeout(() => {
      if (userFound) {
        res.send(userKey);
      } else {
        res.status(401).send('Invalid email or password');
      }
    }, 1000);
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  client.keys('users:*', (err, keys) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      client.mget(keys, (err, users) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          const result = users.map(user => JSON.parse(user));
          res.send(result);
        }
      });
    }
  });
});

// Get user by id
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  client.hgetall(`users:${id}`, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).send(`User with id ${id} not found`);
    } else {
      res.send(user);
    }
  });
});

// Delete all users
app.delete('/api/users', (req, res) => {
  client.keys('users:*', (err, keys) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else if (keys.length === 0) {
      res.status(404).send('No users found');
    } else {
        client.del(keys, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          } else {
            res.send(`Deleted ${result} users`);
          }
      });
    }
  });
});
  
  // Delete user by id
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
    client.del(`users:${id}`, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else if (result === 0) {
        res.status(404).send(`User with id ${id} not found`);
      } else {
        res.send(`Deleted user with id ${id}`);
      }
    });
});

// Promisify Redis methods
const hgetallAsync = promisify(client.hgetall).bind(client);
const hmsetAsync = promisify(client.hmset).bind(client);
const hincrbyAsync = promisify(client.hincrby).bind(client);
const hdelAsync = promisify(client.hdel).bind(client);

// API to create a new application
app.post('/api/applications', async (req, res) => {
  const { name, phone, email, applicationType, reason, status, user_id } = req.body;

  const id = await hincrbyAsync('applications', 'id', 1);

  const application = { id, name, phone, email, applicationType, reason, status,user_id };
  await hmsetAsync(`application:${id}`, application);

  res.status(201).json({ message: 'Application created successfully' });
});

// API to retrieve all applications
app.get('/api/applications', async (req, res) => {
  const keys = await hgetallAsync('applications');

  const applications = [];
  for (const key in keys) {
    if (key !== 'id') {
      const application = await hgetallAsync(`application:${keys[key]}`);
      applications.push(application);
    }
  }

  res.status(200).json(applications);
});

// API to retrieve a single application
app.get('/api/applications/:id', async (req, res) => {
  const application = await hgetallAsync(`application:${req.params.id}`);

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
  } else {
    res.status(200).json(application);
  }
});

// API to update a application
app.put('/api/applications/:id', async (req, res) => {
  const { name, applicationType, reason } = req.body;

  const application = await hgetallAsync(`application:${req.params.id}`);

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
  } else {
    const updatedApplication = { ...application, name, applicationType, reason };
    await hmsetAsync(`application:${req.params.id}`, updatedApplication);

    res.status(200).json({ message: 'Application updated successfully' });
  }
});

app.put('/api/admin/applications/:id', async (req, res) => {
  const { name, applicationType, reason, status } = req.body;

  const application = await hgetallAsync(`application:${req.params.id}`);

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
  } else {
    const updatedApplication = { ...application, name, applicationType, reason, status };
    await hmsetAsync(`application:${req.params.id}`, updatedApplication);

    res.status(200).json({ message: 'Application updated successfully' });
  }
});

// API to delete a application
app.delete('/api/applications/:id', async (req, res) => {
  const application = await hgetallAsync(`application:${req.params.id}`);

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
  } else {
    await hdelAsync('applications', `application:${req.params.id}`);

    res.status(200).json({ message: 'Application deleted successfully' });
  }
});

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
  res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;

  const blocksReversed = blockchain.chain.slice().reverse();

  let startIndex = (id-1) * 5;
  let endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool
    .existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain
      });
    }
  } catch(error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info/:id', (req, res) => {
  const id = req.params.id;
  client.hgetall(`users:${id}`, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).send(`User with id ${id} not found`);
    } else {
      const address = user.publicKey
      res.json({
        address: address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
      });
    }
  });

  
});

app.get('/api/known-addresses', (req, res) => {
  const addressMap = {};

  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      const recipient = Object.keys(transaction.outputMap);

      recipient.forEach(recipient => addressMap[recipient] = recipient);
    }
  }

  res.json(Object.keys(addressMap));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });
};

if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
  });

  const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  });

  const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
  });

  for (let i=0; i<20; i++) {
    if (i%3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i%3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
