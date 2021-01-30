import React from 'react';
import { Switch, Route } from 'react-router-dom';
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

function Content({ visible }) {
    return (
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
            <Route path="/DepthFirstSearch" exact>
                <DFS visible={visible} />
            </Route>
            <Route path="/BreadthFirstSearch" exact>
                <BFS visible={visible} />
            </Route>
            <Route path="/Prim'sAlgorithm" exact>
                <Prims visible={visible} />
            </Route>
            <Route path="/Kruskal'sAlgorithm" exact>
                <Kruskals visible={visible} />
            </Route>
            <Route path="/Dijkstra'sAlgorithm" exact>
                <Dijkstras visible={visible} />
            </Route>
            <Route path="/TopologicalSorting" exact>
                <TopSort visible={visible} />
            </Route>
            <Route>
                <NoRouteFound />
            </Route>
        </Switch>
    );
}

export default Content;
