import React, { Fragment } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Breadcrumbs } from '@material-ui/core';
import { Algorithms, DataStructures } from '../../common/constants';
import Home from '../../home/home';
import PageNotFound from '../404/404';

import BubbleSort from '../../algorithms/sorting/BubbleSort';
import InsertionSort from '../../algorithms/sorting/InsertionSort';
import SelectionSort from '../../algorithms/sorting/SelectionSort';
import RadixSort from '../../algorithms/sorting/RadixSort';
import HeapSort from '../../algorithms/sorting/HeapSort';
import MergeSort from '../../algorithms/sorting/MergeSort';

import DFS from '../../algorithms/graph/DFS';
import BFS from '../../algorithms/graph/BFS';
import Prims from '../../algorithms/graph/Prims';
import Kruskals from '../../algorithms/graph/Kruskals';
import Dijkstras from '../../algorithms/graph/Dijkstras';
import TopSort from '../../algorithms/graph/TopSort';
import ConvexHull from '../../algorithms/graph/ConvexHull';

const getTitle = (algo) => {
    switch (algo.value) {
        case 'prims':
            return "Prim's Minimum Spanning Tree";
        case 'kruskals':
            return "Kruskal's Minimum Spanning Tree";
        case 'dijkstras':
            return "Dijkstra's Shortest Path";
        default:
            return algo.label;
    }
};

function Content({ location }) {
    const { pathname } = location;
    const { sorting, graph } = Algorithms;
    const all = [...sorting, ...graph, ...DataStructures];
    const algo = all.find((x) => pathname.includes(x.value));
    return (
        <Fragment>
            <Breadcrumbs>
                {algo ? <Link to="/">Home</Link> : <span>Home</span>}
                {algo && <span>{getTitle(algo)}</span>}
            </Breadcrumbs>
            <br />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/bubble-sort" exact>
                    <BubbleSort />
                </Route>
                <Route path="/insertion-sort" exact>
                    <InsertionSort />
                </Route>
                <Route path="/selection-sort" exact>
                    <SelectionSort />
                </Route>
                <Route path="/radix-sort" exact>
                    <RadixSort />
                </Route>
                <Route path="/heap-sort" exact>
                    <HeapSort />
                </Route>
                <Route path="/merge-sort" exact>
                    <MergeSort />
                </Route>
                <Route path="/dfs" exact>
                    <DFS />
                </Route>
                <Route path="/bfs" exact>
                    <BFS />
                </Route>
                <Route path="/prims" exact>
                    <Prims />
                </Route>
                <Route path="/kruskals" exact>
                    <Kruskals />
                </Route>
                <Route path="/dijkstras" exact>
                    <Dijkstras />
                </Route>
                <Route path="/topsort" exact>
                    <TopSort />
                </Route>
                <Route path="/convex-hull" exact>
                    <ConvexHull />
                </Route>
                <Route>
                    <PageNotFound />
                </Route>
            </Switch>
        </Fragment>
    );
}

export default withRouter(Content);