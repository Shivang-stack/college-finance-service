import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class App extends Component {
  
  render() {
    
    return (
      <div className='App'>
        <div className='container'>
            <img className='logo' src={logo}></img>
            <br />
            <div>
                <h3>Welcome to the AMC INSTITUTION Blockchain Network</h3> 
            </div>
            <br />
            <br />
            <br />
            <Link to='/login'><div className='btn pt-5'>Login</div></Link><br/>
            <Link to='/signup'><div className='btn pt-3'>Sign-up</div></Link>    
        </div>
      </div>
    );
  }
}

export default App;