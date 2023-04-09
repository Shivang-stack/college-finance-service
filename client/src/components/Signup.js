import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  Button,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    userType:'',
    email:'',
    phonenumber: '',
    // idCard: null,
    message: null
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  // handleFileChange = event => {
  //   const { name, files } = event.target;

  //   this.setState({
  //     [name]: files[0]
  //   });
  // };

  handleRoleChange = (eventKey) => {
    this.setState({
      userType: eventKey,
    });
  };

  
  handleSubmit = async event => {
    event.preventDefault();
    const { username, password, userType, email,phonenumber } = this.state;
  
    const userData = {
      username,
      password,
      userType,
      email,
      phonenumber
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    };
  
    const response = await fetch('/api/register', requestOptions);
    const data = await response.json();
  
    console.log(data); // log the response to the console
    console.log(response.ok)
    if (response.ok) {
      this.setState({ message: data.message });
      this.props.history.push('/home');
    } else {
      this.setState({ message: data.error });
    }
  };

  render() {
    const { message } = this.state;

    return (
      <div className='container'>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          <h3>Welcome to the AMC INSTITUTION Blockchain Network</h3>
        </div>
        <h3>Sign-up</h3>
        {message && <div className='alert'>{message}</div>}
        <div>
          <form>
            
          </form>
          <FormGroup>
            <FormControl
              name='username'
              input='text'
              placeholder='Enter Your USN'
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='name'
              input='text'
              placeholder='Enter Your Name'
              value={this.state.name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='email'
              input='email'
              placeholder='Enter Your email'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='phonenumber'
              input='text'
              placeholder='Enter Your phonenumber'
              value={this.state.phonenumber}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='password'
              input='password'
              placeholder='Enter Password'
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <DropdownButton
              title='Select your role'
              id='userType-dropdown'
              onSelect={this.handleRoleChange}
            >
              <MenuItem eventKey='student'>Student</MenuItem>
              <MenuItem eventKey='faculty'>Faculty</MenuItem>
            </DropdownButton>
          </FormGroup>
          {/* <FormGroup>
            <label>Upload Verification document</label>
            <input type='file' name='idCard' onChange={this.handleFileChange} />
          </FormGroup> */}
        </div>
        <Link to='/home'>
          <Button className='btn' type='submit' onClick={this.handleSubmit}>Submit</Button>
        </Link>
        <Link to='/'>
          <div className='btn'>Back</div>
        </Link>
      </div>
    );
  }
}

export default Signup;
