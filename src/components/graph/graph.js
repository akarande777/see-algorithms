import React, { useState, useEffect } from 'react';
import { Button, Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import { PlayArrow, Pause } from '@material-ui/icons';
import { showToast } from '../toast/toast';
import './graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import listen from './events';
import { fromEnd } from '../../common/utils';
import timer from '../../common/timer';

function GraphView(props) {
    const [directed, setDirected] = useState(props.isDAG || false);
    const [status, setStatus] = useState(0);
    const [source, setSource] = useState('A');

    const validate = () => {
        let ns = Graph.totalSegments();
        if (ns < 1) {
            showToast({
                message: 'Please draw valid graph',
                variant: 'error',
            });
            return;
        }
        let s = source.charCodeAt(0);
        let np = Graph.totalPoints();
        if (source < 65 || s >= 65 + np) {
            showToast({
                message: 'Please enter valid source',
                variant: 'error',
            });
            return;
        }
        if (!Graph.isConnected()) {
            showToast({
                message: 'Please connect all vertices',
                variant: 'error',
            });
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
            <div className="d-flex flex-wrap toolbar">
                <span className="title">Draw Graph</span>
                {!props.isDAG && (
                    <>
                        {!props.isMST && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={directed}
                                        onChange={() => setDirected(!directed)}
                                        name="directed"
                                        disabled={status !== 0}
                                    />
                                }
                                label="Directed"
                                className="checkbox"
                            />
                        )}
                        {props.customSource !== false && (
                            <TextField
                                value={source}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    setSource(value.charAt(0).toUpperCase());
                                }}
                                className="source"
                                label="Source"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </>
                )}
                <Button
                    variant="contained"
                    startIcon={status > 0 ? <Pause /> : <PlayArrow />}
                    onClick={handlePlay}
                    disabled={Boolean(props.isDAG && status)}
                >
                    {status > 0 ? 'Pause' : 'Play'}
                </Button>
                <Button variant="contained" onClick={clear} id="clear">
                    Clear
                </Button>
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
