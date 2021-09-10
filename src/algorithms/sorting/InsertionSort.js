import React, { useEffect } from 'react';
import Numbers from '../../components/numbers/numbers';
import { Colors } from '../../common/constants';

var a, n;
var i, j, temp;
var tbl, cell;
var timer;
var delay = 800;

function InsertionSort() {
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
        i = 1;
        timer = setTimeout(() => {
            cell[n].setAttribute('bgcolor', Colors.sorted);
            timer = setTimeout(pick, delay);
        }, delay);
    };

    const stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
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

function pick() {
    if (i < n) {
        cell[i + n].setAttribute('bgcolor', Colors.compare);
        timer = setTimeout(function () {
            cell[i].innerHTML = cell[i + n].innerHTML;
            cell[i + n].innerHTML = '';
            cell[i + n].removeAttribute('bgcolor');
            cell[i].setAttribute('bgcolor', Colors.compare);
            temp = a[i];
            j = i;
            timer = setTimeout(function () {
                timer = setInterval(shift, delay / 2);
            }, delay / 2);
        }, delay / 2);
    }
}

function shift() {
    if (temp < a[j - 1]) {
        a[j] = a[j - 1];
        cell[j + n].innerHTML = a[j];
        cell[j + n].setAttribute('bgcolor', Colors.sorted);
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
        cell[j - 1].setAttribute('bgcolor', Colors.compare);
        cell[j].innerHTML = '';
        cell[j].removeAttribute('bgcolor');
        j--;
    } else {
        clearInterval(timer);
        a[j] = temp;
        cell[j + n].innerHTML = cell[j].innerHTML;
        cell[j + n].setAttribute('bgcolor', Colors.sorted);
        cell[j].innerHTML = '';
        cell[j].removeAttribute('bgcolor');
        i++;
        timer = setTimeout(pick, delay);
    }
}

export default InsertionSort;
