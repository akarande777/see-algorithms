import React from 'react';
import { Select, Input, Button } from 'antd';

function Common(props) {
    let values = props.values;
    return (
        <div style={{ padding: 24 }}>
            <span className="label">
                {!values.length ? 'Select number of elements: '
                    : 'Enter numbers: '
                }
            </span>
            {!values.length ?
                <Select
                    style={{ width: 60 }}
                    onChange={props.handleSelect}
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
                values.map((v, i) => {
                    return (
                        <Input size="small"
                            key={i} value={v}
                            onChange={e => props.handleInput(e, i)}
                            style={{ width: 40, marginRight: 5 }}
                        />
                    );
                })
            }
            {values.length > 0 &&
                <Button
                    type="primary"
                    onClick={
                        !props.started ? props.start
                            : props.stop
                    }
                >
                    {!props.started ? 'Start' : 'Stop'}
                </Button>
            }
        </div>
    );
}

export default Common;