import React, { useState, useEffect, createContext } from 'react';
import './App.scss';
import { HashRouter } from 'react-router-dom';
import { Grid, Drawer } from '@material-ui/core';
import 'antd/dist/antd.css';
import Header from './components/header/header';
import SiderView from './layout/sider';
import ContentView from './layout/content';
import Toast from './components/toast/toast';
import Menu from './components/menu/menu';
import { auth } from './services/firebase';
import { createUserProfileDoc } from './services/auth';

export const AppContext = createContext({});

function App() {
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            console.log('user auth', userAuth);
            if (userAuth && userAuth.emailVerified) {
                const userRef = await createUserProfileDoc(userAuth);
                userRef.onSnapshot((snapshot) => {
                    console.log('on snapshot', snapshot.data());
                    setUser({
                        id: snapshot.id,
                        ...snapshot.data(),
                    });
                });
            }
            setUser(null);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AppContext.Provider value={{ user }}>
            <div className="App">
                <Toast />
                <Menu />
                <Header showSider={() => setVisible(true)} />
                <HashRouter>
                    <Drawer
                        anchor="left"
                        open={visible}
                        onClose={() => setVisible(false)}
                        className="drawer"
                        PaperProps={{ className: 'drawerBody' }}
                    >
                        <SiderView close={() => setVisible(false)} />
                    </Drawer>
                    <Grid container className="layout">
                        <Grid item xs="auto" className="d-none d-md-block sider">
                            <SiderView close={() => null} />
                        </Grid>
                        <Grid item className="content">
                            <ContentView visible={visible} />
                        </Grid>
                    </Grid>
                </HashRouter>
            </div>
        </AppContext.Provider>
    );
}

export default App;
