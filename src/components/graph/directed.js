import $ from 'jquery';
import { message } from 'antd';
import { distance, addVertex, addEdge, offset, fromEnd } from '../utils';
import { Point, Segment } from './Graph';
import DAG from './DAG';

function directed() {
    var lastp;
    var flag = false;
    DAG.initialize();

    $('#plane').on('mousedown', function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        let np = DAG.totalPoints();
        if (np == 0) {
            addVertex(p, 'A');
            DAG.addPoint(p);
            return;
        }
        for (let i = 0; i < np; i++) {
            let q = DAG.point(i);
            let d = distance(p, q);
            if (d < 25) {
                p.x = q.x;
                p.y = q.y;
                flag = true;
                addEdge(p, p);
                $('line:last').attr('marker-end', 'url(#arrow)');
                lastp = p;
                return;
            }
        }
        if (np == 12) {
            return;
        }
        addVertex(p, String.fromCharCode(65 + np));
        DAG.addPoint(p);
    });

    $('#plane').on('mouseup', function (e) {
        e.preventDefault();
        if (flag) {
            flag = false;
            let p = new Point(offset(e).x, offset(e).y);
            let np = DAG.totalPoints();
            let j;
            for (j = 0; j < np; j++) {
                let q = DAG.point(j);
                let d = distance(p, q);
                if (d < 25) {
                    p.x = q.x;
                    p.y = q.y;
                    break;
                }
            }
            if (j == np) {
                $('line:last').remove();
                return;
            }
            if (p.equals(lastp)) {
                $('line:last').remove();
                return;
            }
            let s = new Segment(lastp, p);
            let ns = DAG.totalSegments();
            for (let i = 0; i < ns; i++) {
                if (DAG.segment(i).overlaps(s)) {
                    $('line:last').remove();
                    return;
                }
            }
            DAG.addSegment(s, true);
            if (DAG.hasCycle()) {
                message.warning('draw acyclic graph');
                $('line:last').remove();
                DAG.removeSegment(s);
                return;
            }
            let q = fromEnd(lastp, p, 23);
            $('line:last').attr('x2', q.x);
            $('line:last').attr('y2', q.y);
        }
        flag = false;
    });

    $('#plane').on('mousemove', function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(offset(e).x, offset(e).y);
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
        }
    });
}

export { directed };
