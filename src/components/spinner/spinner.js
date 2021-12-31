import React from 'react';
import { CircularProgress } from '@material-ui/core';
import './spinner.scss';

function Spinner({ spinning, className, children }) {
    return (
        <div className={`${className || ''} ${spinning ? 'spinning' : ''}`}>
            {spinning && <CircularProgress className="spinner" />}
            {children}
        </div>
    );
}

export default Spinner;
