import React from 'react';
import '../css/DataTable.css'

const styles = () => ({
  //header styles
  headerStyles: {
    default: {
      color: 'black',
      textAlign: 'center',
    },
    dropdown: {
    },
    currency: {
      textAlign: 'center',
    },
  },

  //body styles
  bodyStyles: {
    default: {
      color: 'black',
    },
    dropdown: {
    },
    currency: {
      textAlign: 'right',
    },
  },

  // bumpScrollWidth: {
  //   scrollWidth: '17px'
  // },

});


export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.classes = styles();
    // this.checkScrollRef = React.createRef();
    // this.maxTableHeight = 700;
    this.state = {
      filterSelect: "All Categories",
      filterClass: "",
    }
  }

  getStyles = (header, type) => {
    var headerStyle = { ...header.style, backgroundColor: 'white' };
    if (type === 'headers') {
      const headerClasses = this.classes.headerStyles;
      if (header.theme) {
        for (const addStyle of Object.keys(headerClasses[header.theme])) {
          headerStyle[addStyle] = headerClasses[header.theme][addStyle];
        }
      }
      else if (!header.style) {
        for (const addStyle of Object.keys(headerClasses['default'])) {
          headerStyle[addStyle] = headerClasses['default'][addStyle];
        }
      }
    }
    if (type === 'body') {
      const bodyClasses = this.classes.bodyStyles;
      if (header.theme) {
        for (const addStyle of Object.keys(bodyClasses[header.theme])) {
          headerStyle[addStyle] = bodyClasses[header.theme][addStyle];
        }
      }
      else if (!header.style) {
        for (const addStyle of Object.keys(bodyClasses['default'])) {
          headerStyle[addStyle] = bodyClasses['default'][addStyle];
        }
      }
    }
    return headerStyle;
  }

  handleCategoryChange = (event, index) => {
    this.props.categoryChange(event.target.value, event.target.id, index);
  }


  getOptions = (header, checkHeader) => {
    const optionsJSX = header.options.map((option, index) => {
      return (
        <option key={option.value + index} value={option.value}>{option.value}</option>
      )
    })
    return optionsJSX;
  }

  getCellContents = (row, header, index) => {
    const value = row[header.name];
    if (header.theme === 'currency' && value.toString() === '0.00') {
      return '';
    }

    //dropdown cell content
    else if (header.theme === 'dropdown' && this.props.edit === true) {

      const dropdownJSX = () => {
        return (
          <select
            className="cell-select"
            key={"select" + index}
            id={row.id}
            value={value}
            onChange={(e) => { this.handleCategoryChange(e, index) }}
          >{this.getOptions(header)}</select>
        );

      }
      const selectReturn = dropdownJSX();
      return selectReturn;

    }

    //default cell content
    else {
      return value;
    }
  }

  handleFilterChange = (event) => {
    const filterSelect = event.target.value;
    const filterClass = event.target.getAttributeNode('class');
    this.setState({ filterSelect: filterSelect, filterClass: filterClass }, () => {
      this.props.filterChange(this.state.filterSelect, this.state.filterClass);
    })
  }

  renderTableHeader = (headerData) => {
    const headersJSX = headerData.map((header) => {

      //add theme style to value style object or set default style
      var headerStyle = this.getStyles(header, 'headers');

      if (header.filter === true && this.props.filter === true) {
        return (
          <th key={header.key} style={headerStyle}>
            <select
              className={header.className}
              key={"filter_" + header.name}
              value={this.state.filterSelect}
              onChange={(e) => { this.handleFilterChange(e) }}
            >{this.getOptions(header)}</select>
          </th>
        )
      }
      else {
        return (
          <th key={header.key} style={headerStyle}>
            {header.name}
          </th>
        )
      }
    })
    return <tr className='header-cell'>{headersJSX}</tr>
  }

  renderTableData = (headers, data) => {
    let tableJSX = {};
    if (headers[0] === '') {
      tableJSX = <tr className='body-row' key='nulltable'>No data found. Please refresh table or import data.</tr>;
    }
    else {
      tableJSX = data.map((row, index) => {
        const rowJSX = headers.map((header, i) => {
          const cellKey = header.name + index;

          //add theme style to value style object or set default style
          var headerStyle = this.getStyles(header, 'body');

          var displayContents = this.getCellContents(row, header, index);


          return (
            <td className='body-cell' key={cellKey} style={headerStyle}>
              {displayContents}
            </td>
          )
        })
        const rowKey = "row" + index;
        return (<tr className='body-row' key={rowKey}>{rowJSX}</tr>);
      });
    }
    return tableJSX;
  }

  // componentDidMount() {
  //   const nodeStyle = window.getComputedStyle(this.checkScrollRef.current);
  //   const tableHeight = Number(nodeStyle.height.slice(0, nodeStyle.height.length - 2));
  //   if (tableHeight >= this.maxTableHeight) {
  //     this.setState({
  //       adjustTableMargin: true
  //     },()=>{console.log(this.state)});
  //   }
  // }

  // getHeaderStyle = () => {
  //   if (this.state.adjustTableMargin) {
  //     return (
  //       { marginRight: this.classes.bumpScrollWidth.scrollWidth }
  //     );
  //   }
  // }

  maxTableHeight = `${this.props.maxHeight}px`;

  render() {
    return (
      <div className='data-table'>
        {/* <div className='table-head-div' style={this.getHeaderStyle()}> */}
        <div className='table-head-div'>
          <table className='table-head' cellPadding="0" cellSpacing="0" border="0">
            <thead>
              {this.renderTableHeader(this.props.headers)}
            </thead>
          </table>
        </div>
        {/* <div className='table-body-div' ref={this.checkScrollRef} > */}
        <div className='table-body-div' style={{maxHeight: this.maxTableHeight}}>
          <table className='table-body' cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              {this.renderTableData(this.props.headers, this.props.data)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}