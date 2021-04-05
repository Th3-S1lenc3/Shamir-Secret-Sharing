import React, { Component } from 'react';

import { AppContext } from '../AppContext';
import UploadBtn from '../Utilities/UploadBtn';
import GenerateParts from './GenerateParts';

import './index.css';

const Space = () => <>&nbsp;</>;

export default class SplitSecret extends Component {
  static contextType = AppContext;

  state={
    force_update: true,
  }

  validateNumerical(e) {
    if (e.defaultPrevented) {
      return;
    }
    const key = e.key || e.code;
    if ((e.key.length <= 1) && (!(e.metaKey || e.ctrlKey || e.altKey))) {
      if (!((key >= '0' && key <= '9') || (key === '-') || (key === '.') )) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    }
  }

  handleInput() {
    const { force_update } = this.state;

    this.setState(() => ({
      force_update: !force_update,
    }));
  }

  renderSplitSecret() {
    const key = '0-';
    const output = [];
    let outputTmp;

    outputTmp = (
      <h2 key={key + 0}>Split Secret</h2>
    );
    output.push(outputTmp);

    outputTmp = (
      <p key={key + 1}>
        Require<Space />
        <span
          className='required'
          contentEditable='true'
          onKeyDown={this.validateNumerical}
          onInput={(e) => {this.handleInput(e)}}
          placeholder='3'
        /><Space />
        parts from<Space />
        <span
          className='total'
          contentEditable='true'
          onKeyDown={this.validateNumerical}
          onInput={(e) => {this.handleInput(e)}}
          placeholder='5'
        /><Space />
        to reconstruct the following secret:
        <UploadBtn className='float-right' caller='secret'/>
      </p>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key+2}>
        <textarea className='secret form-control' rows='10' placeholder='Enter your secret here' data-caller='secret' onChange={(e) => {this.handleInput(e)}} />
      </div>
    );
    output.push(outputTmp);

    outputTmp = (
      <div key={key + 3}>
        <GenerateParts />
      </div>
    );
    output.push(outputTmp);

    return output;
  }

  render() {
    const classes='split-secret ml-2 mr-2';

    return (
      <div className={classes}>
        {this.renderSplitSecret()}
      </div>
    );
  }
}
