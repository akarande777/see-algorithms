import React from 'react';
import { Select, Input, Button } from 'antd';

function Common({ values, ...props }) {

    return (
        <div id="input">
            <span className="label">
                {!values.length ? 'Select number of elements: '
                    : 'Enter numbers: '
                }
                &nbsp;
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
                <div>
                    {values.map((v, i) => {
                        return (
                            <Input size="small"
                                key={i} value={v}
                                onChange={e => props.handleInput(e, i)}
                            />
                        );
                    })}
                </div>
            }
            {values.length > 0 &&
                <div>
                    <Button
                        type="primary"
                        onClick={
                            !props.started ? props.start
                                : props.stop
                        }
                    >
                        {!props.started ? 'Start' : 'Stop'}
                    </Button>
                </div>
            }
        </div>
    );
}

export default Common;