import $ from 'jquery';
import { distance, addVertex, addEdge, withOffset, fromDistance } from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { showToast } from '../components/toast/toast';
import { Colors } from '../common/constants';

export function drawGraph({ weighted, acyclic }) {
    $('#plane').off();
    var lastp, prev, flag = false;

    function isValid(p) {
        let s = new Segment(lastp, p);
        for (let i = 0; i < Graph.totalSegments(); i++) {
            let si = Graph.segment(i);
            if (s.overlaps(si)) return false;
        }
        return true;
    }

    $('#plane').on('click', function (e) {
        e.preventDefault();
        let p = new Point(...withOffset(e));
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
            flag = false;
            $('.vrtx').eq(prev).attr('stroke', Colors.stroke);
            if (p.equals(lastp) || !isValid(p)) {
                $('.edge:last').remove();
                return;
            }
            $('.edge:last').attr('x2', p.x);
            $('.edge:last').attr('y2', p.y);
            if (k === np) {
                if (np === 26) {
                    $('.edge:last').remove();
                    return;
                }
                addVertex(p, String.fromCharCode(65 + np));
                Graph.addPoint(p);
            }
            let s = new Segment(lastp, p);
            Graph.addSegment(s);
            if (weighted) addCost(p, lastp);
            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph',
                        variant: 'error',
                    });
                    $('.edge:last').remove();
                    Graph.removeSegment(s);
                    return;
                }
                let q = fromDistance(lastp, p, 23);
                $('.edge:last').attr('x2', q.x);
                $('.edge:last').attr('y2', q.y);
            }
        } else {
            if (k === np) {
                if (np < 26) {
                    addVertex(p, String.fromCharCode(65 + np));
                    Graph.addPoint(p);
                }
            } else {
                addEdge(p, p);
                $('.vrtx').eq(k).attr('stroke', Colors.visited);
                if (Graph.isDirected()) {
                    $('.edge:last').attr('marker-end', 'url(#arrow)');
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
            let p = new Point(...withOffset(e));
            $('.edge:last').attr('x2', p.x);
            $('.edge:last').attr('y2', p.y);
        }
    });

    $('#plane').on('mouseleave', function (e) {
        e.preventDefault();
        if (flag) {
            $('.edge:last').remove();
            $('.vrtx').eq(prev).attr('stroke', Colors.stroke);
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
    document.getElementById('plane').innerHTML += element;
}
