import React, { Component } from 'react'

class FileUpload extends Component {
  state = {
    selectedFile: null
  };

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }
  
  onClickHandler = (event) => {
    
  }
  
  render () {
    return (
   		<div className='file-upload'>
      	
      	<input type="file" className="file" onChange={this.onChangeHandler}/>
        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
      </div> 
    );
  }
}

export default FileUpload