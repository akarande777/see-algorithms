import React, { useState } from 'react';
import { Select, Input, Button, message } from 'antd';

function Container(props) {
    const [values, setValues] = useState([]);
    const [status, setStatus] = useState(false);

    const handleSelect = (val) => {
        const values = [];
        for (let i = 0; i < val; i++) {
            values.push(Math.floor(Math.random() * 100));
        }
        setValues(values);
    };

    const handleInput = (e, i) => {
        values[i] = e.target.value;
        setValues([...values]);
    };

    const validate = () => {
        for (let i = 0; i < values.length; i++) {
            if (isNaN(parseInt(values[i]))) {
                message.error('not a number', 2);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!status) {
            validate() && props.start(values);
            setStatus(true);
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
                <Select style={{ width: 60 }} onChange={handleSelect}>
                    {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
                        return (
                            <Select.Option key={i} value={i}>
                                {i}
                            </Select.Option>
                        );
                    })}
                </Select>
            ) : (
                <div>
                    {values.map((v, i) => {
                        return (
                            <Input
                                size="small"
                                key={i}
                                value={v}
                                onChange={(e) => handleInput(e, i)}
                                className="number"
                            />
                        );
                    })}
                </div>
            )}
            {values.length > 0 && (
                <div>
                    <Button type="primary" onClick={handleSubmit}>
                        {!status ? 'Start' : 'Stop'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Container;
