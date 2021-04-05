import React, { Component } from 'react';

import { AppContext } from '../AppContext';
import UploadBtn from '../Utilities/UploadBtn';

import CombineParts from './CombineParts';

import './index.css';

export default class CombineShares extends Component {
  static contextType = AppContext;

  state={
    force_update: true,
  }

  handleInput() {
    const { force_update } = this.state;

    this.setState(() => ({
      force_update: !force_update,
    }));
  }

  renderCombineShares() {
    const key = '0-';
    const output = [];
    let outputTmp;

    outputTmp = (
      <h2 key={key + 0}>Combine Shares</h2>
    );
    output.push(outputTmp);

    outputTmp = (
      <p key={key + 1}>
        Enter the shares, one per line:
        <UploadBtn className='float-right' caller='parts'/>
      </p>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key + 2}>
        <textarea className='parts form-control' rows='10' data-caller='parts' onChange={(e) => {this.handleInput(e)}} />
      </div>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key + 3}>
        <CombineParts />
      </div>
    );
    output.push(outputTmp);

    return output;
  }

  render() {
    const classes='combine-shares ml-2 mr-2';

    return (
      <div className={classes}>
        {this.renderCombineShares()}
      </div>
    );
  }
}
