import React, { useEffect } from 'react';
import Wrapper from './wrapper';

var a, n;
var i, j, temp;
var tbl, cell;
var timer;

function InsertionSort(props) {
    const start = () => {
        a = [...props.values];
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
        i = 1;
        timer = setTimeout(function () {
            cell[n].setAttribute('bgcolor', 'plum');
            timer = setTimeout(pick, 1000);
        }, 1000);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
        tbl.innerHTML = '';
        props.setValues([]);
    };

    useEffect(() => {
        tbl = document.getElementById('tbl');
        return () => stop();
    }, []);

    useEffect(() => {
        if (props.status) {
            if (!props.validate()) {
                props.setStatus(false);
                return;
            }
            start();
        } else {
            stop();
        }
    }, [props.status]);

    return (
        <div style={{ padding: 24 }}>
            <table id="tbl" />
        </div>
    );
}

function pick() {
    if (i < n) {
        cell[i + n].setAttribute('bgcolor', 'pink');
        timer = setTimeout(function () {
            cell[i].innerHTML = cell[i + n].innerHTML;
            cell[i + n].innerHTML = '';
            cell[i + n].removeAttribute('bgcolor');
            cell[i].setAttribute('bgcolor', 'pink');
            temp = a[i];
            j = i;
            timer = setTimeout(function () {
                timer = setInterval(shift, 700);
            }, 500);
        }, 500);
    }
}

function shift() {
    if (temp < a[j - 1]) {
        a[j] = a[j - 1];
        cell[j + n].innerHTML = a[j];
        cell[j + n].setAttribute('bgcolor', 'plum');
        cell[j + n - 1].innerHTML = '';
        cell[j + n - 1].removeAttribute('bgcolor');
        j--;
    } else {
        clearInterval(timer);
        j = i;
        timer = setInterval(insert, 100);
    }
}

function insert() {
    if (temp < a[j - 1]) {
        cell[j - 1].innerHTML = cell[j].innerHTML;
        cell[j - 1].setAttribute('bgcolor', 'pink');
        cell[j].innerHTML = '';
        cell[j].removeAttribute('bgcolor');
        j--;
    } else {
        clearInterval(timer);
        a[j] = temp;
        cell[j + n].innerHTML = cell[j].innerHTML;
        cell[j + n].setAttribute('bgcolor', 'plum');
        cell[j].innerHTML = '';
        cell[j].removeAttribute('bgcolor');
        i++;
        timer = setTimeout(pick, 1000);
    }
}

export default Wrapper(InsertionSort);
