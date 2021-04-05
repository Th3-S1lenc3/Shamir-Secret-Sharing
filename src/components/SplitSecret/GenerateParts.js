import React, { Component } from 'react';

import { AppContext } from '../AppContext';

const shamir = require('@consento/shamirs-secret-sharing');

import Table from '../Utilities/Table';

export default class GenerateParts extends Component {

  generateParts() {
    const requiredElem = document.querySelector('.required') || document.querySelector('#root');
    const totalElem = document.querySelector('.total') || document.querySelector('#root');
    const secretElem = document.querySelector('.secret') || document.querySelector('#root');
    let requiredParts = requiredElem.innerText || requiredElem.getAttribute('placeholder');
    let totalParts = totalElem.innerText || totalElem.getAttribute('placeholder');
    let secret = secretElem.value || '';

    if (requiredParts && totalParts && secret) {
      let secretBytes = Buffer.from(secret);
      let shares = shamir.split(secretBytes, { shares: Number(totalParts), threshold: Number(requiredParts)});

      let newShares = shares.map((value, index) => {
        return {
          part: index + 1,
          share: '0x' + Buffer.from(value).toString('hex'),
        }
      });

      if (newShares) {
        return (
          <Table data={newShares} table_classes='partsTable table table-hover table-striped' thead_classes='thead-dark' column_width={['10%', '5%']} />
        );
      }
    }

    return (
      <p>Secret is blank</p>
    );
  }

  renderGenerateParts() {
    const key = '1-';
    const output = [];
    let outputTmp;

    outputTmp = (
      <h4 key={key + 0} className='pt-2'>Parts</h4>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key + 1}>
        {this.generateParts()}
      </div>
    );
    output.push(outputTmp);

    return output;
  }

  render() {
    const classes = 'generate-parts';

    return (
      <div className={classes}>
        {this.renderGenerateParts()}
      </div>
    );
  }
}
