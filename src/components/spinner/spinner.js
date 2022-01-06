import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

function Spinner({ spinning, className, children }) {
    return (
        <div className={className}>
            <Backdrop open={spinning} style={{ zIndex: 100 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {children}
        </div>
    );
}

export default Spinner;
