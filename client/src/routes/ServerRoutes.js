import axios from 'axios';

/*********************************************************************
 * Async functions for all server api calls
**********************************************************************/

export const convertData = async (dataFileToSend) => {
  const res = await axios.post("/show-data", dataFileToSend, {});
  return res.data.data;
}

export const importData = async (data) => {
    const env = await axios.get("/get-env");
    if (env.data !== 'LOCAL') {
      alert("Importing data from remote environment not allowed!");
      return;
    }

    const options = {
        method: 'POST',
        url: '/import',
        data: data
    }
    const res = await axios(options);

    if(res.data.env === 'LOCAL') {
      const options = {
          method: 'POST',
          url: '/update-remote',
      }
      async function updateRemote() {
        const res = await axios(options);
        console.log(res.data);
      }
      updateRemote();
    }
    return res.data;
}

export const getData = async () => {
    const options = {
        method: 'GET',
        url: '/data',
    }
    const res = await axios(options);
    return res.data;
}