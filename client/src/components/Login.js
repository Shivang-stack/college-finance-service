import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // redirect to home page if login is successful
          this.props.history.push('/home');
        } else {
          // display error message if login fails
          this.setState({ error: data.message });
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        this.setState({ error: 'Login failed. Please try again.' });
      });
  }

  render() {
    const { error } = this.state;

    return (
      <div className='container'>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          <h3>Welcome to the AMC INSTITUTION Blockchain Network</h3> 
        </div>
        <h3>Login</h3>
        <div>
          <form onSubmit={this.handleFormSubmit}>
            <FormGroup>
              <FormControl
                name='email'
                type='text'
                placeholder='Enter Your email'
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                name='password'
                type='password'
                placeholder='Enter Password'
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <Link to='/home'><Button type='submit'>Submit</Button></Link>
            <Link to='/'><Button>Back</Button></Link>
            {error && <div className='error'>{error}</div>}
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
