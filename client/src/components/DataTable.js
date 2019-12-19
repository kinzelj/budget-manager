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
  }

});


export default function DataTable(props) {
  const classes = styles();

  const getStyles = (header, type) => {
    var headerStyle = { ...header.style };
    if (type === 'headers') {
      const headerClasses = classes.headerStyles;
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
      const bodyClasses = classes.bodyStyles;
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

  function handleCategoryChange(event, index) {
    props.categoryChange(event.target.value, event.target.id, index);
  }

  const getCellContents = (row, header, index) => {
    const value = row[header.name];
    if (header.theme === 'currency' && value.toString() === '0.00') {
      return '';
    }

    //dropdown cell content
    else if (header.theme === 'dropdown' && props.edit === true) {
      const getOptions = () => {
        const optionsJSX = header.options.map((option, index) => {
          return (
            <option key={option.value + index} value={option.value}>{option.value}</option>
          )
        })
        return optionsJSX;
      }
      const dropdownJSX = () => {
        return (
          <select 
            className="cell-select" 
            key={"select"+ index}
            id={row.id} 
            value={value}
            onChange={(e)=>{handleCategoryChange(e, index)}}
          >{getOptions()}</select>
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

  const renderTableHeader = (headerData) => {
    const headersJSX = headerData.map((header) => {

      //add theme style to value style object or set default style
      var headerStyle = getStyles(header, 'headers');

      return (
        <th key={header.key} style={headerStyle}>
          {header.name}
        </th>
      )
    })
    return <tr className='header-cell'>{headersJSX}</tr>
  }

  const renderTableData = (headers, data) => {
    const tableJSX = data.map((row, index) => {
      const rowJSX = headers.map((header, i) => {
        const cellKey = header.name + index;

        //add theme style to value style object or set default style
        var headerStyle = getStyles(header, 'body');

        var displayContents = getCellContents(row, header, index);


        return (
          <td className='body-cell' key={cellKey} style={headerStyle}>
            {displayContents}
          </td>
        )
      })
      const rowKey = "row" + index;
      return (<tr className='body-row' key={rowKey}>{rowJSX}</tr>);
    });
    return tableJSX;
  }

  return (
    <div className='data-table'>
      <div className='table-head-div'>
        <table className='table-head' cellPadding="0" cellSpacing="0" border="0">
          <thead>
            {renderTableHeader(props.headers)}
          </thead>
        </table>
      </div>
      <div className='table-body-div'>
        <table className='table-body' cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            {renderTableData(props.headers, props.data)}
          </tbody>
        </table>
      </div>
    </div>
  )
}