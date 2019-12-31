import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import BubbleSort from './sorting/BubbleSort';
import InsertionSort from './sorting/InsertionSort';
import SelectionSort from './sorting/SelectionSort';
import RadixSort from './sorting/RadixSort';
import HeapSort from './sorting/HeapSort';
import MergeSort from './sorting/MergeSort';

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
        </Switch>
    );
}

export default Content;