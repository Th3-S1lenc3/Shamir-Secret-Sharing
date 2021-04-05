import React, { Component, createContext } from 'react';

export const AppContext = createContext();

export default class AppContextProvider extends Component {
  state = {
    action: 'split',
    updateContext: (target) => {
      const { name, value } = target;

      this.setState(() => ({
        [name]: value
      }));

      setTimeout(() => {console.log(this.state)}, 1);
    }
  };

  render() {
    const { children } = this.props;

    return (
      <AppContext.Provider value = {this.state}>
        {children}
      </AppContext.Provider>
    )
  }
}
