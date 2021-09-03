import $ from 'jquery';
import { distance, offset } from '../../common/utils';
import Graph, { Point, Segment } from '../../common/graph';

function addPoint(p) {
    let vrtx = `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#444" />`;
    document.getElementById('plane').innerHTML += vrtx;
    Graph.addPoint(p);
}

var hull, left, p, q;

export function addPoints() {
    var flag = false;
    var k;

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
        addPoint(p);
    }

    newConvex();

    $('#plane').on('mousedown', function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        let np = Graph.totalPoints();
        for (let i = 0; i < np; i++) {
            if (distance(p, Graph.point(i)) < 8) {
                flag = true;
                k = i;
                return;
            }
        }
        addPoint(p);
        let hlen = hull.length;
        for (let i = 0; i < hlen; i++) {
            let u = Graph.point(hull[i]);
            let v = Graph.point(hull[(i + 1) % hlen]);
            let s = new Segment(u, v);
            if (s.orientation(p) === 1) {
                newConvex();
                break;
            }
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(offset(e).x, offset(e).y);
            $('circle').eq(k).attr('cx', p.x);
            $('circle').eq(k).attr('cy', p.y);
            Graph.setPoint(k, p);
            newConvex();
        }
    });

    $('#plane').on('mouseup', function (e) {
        e.preventDefault();
        flag = false;
    });
}

function newConvex() {
    $('line').remove();
    hull = new Array();
    left = 0;
    for (let i = 1; i < Graph.totalPoints(); i++) {
        let x1 = Graph.point(i).x;
        let x2 = Graph.point(left).x;
        if (x1 < x2) left = i;
    }
    p = left;
    $('circle').attr('fill', '#3a3a3a');
    $('circle').removeAttr('stroke');
    convexHull();
}

function convexHull() {
    do {
        hull.push(p);
        $('circle').eq(p).attr('fill', 'orange');
        $('circle').eq(p).attr('stroke', 'orange');
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
        let edge = `<line x1="${u.x}" y1="${u.y}" x2="${v.x}" y2="${v.y}" stroke-width="2" stroke="orange" />`;
        document.querySelector('#plane').innerHTML += edge;
        p = q;
    } while (p !== left);
}
