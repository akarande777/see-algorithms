import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import { PlayArrow, Pause } from '@material-ui/icons';
import { showToast } from '../toast/toast';
import './draw-graph.scss';
import Graph from '../../common/graph';
import $ from 'jquery';
import { clearGraph, drawGraph, switchType } from '../../algorithms/draw-graph';
import { findAlgorithm, getCostMatrix } from '../../common/utils';
import Timer from '../../common/timer';
import { withRouter } from 'react-router-dom';
import Spinner from '../spinner/spinner';
import { AppContext } from '../../common/context';
import useGraphData from './useGraphData';

function DrawGraph(props) {
    const { setContext, categories, dataArray, isGraphDirected, playStatus } =
        useContext(AppContext);
    const [source, setSource] = useState('A');
    const { pathname } = props.location;
    const { algoId } = findAlgorithm(categories, pathname);
    const { saveGraphData, loading } = useGraphData({ algoId, dataArray, setContext });

    const validate = () => {
        let np = Graph.totalPoints();
        if (np < 2) {
            showToast({
                message: 'Graph cannot be empty',
                variant: 'error',
            });
            return false;
        }
        if (source < 'A' || source > 'Z') {
            showToast({
                message: 'Please enter valid source',
                variant: 'error',
            });
            return false;
        }
        if (!Graph.isConnected()) {
            showToast({
                message: 'Please draw connected graph',
                variant: 'error',
            });
            return false;
        }
        return true;
    };

    const config = () => ({
        weighted: props.isMST || props.weighted || false,
        acyclic: props.isDAG || false,
    });

    const handleClear = () => {
        Timer.clear();
        clearGraph();
        drawGraph(config());
        setContext({ playStatus: 0 });
    };

    const handlePlay = () => {
        switch (playStatus) {
            case 0:
                if (validate()) {
                    $('#plane').off();
                    props.start(source.charCodeAt(0) - 65);
                    setContext({ playStatus: 1 });
                }
                break;
            case -1:
                setContext({ playStatus: 1 });
                Timer.resume();
                break;
            default:
                setContext({ playStatus: -1 });
                Timer.pause();
        }
    };

    useEffect(() => {
        handleClear();
        setContext({ isGraphDirected: false, playStatus: 0 });
        while (Graph.isDirected()) {
            Graph.switchType();
        }
        return () => {
            Timer.clear() || clearGraph();
        };
    }, [pathname]);

    const setDirected = () => {
        switchType();
        drawGraph(config());
        setContext({ isGraphDirected: !isGraphDirected });
    };

    const saveGraph = () => {
        const costMatrix = getCostMatrix();
        const data = Graph.stringify({ costMatrix, ...config() });
        saveGraphData({ variables: { algoId, data } });
    };

    return (
        <Spinner className="drawGraph" spinning={loading}>
            <div className="d-flex flex-wrap toolbar">
                <span className="title">Draw Graph</span>
                {!props.isDAG && (
                    <>
                        {!props.isMST && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isGraphDirected}
                                        onChange={setDirected}
                                        name="directed"
                                        disabled={playStatus !== 0}
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
                    startIcon={playStatus > 0 ? <Pause /> : <PlayArrow />}
                    onClick={handlePlay}
                    disabled={Boolean(props.isDAG && playStatus)}
                >
                    {playStatus > 0 ? 'Pause' : 'Play'}
                </Button>
                <Button variant="contained" onClick={handleClear} id="clear">
                    Clear
                </Button>
                {/* <Button
                    variant="contained"
                    onClick={() => validate() && saveGraph()}
                    disabled={playStatus !== 0}
                >
                    Save
                </Button> */}
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
        </Spinner>
    );
}

export default withRouter(DrawGraph);
