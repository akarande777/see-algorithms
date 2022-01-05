import React, { useEffect } from 'react';
import $ from 'jquery';
import DSInput from '../components/ds-input/ds-input';
import { showToast } from '../components/toast/toast';
import { randomInt } from '../common/utils';

const buttons = [
    { text: 'Enqueue', onClick: enqueue },
    { text: 'Dequeue', onClick: dequeue },
];

export default function (props) {
    useEffect(() => createQueue(), []);
    return <DSInput {...props} buttons={buttons} />;
}

var n = 16;
var front, rear;
var size;

function createQueue() {
    front = 0;
    size = rear = 6;
    let r = 150;
    let circle = `<circle cx="200" cy="200" r="${r}" stroke="black" fill="#eee"></circle>`;
    document.getElementById('plane').innerHTML += circle;
    let deg = 360 / n;
    let half = deg / 2;
    let nx, ny;
    for (let i = 0; i < n; i++) {
        let rad = ((deg - 90) * Math.PI) / 180;
        nx = 200 + r * Math.sin(rad);
        ny = 200 + r * Math.cos(rad);
        let line = `<line x1="200" y1="200" x2="${nx}" y2="${ny}" stroke="black" />`;
        document.getElementById('plane').innerHTML += line;
        rad = ((deg - half - 90) * Math.PI) / 180;
        nx = 190 + (r - 20) * Math.sin(rad);
        ny = 205 + (r - 20) * Math.cos(rad);
        let text = `<text class="num" x="${nx}" y="${ny}"></text>`;
        document.getElementById('plane').innerHTML += text;
        if (i < rear) {
            $('.num:last').html(randomInt());
        }
        nx = 195 + (r + 20) * Math.sin(rad);
        ny = 205 + (r + 20) * Math.cos(rad);
        text = `<text class="front" x="${nx}" y="${ny}"></text>`;
        document.getElementById('plane').innerHTML += text;
        if (i === front) $('.front:last').html('F');
        deg += 360 / n;
    }
    circle = `<circle cx="200" cy="200" r="110" stroke="black" fill="white"></circle>`;
    document.getElementById('plane').innerHTML += circle;
    deg = 360 / n;
    for (let i = 0; i < n; i++) {
        let rad = ((deg - half - 90) * Math.PI) / 180;
        nx = 195 + (r - 60) * Math.sin(rad);
        ny = 205 + (r - 60) * Math.cos(rad);
        let text = `<text class="rear" x="${nx}" y="${ny}"></text>`;
        document.getElementById('plane').innerHTML += text;
        if (i === rear) $('.rear:last').html('R');
        deg += 360 / n;
    }
}

export function enqueue(num) {
    if (front === rear && size === n) {
        showToast({ message: 'Queue is full', variant: 'error' });
    } else {
        $('.num').eq(rear).html(num);
        $('.rear').eq(rear).html('');
        rear = ++rear % n;
        $('.rear').eq(rear).html('R');
        size++;
    }
    return Promise.resolve();
}

export function dequeue() {
    if (front === rear && size === 0) {
        showToast({ message: 'Queue is empty', variant: 'error' });
    } else {
        $('.num').eq(front).html('');
        $('.front').eq(front).html('');
        front = ++front % n;
        $('.front').eq(front).html('F');
        size--;
    }
    return Promise.resolve();
}
