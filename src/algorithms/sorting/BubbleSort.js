import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';

var a, n;
var i, j, swaps;
var tbl, cell;
var timer;
var delay = 800;

function iloop() {
    if (i < n - 1 && swaps > 0) {
        swaps = 0;
        j = 0;
        timer = setTimeout(jloop, delay);
    } else {
        for (let k = 0; k < n; k++) {
            cell[k + n].setAttribute('bgcolor', Colors.sorted);
        }
    }
}

function jloop() {
    if (j < n - i - 1) {
        cell[j + n - 1].removeAttribute('bgcolor');
        cell[j + n].setAttribute('bgcolor', Colors.compare);
        cell[j + n + 1].setAttribute('bgcolor', Colors.compare);
        if (a[j + 1] < a[j]) {
            timer = setTimeout(swap, delay);
            swaps++;
        } else {
            timer = setTimeout(jloop, delay);
            j++;
        }
    } else {
        cell[j + n - 1].removeAttribute('bgcolor');
        cell[j + n].setAttribute('bgcolor', Colors.sorted);
        iloop();
        i++;
    }
}

function BubbleSort() {
    const start = (values) => {
        a = [...values];
        n = a.length;
        cell = [];
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement('td');
                if (i === 1) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = '2px solid';
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        i = 0;
        j = 0;
        swaps = 1;
        iloop();
    };

    const stop = () => {
        clearTimeout(timer);
        tbl.innerHTML = '';
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    return (
        <div className="sortNumbers">
            <Numbers start={start} stop={stop} />
            <table id="tbl" />
        </div>
    );
}

function swap() {
    let t = a[j];
    a[j] = a[j + 1];
    a[j + 1] = t;
    timer = setTimeout(function () {
        shift(j + 1, j + n + 1);
        shift(j + n + n, j + n);
    }, 150);
    timer = setTimeout(function () {
        shift(j, j + 1);
        shift(j + n + n + 1, j + n + n);
    }, 300);
    timer = setTimeout(function () {
        shift(j + n, j);
        shift(j + n + 1, j + n + n + 1);
        j++;
    }, 450);
    timer = setTimeout(jloop, delay);
}

function shift(u, v) {
    cell[u].innerHTML = cell[v].innerHTML;
    cell[u].setAttribute('bgcolor', Colors.compare);
    cell[v].removeAttribute('bgcolor');
    cell[v].innerHTML = '';
}

export default BubbleSort;
