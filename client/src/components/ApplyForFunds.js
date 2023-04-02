import React, { Component } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ApplyForFunds extends Component {
    handleChange = (event) => {
        const files = event.target.files;
        // handle each file individually
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // do something with the file, such as reading its contents
        }
      }
      

  render() {
      
    return (
      <div className='container'>
        <h3>Apply For Funds</h3>
        <div>
            <FormGroup>
                <FormControl
                    input='text'
                    placeholder='Enter Your Full Name'
                    value={null}
                    onChange={null}
                />
            </FormGroup>
            <FormGroup>
                <FormControl
                    input='text'
                    placeholder='Enter Your USN'
                    value={null}
                    onChange={null}
                />
            </FormGroup>
            <FormGroup>
                <FormControl
                    input='text'
                    placeholder='Enter Type of Application (Scholarship/Reimbersment/Project-Fund/Fest-Fund)'
                    value={null}
                    onChange={null}
                />
            </FormGroup>
            <FormGroup>
                <FormControl
                    input='text'
                    placeholder='Enter Subject/Reason'
                    value={null}
                    onChange={null}
                />
            </FormGroup>
            <FormGroup>
                <h3>Upload Required documents</h3>
                <input type="file" multiple onChange={this.handleChange} />
            </FormGroup>
            
        </div>
        <Link to='/home'><div className='btn'>Submit</div></Link>
        <Link to='/home'><div className='btn'>Back</div></Link>
      </div>
    );
  }
}

export default ApplyForFunds;