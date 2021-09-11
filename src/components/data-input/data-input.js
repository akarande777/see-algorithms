import React, { useState } from 'react';
import { showToast } from '../toast/toast';
import { Input, Button } from '@material-ui/core';
import './data-input.scss';

function DataInput(props) {
    const [number, setNumber] = useState(Math.floor(Math.random() * 100));
    const [status, setStatus] = useState(false);

    const handleInput = (e) => {
        let value = e.target.value.trim().slice(0, 3);
        if (!isNaN(value)) {
            setNumber(parseInt(value) || '');
        }
    };

    const validate = (callback) => {
        if (typeof number !== 'number') {
            showToast({
                message: 'Please enter a number',
                variant: 'error',
            });
        } else {
            setStatus(true);
            callback(number).then((flag) => {
                if (!flag) {
                    setStatus(false);
                    setNumber(Math.floor(Math.random() * 100));
                }
            });
        }
    };

    return (
        <div className="dataInput">
            <div className="input" style={{ marginBottom: 0 }}>
                <span className="label">Enter a number: &nbsp;</span>
                <Input
                    value={number}
                    onChange={(e) => handleInput(e)}
                    className="number"
                />
                <div>
                    {props.buttons.map((btn, i) => (
                        <Button
                            key={i}
                            variant="contained"
                            onClick={() => validate(btn.onClick)}
                            disabled={status}
                        >
                            {btn.text}
                        </Button>
                    ))}
                </div>
            </div>
            <svg id="plane"></svg>
        </div>
    );
}

export default DataInput;
