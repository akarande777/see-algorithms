import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import BubbleSort from './sorting/BubbleSort';
import InsertionSort from './sorting/InsertionSort';
import SelectionSort from './sorting/SelectionSort';
import RadixSort from './sorting/RadixSort';
import HeapSort from './sorting/HeapSort';
import MergeSort from './sorting/MergeSort';
// import HuffmanCoding from './HuffmanCoding';
import DFS from './graph/DFS';
import BFS from './graph/BFS';
import Prims from './graph/Prims';
import Kruskals from './graph/Kruskals';
import Dijkstras from './graph/Dijkstras';
import TopSort from './graph/TopSort';

function Content() {
    return (
        <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/BubbleSort"><BubbleSort /></Route>
            <Route path="/InsertionSort"><InsertionSort /></Route>
            <Route path="/SelectionSort"><SelectionSort /></Route>
            <Route path="/RadixSort"><RadixSort /></Route>
            <Route path="/HeapSort"><HeapSort /></Route>
            <Route path="/MergeSort"><MergeSort /></Route>
            {/* <Route path="/HuffmanCoding"><HuffmanCoding /></Route> */}
            <Route path="/DepthFirstSearch"><DFS /></Route>
            <Route path="/BreadthFirstSearch"><BFS /></Route>
            <Route path="/Prim'sAlgorithm"><Prims /></Route>
            <Route path="/Kruskal'sAlgorithm"><Kruskals /></Route>
            <Route path="/Dijkstra'sAlgorithm"><Dijkstras /></Route>
            <Route path="/TopologicalSorting"><TopSort /></Route>
        </Switch>
    );
}

export default Content;