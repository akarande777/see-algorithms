import React from 'react';
import { Select } from 'antd';

var n, a;
var out, b, k;
var max, exp;
var tbl, tbl2, cell;
var timer;
var delay = 1000;

function shift() {
    for (let i = 0; i < n; i++) {
        cell[i].innerHTML = '</div>';
        let t = a[i];
        let j = 1;
        while (t != 0) {
            let r = t % 10;
            if (j == exp) {
                cell[i].innerHTML =
                    '<span style="color:crimson">' + r + '</span>' + cell[i].innerHTML;
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
        timer = setTimeout(bucket, delay / 1.5);
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
            timer = setTimeout(bucket, delay / 1.5);
        }, delay / 1.5);
    } else {
        for (let j = 1; j < 10; j++) b[j] += b[j - 1];
        for (let i = n - 1; i >= 0; i--) out[--b[Math.floor(a[i] / exp) % 10]] = a[i];
        for (let i = 0; i < n; i++) a[i] = out[i];
        exp *= 10;
        --k;
        timer = setTimeout(combine, delay, 10);
    }
}

function combine(j) {
    if (k >= 0) {
        if (cell[n + j - 1].childNodes.length > 0) {
            cell[n + j - 1].firstChild.removeAttribute('style');
            cell[k].innerHTML = cell[n + j - 1].firstChild.outerHTML;
            cell[k--].setAttribute('bgcolor', '#F9E79F');
            cell[n + j - 1].removeChild(cell[n + j - 1].firstChild);
            timer = setTimeout(combine, delay / 1.5, j);
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

class RadixSort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            started: false,
        };
    }

    componentDidMount() {
        tbl = document.getElementById('tbl');
        tbl2 = document.getElementById('tbl2');
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    handleSelect = (val) => {
        a = new Array();
        n = val;
        for (let i = 0; i < n; i++) {
            a[i] = Math.floor(Math.random() * 900 + 100);
        }
        clearTimeout(timer);
        tbl.innerHTML = '';
        tbl2.innerHTML = '';
        this.start();
    };

    start = () => {
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
            if (a[i] > max) {
                max = a[i];
            }
        }
        let k = n;
        for (let i = 1; i <= 2; i++) {
            row = document.createElement('tr');
            for (let j = 0; j < 10; j++) {
                cell[k] = document.createElement('td');
                if (i == 2) {
                    cell[k].innerHTML = j;
                    cell[k].setAttribute('bgcolor', 'pink');
                    cell[k].setAttribute('align', 'center');
                    cell[k].setAttribute(
                        'style',
                        'font-weight: 600; border: 2px solid; text-align: center'
                    );
                }
                if (i == 1)
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

    stop = () => {
        clearTimeout(timer);
        tbl.innerHTML = '';
        this.setState({
            values: [],
            started: false,
        });
    };

    render() {
        return (
            <div>
                <div style={{ padding: 24 }}>
                    <span className="label">Select number of elements:&nbsp;</span>
                    <Select style={{ width: 60 }} onChange={this.handleSelect}>
                        {[7, 8, 9, 10, 11, 12].map((i) => {
                            return (
                                <Select.Option key={i} value={i}>
                                    {i}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </div>
                <div style={{ padding: 24 }}>
                    <table id="tbl" />
                    <br />
                    <br />
                    <table id="tbl2" />
                </div>
            </div>
        );
    }
}

export default RadixSort;
