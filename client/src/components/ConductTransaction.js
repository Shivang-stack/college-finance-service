import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  Button,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  updateRecipient = (eventKey) => {
    this.setState({
      recipient: eventKey,
    });
  };

  updateAmount = (event) => {
    this.setState({ amount: Number(event.target.value) });
  }

  conductTransaction = () => {
    const { recipient, amount } = this.state;

    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(json => {
      alert(json.message || json.type);
      history.push('/transaction-pool');
    })
    .catch(error => {
      alert(error.message);
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='ConductTransaction'>
          <Link to='/'>Home</Link>
          <h3>Conduct a Transaction</h3>
          <br />
          <h4>Known Addresses</h4>
          {
            this.state.knownAddresses.map(knownAddress => {
              return (
                <div key={knownAddress}>
                  <div>{knownAddress}</div>
                  <br />
                </div>
              );
            })
          }
          <br />
          <FormGroup>
            <DropdownButton
              title='Select Receiver'
              id='userType-dropdown'
              onSelect={this.updateRecipient} // corrected the function name
            >
              <MenuItem eventKey='stationary'>Stationary</MenuItem>
              <MenuItem eventKey='shopkeeper'>Shopkeeper</MenuItem>
            </DropdownButton>
          </FormGroup>
          <FormGroup>
            <FormControl
              input='number'
              placeholder='amount'
              value={this.state.amount}
              onChange={this.updateAmount}
            />
          </FormGroup>
          <div>
            <Button
              bsStyle="danger"
              onClick={this.conductTransaction}
            >
              Submit
            </Button>
          </div>
          <br/>
          <Link to='/home'><div className='btn pt-5'>Back</div></Link><br/>
        </div>
      </div>
    )
  }
};

export default ConductTransaction;
