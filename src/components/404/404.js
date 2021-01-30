import React from 'react';
import './404.css';
import { Button } from 'antd';

const NoRouteFound = ({ history }) => {
    return (
        <div className="container404">
            <div>
                <h1 className="fourZeroFour">404</h1>
                <hr />
                <h3>Oops! page not found</h3>
                <br />
                <Button type="primary" onClick={() => history.goBack()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default NoRouteFound;
