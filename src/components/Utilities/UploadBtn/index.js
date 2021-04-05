import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default class UploadBtn extends Component {

  parseFiles(data) {
    const { caller, files } = data;
    const eventHandler = document.querySelector(`[data-caller="${caller}"]`);
    eventHandler.value = '';

    let fileData = '';

    for (let file in files) {
      let { fileName, fileContent } = files[file];

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

  handleClick(e) {
    const { caller } = this.props;
    const api = window.api;

    if (caller == "secret") {
      api.request('upload:files:one', caller);
    }
    else {
      api.request('upload:files', caller);
    }

    api.receive('upload:files:reply', (data) => {
      this.parseFiles(data)
    });
  }

  render() {
    const { className } = this.props;

    let classes = `${className} btn btn-primary btn-md`

    return (
      <button className={classes} onClick={(e) => {this.handleClick(e)}}>
        <FontAwesomeIcon icon={faUpload} className='pr-1'/>
        Upload
      </button>
    )
  }
}
