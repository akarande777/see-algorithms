import React from 'react';
import { fromEnd, cloneEdge } from '../../common/utils';
import Graph from '../../common/graph';
import DrawConvex from '../../components/draw-convex/draw-convex';
import $ from 'jquery';
import Timer from '../../common/timer';
import { Colors } from '../../common/constants';

var delay = 100;

export default function (props) {
    return <DrawConvex {...props} start={start} />;
}

function start() {}
