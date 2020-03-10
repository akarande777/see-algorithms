import React from 'react';
import { message } from 'antd';
import CommonView from './common';

var n, a;
var tbl, cell;
var mid, p, q, s;
var t, r, k;
var timer;

const wait = ms => new Promise(resolve => {
    timer = setTimeout(resolve, ms);
});

function merge() {
    if (p <= mid && q <= s) {
        // cell[p].setAttribute("bgcolor", "yellowgreen");
        // cell[q].setAttribute("bgcolor", "yellowgreen");
        // return wait(1000).then(() => {
            if (a[p] <= a[q]) {
                // cell[p].setAttribute("bgcolor", "yellowgreen");
                // return wait(200).then(() => {
                    t[r] = a[p];
                    cell[p + n].innerHTML = a[p];
                    cell[p + n].setAttribute("bgcolor", "orange");
                    cell[p].innerHTML = "";
                    cell[p].removeAttribute("bgcolor");
                    k = p++;
                    return wait(100).then(shift);
                // });
            }
            else {
                // cell[q].setAttribute("bgcolor", "yellowgreen");
                // return wait(200).then(() => {
                    t[r] = a[q];
                    cell[q + n].innerHTML = a[q];
                    cell[q + n].setAttribute("bgcolor", "orange");
                    cell[q].innerHTML = "";
                    cell[q].removeAttribute("bgcolor");
                    k = q++;
                    return wait(100).then(shift);
                // });
            }
        // });
    }
    else {
        if (p <= mid) {
            cell[p].setAttribute("bgcolor", "orange");
            return wait(200).then(() => {
                t[r] = a[p];
                cell[p + n].innerHTML = a[p];
                cell[p + n].setAttribute("bgcolor", "orange");
                cell[p].innerHTML = "";
                cell[p].removeAttribute("bgcolor");
                k = p++;
                return wait(100).then(shift);
            });
        }
        if (q <= s) {
            cell[q].setAttribute("bgcolor", "orange");
            return wait(200).then(() => {
                t[r] = a[q];
                cell[q + n].innerHTML = a[q];
                cell[q + n].setAttribute("bgcolor", "orange");
                cell[q].innerHTML = "";
                cell[q].removeAttribute("bgcolor");
                k = q++;
                return wait(100).then(shift);
            });
        }
    }
}

function shift() {
    if (k < r) {
        cell[k + n + 1].innerHTML = t[r];
        cell[k + n + 1].setAttribute("bgcolor", "orange");
        cell[k + n].innerHTML = "";
        cell[k + n].removeAttribute("bgcolor");
        k++;
        return wait(100).then(shift);
    }
    else if (k > r) {
        cell[k + n - 1].innerHTML = t[r];
        cell[k + n - 1].setAttribute("bgcolor", "orange");
        cell[k + n].innerHTML = "";
        cell[k + n].removeAttribute("bgcolor");
        k--;
        return wait(100).then(shift);
    }
    else {
        clearTimeout(timer);
        return wait(200).then(() => {
            cell[r + n + n].innerHTML = t[r];
            cell[r + n + n].setAttribute("bgcolor", "yellowgreen");
            cell[r + n].innerHTML = "";
            cell[r + n].removeAttribute("bgcolor");
            r++;
            return wait(1000).then(merge);
        });
    }
}

function lift(u, v) {
    return wait(150).then(() => {
        if (u - n > -1) {
            for (let i = u; i <= v; i++) {
                cell[i - n].innerHTML = cell[i].innerHTML;
                cell[i - n].setAttribute("bgcolor", "yellowgreen");
                cell[i].removeAttribute("bgcolor");
                cell[i].innerHTML = "";
            }
            return lift(u - n, v - n);
        }
        else {
            return wait(500).then(() => {
                for (let i = u; i <= v; i++) {
                    cell[i].removeAttribute("bgcolor");
                    cell[i + n + n].style.border = 0;
                    a[i] = t[i];
                }
            });
        }
    });
}

function mergeSort(start, end) {
    return wait(1000).then(() => {
        for (let i = 0; i < n; i++) {
            if (i >= start && i <= end) {
                cell[i].setAttribute("bgcolor", "orange");
            }
            else {
                cell[i].removeAttribute("bgcolor");
            }
        }
        if (start < end) {
            let m = Math.floor((start + end) / 2);
            
            return mergeSort(start, m)
                .then(() => mergeSort(m + 1, end))
                .then(() => {
                    return wait(1000).then(() => {
                        p = start;
                        s = end;
                        mid = Math.floor((p + s) / 2);
                        q = mid + 1;
                        r = p;
                        t = new Array();
                        for (let i = 0; i < n; i++) {
                            if (i >= start && i <= end) {
                                cell[i].setAttribute("bgcolor", "orange");
                                cell[i + n + n].style.border = "thin solid";
                            }
                            else {
                                cell[i].removeAttribute("bgcolor");
                                cell[i + n + n].style.border = 0;
                            }
                        }
                        return wait(1000).then(() => merge());
                    });
                })
                .then(() => {
                    return lift(start + n + n, end + n + n);
                });
        }
        // else {
        //     return wait(500).then(() => {
        //         cell[start].setAttribute("bgcolor", "yellowgreen");
        //         return '';
        //     });
        // }
    });
}


class MergeSort extends React.Component {

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
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < n; j++) {
                cell[i * n + j] = document.createElement("td");
                if (i == 0) {
                    cell[i * n + j].innerHTML = a[j];
                    cell[i * n + j].style.border = "thin solid";
                }
                row.appendChild(cell[i * n + j]);
            }
            tbl.appendChild(row);
        }
        this.setState({
            started: true
        }, () => mergeSort(0, n - 1));
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

export default MergeSort;