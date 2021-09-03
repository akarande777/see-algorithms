import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
// import { PlayArrow, Pause } from '@material-ui/icons';
// import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { addPoints } from './events';
// import Timer from '../../common/timer';

function DrawConvex(props) {
    // const [status, setStatus] = useState(0);

    const initialize = () => {
        Graph.initialize();
        addPoints();
    };

    const clear = () => {
        $('#plane').off();
        $('#plane').children().remove();
    };

    const reset = () => {
        clear();
        initialize();
    };

    useEffect(() => {
        initialize();
        return () => clear();
    }, []);

    return (
        <div className="drawGraph">
            <div className="d-flex flex-wrap toolbar">
                <span className="title">Draw Graph</span>
                {/* <Button
                    variant="contained"
                    startIcon={status > 0 ? <Pause /> : <PlayArrow />}
                    onClick={handlePlay}
                    disabled={Boolean(props.isDAG && status)}
                >
                    {status > 0 ? 'Pause' : 'Play'}
                </Button> */}
                <Button variant="contained" onClick={reset} id="clear">
                    Reset
                </Button>
            </div>
            <svg id="plane"></svg>
            <div className="spaceAround ">
                <table id="tbl" />
            </div>
        </div>
    );
}

export default DrawConvex;
