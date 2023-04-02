import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class Login extends Component {
  

  render() {
      
    return (
      <div className='container'>
        <img className='logo' src={logo}></img>
        <br />
        <div>
            <h3>Welcome to the AMC INSTITUTION Blockchain Network</h3> 
        </div>
        <h3>Login</h3>
        <div>
            <FormGroup>
            <FormControl
                input='text'
                placeholder='Enter Your Username'
                value={null}
                onChange={null}
            />
            </FormGroup>
            <FormGroup>
            <FormControl
                input='password'
                placeholder='Enter Password'
                value={null}
                onChange={null}
            />
            </FormGroup>
        </div>
        <Link to='/home'><div className='btn'>Submit</div></Link>
        <Link to='/home'><div className='btn'>Back</div></Link>
      </div>
    );
  }
}

export default Login;