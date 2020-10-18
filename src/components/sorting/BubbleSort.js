import React, { useEffect } from 'react';
import Wrapper from './wrapper';
import { setPrevious } from '../../utils';

var a, n;
var i, j, swaps;
var tbl, cell;
var timer;

function iloop() {
    if (i < n - 1 && swaps > 0) {
        swaps = 0;
        j = 0;
        timer = setTimeout(jloop, 1000);
    }
    else {
        for (let k = 0; k < n; k++) {
            cell[k + n].setAttribute("bgcolor", "plum");
        }
    }
}

function jloop() {
    if (j < n - i - 1) {
        cell[j + n - 1].removeAttribute("bgcolor");
        cell[j + n].setAttribute("bgcolor", "pink");
        cell[j + n + 1].setAttribute("bgcolor", "pink");
        if (a[j + 1] < a[j]) {
            timer = setTimeout(swap, 800);
            swaps++;
        }
        else {
            timer = setTimeout(jloop, 800);
            j++;
        }
    }
    else {
        cell[j + n - 1].removeAttribute("bgcolor");
        cell[j + n].setAttribute("bgcolor", "plum");
        iloop();
        i++;
    }
}

function BubbleSort(props) {
    const prevStatus = setPrevious(props.status);

    const start = () => {
        a = [...props.values];
        n = a.length;
        cell = [];
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement("td");
                if (i === 1) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = "2px solid";
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        i = 0; j = 0;
        swaps = 1;
        iloop();
    }

    const stop = () => {
        clearTimeout(timer);
        tbl.innerHTML = '';
        props.setValues([]);
    }

    useEffect(() => {
        tbl = document.getElementById("tbl");
        return () => stop();
    }, []);

    useEffect(() => {
        if (props.status) {
            if (!props.isInputValid()) {
                setPrevious(undefined);
                props.setStatus(false);
                return;
            }
            start();
        }
        else if (prevStatus) {
            stop();
        }
    }, [props.status]);

    return (
        <div style={{ padding: 24 }}>
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
    timer = setTimeout(jloop, 1000);
}

function shift(u, v) {
    cell[u].innerHTML = cell[v].innerHTML;
    cell[u].setAttribute("bgcolor", "pink");
    cell[v].removeAttribute("bgcolor");
    cell[v].innerHTML = "";
}

export default Wrapper(BubbleSort);