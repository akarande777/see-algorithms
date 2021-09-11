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

import BST from '../../data-structures/BST';
import Heap from '../../data-structures/Heap';
import Queue from '../../data-structures/Queue';

const getTitle = (algo) => {
    switch (algo.value) {
        case 'prims':
            return "Prim's Minimum Spanning Tree";
        case 'kruskals':
            return "Kruskal's Minimum Spanning Tree";
        case 'dijkstras':
            return "Dijkstra's Shortest Path";
        case 'heap':
            return 'Binary (Max) Heap';
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
                <Route exact path="/" component={Home} />
                <Route path="/bubble-sort" exact component={BubbleSort} />
                <Route path="/insertion-sort" exact component={InsertionSort} />
                <Route path="/selection-sort" exact component={SelectionSort} />
                <Route path="/radix-sort" exact component={RadixSort} />
                <Route path="/heap-sort" exact component={HeapSort} />
                <Route path="/merge-sort" exact component={MergeSort} />
                <Route path="/dfs" exact component={DFS} />
                <Route path="/bfs" exact component={BFS} />
                <Route path="/prims" exact component={Prims} />
                <Route path="/kruskals" exact component={Kruskals} />
                <Route path="/dijkstras" exact component={Dijkstras} />
                <Route path="/topsort" exact component={TopSort} />
                <Route path="/convex-hull" exact component={ConvexHull} />
                <Route path="/bst" exact component={BST} />
                <Route path="/heap" exact component={Heap} />
                <Route path="/queue" exact component={Queue} />
                <Route>
                    <PageNotFound />
                </Route>
            </Switch>
        </Fragment>
    );
}

export default withRouter(Content);
