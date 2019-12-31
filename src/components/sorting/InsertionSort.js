import React from 'react';
import { Card, message } from 'antd';
import CommonView from './common';

var a, n;
var i, j, temp;
var tbl, cell;
var timer;

class InsertionSort extends React.Component {

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
        i = 1;
        this.setState({
            started: true
        }, () => {
            timer = setTimeout(function () {
                cell[n].setAttribute("bgcolor", "plum");
                timer = setTimeout(pick, 1000);
            }, 1000);
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

function pick() {
    if (i < n) {
        cell[i + n].setAttribute("bgcolor", "pink");
        timer = setTimeout(function () {
            cell[i].innerHTML = cell[i + n].innerHTML;
            cell[i + n].innerHTML = "";
            cell[i + n].removeAttribute("bgcolor");
            cell[i].setAttribute("bgcolor", "pink");
            temp = a[i];
            j = i;
            timer = setTimeout(function () {
                timer = setInterval(shift, 750);
            }, 500);
        }, 500);
    }
}

function shift() {
    if (temp < a[j - 1]) {
        a[j] = a[j - 1];
        cell[j - 1].innerHTML = cell[j].innerHTML;
        cell[j - 1].setAttribute("bgcolor", "pink");
        cell[j].innerHTML = "";
        cell[j].removeAttribute("bgcolor");
        cell[j + n].innerHTML = a[j];
        cell[j + n].setAttribute("bgcolor", "plum");
        cell[j + n - 1].innerHTML = "";
        cell[j + n - 1].removeAttribute("bgcolor");
        j--;
    }
    else {
        clearInterval(timer);
        a[j] = temp;
        cell[j + n].innerHTML = cell[j].innerHTML;
        cell[j + n].setAttribute("bgcolor", "plum");
        cell[j].innerHTML = "";
        cell[j].removeAttribute("bgcolor");
        i++;
        timer = setTimeout(pick, 1000);
    }
}

export default InsertionSort;