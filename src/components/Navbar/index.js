import React, { Component } from 'react';

import { AppContext } from '../AppContext';
import './index.css'

export default class Navbar extends Component {
  static contextType = AppContext;

  handleClick(e) {
    const { showUsage, updateContext } = this.context;

    let caller = e.target.dataset.caller;
    let target;

    switch (caller) {
      case 'split':
        target = { name: 'action', value: 'split' };
        updateContext(target);
        break;
      case 'combine':
        target = { name: 'action', value: 'combine' };
        updateContext(target);
        break;
      default:
        break;
    }
  }

  render() {
    const { action } = this.context;

    let active;

    let splitClasses = 'nav-link ';
    let combineClasses = 'nav-link ';

    switch (action) {
      case 'split':
        splitClasses += 'active';
        break;
      case 'combine':
        combineClasses += 'active';
        break;
      default:
        break;
    }

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <ul className="navbar-nav nav-pills">
          <li className="nav-item">
            <a className={splitClasses} href="#" data-caller='split' onClick={(e) => {this.handleClick(e)}}>Split</a>
          </li>
          <li>
            <a className={combineClasses} href="#" data-caller='combine' onClick={(e) => {this.handleClick(e)}}>Combine</a>
          </li>
        </ul>
      </nav>
    )
  }
}
