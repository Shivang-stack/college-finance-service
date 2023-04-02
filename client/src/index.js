import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Home from './components/Home';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import Login from './components/Login';
import Signup from './components/Signup';

import './index.css';
import ApplyForFunds from './components/ApplyForFunds';

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/home' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/blocks' component={Blocks} />
      <Route path='/conduct-transaction' component={ConductTransaction} />
      <Route path='/transaction-pool' component={TransactionPool} />
      <Route path='/apply-for-funds' component={ApplyForFunds} />
    </Switch>
  </Router>,
  document.getElementById('root')
);