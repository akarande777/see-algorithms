import React, { useState, useEffect, createContext } from 'react';
import './App.scss';
import { HashRouter } from 'react-router-dom';
import { Grid, Drawer } from '@material-ui/core';
import Header from './components/header/header';
import Sider from './components/sider/sider';
import Content from './content/content';
import Toast from './components/toast/toast';
import Menu from './components/menu/menu';
import { auth } from './services/firebase';
import { createUserProfileDoc, createUserAgentDoc } from './services/auth';

export const AppContext = createContext({});

function App() {
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        createUserAgentDoc();
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            console.log('user auth', userAuth);
            if (userAuth && userAuth.emailVerified) {
                const userRef = await createUserProfileDoc(userAuth);
                userRef.onSnapshot((snapshot) => {
                    console.log('snapshot', snapshot.data());
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
                <Header toggleMenu={() => setVisible(!visible)} />
                <HashRouter>
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
                        <Grid item xs="auto" className="d-none d-md-block sider">
                            <Sider onClose={() => null} />
                        </Grid>
                        <Grid item xs className="content">
                            <Content visible={visible} />
                        </Grid>
                    </Grid>
                </HashRouter>
            </div>
        </AppContext.Provider>
    );
}

export default App;
