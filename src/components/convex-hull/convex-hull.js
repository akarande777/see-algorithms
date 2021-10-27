import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { PlayArrow, Pause } from '@material-ui/icons';
// import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { addPoints, randomize } from '../../events/convex-hull';
import Timer from '../../common/timer';

function ConvexHull(props) {
    const [status, setStatus] = useState(0);

    const reset = () => {
        Graph.reset();
        addPoints();
        randomize();
    };

    const clear = () => {
        Timer.clear();
        $('#plane').off();
        $('#plane').children().remove();
    };

    const handleReset = () => {
        clear();
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
                props.start();
                break;
            case 2:
                Timer.resume();
                break;
            default:
                Timer.pause();
        }
    }, [status]);

    const handlePlay = () => {
        switch (status) {
            case 0:
                setStatus(1);
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
                <span className="title">Add Points</span>
                <Button
                    variant="contained"
                    startIcon={status > 0 ? <Pause /> : <PlayArrow />}
                    onClick={handlePlay}
                    disabled={Boolean(props.isDAG && status)}
                >
                    {status > 0 ? 'Pause' : 'Play'}
                </Button>
                <Button variant="contained" onClick={handleReset} id="clear">
                    Reset
                </Button>
            </div>
            <svg id="plane"></svg>
        </div>
    );
}

export default ConvexHull;
