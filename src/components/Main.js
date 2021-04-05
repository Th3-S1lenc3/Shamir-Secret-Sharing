import React, { Component } from 'react';

import { AppContext } from './AppContext';
import './Prototypes';
import SplitSecret from './SplitSecret';
import CombineShares from './CombineShares';

export default class Main extends Component {
  static contextType = AppContext;

  render() {
    const { showUsage, action } = this.context;

    switch (action) {
      case 'split':
        return (
          <SplitSecret />
        )
        break;
      case 'combine':
        return (
          <CombineShares />
        )
        break;
      default:
        break;
    }
  }
}
