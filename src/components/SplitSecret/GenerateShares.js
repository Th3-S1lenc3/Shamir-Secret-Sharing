import React, { useEffect, useState } from 'react';
import secrets from 'secrets.js-lit';
import { Table } from 'react-bootstrap';

import DownloadBtn from '@components/DownloadBtn';

export default function GenerateShares(props) {
  const [requiredParts, setRequiredParts] = useState('');
  const [totalParts, setTotalParts] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const requiredParts = document.querySelector('.requiredParts')?.innerText ||
        document.querySelector('.requiredParts')?.getAttribute('placeholder') ||
        null;
    const totalParts = document.querySelector('.totalParts')?.innerText ||
     document.querySelector('.totalParts')?.getAttribute('placeholder') ||
     null;
    const secret = document.querySelector('.secret')?.value || null;

    setRequiredParts(requiredParts);
    setTotalParts(totalParts);
    setSecret(secret);
  }, [props.reload]);

  if (parseInt(requiredParts) > parseInt(totalParts)) {
    throw new Error('Required parts greater than the total parts.');
  }

  if (requiredParts && totalParts && secret && secret !== '') {
    let shares;

    try {
      const secretHex = secrets.str2hex(secret);
      shares = secrets.share(secretHex, parseInt(totalParts), parseInt(requiredParts));
    }
    catch (e) {
      throw new Error(e);
    }

    const rows = shares?.map((share, index) => (
      <tr key={index} className="share">
        <td>
          <DownloadBtn data={{ part: index + 1 , share: `0x${share}`}} />
        </td>
        <td className="share-index">
          {index + 1}
        </td>
        <td className="share-data">
          {`0x${share}`}
        </td>
      </tr>
    ));

    return (
      <div className="generate-shares">
        <div className="generate-shares-header my-2">
          <h3>Shares</h3>
          <DownloadBtn all for="share" />
        </div>
        <Table
          striped
          hover
          variant="dark"
        >
          <thead>
            <tr>
              <th>Action</th>
              <th>Part</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }
  else {
    return (
      <></>
    );
  }
}
