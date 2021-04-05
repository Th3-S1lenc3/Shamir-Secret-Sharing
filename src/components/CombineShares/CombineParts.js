import React, { Component } from 'react';

import { AppContext } from '../AppContext';
import Table from '../Utilities/Table';

const shamir = require('@consento/shamirs-secret-sharing')

export default class CombineParts extends Component {

  combineParts() {
    const partsElem = document.querySelector('.parts') || document.querySelector('#root');
    let parts = partsElem.value || '';
    let secret = '';

    if (parts) {
      let partsArr = parts.trim().split(/\s+/);

      let shares = partsArr.map((value, index) => {
        let newValue;

        try {
          newValue = Buffer.from(value.substring(2), 'hex')
        }
        catch (e) {
          newValue = '';
        }
        return newValue;
      });

      try {
        secret = shamir.combine(shares).toString();
      }
      catch (e) {
        secret = 'Invalid hex string.';
      }

    }

    let result = [{
      secret: secret,
    }];

    if (secret) {
      return (
        <Table data={result} table_classes='sharesTable table table-hover table-striped' thead_classes='thead-dark' column_width={['5%']} />
      );
    }
    else {
      return (
        <p>No Shares Entered</p>
      )
    }
  }

  renderCombineParts() {
    const key = '1-';
    const output = [];
    let outputTmp;

    outputTmp = (
      <h4 key={key + 0} className='pt-2'>Result</h4>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key+1}>
        {this.combineParts()}
      </div>
    );
    output.push(outputTmp);

    return output;
  }

  render() {
    const classes = 'combine-parts';

    return (
      <div className={classes}>
        {this.renderCombineParts()}
      </div>
    )
  }
}
