import React, { Fragment } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Breadcrumbs } from '@material-ui/core';
import Home from '../home/home';
import NoRouteFound from '../components/404/404';
import { algorithms } from '../common/constants';
import BubbleSort from '../sorting/BubbleSort';
import InsertionSort from '../sorting/InsertionSort';
import SelectionSort from '../sorting/SelectionSort';
import RadixSort from '../sorting/RadixSort';
import HeapSort from '../sorting/HeapSort';
import MergeSort from '../sorting/MergeSort';
// import HuffmanCoding from '../HuffmanCoding';
import DFS from '../graph/DFS';
import BFS from '../graph/BFS';
import Prims from '../graph/Prims';
import Kruskals from '../graph/Kruskals';
import Dijkstras from '../graph/Dijkstras';
import TopSort from '../graph/TopSort';

const getDescription = (algo) => {
    switch (algo.value) {
        case 'Prims':
            return "Prim's Minimum Spanning Tree";
        case 'Kruskals':
            return "Kruskal's Minimum Spanning Tree";
        case 'Dijkstras':
            return "Dijkstra's Shortest Path";
        default:
            return algo.label;
    }
};

function Content({ location, visible }) {
    const { pathname } = location;
    const { sorting, graph } = algorithms;
    const all = [...sorting, ...graph];
    const algo = all.find((x) => pathname.includes(x.value));
    return (
        <Fragment>
            <Breadcrumbs>
                {algo ? <Link to="/">Home</Link> : <span>Home</span>}
                {algo && <span>{getDescription(algo)}</span>}
            </Breadcrumbs>
            <br />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/BubbleSort" exact>
                    <BubbleSort />
                </Route>
                <Route path="/InsertionSort" exact>
                    <InsertionSort />
                </Route>
                <Route path="/SelectionSort" exact>
                    <SelectionSort />
                </Route>
                <Route path="/RadixSort" exact>
                    <RadixSort />
                </Route>
                <Route path="/HeapSort" exact>
                    <HeapSort />
                </Route>
                <Route path="/MergeSort" exact>
                    <MergeSort />
                </Route>
                <Route path="/DFS" exact>
                    <DFS visible={visible} />
                </Route>
                <Route path="/BFS" exact>
                    <BFS visible={visible} />
                </Route>
                <Route path="/Prims" exact>
                    <Prims visible={visible} />
                </Route>
                <Route path="/Kruskals" exact>
                    <Kruskals visible={visible} />
                </Route>
                <Route path="/Dijkstras" exact>
                    <Dijkstras visible={visible} />
                </Route>
                <Route path="/TopSort" exact>
                    <TopSort visible={visible} />
                </Route>
                <Route>
                    <NoRouteFound />
                </Route>
            </Switch>
        </Fragment>
    );
}

export default withRouter(Content);
