import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { createWorker } from 'tesseract.js';

import { copy } from '../utils';

export default class UploadBtn extends Component {

  parseFiles(data) {
    const { caller, files } = data;
    const eventHandler = document.querySelector(`[data-caller="${caller}"]`);
    eventHandler.value = '';

    let fileData = '';

    for (let file in files) {
      let { fileName, fileContent } = files[file];

      if (caller == 'shares') {
        fileContent = fileContent.replace(/\n/g, '');
      }

      fileData += `${fileContent}\n`;
    }

    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;

    nativeInputValueSetter.call(eventHandler, fileData);

    let inputEvent = new Event("input", { bubbles: true });

    eventHandler.dispatchEvent(inputEvent);
  }

  setCallerToWaiting(caller, type) {
    const eventHandler = document.querySelector(`[data-caller="${caller}"]`);

    const eventHandlerValuePrev = copy(eventHandler.value)

    let nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;

    nativeInputValueSetter.call(eventHandler, `Reading ${type.titleCase()}...`);

    let inputEvent = new Event("input", { bubbles: true });

    eventHandler.dispatchEvent(inputEvent);
  }

  handleFile(e) {
    const { caller } = this.props;
    const api = window.api;

    if (caller == "secret") {
      api.request('upload:files:one', caller);
    }
    else {
      api.request('upload:files', caller);
    }

    api.receive('upload:reply', (data) => {
      this.parseFiles(data)
    });
  }

  handleQRCode(e) {
    const { caller } = this.props;
    const api = window.api;

    if (caller == "secret") {
      api.request('upload:qrCodes:one', caller);
    }
    else {
      api.request('upload:qrCodes', caller);
    }

    this.setCallerToWaiting(caller, 'QR code');

    api.receive('upload:reply', (data) => {
      this.parseFiles(data)
    });
  }

  handleClick(e, type) {
    switch (type) {
      case 'file':
        this.handleFile(e);
        break;
      case 'image':
        this.handleImage(e);
        break;
      case 'qrCode':
        this.handleQRCode(e);
        break;
      default:
        break;
    }
  }

  render() {
    const { className: classes } = this.props;
    const variant = 'primary'

    return (
      <Dropdown as={ButtonGroup}>
        <Button variant={variant} className={classes} onClick={(e) => {this.handleClick(e, 'file')}}>
          <FontAwesomeIcon icon={faUpload} className='pr-1'/>
          Upload File
        </Button>
        <Dropdown.Toggle split variant={variant} />
        <Dropdown.Menu>
          <Dropdown.Item onClick={(e) => {this.handleClick(e, 'qrCode')}}>Upload QR Code</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
