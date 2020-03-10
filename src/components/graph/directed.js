import $ from 'jquery';
import { message } from 'antd';
import { Point, Segment, distance, addVertex, addEdge, offset, fromEnd } from '../utils';

var wt, mt;
var ind;

function directed() {
    var pnts = this.pnts = [];
    var sgts = this.sgts = [];
    wt = this.wt = new Array();
    mt = this.mt = new Array();
    ind = this.ind = [];
    var src, lastp;
    var flag = false;

    $('#plane').mousedown(function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        if (pnts.length == 0) {
            addVertex(p, 'A');
            pnts.push(p);
            ind.push(0);
            wt[0] = new Array();
            mt[0] = new Array();
            return;
        }
        for (let i = 0; i < pnts.length; i++) {
            let d = distance(p, pnts[i]);
            if (d < 25) {
                p.x = pnts[i].x;
                p.y = pnts[i].y;
                src = i;
                flag = true;
                addEdge(p, p);
                $('line:last').attr('marker-end', 'url(#arrow)');
                lastp = p;
                return;
            }
        }
        if (pnts.length == 12) {
            return;
        }
        wt[pnts.length] = new Array();
        mt[pnts.length] = new Array();
        addVertex(p, String.fromCharCode(65 + pnts.length));
        pnts.push(p);
        ind.push(0);
    });

    $('#plane').mouseup(function (e) {
        e.preventDefault();
        if (flag) {
            flag = false;
            let p = new Point(offset(e).x, offset(e).y);
            let j;
            for (j = 0; j < pnts.length; j++) {
                let d = distance(p, pnts[j]);
                if (d < 25) {
                    p.x = pnts[j].x;
                    p.y = pnts[j].y;
                    break;
                }
            }
            if (j == pnts.length) {
                $('line:last').remove();
                return;
            }
            if (p.equals(lastp)) {
                $('line:last').remove();
                return;
            }
            let s = new Segment(lastp, p);
            for (let i = 0; i < sgts.length; i++) {
                if (sgts[i].overlaps(s)) {
                    $('line:last').remove();
                    return;
                }
            }
            ind[j]++;
            wt[src][j] = 1;
            mt[src][j] = sgts.length;
            if (hasCycle(pnts)) {
                message.warning("draw acyclic graph");
                $('line:last').remove();
                --ind[j];
                return;
            }
            let q = fromEnd(lastp, p, 23);
            $('line:last').attr('x2', q.x);
            $('line:last').attr('y2', q.y);
            sgts.push(s);
        }
        flag = false;
    });

    $('#plane').mousemove(function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(offset(e).x, offset(e).y);
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
        }
    });
}

function hasCycle(pnts) {
    let stack = new Array();
    let t = ind.slice();
    for (let i = 0; i < pnts.length; i++) {
        if (t[i] == 0) {
            stack.push(i);
        }
    }
    if (stack.length == 0) {
        return true;
    }
    let k = 0;
    while (stack.length > 0) {
        let i = stack.pop();
        for (let j = 0; j < pnts.length; j++) {
            if (wt[i][j] != undefined && t[j] != 0) {
                --t[j];
                if (t[j] == 0) stack.push(j);
            }
        }
        k++;
    }
    return k != pnts.length ? true : false;
}

export { directed };