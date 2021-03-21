import React, { useState, useEffect, createContext } from 'react';
import './App.scss';
import { Layout, Drawer } from 'antd';
import { HashRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import Header from './components/header/header';
import SiderView from './layout/sider';
import ContentView from './layout/content';
import './components/common.scss';
import { auth } from './services/firebase';
import { createUserProfileDoc } from './services/auth';

const { Sider, Content } = Layout;

export const AuthContext = createContext(null);

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
        <AuthContext.Provider value={user}>
            <div className="App">
                <Header showSider={setVisible} />
                <HashRouter>
                    <Drawer
                        placement="left"
                        onClose={() => setVisible(false)}
                        visible={visible}
                        closable={false}
                    >
                        <Sider width="auto" style={{ backgroundColor: 'white' }}>
                            <SiderView onChange={() => setVisible(false)} />
                        </Sider>
                    </Drawer>
                    <Layout>
                        <Sider
                            width="auto"
                            style={{ backgroundColor: 'white' }}
                            className="d-none d-md-block"
                        >
                            <SiderView onChange={() => null} />
                        </Sider>
                        <Content style={{ backgroundColor: 'white', padding: 24 }}>
                            <ContentView visible={visible} />
                        </Content>
                    </Layout>
                </HashRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
