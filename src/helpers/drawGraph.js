import $ from 'jquery';
import { addVertex, addEdge, withOffset, fromDistance } from '../common/utils';
import Graph, { Point, Segment } from '../common/graph';
import { showToast } from '../components/toast/toast';
import { Colors } from '../common/constants';
import Timer from '../common/timer';

export function createGraph(data) {
    clearGraph();
    let { points, segments, matrix, steps, directed, costMatrix, weighted, acyclic } = data;
    points.forEach((p, i) => {
        addVertex(p, String.fromCharCode(65 + i));
    });
    steps.forEach(([i, j]) => {
        let { p, q } = segments[matrix[i][j]];
        addEdge(p, q);
        if (directed) {
            let { x, y } = fromDistance(p, q, 23);
            $('.edge:last').attr('x2', x);
            $('.edge:last').attr('y2', y);
            $('.edge:last').attr('marker-end', 'url(#arrow)');
        }
        if (weighted) {
            addCost(p, q, costMatrix[i][j]);
        }
    });
    Graph.initialize(data);
    drawGraph({ weighted, acyclic });
}

export function clearGraph() {
    Timer.clear();
    $('#plane').off();
    $('#plane').children().not(':first').remove();
    Graph.clear();
}

export function drawGraph({ weighted, acyclic }) {
    let px, ipx, flag;

    function isValid(p) {
        let s1 = Segment.create(px, p);
        for (let i = 0; i < Graph.totalSegments(); i++) {
            let s2 = Graph.segment(i);
            if (Segment.overlap(s1, s2)) return false;
        }
        return true;
    }

    $('#plane').on('click', function (e) {
        e.preventDefault();
        let p = withOffset(e);
        let np = Graph.totalPoints();
        if (np === 0) {
            addVertex(p, 'A');
            Graph.addPoint(p);
            return;
        }
        let k;
        for (k = 0; k < np; k++) {
            let q = Graph.point(k);
            let d = Point.distance(p, q);
            if (d < 25) {
                p = { ...q };
                break;
            }
        }
        if (flag) {
            flag = false;
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
            if (Point.equal(p, px) || !isValid(p)) {
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
            let s = Segment.create(px, p);
            Graph.addSegment(s);
            if (weighted) addCost(p, px);
            if (Graph.isDirected()) {
                if (acyclic && Graph.hasCycle()) {
                    showToast({
                        message: 'Please draw acyclic graph.',
                        variant: 'error',
                    });
                    $('.edge:last').remove();
                    Graph.removeSegment(s);
                    return;
                }
                let q = fromDistance(px, p, 23);
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
                (px = p) && (ipx = k);
                flag = true;
            }
        }
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = withOffset(e);
            $('.edge:last').attr('x2', p.x);
            $('.edge:last').attr('y2', p.y);
        }
    });

    $('#plane').on('mouseleave', function (e) {
        e.preventDefault();
        if (flag) {
            $('.edge:last').remove();
            $('.vrtx').eq(ipx).attr('stroke', Colors.stroke);
            flag = false;
        }
    });
}

function addCost(p, q, cost) {
    cost = cost || Math.round(Point.distance(p, q) / 20);
    let element = `
        <foreignObject width="30" height="30" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
            <p class="cost" onclick="this.focus();event.stopPropagation();" contenteditable="true">
                ${cost}
            </p>
        </foreignObject>`;
    document.getElementById('plane').innerHTML += element;
}

export function switchType() {
    Graph.switchType();
    if (Graph.isDirected()) {
        $('.edge').each(function (i) {
            let s = Graph.segment(i);
            let r = fromDistance(s.p, s.q, 23);
            $(this).attr('x2', r.x);
            $(this).attr('y2', r.y);
            $(this).attr('marker-end', 'url(#arrow)');
        });
    } else {
        $('.edge').each(function (i) {
            let s = Graph.segment(i);
            let { x, y } = s.q;
            $(this).attr('x2', x);
            $(this).attr('y2', y);
            $(this).removeAttr('marker-end');
        });
    }
}
