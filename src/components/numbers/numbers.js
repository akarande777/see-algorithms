import React, { useState } from 'react';
import { showToast } from '../toast/toast';
import { Select, Input, Button } from '@material-ui/core';
import './numbers.scss';

function Numbers(props) {
    const [values, setValues] = useState([]);
    const [status, setStatus] = useState(false);

    const handleSelect = (e) => {
        const size = parseInt(e.target.value);
        const values = [];
        for (let i = 0; i < size; i++) {
            values.push(Math.floor(Math.random() * 100));
        }
        setValues(values);
    };

    const handleInput = (e, i) => {
        let value = e.target.value.slice(0, 3);
        if (!isNaN(value)) {
            values[i] = value ? parseInt(value) : value;
            setValues([...values]);
        }
    };

    const validate = () => {
        for (let i = 0; i < values.length; i++) {
            if (!values[i]) {
                showToast({
                    message: 'Please enter valid number',
                    variant: 'error',
                });
                setStatus(false);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!status) {
            if (validate()) {
                setStatus(true);
                props.start(values);
            }
        } else {
            props.stop();
            setStatus(false);
            setValues([]);
        }
    };

    return (
        <div className="input">
            <span className="label">
                {!values.length ? 'Select number of elements: ' : 'Enter numbers: '}
                &nbsp;
            </span>
            {!values.length ? (
                <Select native onChange={handleSelect}>
                    <option value="" />
                    {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
                        return (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        );
                    })}
                </Select>
            ) : (
                <div>
                    {values.map((val, i) => {
                        return (
                            <Input
                                key={i}
                                value={val}
                                onChange={(e) => handleInput(e, i)}
                                className="number"
                            />
                        );
                    })}
                </div>
            )}
            {values.length > 0 && (
                <div>
                    <Button variant="contained" onClick={handleSubmit}>
                        {!status ? 'Start' : 'Stop'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Numbers;
