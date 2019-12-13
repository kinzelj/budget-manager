import axios from 'axios';

/*********************************************************************
 * Async functions for all server api calls
**********************************************************************/
export const convertData = async (dataFileToSend) => {
  const res = await axios.post("/show-data", dataFileToSend, {});
  return res;
}

export const importData = async (data) => {
    const options = {
        method: 'POST',
        url: '/import',
        data: data 
    }
    const response = await axios(options);
  	console.log(response);
    return response;
}