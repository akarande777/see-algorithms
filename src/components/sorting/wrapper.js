import React, { useState } from 'react';
import { Select, Input, Button, message } from 'antd';

function Wrapper(Component) {
    return function Container() {
        const [values, setValues] = useState([]);
        const [status, setStatus] = useState(false);

        const handleSelect = val => {
            const values = [];
            for (let i = 0; i < val; i++) {
                values.push(Math.floor(Math.random() * 100));
            }
            setValues(values);
        }

        const handleInput = (e, i) => {
            values[i] = e.target.value;
            setValues([...values]);
        }

        const isInputValid = () => {
            for (let i = 0; i < values.length; i++) {
                if (isNaN(parseInt(values[i]))) {
                    message.error("not a number", 2);
                    return false;
                }
            }
            return true;
        }

        const createTable = (tbl, cell) => {
            const n = values.length;
            const row = [];
            for (let i = 0; i < 3; i++) {
                row[i] = document.createElement("tr");
                for (let j = 0; j < n; j++) {
                    cell[i * n + j] = document.createElement("td");
                    if (i === 1) {
                        cell[i * n + j].innerHTML = values[j];
                        cell[i * n + j].style.border = "2px solid";
                    }
                    row[i].appendChild(cell[i * n + j]);
                }
                tbl.appendChild(row[i]);
            }
        }

        return (
            <div>
                <div id="input">
                    <span className="label">
                        {!values.length ? 'Select number of elements: ' : 'Enter numbers: '}
                        &nbsp;
                    </span>
                    {!values.length ?
                        <Select
                            style={{ width: 60 }}
                            onChange={handleSelect}
                        >
                            {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                                .map(i => {
                                    return (
                                        <Select.Option key={i} value={i}>
                                            {i}
                                        </Select.Option>
                                    );
                                })
                            }
                        </Select> :
                        <div>
                            {values.map((v, i) => {
                                return (
                                    <Input size="small"
                                        key={i} value={v}
                                        onChange={e => handleInput(e, i)}
                                    />
                                );
                            })}
                        </div>
                    }
                    {values.length > 0 &&
                        <div>
                            <Button
                                type="primary"
                                onClick={!status
                                    ? () => setStatus(true)
                                    : () => setStatus(false)
                                }
                            >
                                {!status ? 'Start' : 'Stop'}
                            </Button>
                        </div>
                    }
                </div>
                <Component
                    values={values}
                    status={status}
                    setValues={setValues}
                    setStatus={setStatus}
                    isInputValid={isInputValid}
                />
            </div>
        );
    }
}

export default Wrapper;