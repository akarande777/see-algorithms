import React, { useEffect } from 'react';
import { createTable } from '../../common/utils';
import Numbers from '../../components/numbers/numbers';
import Timer from '../../common/timer';

var a, n, cells;
var out, b, k;
var max, exp;
var delay = 700;

function next() {
    for (let i = 0; i < n; i++) {
        let html = '</div>';
        let t = a[i];
        let j = 1;
        while (t !== 0) {
            let r = t % 10;
            if (j === exp) {
                html = `<span style="color:#e91e63">${r}</span>${html}`;
            } else {
                html = r + html;
            }
            t = Math.floor(t / 10);
            j = j * 10;
        }
        cells[i].innerHTML = '<div>' + html;
    }
}

function radixSort() {
    next();
    if (Math.floor(max / exp) > 0) {
        b = new Array();
        for (let j = 0; j < 10; j++) b[j] = 0;
        k = 0;
        Timer.timeout(bucket, delay);
    }
}

function bucket() {
    if (k < n) {
        let j = Math.floor(a[k] / exp) % 10;
        b[j]++;
        cells[k].setAttribute('bgcolor', '#ffe57f');
        Timer.timeout(function () {
            cells[k].removeAttribute('bgcolor');
            cells[k].firstChild.setAttribute('style', `
                background-color:#ffe57f;
                margin-top:4px;
                border:thin solid;
                border-radius:4px;
            `);
            cells[j + n].innerHTML = cells[k].innerHTML + cells[j + n].innerHTML;
            cells[k++].innerHTML = '';
            Timer.timeout(bucket, delay);
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
        Timer.timeout(combine, delay, 10);
    }
}

function combine(j) {
    if (k >= 0) {
        let bkt = cells[n + j - 1];
        if (bkt.childNodes.length > 0) {
            bkt.firstChild.removeAttribute('style');
            cells[k].innerHTML = bkt.firstChild.outerHTML;
            cells[k].setAttribute('bgcolor', '#ffe57f');
            k--;
            bkt.removeChild(bkt.firstChild);
            Timer.timeout(combine, delay, j);
        } else {
            combine(--j);
        }
    } else {
        for (let i = 0; i < n; i++) {
            cells[i].removeAttribute('bgcolor');
        }
        Timer.timeout(radixSort, delay);
    }
}

function RadixSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        createTable(1, n);
        createTable(2, 10, 'bkt');
        cells = document.querySelectorAll('.cell');
        for (let i = 0; i < n; i++) {
            cells[i].textContent = a[i];
            cells[i].style.border = '2px solid';
        }
        max = a[0];
        for (let i = 1; i < n; i++) {
            if (a[i] > max) max = a[i];
        }
        for (let i = 0; i < 10; i++) {
            let npn = i + 10 + n;
            cells[npn].textContent = i;
            cells[npn].setAttribute('align', 'center');
            cells[npn].setAttribute(
                'style',
                'font-weight:600; border-top:2px solid; text-align:center;'
            );
            cells[n + i].setAttribute(
                'style',
                'padding:0; height:80px; text-align:center; vertical-align:bottom;'
            );
        }
        exp = 1;
        out = new Array();
        Timer.timeout(radixSort, delay);
    };

    const stop = () => {
        Timer.clear();
        document.getElementById('tbl').innerHTML = '';
        document.getElementById('bkt').innerHTML = '';
    };

    useEffect(() => () => stop(), []);

    return (
        <div className="sortNumbers">
            <Numbers start={start} stop={stop} />
            <table id="tbl" />
            <br />
            <br />
            <table id="bkt" />
        </div>
    );
}

export default RadixSort;
