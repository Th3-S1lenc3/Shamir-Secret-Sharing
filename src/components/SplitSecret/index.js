import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { ErrorBoundary } from 'react-error-boundary';

import EditableSpan from '@components/EditableSpan';
import UploadBtn from '@components/UploadBtn';

import GenerateShares from './GenerateShares';

import './index.css'

export default function SplitSecret() {
  const [reload, setReload] = useState(false);

  const validateNumerical = (e) => {
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

  const handleInput = (e) => {
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
    <div className="split-secret mx-2">
      <div className="split-secret-header">
        <h2>Split Secret</h2>
        <div className="centre">
          <UploadBtn />
        </div>
      </div>
      <p>
        Require{' '}
        <EditableSpan
          className="requiredParts"
          validate={validateNumerical}
          onInput={handleInput}
          placeholder='3'
        />{' '}
        parts from{' '}
        <EditableSpan
          className="totalParts"
          validate={validateNumerical}
          onInput={handleInput}
          placeholder='5'
        />{' '}
        to reconstruct the following secret:
      </p>
      <textarea
        className="secret form-control mb-2"
        rows="10"
        placeholder="Enter your secret here..."
        date-caller="secret"
        onChange={e => handleInput(e)}
      />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setReload(!reload)}
        resetKeys={[reload]}
      >
        <GenerateShares reload={reload} />
      </ErrorBoundary>
    </div>
  );
}
