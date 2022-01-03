import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { Grid, Drawer } from '@material-ui/core';
import Header from './components/header/header';
import Sider from './components/sider/sider';
import Content from './components/content/content';
import Toast, { showToast } from './components/toast/toast';
import Menu from './components/menu/menu';
import InputList from './components/input-list/input-list';
import Spinner from './components/spinner/spinner';
import { AppContext, initialState } from './common/context';
import { useQuery } from '@apollo/client';
import { GET_ALGORITHMS } from './graphql/queries';

function App() {
    const [state, setState] = useState(initialState);
    const [visible, setVisible] = useState(false);
    const { loading, data } = useQuery(GET_ALGORITHMS);

    const setContext = (slice) => {
        setState((state) => ({ ...state, ...slice }));
    };

    useEffect(() => {
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
            setContext({ userAuth: JSON.parse(userAuth) });
        }
    }, []);

    useEffect(() => {
        if (data) {
            const { data: categories, status, message } = data.getAlgorithms;
            if (status) {
                setContext({ categories });
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [data]);

    return (
        <AppContext.Provider value={{ ...state, setContext }}>
            <Spinner className="App" spinning={loading}>
                <Toast />
                <Menu />
                <Header toggleMenu={() => setVisible(!visible)} />
                <BrowserRouter>
                    <Drawer
                        anchor="left"
                        open={visible}
                        onClose={() => setVisible(false)}
                        className="drawer"
                        PaperProps={{ className: 'paper' }}
                        BackdropProps={{ className: 'backdrop' }}
                    >
                        <Sider onClose={() => setVisible(false)} />
                    </Drawer>
                    <Grid container className="layout">
                        <Grid item xs={2} className="d-none d-md-block sider">
                            <Sider onClose={() => {}} />
                        </Grid>
                        <Grid item xs className="content">
                            <Content visible={visible} />
                        </Grid>
                        {/* <Grid item xs={2} className="d-none d-md-block sider">
                            <InputList />
                        </Grid> */}
                    </Grid>
                </BrowserRouter>
            </Spinner>
        </AppContext.Provider>
    );
}

export default App;
