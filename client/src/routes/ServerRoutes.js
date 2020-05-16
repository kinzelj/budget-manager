import axios from 'axios';

/*********************************************************************
 * Async functions for all server api calls
**********************************************************************/

export const convertData = async (dataFileToSend) => {
    const res = await axios.post("/show-data", dataFileToSend, {});
    return res.data.data;
}

export const importData = async (data) => {
    // const env = await axios.get("/get-env");
    // if (env.data !== 'LOCAL') {
    //   alert("Importing data from remote environment not allowed!");
    //   return;
    // }

    const options = {
        method: 'POST',
        url: '/import',
        data: data
    }
    const res = await axios(options);

    // if(res.data.env === 'LOCAL') {
    //   const options = {
    //       method: 'POST',
    //       url: '/update-remote',
    //   }
    //   async function updateRemote() {
    //     const res = await axios(options);
    //     console.log(res.data);
    //   }
    //   updateRemote();
    // }
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

export const updateCategories = async (updateArray) => {
    const options = {
        method: 'POST',
        url: '/update-categories',
        data: updateArray
    }
    const res = await axios(options);
    return res.data;
}

export const getSettings = async (input) => {
    const res = await axios({
        method: 'GET',
        url: `/settings/${input.user_id}/budget/${input.budget_id}`,
    });
    return res.data;
}

export const getBudgets = async (id) => {
    const res = await axios({
        method: 'GET',
        url: `/settings/${id}`,
    });
    return res.data;
}

export const updateSettings = async (settings) => {
    const options = {
        method: 'PUT',
        url: '/settings',
        data: settings
    }
    const res = await axios(options);
    if (res.data.nModified > 0) {
        return (1);
    }
    else { return (0) }
}