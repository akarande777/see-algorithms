import React from 'react';
import { Select, Input, Button, message } from 'antd';
import { Point, addVertex, addEdge, moveVertex, distance, fromEnd } from './utils';
import $ from 'jquery';

var nodes, n;
var tbl, cell;
var v, j;
var p, q, flag;
var timer;

const delay = 1200;

function Node(left, right, value, char) {
    this.left = left;
    this.right = right;
    this.value = value;
    this.char = char;
}

function addFirstTwo() {
    let node = {
        left: nodes[0],
        right: nodes[1],
        value: nodes[0].value + nodes[1].value
    }
    addEdge(nodes[0].point, nodes[0].point);
    addEdge(nodes[1].point, nodes[1].point);
    let d = distance(nodes[0].point, nodes[1].point);
    let x = (nodes[0].point.x + (d / 2));
    let y = (nodes[0].point.y - d);
    node.point = new Point(x, y);
    d = distance(nodes[0].point, node.point);
    timer = setTimeout(span, 10, nodes[0], node, d - 2, $('line').eq(-2));
    timer = setTimeout(span, 10, nodes[1], node, d - 2, $('line:last'));
}

function span(p, q, d, e) {
    if (d > 0) {
        let r = fromEnd(p.point, q.point, d);
        e.attr('x2', r.x);
        e.attr('y2', r.y);
        timer = setTimeout(span, 10, p, q, d - 2, e);
    }
    else {
        clearTimeout(timer);
        addVertex(q.point, q.value);
    }
}

class HuffmanCoding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            char: [],
            freq: [],
            started: false
        }
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    handleSelect = val => {
        let char = [], freq = [];
        for (let i = 0; i < val; i++) {
            char.push(String.fromCharCode(Math.floor(Math.random() * 26) + 65));
            freq.push(Math.floor(Math.random() * 50));
        }
        n = val;
        this.setState({
            char, freq
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
            let val = parseInt(this.state.freq[i]);
            if (isNaN(val)) {
                message.error("not a number", 2);
                return;
            }
        }
        nodes = this.state.char.map((c, i) => {
            return { char: c, value: this.state.freq[i] }
        });
        nodes.sort((a, b) => a.value - b.value);
        // tbl = document.getElementById("tbl");
        // cell = new Array();
        // let row = document.createElement("tr");
        // for (let j = 0; j < n; j++) {
        //     cell[j] = document.createElement("td");
        //     cell[j].style.border = "thin solid";
        //     row.appendChild(cell[j]);
        // }
        // tbl.appendChild(row);
        this.setState({
            started: true
        }, () => {

            nodes.forEach((x, i) => {
                let p = new Point((i + 1) * 70, 100);
                addVertex(p, x.value);
                nodes[i].point = p;
            });
            timer = setTimeout(addFirstTwo, 1000);
            // d3.select("svg")
            //     .data(this.state.freq)
            //     .enter().append("circle")
            //     .text(function(d) { return d });
        });
    }

    stop = () => {
        clearTimeout(timer);
        $('#plane').html('');
        tbl.innerHTML = '';
        this.setState({
            values: [],
            started: false
        });
    }

    render() {
        const values = this.state.freq;
        const columnStyle = {
            display: 'flex', flexDirection: 'column'
        }
        return (
            <div>
                <div style={{ padding: 24, display: 'flex' }}>
                    <span id="label">
                        {!values.length ? 'Select number of elements: '
                            : <div style={{ ...columnStyle, marginRight: 5 }}>
                                <p>Character: </p>
                                <p>Frequency: </p>
                            </div>
                        }
                    </span>
                    {!values.length ?
                        <Select
                            style={{ width: 60 }}
                            onChange={this.handleSelect}
                        >
                            {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                                .map(i => {
                                    return (
                                        <Select.Option key={i} value={i}>
                                            {i}
                                        </Select.Option>
                                    );
                                })
                            }
                        </Select> :
                        values.map((v, i) => {
                            return (
                                <div style={columnStyle}>
                                    <Input size="small"
                                        key={i} value={this.state.char[i]}
                                        onChange={e => this.handleInput(e, i)}
                                        style={{ width: 40, marginRight: 5 }}
                                    />
                                    <Input size="small"
                                        key={i + n} value={v}
                                        onChange={e => this.handleInput(e, i)}
                                        style={{ width: 40, marginRight: 5, marginTop: 10 }}
                                    />
                                </div>
                            );
                        })
                    }
                    {values.length > 0 &&
                        <Button
                            type="primary"
                            onClick={
                                !this.state.started ? this.start : this.stop
                            }
                        >
                            {!this.state.started ? 'Start' : 'Stop'}
                        </Button>
                    }
                </div>
                <div style={{ padding: 24 }}>
                    <svg id="plane" width="650" height="300" />
                    <table id="tbl" />
                </div>
            </div>
        );
    }
}

export default HuffmanCoding;