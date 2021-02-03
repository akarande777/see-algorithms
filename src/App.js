import React, { useState } from 'react';
import './App.scss';
import { Layout, Drawer } from 'antd';
import { HashRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import Header from './components/header/header';
import SiderView from './layout/sider';
import ContentView from './layout/content';
import './components/common.scss';

const { Sider, Content } = Layout;

function App() {
    const [visible, setVisible] = useState(false);
    return (
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
    );
}

export default App;
