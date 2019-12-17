import React from "react";
import ReactDataGrid from "react-data-grid";
export default class DataTable extends React.Component {
  onGridRowsUpdated = (rowData) => {
      console.log(rowData);
      console.log(rowData.rowIds[0]);
  };
  render() {
    return (
      <div>
        <ReactDataGrid
          columns={this.props.headers}
          rowGetter={i => this.props.data[i]}
          rowsCount={this.props.data.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          minHeight={600}
        />
      </div>
    );
  }
}
