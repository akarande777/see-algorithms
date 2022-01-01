import { createContext } from 'react';

export const AppContext = createContext({
    userAuth: null,
    categories: [],
    dataArray: [],
    setContext: () => {},
});
