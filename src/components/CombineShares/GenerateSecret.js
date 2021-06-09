import React, { useEffect, useState } from 'react';
import secrets from 'secrets.js-lit';
import { Table } from 'react-bootstrap';

import DownloadBtn from '@components/DownloadBtn';

import clean from '@utilities/clean';

export default function GenerateSecret(props) {
  const [shares, setShares] = useState('');

  useEffect(() => {
    const shares = document.querySelector('.shares')?.value || null;

    setShares(shares);
  }, [props.reload]);

  if (shares && shares !== '') {
    const sharesArr = clean(shares?.split('\n').map((share, index) => {
      return share.replace('0x', '');
    }));

    let secret;

    try {
      const secretHex = secrets.combine(sharesArr);
      secret = secrets.hex2str(secretHex);
    }
    catch (e) {
      secret = 'Invalid share.';
    }

    return (
      <div className="generate-secret mt-2">
        <Table
          striped
          hover
          variant="dark"
        >
          <colgroup>
            <col style={{width: '1rem'}} />
            <col style={{width: '80%'}} />
          </colgroup>
          <thead>
            <tr>
              <th>Action</th>
              <th>Secret</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <DownloadBtn data={{ secret }} />
              </td>
              <td>{secret}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
  else {
    return (
      <></>
    )
  }
}
