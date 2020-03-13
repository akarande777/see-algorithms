import React from 'react';
import { Layout, PageHeader, Icon } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import SiderView from './menu';
import ContentView from './content';

const { Sider, Content } = Layout;

function Dashboard() {
    return (
        <div className="Dashboard">
            <PageHeader
                style={{ border: '1px solid rgb(235, 237, 240)' }}
                onBack={() => null}
                title="seeAlgorithms"
                subTitle="Visualization of Algorithms"
                backIcon={<Icon type="eye"
                    theme="twoTone"
                    style={{ fontSize: 22 }}
                />}
                extra={<Icon type="github"
                    style={{ fontSize: 22 }}
                    onClick={() => {
                        window.location.href = 'https://github.com/akarande777/see-algorithms';
                    }}
                />}
            />
            <BrowserRouter>
                <Layout style={{ marginLeft: 26 }}>
                    <Sider style={{ backgroundColor: 'white' }} width="auto">
                        <SiderView />
                    </Sider>
                    <Content style={{ overflow: 'hidden', backgroundColor: 'white' }}>
                        <ContentView />
                    </Content>
                </Layout>
            </BrowserRouter>
        </div>
    );
}

export default Dashboard;