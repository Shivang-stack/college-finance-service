import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  Button,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ApplyForFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      phone:'',
      applicationType: '',
      reason: '',
      status: 'PENDING',
      user_id: localStorage.getItem('id'),
      // files: []
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  // handleFileChange = (event) => {
  //   this.setState({ files: event.target.files });
  // }

  handleApplicationTypeChange = (eventKey) => {
    this.setState({
      applicationType: eventKey
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, phone, applicationType, reason, status, user_id } = this.state;
    
    const applicationData = {
      name,
      email,
      phone,
      applicationType,
      reason,
      status,
      user_id
    }
  
    fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    })
    .then(response => {
      if (response.ok) {
        alert('Application submitted successfully');
      } else {
        console.log(response)
        alert('Error submitting application');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error submitting application');
    });
  }

  render() {
    return (
      <div className='container'>
        <h3>Apply For Funds</h3>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <FormControl
              name='name'
              input='text'
              placeholder='Enter Your Full Name'
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='email'
              input='email'
              placeholder='Enter Your Email'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name='phone'
              input='text'
              placeholder='Enter Your Phone'
              value={this.state.phone}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
          <FormGroup>
            <DropdownButton
              title='Select Application Type'
              id='applicationType-dropdown'
              onSelect={this.handleApplicationTypeChange}
            >
              <MenuItem eventKey="scholarship">Scholarship</MenuItem>
              <MenuItem eventKey="festfund">Fest-Fund</MenuItem>
              <MenuItem eventKey="projectfund">Project-Fund</MenuItem>
              <MenuItem eventKey="other">Other</MenuItem>
            </DropdownButton>
          </FormGroup>
          </FormGroup>
          <FormGroup>
            <FormControl
              name='reason'
              input='text'
              placeholder='Enter Subject/Reason'
              value={this.state.reason}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <h3>Upload Required documents</h3>
            {/* <input type="file" multiple onChange={this.handleFileChange} /> */}
          </FormGroup>
          <button type="submit" className='btn'>Submit</button>
          <Link to='/home'><div className='btn'>Back</div></Link>
        </form>
      </div>
    );
  }
}

export default ApplyForFunds;
