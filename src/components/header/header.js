import React from 'react';
import { Icon } from 'antd';
import './header.scss';

function Dashboard(props) {
    return (
        <div className="header d-flex">
            <div className="d-flex">
                <Icon
                    type="eye"
                    onClick={() => window.history.back()}
                    className="d-none d-md-block"
                />
                <Icon
                    type="menu"
                    onClick={() => props.showSider(true)}
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
    );
}

export default Dashboard;
