import React, { Component } from 'react';

import DownloadBtn from '../DownloadBtn';

import './index.css';

const RenderRow = (props) =>{
  let rows = props.keys.map((key, index)=>{
    return <td key={props.data[key]} className={key}>{props.data[key]}</td>
  });

  let rowData = [
    <td key={'0~0'} className='downloadBtn'><DownloadBtn row={props} oneFile={true} /></td>,
    ...rows
  ]
  return rowData;
}

export default class Table extends Component {

  getKeys = () => {
    return Object.keys(this.props.data[0]);
  }

  getHeader = () => {
    let keys = this.getKeys();
    let newKeys = keys.map((key, index) => {
      return <th key={key}>{key.titleCase()}</th>
    });

    let headerData = [
      <th key={0}>Action</th>,
      ...newKeys
    ]
    return headerData;
  }

  getRowsData = () => {
    let items = this.props.data;
    let keys = this.getKeys();
    return items.map((row, index) => {
      return <tr key={index}><RenderRow key={index} data={row} keys={keys} /></tr>
    });
  }

  render() {
    const { table_classes='', thead_classes='', column_width } = this.props;

    let colgroup;

    if (Array.isArray(column_width)) {
      let columns = column_width.map((value, index) => {
        if (value.includes('%') && index == 0) {
          if (value.split('%')[0] < 15) {
            value = '15%';
          }
        }

        return (
          <col key={index} span="1" style={{ width: value }} />
        );
      });

      colgroup = (
        <colgroup key={-2}>{columns}</colgroup>
      );
    }

    return (
      <div key={-1}>
        <table className={table_classes}>
          {colgroup}
          <thead className={thead_classes}>
            <tr>{this.getHeader()}</tr>
          </thead>
          <tbody>
            {this.getRowsData()}
          </tbody>
        </table>
      </div>
    );
  }
}
