import React from 'react';
import { message } from 'antd';
import CommonView from './common';

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


class BubbleSort extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: [],
            started: false
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    handleSelect = val => {
        let values = [];
        for (let i = 0; i < val; i++) {
            values.push(Math.floor(Math.random() * 100));
        }
        n = val;
        this.setState({
            values
        });
    }

    handleInput = (e, i) => {
        let values = this.state.values.slice();
        values[i] = e.target.value;
        this.setState({
            values
        });
    }

    start = () => {
        for (let i = 0; i < n; i++) {
            let val = parseInt(this.state.values[i]);
            if (isNaN(val)) {
                message.error("not a number", 2);
                return;
            }
        }
        a = [...this.state.values];
        tbl = document.getElementById("tbl");
        cell = new Array();
        let row = new Array();
        for (let i = 0; i < 3; i++) {
            row[i] = document.createElement("tr");
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement("td");
                if (i === 1) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = "thin solid";
                }
                row[i].appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row[i]);
        }
        i = 0; j = 0;
        swaps = 1;
        this.setState({
            started: true
        }, iloop);
    }

    stop = () => {
        clearTimeout(timer);
        tbl.innerHTML = '';
        this.setState({
            values: [],
            started: false
        });
    }

    render() {
        return (
            <div>
                <CommonView
                    values={this.state.values}
                    started={this.state.started}
                    handleSelect={this.handleSelect}
                    handleInput={this.handleInput}
                    start={this.start}
                    stop={this.stop}
                />
                <div style={{ padding: 24 }}>
                    <table id="tbl" />
                </div>
            </div>
        );
    }
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

export default BubbleSort;