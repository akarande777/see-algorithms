import $ from 'jquery';
import { distance, addVertex, addEdge, offset, fromEnd } from '../../common/utils';
import Graph, { Point, Segment } from '../../common/graph';
import { showToast } from '../toast/toast';
import { Colors } from '../../common/constants';

export function drawGraph({ weighted, directed, asyclic }) {
    $('#plane').off();
    var lastp, prev, flag = false;

    function isValid(p) {
        let s = new Segment(lastp, p);
        for (let i = 0; i < Graph.totalSegments(); i++) {
            if (s.overlaps(Graph.segment(i))) {
                return false;
            }
        }
        return true;
    }

    $('#plane').on('click', function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        let np = Graph.totalPoints();
        if (np === 0) {
            addVertex(p, 'A');
            Graph.addPoint(p);
            return;
        }
        let k;
        for (k = 0; k < np; k++) {
            let q = Graph.point(k);
            let d = distance(p, q);
            if (d < 25) {
                p.x = q.x;
                p.y = q.y;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(prev).attr('stroke', '#777');
            if (p.equals(lastp) || !isValid(p)) {
                $('line:last').remove();
                flag = false;
                return;
            }
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
            if (k === np) {
                if (np === 26) {
                    $('line:last').remove();
                    flag = false;
                    return;
                }
                addVertex(p, String.fromCharCode(65 + np));
                Graph.addPoint(p);
            }
            let s = new Segment(lastp, p);
            Graph.addSegment(s);
            weighted && addCost(p, lastp);
            if (directed) {
                if (asyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph',
                        variant: 'error',
                    });
                    $('line:last').remove();
                    Graph.removeSegment(s);
                    flag = false;
                    return;
                }
                let q = fromEnd(lastp, p, 23);
                $('line:last').attr('x2', q.x);
                $('line:last').attr('y2', q.y);
            }
            flag = false;
        } else {
            if (k === np) {
                if (Graph.totalPoints() < 26) {
                    addVertex(p, String.fromCharCode(65 + np));
                    Graph.addPoint(p);
                }
            } else {
                addEdge(p, p);
                $('.vrtx').eq(k).attr('stroke', Colors.visited);
                if (directed) {
                    $('line:last').attr('marker-end', 'url(#arrow)');
                }
                lastp = p;
                prev = k;
                flag = true;
            }
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
            $('.vrtx').eq(prev).attr('stroke', '#777');
            flag = false;
        }
    });
}

function addCost(p, q) {
    let element = `
        <foreignObject width="30" height="30" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
            <p class="cost" onclick="this.focus();event.stopPropagation();" contenteditable="true">
                ${Math.round(distance(p, q) / 20)}
            </p>
        </foreignObject>`;
    document.querySelector('#plane').innerHTML += element;
}
