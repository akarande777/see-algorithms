/* eslint-disable no-array-constructor */
import React, { useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { createTable } from '../../common/utils';

var a, n, cells;
var out, b, k;
var max, exp;
var timer;
var delay = 700;

function shift() {
    for (let i = 0; i < n; i++) {
        cells[i].innerHTML = '</div>';
        let t = a[i];
        let j = 1;
        while (t !== 0) {
            let r = t % 10;
            if (j === exp) {
                cells[i].innerHTML =
                    '<span style="color: crimson">' + r + '</span>' + cells[i].innerHTML;
            } else {
                cells[i].innerHTML = r + cells[i].innerHTML;
            }
            t = Math.floor(t / 10);
            j = j * 10;
        }
        cells[i].innerHTML = '<div class="mydiv">' + cells[i].innerHTML;
    }
}

function radixSort() {
    shift();
    if (Math.floor(max / exp) > 0) {
        b = new Array();
        for (let j = 0; j < 10; j++) b[j] = 0;
        k = 0;
        timer = setTimeout(bucket, delay);
    }
}

function bucket() {
    if (k < n) {
        let j = Math.floor(a[k] / exp) % 10;
        b[j]++;
        cells[k].setAttribute('bgcolor', '#F9E79F');
        timer = setTimeout(function () {
            cells[k].removeAttribute('bgcolor');
            document
                .getElementsByClassName('mydiv')[0]
                .setAttribute(
                    'style',
                    'background-color: #F9E79F; margin-top: 4px; border: thin solid'
                );
            cells[j + n].innerHTML = cells[k].innerHTML + cells[j + n].innerHTML;
            cells[k++].innerHTML = '';
            timer = setTimeout(bucket, delay);
        }, delay);
    } else {
        for (let j = 1; j < 10; j++) {
            b[j] += b[j - 1];
        }
        for (let i = n - 1; i >= 0; i--) {
            out[--b[Math.floor(a[i] / exp) % 10]] = a[i];
        }
        for (let i = 0; i < n; i++) a[i] = out[i];
        exp *= 10;
        k--;
        timer = setTimeout(combine, delay, 10);
    }
}

function combine(j) {
    if (k >= 0) {
        let bkt = cells[n + j - 1];
        if (bkt.childNodes.length > 0) {
            bkt.firstChild.removeAttribute('style');
            cells[k].innerHTML = bkt.firstChild.outerHTML;
            cells[k].setAttribute('bgcolor', '#F9E79F');
            k--;
            bkt.removeChild(bkt.firstChild);
            timer = setTimeout(combine, delay, j);
        } else {
            combine(--j);
        }
    } else {
        for (let i = 0; i < n; i++) {
            cells[i].removeAttribute('bgcolor');
        }
        timer = setTimeout(radixSort, delay);
    }
}

function RadixSort() {
    useEffect(() => {
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (e) => {
        a = new Array();
        n = parseInt(e.target.value);
        for (let i = 0; i < n; i++) {
            a[i] = Math.floor(Math.random() * 900 + 100);
        }
        clearTimeout(timer);
        document.getElementById('tbl').innerHTML = '';
        document.getElementById('bkt').innerHTML = '';
        start();
    };

    const start = () => {
        createTable(1, n);
        createTable(2, 10, 'bkt');
        cells = document.querySelectorAll('.cell');
        for (let i = 0; i < n; i++) {
            cells[i].innerHTML = a[i];
            cells[i].style.border = '2px solid';
        }
        max = a[0];
        for (let i = 1; i < n; i++) {
            if (a[i] > max) max = a[i];
        }
        for (let i = 0; i < 10; i++) {
            let npn = i + 10 + n;
            cells[npn].innerHTML = i;
            cells[npn].setAttribute('align', 'center');
            cells[npn].setAttribute(
                'style',
                'font-weight: 600; border-top: 2px solid; text-align: center'
            );
            cells[n + i].setAttribute(
                'style',
                'padding: 0; height: 80px; text-align: center; vertical-align: bottom'
            );
        }
        exp = 1;
        out = new Array();
        timer = setTimeout(radixSort, delay);
    };

    return (
        <div className="sortNumbers">
            <div className="input">
                <span className="label">Select number of elements: &nbsp;</span>
                <Select onChange={handleSelect} className="select">
                    <MenuItem></MenuItem>
                    {[7, 8, 9, 10, 11, 12].map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                    ))}
                </Select>
            </div>
            <table id="tbl" />
            <br />
            <br />
            <table id="bkt" />
        </div>
    );
}

export default RadixSort;
