import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class Home extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='App'>
        <div className='container'>
        <div>
        <img className='logo' width='40px' height='50px' src={logo}></img>
        <h3>AMC INSTITUTION Blockchain Network</h3> 
        </div>
        <br/>
          <h3> <strong>Balance:</strong> <span>{balance}</span></h3>
          <br />
          <div ><Link className='btn' to='/apply-for-funds'>Apply for Funds</Link></div>
          {/* <div ><Link className='btn' to='/blocks'>Blocks</Link></div> */}
          <div ><Link className='btn' to='/conduct-transaction'>Conduct a Transaction</Link></div>
          <div ><Link className='btn' to='/transaction-pool'>Transaction Histroy</Link></div>
          <br />
        </div>
        <br />
        <div className='WalletInfo'>
          <div> <strong>Address:</strong> <span>{address}</span></div>
          <Link to='/'><div className='btn'>Logout</div></Link>
        </div>
      </div>
    );
  }
}

export default Home;