import React, { useState, useEffect } from 'react';
import { Button, Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import { PlayArrow, Pause } from '@material-ui/icons';
import { showToast } from '../toast/toast';
import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { drawGraph } from '../../events/draw-graph';
import { fromEnd } from '../../common/utils';
import Timer from '../../common/timer';

function DrawGraph(props) {
    const [directed, setDirected] = useState(props.isDAG || false);
    const [status, setStatus] = useState(0);
    const [source, setSource] = useState('A');

    const validate = () => {
        let np = Graph.totalPoints();
        if (np < 2) {
            showToast({
                message: 'Graph cannot be empty',
                variant: 'error',
            });
            return;
        }
        if (source < 'A' || source > 'Z') {
            showToast({
                message: 'Please enter valid source',
                variant: 'error',
            });
            return;
        }
        if (!Graph.isConnected()) {
            showToast({
                message: 'Please draw connected graph',
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

    const reset = () => {
        Graph.reset(directed);
        drawGraph(options());
    };

    const clear = () => {
        Timer.clear();
        $('#plane').off();
        $('#plane').children().not(':first').remove();
        $('#tbl').html('');
        status ? setStatus(0) : reset();
    };

    useEffect(() => () => clear(), []);

    useEffect(() => {
        switch (status) {
            case 0:
                reset();
                break;
            case 1:
                $('#plane').off();
                props.start(source.charCodeAt(0) - 65);
                break;
            case 2:
                Timer.resume();
                break;
            default:
                Timer.pause();
        }
    }, [status]);

    useEffect(() => {
        if (directed !== Graph.isDirected()) {
            Graph.switchType();
            drawGraph(options());
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
                setStatus(2);
                break;
            default:
                setStatus(-1);
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
                                style={{ margin: 0 }}
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

export default DrawGraph;
