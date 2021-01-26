import React, { useState } from 'react';
import { Layout, Icon, Drawer } from 'antd';
import { HashRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import SiderView from './sider';
import ContentView from './content';
import './dashboard.scss';

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
                    <h5>SEE ALGORITHMS</h5>
                </div>
                <Icon
                    type="github"
                    onClick={() => {
                        window.location.href = 'https://github.com/akarande777/see-algorithms';
                    }}
                />
            </div>
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
                    <Content style={{ backgroundColor: 'white' }}>
                        <ContentView visible={visible} />
                    </Content>
                </Layout>
            </HashRouter>
        </div>
    );
}

export default Dashboard;
