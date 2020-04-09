import * as ServerRoutes from '../routes/ServerRoutes.js'

export const fetchData = () => async (dispactch) => {
    const res = await ServerRoutes.getData();
    dispactch({ type: 'fetch-data', payload: res });
}

export const fetchSettings = (user) => async (dispactch) => {
    const res = await ServerRoutes.getSettings(user);
    dispactch({ type: 'fetch-settings', payload: res });
};
