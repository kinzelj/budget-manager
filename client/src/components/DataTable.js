import React from 'react';
import '../css/DataTable.css'

const styles = () => ({
  default: {
    color: 'black',
    textAlign: 'right',
  },
  dropdown: {
    color: 'blue',
  },
  currency: {
    color: 'red',
    textAlign: 'right',
  },
});

export default function DataTable(props) {
  const classes = styles();
   const renderTableHeader = (headerData) => {
      const headersJSX = headerData.map((header) => {
        
        //add theme style to value style object
        console.log(header);
        if(header.style && header.theme){
          for (const addStyle of Object.keys(classes[header.theme])){
            header.style[addStyle] = classes[header.theme][addStyle];
          }
        }
        else {
          header.style = {};
          for (const addStyle of Object.keys(classes['default'])) {
            header.style[addStyle] = classes['default'][addStyle];
          }
        }
        
         return (
           <th key={header.key} style={header.style}>
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

          //add theme style to value style object
        	if(header.style && header.theme){
            for (const addStyle of Object.keys(classes[header.theme])) {
              header.style[addStyle] = classes[header.theme][addStyle];
            }
          }
          else {
            header.style = {};
            for (const addStyle of Object.keys(classes['default'])) {
              header.style[addStyle] = classes['default'][addStyle];
            }
          }
          
          return ( 
          	<td className='body-cell' key={cellKey} style={header.style}>
            	{row[header.name]}
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
          <table className='table-head' cellPadding="0" cellSpacing="0" border="0">
              <thead>
             		{renderTableHeader(props.headers)}
              </thead>
          </table>
          <table className='table-body' cellPadding="0" cellSpacing="0" border="0">
             <tbody>
                {renderTableData(props.headers, props.data)}
             </tbody>
          </table>
       </div>
    )
}

// const issueTypes = [
//     { id: "Merchandise", value: "Merchandise" },
//     { id: "Dining", value: "Dining" },
//     { id: "Payment/Credit", value: "Payment/Credit" },
//     { id: "Gas/Automotive", value: "Gas/Automotive" },
//     { id: "Other Travel", value: "Other Travel" },
//     { id: "Phone/Cable", value: "Phone/Cable" },
//     { id: "Entertainment", value: "Entertainmanet" },
//     { id: "Other Services", value: "Other Services" },
//     { id: "Internet", value: "Internet" },
//     { id: "Other", value: "Other" },
//     { id: "Lodging", value: "Lodging" },
//     { id: "Insurance", value: "Insurance" },
//     { id: "Fee/Interest Charge", value: "Fee/Interest Charge" },
//     { id: "Health Care", value: "Health Care" },
//     { id: "Car Rental", value: "Car Rental" },
//     { id: "Professional Services", value: "Professional Services" },
//     { id: "Airfare", value: "Airfare" },
//     { id: "Work Expense", value: "Work Expense" },
//   ];
