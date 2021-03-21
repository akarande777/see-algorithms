import React, { useContext } from 'react';
import { Icon, Avatar, Dropdown, Menu } from 'antd';
import './header.scss';
import { AuthContext } from '../../App';
import { auth } from '../../services/firebase';

function Header(props) {
    const user = useContext(AuthContext);

    const menu = (
        <Menu>
            <Menu.Item key="0" onClick={() => auth.signOut()}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="header d-flex">
            <div className="d-flex align-items-center">
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
                <h5>see algorithms</h5>
            </div>
            {/* <Icon
                type="github"
                onClick={() => {
                    window.location.href = 'https://github.com/akarande777/see-algorithms';
                }}
            /> */}
            <Dropdown overlay={menu} trigger={['click']}>
                {user ? <Avatar icon="user" /> : <span />}
            </Dropdown>
        </div>
    );
}

export default Header;
