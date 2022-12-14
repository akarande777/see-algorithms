import React, { useEffect } from 'react';
import $ from 'jquery';
import DSInput from '../components/ds-input/ds-input';
import { showToast } from '../components/toast/toast';
import { createTable, randomInt } from '../common/utils';

const buttons = [
    { text: 'Enqueue', onClick: enqueue, validate: true },
    { text: 'Dequeue', onClick: dequeue },
];

export default function (props) {
    useEffect(() => {
        rear = 5;
        size = rear - front;
        createTable(3, n);
        cells = document.querySelectorAll('.cell');
        cells[front].innerHTML = 'Head';
        cells[n + n + rear].innerHTML = 'Tail';
        for (let k = 0; k < n; k++) {
            if (k < rear && k >= front) {
                cells[k + n].innerHTML = randomInt();
            }
            cells[k].setAttribute('style', 'vertical-align:bottom;');
            cells[k + n + n].setAttribute('style', 'vertical-align:top;')
            cells[k + n].style.border = '2px solid';
        }
    }, []);

    return (
        <div className="sortNumbers">
            <DSInput {...props} buttons={buttons} />
            <table id="tbl" />
        </div>
    );
}

var cells, n = 12;
var front = 0, rear;
var size;

export function enqueue(num) {
    if (front === rear && size === n) {
        showToast({ message: 'Queue is full.', variant: 'error' });
    } else {
        $('.cell').eq(n + rear).html(num);
        $('.cell').eq(n + n + rear).html('');
        rear = ++rear % n;
        $('.cell').eq(n + n + rear).html('Tail');
        size++;
    }
    return Promise.resolve();
}

export function dequeue() {
    if (front === rear && size === 0) {
        showToast({ message: 'Queue is empty.', variant: 'error' });
    } else {
        $('.cell').eq(front).html('');
        $('.cell').eq(front + n).html('');
        front = ++front % n;
        $('.cell').eq(front).html('Head');
        size--;
    }
    return Promise.resolve();
}
