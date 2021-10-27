import React, { useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';

var n, a;
var out, b, k;
var max, exp;
var tbl, tbl2, cell;
var timer;
var delay = 700;

function shift() {
    for (let i = 0; i < n; i++) {
        cell[i].innerHTML = '</div>';
        let t = a[i];
        let j = 1;
        while (t !== 0) {
            let r = t % 10;
            if (j === exp) {
                cell[i].innerHTML =
                    '<span style="color: crimson">' + r + '</span>' + cell[i].innerHTML;
            } else {
                cell[i].innerHTML = r + cell[i].innerHTML;
            }
            t = Math.floor(t / 10);
            j = j * 10;
        }
        cell[i].innerHTML = '<div class="mydiv">' + cell[i].innerHTML;
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
        cell[k].setAttribute('bgcolor', '#F9E79F');
        timer = setTimeout(function () {
            cell[k].removeAttribute('bgcolor');
            document
                .getElementsByClassName('mydiv')[0]
                .setAttribute(
                    'style',
                    'background-color: #F9E79F; margin-top: 4px; border: thin solid'
                );
            cell[j + n].innerHTML = cell[k].innerHTML + cell[j + n].innerHTML;
            cell[k++].innerHTML = '&nbsp;&nbsp;&nbsp;';
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
        if (cell[n + j - 1].childNodes.length > 0) {
            cell[n + j - 1].firstChild.removeAttribute('style');
            cell[k].innerHTML = cell[n + j - 1].firstChild.outerHTML;
            cell[k].setAttribute('bgcolor', '#F9E79F');
            k--;
            cell[n + j - 1].removeChild(cell[n + j - 1].firstChild);
            timer = setTimeout(combine, delay, j);
        } else {
            combine(--j);
        }
    } else {
        for (let i = 0; i < n; i++) {
            cell[i].removeAttribute('bgcolor');
        }
        timer = setTimeout(radixSort, delay);
    }
}

function RadixSort() {
    useEffect(() => {
        tbl = document.getElementById('tbl');
        tbl2 = document.getElementById('tbl2');
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (e) => {
        a = new Array();
        n = parseInt(e.target.value);
        for (let i = 0; i < n; i++) {
            a[i] = Math.floor(Math.random() * 900 + 100);
        }
        clearTimeout(timer);
        tbl.innerHTML = '';
        tbl2.innerHTML = '';
        start();
    };

    const start = () => {
        cell = new Array();
        let row = document.createElement('tr');
        for (let i = 0; i < n; i++) {
            cell[i] = document.createElement('td');
            cell[i].innerHTML = a[i];
            cell[i].style.border = '2px solid';
            row.appendChild(cell[i]);
        }
        tbl.appendChild(row);
        max = a[0];
        for (let i = 1; i < n; i++) {
            if (a[i] > max) max = a[i];
        }
        let k = n;
        for (let i = 1; i <= 2; i++) {
            row = document.createElement('tr');
            for (let j = 0; j < 10; j++) {
                cell[k] = document.createElement('td');
                if (i === 2) {
                    cell[k].innerHTML = j;
                    cell[k].setAttribute('align', 'center');
                    cell[k].setAttribute(
                        'style',
                        'font-weight: 600; border-top: 2px solid; text-align: center'
                    );
                }
                if (i === 1)
                    cell[k].setAttribute(
                        'style',
                        'padding: 0; height: 80px; text-align: center; vertical-align: bottom'
                    );
                row.appendChild(cell[k++]);
            }
            tbl2.appendChild(row);
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
                        <MenuItem key={i} value={i}>
                            {i}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <table id="tbl" />
            <br />
            <br />
            <table id="tbl2" />
        </div>
    );
}

export default RadixSort;
