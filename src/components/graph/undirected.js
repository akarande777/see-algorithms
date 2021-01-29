import $ from 'jquery';
import { distance, addVertex, addEdge, offset } from './utils';
import Graph, { Point, Segment } from './Graph';

function undirected(weighted) {
    var lastp, k;
    var flag = false;
    Graph.initialize();

    $('#plane').on('click', function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        let np = Graph.totalPoints();
        if (np === 0) {
            addVertex(p, 'A');
            Graph.addPoint(p);
            return;
        }
        let j;
        for (j = 0; j < np; j++) {
            let q = Graph.point(j);
            let d = distance(p, q);
            if (d < 25) {
                p.x = q.x;
                p.y = q.y;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(k).attr('stroke', '#777');
            if (p.equals(lastp)) {
                $('line:last').remove();
                flag = false;
                return;
            }
            let s = new Segment(lastp, p);
            let ns = Graph.totalSegments();
            for (let i = 0; i < ns; i++) {
                let r = Graph.segment(i);
                if (s.overlaps(r)) {
                    $('line:last').remove();
                    flag = false;
                    return;
                }
            }
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
            if (j === np) {
                if (ns >= 25) {
                    $('line:last').remove();
                    flag = false;
                    return;
                }
                addVertex(p, String.fromCharCode(65 + np));
                Graph.addPoint(p);
            }
            Graph.addSegment(s);
            if (weighted) {
                addCost(p, lastp);
            }
            flag = false;
        } else {
            if (j === np) return;
            $('.vrtx').eq(j).attr('stroke', 'orange');
            addEdge(p, p);
            lastp = p;
            k = j;
            flag = true;
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(offset(e).x, offset(e).y);
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
        }
    });

    $('#plane').on('mouseleave', function (e) {
        e.preventDefault();
        if (flag) {
            $('line:last').remove();
            $('.vrtx').eq(k).attr('stroke', '#777');
            flag = false;
        }
    });
}

function addCost(p, q) {
    let cost = `
        <foreignObject width="25" height="25" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
            <p class="cost" onclick="this.focus()" contenteditable="true">
                ${Math.round(distance(p, q) / 20)}
            </p>
        </foreignObject>`;
    document.querySelector('#plane').innerHTML += cost;
}

export { undirected };
