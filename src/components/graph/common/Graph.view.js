import React, { useState, useEffect } from 'react';
import { Button, Radio, Input, message } from 'antd';
import './Graph.view.scss';
import Graph from './Graph';
import $ from 'jquery';
import listen from './events';
import { fromEnd } from '../utils';
import timer from './timer';

function GraphView(props) {
    const [directed, setDirected] = useState(props.isDAG || false);
    const [status, setStatus] = useState(0);
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
        setStatus(1);
    };

    const options = () => ({
        weighted: props.isMST || props.weighted || false,
        directed: directed,
        asyclic: props.isDAG || false,
    });

    const initialize = () => {
        Graph.initialize(directed);
        listen(options());
    };

    const clear = () => {
        timer.clear();
        $('#plane').off();
        $('#plane').children().not(':first').remove();
        $('#tbl').html('');
        status ? setStatus(0) : initialize();
    };

    useEffect(() => () => clear(), []);

    useEffect(() => {
        if (status === 1) {
            props.start(source.charCodeAt(0) - 65);
        }
        if (status === 0) {
            initialize();
        }
    }, [status]);

    useEffect(() => {
        if (directed !== Graph.isDirected()) {
            Graph.switchType();
            listen(options());
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

    const handlePlay = () => {
        switch (status) {
            case 0:
                validate();
                break;
            case -1:
                timer.resume();
                setStatus(2);
                break;
            default:
                timer.pause();
                setStatus(-1);
                break;
        }
    };

    return (
        <div className="drawGraph">
            <div className="spaceBetween toolbar">
                <div className="d-flex flex-wrap">
                    <span className="title">Draw Graph</span>
                </div>
                <div className="d-flex flex-wrap options">
                    {!props.isDAG && (
                        <>
                            {!props.isMST && (
                                <Radio.Group
                                    value={directed}
                                    onChange={() => !status && setDirected(!directed)}
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value={false}>Undirected</Radio.Button>
                                    <Radio.Button value={true}>Directed</Radio.Button>
                                </Radio.Group>
                            )}
                            {props.customSource !== false && (
                                <Input
                                    addonBefore="Source"
                                    value={source}
                                    onChange={({ target }) => setSource(target.value)}
                                    className="source"
                                />
                            )}
                        </>
                    )}
                    <Button
                        type="primary"
                        className="playButton"
                        icon={status > 0 ? 'pause' : 'caret-right'}
                        onMouseDown={handlePlay}
                        disabled={props.isDAG && status}
                    >
                        {status > 0 ? 'Pause' : 'Play'}
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
