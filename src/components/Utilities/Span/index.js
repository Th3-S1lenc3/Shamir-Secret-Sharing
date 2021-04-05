import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Span extends Component {

  validateNumerical(e) {
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

  render() {
    const { className, placeholder, type } = this.props;

    let classes = className || '';

    switch (type) {
      case 'number':
        return (
          <span className={classes} contentEditable='true' onKeyDown={this.validateNumerical} placeholder={placeholder}/>
        )
        break;
      default:
        return (
          <span className={classes} contentEditable='true' placeholder={placeholder}/>
        )
        break;
    }
  }
}
