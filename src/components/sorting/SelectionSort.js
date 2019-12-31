import React from 'react';
import { Card, message } from 'antd';
import CommonView from './common';

var a, n;
var tbl, cell;
var i, j, pos;
var prev, k;
var flag1, flag2;
var timer;

function iloop() {
    if (i < n - 1) {
        cell[i + n].setAttribute('bgcolor', 'pink');
        pos = i;
        j = i + 1;
        flag1 = true; // start loop
        flag2 = false;
        timer = setTimeout(function () {
            cell[i].innerHTML = a[i];
            cell[i].setAttribute('bgcolor', 'plum');
            cell[i + n].innerHTML = "";
            cell[i + n].removeAttribute("bgcolor");
            timer = setInterval(jloop, 500);
        }, 500);
    }
    else {
        cell[n + n - 1].setAttribute('bgcolor', 'plum');
    }
}

function jloop() {
    if (flag1) {
        if (a[pos] > a[j]) {
            prev = pos;
            pos = j;
            flag2 = true; // pos changed
        }
        cell[j + n - 1].removeAttribute("bgcolor");
        cell[j + n].setAttribute('bgcolor', 'pink');
        j++;
    }
    if (!flag1 && flag2) { 
        cell[prev + n].innerHTML = a[prev];
        cell[prev].innerHTML = "";
        cell[prev].removeAttribute("bgcolor");
        cell[pos].innerHTML = a[pos];
        cell[pos].setAttribute('bgcolor', 'plum');
        cell[pos + n].innerHTML = "";
        cell[pos + n].removeAttribute("bgcolor");
        flag1 = true; // continue loop
        flag2 = false;
    }
    if (j >= n && !flag2) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cell[n + n - 1].removeAttribute("bgcolor");
            if (pos != i) {
                timer = setTimeout(function () {
                    cell[i + n + n].innerHTML = a[i];
                    cell[i + n].innerHTML = "";
                    k = 1;
                    timer = setTimeout(function () {
                        timer = setInterval(swap, 100);
                    }, 200);
                }, 500);
            }
            else {
                timer = setTimeout(function () {
                    cell[pos + n].innerHTML = a[pos];
                    cell[pos + n].setAttribute('bgcolor', 'plum');
                    cell[pos].innerHTML = "";
                    cell[pos].removeAttribute("bgcolor");
                    i++;
                    timer = setTimeout(iloop, 1000);
                }, 500);
            }
        }, 500);
    }
    if (flag2) {
        flag1 = false; // pause loop
    }
}


class SelectionSort extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: [],
            started: false
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
        clearInterval(timer);
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
        i = 0;
        this.setState({
            started: true
        }, () => {
            timer = setTimeout(iloop, 1000)
        });
    }

    stop = () => {
        clearTimeout(timer);
        clearInterval(timer);
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
    cell[pos - k].innerHTML = a[pos];
    cell[pos - k].setAttribute('bgcolor', 'plum');
    cell[pos - k + 1].innerHTML = "";
    cell[pos - k + 1].removeAttribute("bgcolor");
    cell[i + n + n + k].innerHTML = a[i];
    cell[i + n + n + k - 1].innerHTML = "";
    if (i + k == pos) {
        clearInterval(timer);
        timer = setTimeout(function () {
            cell[pos + n].innerHTML = a[i];
            cell[pos + n + n].innerHTML = "";
            cell[i + n].innerHTML = a[pos];
            cell[i + n].setAttribute('bgcolor', 'plum');
            cell[i].innerHTML = "";
            cell[i].removeAttribute("bgcolor");
            let t = a[i];
            a[i] = a[pos];
            a[pos] = t;
            i++;
            timer = setTimeout(iloop, 1000);
        }, 200);
    }
    k++;
}

export default SelectionSort;