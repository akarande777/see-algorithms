import $ from 'jquery';
import { distance, withOffset } from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { Colors } from '../common/constants';

function print(p) {
    let point = `<circle class="vrtx" cx="${p.x}" cy="${p.y}" r="4" fill="${Colors.stroke}" />`;
    document.getElementById('plane').innerHTML += point;
    Graph.addPoint(p);
}

export function randomize() {
    for (let i = 0; i < 30; i++) {
        let x = Math.floor(Math.random() * 600 + 50);
        let y = Math.floor(Math.random() * 350 + 50);
        let p = new Point(x, y);
        let np = Graph.totalPoints();
        let j;
        for (j = 0; j < np; j++) {
            let d = distance(p, Graph.point(j));
            if (d < 15) break;
        }
        if (j < np) continue;
        print(p);
    }
}

var convex;
var left, p, q;

export function addPoints(cvx) {
    convex = cvx;
    var flag = false, k;

    $('#plane').on('mousedown', function (e) {
        e.preventDefault();
        let p = new Point(...withOffset(e));
        let np = Graph.totalPoints();
        for (let i = 0; i < np; i++) {
            if (distance(p, Graph.point(i)) < 8) {
                flag = true;
                k = i;
                return;
            }
        }
        print(p);
        if (convex) {
            let size = convex.length;
            for (let i = 0; i < size; i++) {
                let u = Graph.point(convex[i]);
                let v = Graph.point(convex[(i + 1) % size]);
                let s = new Segment(u, v);
                if (s.orientation(p) === 1) {
                    newConvex();
                    break;
                }
            }
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(...withOffset(e));
            $('.vrtx').eq(k).attr('cx', p.x);
            $('.vrtx').eq(k).attr('cy', p.y);
            Graph.setPoint(k, p);
            if (convex) newConvex();
        }
    });

    $('#plane').on('mouseup', function (e) {
        e.preventDefault();
        flag = false;
    });
}

function newConvex() {
    $('line').remove();
    convex = [];
    left = 0;
    for (let i = 1; i < Graph.totalPoints(); i++) {
        let x1 = Graph.point(i).x;
        let x2 = Graph.point(left).x;
        if (x1 < x2) left = i;
    }
    p = left;
    $('.vrtx').attr('fill', Colors.stroke);
    $('.vrtx').removeAttr('stroke');
    convexHull();
}

function convexHull() {
    do {
        convex.push(p);
        $('.vrtx').eq(p).attr('fill', Colors.visited);
        $('.vrtx').eq(p).attr('stroke', Colors.visited);
        let np = Graph.totalPoints();
        q = (p + 1) % np;
        for (let i = 0; i < np; i++) {
            let s = new Segment(Graph.point(p), Graph.point(q));
            if (s.orientation(Graph.point(i)) === 1) {
                q = i;
            }
        }
        let u = Graph.point(p);
        let v = Graph.point(q);
        let edge = `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke-width="2" stroke="${Colors.visited}" />`;
        document.getElementById('plane').innerHTML += edge;
        p = q;
    } while (p !== left);
}
