import React from 'react';

export default function EditableSpan({
  validate,
  onInput,
  placeholder,
  className,
  'data-caller': dataCaller
}) {
  return (
    <span
      data-caller={dataCaller}
      className={className}
      contentEditable='true'
      onKeyDown={e => validate(e)}
      onInput={e => onInput(e)}
      placeholder={placeholder}
    />
  )
}
