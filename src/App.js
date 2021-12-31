import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { Grid, Drawer } from '@material-ui/core';
import Header from './components/header/header';
import Sider from './components/sider/sider';
import Content from './components/content/content';
import Toast, { showToast } from './components/toast/toast';
import Menu from './components/menu/menu';
import { AppContext } from './common/context';
import { gql, useQuery } from '@apollo/client';
import Spinner from './components/spinner/spinner';

const initialState = {
    userAuth: null,
};

const GET_ALGORITHMS = gql`
    query {
        getAlgorithms {
            data {
                catId
                catName
                algorithms {
                    algoId
                    algoName
                    pathId
                }
            }
            status
            message
        }
    }
`;

function App() {
    const [state, setState] = useState(initialState);
    const [visible, setVisible] = useState(false);
    const { loading, data } = useQuery(GET_ALGORITHMS);
    const [categories, setCategories] = useState([]);

    const setContext = useCallback(
        (slice) => {
            setState({ ...state, ...slice });
        },
        [state]
    );

    useEffect(() => {
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
            setContext({ userAuth: JSON.parse(userAuth) });
        }
    }, []);

    useEffect(() => {
        if (data) {
            const { data: items, status, message } = data.getAlgorithms;
            if (status) {
                setCategories(items);
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [data]);

    return (
        <AppContext.Provider value={{ ...state, setContext }}>
            <Spinner spinning={loading} className="App">
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
                        <Sider categories={categories} onClose={() => setVisible(false)} />
                    </Drawer>
                    <Grid container className="layout">
                        <Grid item xs="auto" className="d-none d-md-block sider">
                            <Sider categories={categories} onClose={() => {}} />
                        </Grid>
                        <Grid item xs className="content">
                            <Content categories={categories} visible={visible} />
                        </Grid>
                    </Grid>
                </BrowserRouter>
            </Spinner>
        </AppContext.Provider>
    );
}

export default App;
