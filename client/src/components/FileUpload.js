import React, { Component } from 'react'

class FileUpload extends Component {
  state = {
    selectedFile: null
  };

  

  handleChangeFile = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  handleSubmit = (event) => {
    this.props.submitFile(event, this.state.selectedFile);
  }

  render() {
    return (
      <div className='file-upload'>
        <input type="file" className="file" onChange={this.handleChangeFile} /> <br />
        <button type="button" className="btn btn-success btn-block" onClick={this.handleSubmit}>Upload</button>
      </div>
    );
  }
}

export default FileUpload