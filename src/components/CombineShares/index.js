import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import {ErrorBoundary} from 'react-error-boundary';

import UploadBtn from '@components/UploadBtn';

import GenerateSecret from './GenerateSecret';

import './index.css'

export default function CombineShares() {
  const [reload, setReload] = useState(false);

  const handleInput = () => {
    setReload(!reload);
  }

  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
      <Alert
        variant="danger"
        dismissible
        onClose={resetErrorBoundary}
      >
        {error?.message}
      </Alert>
    );
  }

  return (
    <div className="combine-shares mx-2">
      <div className="combine-shares-header">
        <h2>Combine Shares</h2>
        <div className="centre">
          <UploadBtn />
        </div>
      </div>
      <p>
        Enter the shares, one per line:
      </p>
      <textarea
        className="shares form-control"
        rows="10"
        onChange={handleInput}
        placeholder='Enter Shares Here...'
      />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setReload(!reload)}
        resetKeys={[reload]}
      >
        <GenerateSecret reload={reload} />
      </ErrorBoundary>
    </div>
  );
}
