import React, { useState, Fragment } from 'react';
import { withRouter } from 'react-router';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function UploadBtn(props) {
  const [uploading, setUploading] = useState(false);
  const { api } = window;

  const origin = props.location.pathname.replace('/', '');

  const parseFile = (data) => {
    let { origin, files } = data;

    let handler;

    if (origin === 'split') {
      handler = document.querySelector('.secret');
    }
    else if (origin === 'combine') {
      handler = document.querySelector('.shares');
    }

    const fileData = [];

    files.forEach((file, index) => {
      file = JSON.parse(file);

      const { fileName, fileContent } = file;

      fileData.push(fileContent);
    });

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;

    nativeInputValueSetter.call(handler, fileData.join('\n'));

    let inputEvent = new Event("input", { bubbles: true });

    handler.dispatchEvent(inputEvent);

    setUploading(false);
  }

  const uploadFile = () => {
    setUploading(true);

    api.request('upload:files', origin);

    api.receive('upload:reply', (data) => {
      parseFile(data);
    });

    api.receive('upload:cancel', () => {
      setUploading(false);
    });
  }

  const uploadQRCode = () => {
    setUploading(true);

    api.request('upload:qrCodes', origin);

    api.receive('upload:reply', (data) => {
      parseFile(data);
    });

    api.receive('upload:cancel', () => {
      setUploading(false);
    });
  }

  const BtnContent = () => {
    if (uploading) {
      return (
        <Fragment>
          Uploading...
        </Fragment>
      );
    }

    return (
      <Fragment>
        <FontAwesomeIcon icon={faUpload} />
        Upload File
      </Fragment>
    )
  }

  return (
    <Dropdown as={ButtonGroup}>
      <Button
        variant="primary"
        onClick={!uploading ? uploadFile : null}
        disabled={uploading}
      >
        <BtnContent />
      </Button>

      <Dropdown.Toggle split variant="primary" disabled={uploading} />

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={uploadQRCode}
        >
          Upload QR Code
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default withRouter(UploadBtn);
