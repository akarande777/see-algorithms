import React, { useEffect, useState } from 'react';
import { showToast } from '../toast/toast';
import { Select, Input, Button, MenuItem } from '@material-ui/core';
import './numbers.scss';
import { dataArrayVar } from '../../common/cache';
import { randomInt } from '../../common/utils';

function Numbers(props) {
    const [values, setValues] = useState([]);
    const [status, setStatus] = useState(false);
    const { min = 7, max = 12 } = props;

    useEffect(() => {
        dataArrayVar([]);
    }, []);

    const handleSelect = (e) => {
        const size = parseInt(e.target.value);
        const values = [];
        for (let i = 0; i < size; i++) {
            values.push(randomInt());
        }
        setValues(values);
    };

    const handleInput = (e, i) => {
        let val = e.target.value.trim().slice(0, 3);
        if (!isNaN(val)) {
            values[i] = parseInt(val) || '';
            setValues([...values]);
        }
    };

    const validate = () => {
        for (let i = 0; i < values.length; i++) {
            if (typeof values[i] !== 'number') {
                showToast({
                    message: 'Please enter valid numbers.',
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
                <Select onChange={handleSelect} className="select">
                    <MenuItem></MenuItem>
                    {Array.from(Array(max - min + 1))
                        .map((_, i) => min + i)
                        .map((i) => (
                            <MenuItem key={i} value={i}>
                                {i}
                            </MenuItem>
                        ))}
                </Select>
            ) : (
                <div>
                    {values.map((val, i) => (
                        <Input
                            key={i}
                            value={val}
                            onChange={(e) => handleInput(e, i)}
                            className="number"
                        />
                    ))}
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
