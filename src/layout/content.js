import React, { Fragment } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import Home from '../components/home';
import NoRouteFound from '../components/404/404';
import BubbleSort from '../components/sorting/BubbleSort';
import InsertionSort from '../components/sorting/InsertionSort';
import SelectionSort from '../components/sorting/SelectionSort';
import RadixSort from '../components/sorting/RadixSort';
import HeapSort from '../components/sorting/HeapSort';
import MergeSort from '../components/sorting/MergeSort';
// import HuffmanCoding from '../HuffmanCoding';
import DFS from '../components/graph/DFS';
import BFS from '../components/graph/BFS';
import Prims from '../components/graph/Prims';
import Kruskals from '../components/graph/Kruskals';
import Dijkstras from '../components/graph/Dijkstras';
import TopSort from '../components/graph/TopSort';

const getDescription = (algo) => {
    switch (algo) {
        case "Prim's Algorithm":
            return "Prim's Minimum Spanning Tree";
        case "Kruskal's Algorithm":
            return "Kruskal's Minimum Spanning Tree";
        case "Dijkstra's Algorithm":
            return "Dijkstra's Shortest Path";
        default:
            return algo;
    }
};

function Content({ location, visible }) {
    const { pathname } = location;
    const title = pathname.slice(1).split('-').join(' ');
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{getDescription(title)}</Breadcrumb.Item>
            </Breadcrumb>
            <br />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/Bubble-Sort" exact>
                    <BubbleSort />
                </Route>
                <Route path="/Insertion-Sort" exact>
                    <InsertionSort />
                </Route>
                <Route path="/Selection-Sort" exact>
                    <SelectionSort />
                </Route>
                <Route path="/Radix-Sort" exact>
                    <RadixSort />
                </Route>
                <Route path="/Heap-Sort" exact>
                    <HeapSort />
                </Route>
                <Route path="/Merge-Sort" exact>
                    <MergeSort />
                </Route>
                <Route path="/Depth-First-Search" exact>
                    <DFS visible={visible} />
                </Route>
                <Route path="/Breadth-First-Search" exact>
                    <BFS visible={visible} />
                </Route>
                <Route path="/Prim's-Algorithm" exact>
                    <Prims visible={visible} />
                </Route>
                <Route path="/Kruskal's-Algorithm" exact>
                    <Kruskals visible={visible} />
                </Route>
                <Route path="/Dijkstra's-Algorithm" exact>
                    <Dijkstras visible={visible} />
                </Route>
                <Route path="/Topological-Sorting" exact>
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
