import { createContext } from 'react';

export const initialState = {
    userAuth: null,
    categories: [],
    dataArray: [],
    isGraphDirected: false,
    playStatus: 0,
};

export const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});
