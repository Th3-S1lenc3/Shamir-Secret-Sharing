import React, { useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

export default function DownloadBtn(props) {
  const { data, all, 'for': elFor } = props;
  const [downloading, setDownloading] = useState(false);
  const api = window.api;

  const downloadFile = () => {
    if (all && elFor === 'share') {
      const content = new Map();

      let shares = document.querySelectorAll(`.${elFor}`);

      shares = Array.from(shares);

      shares.forEach((el, index) => {
        const shareIndex = el.querySelector('.share-index').innerText;
        const shareData = el.querySelector('.share-data').innerText;

        content.set(shareIndex, shareData);
      });

      api.request('save:files', content);
    }
    else if (data) {
      const { part, share, secret } = data;
      let fileName;
      let content;

      if (secret && secret !== '') {
        fileName = 'secret.txt';

        content = {
          fileName,
          fileContent: secret,
        };
      }
      else if (part && part > 0 && share && share !== '') {
        fileName = `share_${part}.txt`;

        content = {
          fileName,
          fileContent: share,
        }
      }

      if (content) {
        api.request('save:files:one', content);
      }
    }
  }

  const downloadQRCode = () => {
    if (all && elFor === 'share') {
      const content = new Map();

      let shares = document.querySelectorAll(`.${elFor}`);

      shares = Array.from(shares);

      shares.forEach((el, index) => {
        const shareIndex = el.querySelector('.share-index').innerText;
        const shareData = el.querySelector('.share-data').innerText;

        content.set(shareIndex, shareData);
      });

      api.request('save:qrCodes', content);
    }
    else if (data) {
      const { part, share, secret } = data;
      let fileName;
      let content;

      if (secret && secret !== '') {
        fileName = 'secret.png';

        content = {
          fileName,
          fileContent: secret,
        };
      }
      else if (part && part > 0 && share && share !== '') {
        fileName = `share_${part}.png`;

        content = {
          fileName,
          fileContent: share,
        }
      }

      if (content) {
        api.request('save:qrCodes:one', content);
      }
    }
  }

  const handleDownloadFile = () => {
    setDownloading(true);

    downloadFile();

    setDownloading(false);
  }

  const handleDownloadQRCode = () => {
    setDownloading(true);

    downloadQRCode();

    setDownloading(false);
  }

  const BtnContent = () => {
    if (downloading) {
      return (
        <Fragment>
          Downloading...
        </Fragment>
      );
    }

    return (
      <Fragment>
        <FontAwesomeIcon icon={faDownload} className="mr-1" />
        Download {all ? 'all' : ''}
      </Fragment>
    )
  }

  return (
    <Dropdown as={ButtonGroup}>
      <Button
        variant="primary"
        onClick={!downloading ? handleDownloadFile : null}
        disabled={downloading}
      >
        <BtnContent />
      </Button>

      <Dropdown.Toggle split variant="primary" disabled={downloading} />

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={handleDownloadQRCode}
        >
          Download {all ? 'all as' : ''} QR Code
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
