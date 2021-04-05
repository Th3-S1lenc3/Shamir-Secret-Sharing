import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default class DownloadBtn extends Component {

  handleClick(e) {
    const api = window.api;

    const { data: { share, part, secret }, keys } = this.props.row;

    let content, fileName;

    if (keys[0] == 'secret') {
      fileName = 'Secret.txt';
      content = {
        fileName: fileName,
        fileContent: secret,
      };

    }
    else {
      fileName = `share_${part}.txt`;
      content = {
        fileName: fileName,
        fileContent: share,
      };
    }

    api.request('save:file', content);
  }

  render() {
    const { className } = this.props;

    let classes = `${className} btn btn-primary btn-md`

    return (
      <button className={classes} onClick={(e) => {this.handleClick(e)}}>
        <FontAwesomeIcon icon={faDownload} className='pr-1'/>
        Download
      </button>
    )
  }
}
