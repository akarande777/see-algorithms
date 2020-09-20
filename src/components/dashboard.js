import React, { useState } from 'react';
import { Layout, Icon, Drawer } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import SiderView from './sider';
import ContentView from './content';

const { Sider, Content } = Layout;

function Dashboard() {
    const [visible, setVisible] = useState(false);
    
    return (
        <div className="dashboard">
            <div className="header-md d-flex">
                <div className="d-flex">
                    <Icon
                        type="eye"
                        onClick={() => window.history.back()}
                        className="d-none d-md-block"
                    />
                    <Icon
                        type="menu"
                        onClick={() => setVisible(true)}
                        className="d-md-none d-sm-block"
                    />
                    <h5>see algorithms</h5>
                </div>
                <Icon
                    type="github"
                    style={{ fontSize: 20 }}
                    onClick={() => {
                        window.location.href = 'https://github.com/akarande777/see-algorithms';
                    }}
                />
            </div>
            <BrowserRouter>
                <Drawer
                    placement="left"
                    onClose={() => setVisible(false)}
                    visible={visible}
                    closable={false}
                >
                    <Sider width="auto" style={{ backgroundColor: 'white' }}>
                        <SiderView
                            onChange={() => setVisible(false)}
                        />
                    </Sider>
                </Drawer>
                <Layout>
                    <Sider width="auto"
                        style={{ backgroundColor: 'white' }}
                        className="d-none d-md-block"
                    >
                        <SiderView onChange={() => null} />
                    </Sider>
                    <Content style={{ backgroundColor: 'white' }}>
                        <ContentView />
                    </Content>
                </Layout>
            </BrowserRouter>
        </div>
    );
}

export default Dashboard;