import React from 'react';
import { Button } from '@material-ui/core';

const NoRouteFound = ({ history }) => {
    return (
        <div className="container404">
            <div>
                <h1 className="fourZeroFour">404</h1>
                <hr />
                <h4>Oops! page not found</h4>
                <br />
                <Button variant="contained" color="primary" onClick={() => history.goBack()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default NoRouteFound;
