import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default class DownloadBtn extends Component {

  downloadAll() {
    const api = window.api;
    const sharesArr = [];
    const partsArr = [];
    document.querySelectorAll('.share').forEach((share) => {
      sharesArr.push(share.innerText);
    });
    document.querySelectorAll('.part').forEach((part) => {
      partsArr.push(part.innerText);
    });

    let data = new Map();

    for (let i = 0; i < sharesArr.length; i++) {
      data.set(partsArr[i], sharesArr[i]);
    }

    if (data.size > 0) {
      api.request('save:files', data)
    }
  }

  downloadOne() {
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

    if (Object.keys(content).length > 0) {
      api.request('save:file', content);
    }
  }

  handleClick(e) {
    const { oneFile } = this.props;

    if (oneFile) {
      this.downloadOne();
    }
    else {
      this.downloadAll();
    }

  }

  render() {
    const { className, oneFile } = this.props;

    let all = oneFile ? '' : 'All' ;

    let classes = `${className} btn btn-primary btn-md`

    return (
      <button className={classes} onClick={(e) => {this.handleClick(e)}}>
        <FontAwesomeIcon icon={faDownload} className='pr-1'/>
        Download {all}
      </button>
    )
  }
}
