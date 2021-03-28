import React from 'react';
import { MenuOpen, GitHub } from '@material-ui/icons';
import './header.scss';

function Header(props) {
    return (
        <div className="header d-flex">
            <div className="d-flex align-items-center">
                <MenuOpen
                    onClick={() => props.showSider()}
                    className="d-md-none d-sm-block menuIcon"
                    color="primary"
                />
                <h5 className="heading">see algorithms</h5>
            </div>
            <div>
                <GitHub
                    onClick={() => {
                        window.location.href = 'https://github.com/akarande777/see-algorithms';
                    }}
                />
            </div>
        </div>
    );
}

export default Header;
