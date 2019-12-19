import * as ServerRoutes from '../routes/ServerRoutes.js'

export const fetchData = () => async (dispactch) => {
    const res = await ServerRoutes.getData();
    dispactch({ type: 'fetch-data', payload: res });
}
