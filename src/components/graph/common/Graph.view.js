import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Input, message } from 'antd';
import './Graph.view.scss';
import Graph from './Graph';
import $ from 'jquery';
import { decorate } from './events';
import { fromEnd } from '../utils';

function GraphView(props) {
    const [directed, setDirected] = useState(props.isDAG || false);
    const [status, setStatus] = useState(false);
    const [source, setSource] = useState('A');

    const validate = () => {
        let n = Graph.totalPoints();
        if (n < 3) {
            message.error('Draw at least 3 edges');
            return;
        }
        let ind = Graph.indegree();
        for (let i = 0; i < n; i++) {
            let k = 0;
            for (let j = 0; j < n; j++) {
                let ei = Graph.edgeIndex(i, j);
                ei === undefined && k++;
            }
            if (k === n && ind[i] === 0) {
                message.error('Please connect all vertices');
                return;
            }
        }
        let s = source.charCodeAt(0);
        if (isNaN(s) || s < 65 || s >= 65 + n) {
            message.error('Please enter valid source');
            return;
        }
        setStatus(true);
    };

    const create = () => {
        decorate({
            weighted: props.isMST || props.weighted || false,
            directed: directed,
            asyclic: props.isDAG || false,
        });
    };

    const initialize = () => {
        Graph.initialize(directed);
        create();
    };

    const clear = () => {
        props.stop();
        $('#plane').off();
        $('#plane').children().not(':first').remove();
        $('#tbl').html('');
        status ? setStatus(false) : initialize();
    };

    useEffect(() => () => clear(), []);

    useEffect(() => {
        if (status) {
            props.start(source.charCodeAt(0) - 65);
        } else {
            initialize();
        }
    }, [status]);

    useEffect(() => {
        if (directed !== Graph.isDirected()) {
            Graph.switchType();
            create();
            if (directed) {
                $('.edge').each(function (i) {
                    let s = Graph.segment(i);
                    let r = fromEnd(s.p, s.q, 23);
                    $(this).attr('x2', r.x);
                    $(this).attr('y2', r.y);
                    $(this).attr('marker-end', 'url(#arrow)');
                });
            } else {
                $('.edge').each(function (i) {
                    let s = Graph.segment(i);
                    let { x, y } = s.q;
                    $(this).attr('x2', x);
                    $(this).attr('y2', y);
                    $(this).removeAttr('marker-end');
                });
            }
        }
    }, [directed]);

    useEffect(() => {
        if (props.visible) clear();
    }, [props.visible]);

    return (
        <div className="drawGraph">
            <div className="spaceBetween toolbar">
                <div className="d-flex flex-wrap left">
                    <span className="title">Draw Graph</span>
                    {!props.isDAG && (
                        <div className="options">
                            <span>Source: &nbsp;</span>
                            <Input
                                size="small"
                                value={source}
                                onChange={({ target }) => setSource(target.value)}
                                className="source"
                            />
                            {!props.isMST && (
                                <Checkbox
                                    checked={directed}
                                    onChange={({ target }) => {
                                        !status && setDirected(target.checked);
                                    }}
                                >
                                    Directed
                                </Checkbox>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className="d-flex flex-wrap right"
                    style={props.isDAG ? { flexDirection: 'row' } : {}}
                >
                    <Button type="primary" onMouseDown={validate} disabled={status}>
                        Start
                    </Button>
                    <Button type="primary" onMouseDown={clear} id="clear">
                        Clear
                    </Button>
                </div>
            </div>
            <svg id="plane">
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="4"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
            </svg>
            <div className="spaceAround ">
                <table id="tbl" />
            </div>
        </div>
    );
}

export default GraphView;
