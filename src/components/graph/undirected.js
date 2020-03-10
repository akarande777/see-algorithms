import $ from 'jquery';
import { Point, Segment, distance, addVertex, addEdge, offset } from '../utils';

function undirected(hasCost) {
    var pnts = this.pnts = [];
    var sgts = this.sgts = [];
    var lastp, k;
    var flag = false;

    $('#plane').click(function (e) {
        e.preventDefault();
        let p = new Point(offset(e).x, offset(e).y);
        if (pnts.length == 0) {
            addVertex(p, 'A');
            pnts.push(p)
            return;
        }
        let j;
        for (j = 0; j < pnts.length; j++) {
            let d = distance(p, pnts[j]);
            if (d < 25) {
                p.x = pnts[j].x;
                p.y = pnts[j].y;
                break;
            }
        }
        if (flag) {
            $('.vrtx').eq(k).attr("stroke", "#777");
            if (p.equals(lastp)) {
                $('line:last').remove();
                flag = false;
                return;
            }
            let s = new Segment(lastp, p);
            for (let i = 0; i < sgts.length; i++) {
                if (s.overlaps(sgts[i])) {
                    $('line:last').remove();
                    flag = false;
                    return;
                }
            }
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
            if (j == pnts.length) {
                if (sgts.length >= 25) {
                    $('line:last').remove();
                    flag = false;
                    return;
                }
                addVertex(p, String.fromCharCode(65 + pnts.length));
                pnts.push(p);
            }
            sgts.push(s);
            if (hasCost) {
                addCost(p, lastp);
            }
            flag = false;
        }
        else {
            if (j == pnts.length) return;
            $('.vrtx').eq(j).attr("stroke", "orange");
            addEdge(p, p);
            lastp = p;
            k = j;
            flag = true;
        }
    });

    $('#plane').mousemove(function (e) {
        e.preventDefault();
        if (flag) {
            let p = new Point(offset(e).x, offset(e).y);
            $('line:last').attr('x2', p.x);
            $('line:last').attr('y2', p.y);
        }
    });

    $('#plane').mouseleave(function (e) {
        e.preventDefault();
        if (flag) {
            $('line:last').remove();
            $('.vrtx').eq(k).attr("stroke", "#777");
            flag = false;
        }
    });
}

function addCost(p, q) {
    let cost = `<foreignObject width="20" height="25" x="${(p.x + q.x) / 2}" y="${(p.y + q.y) / 2}">
        <p class="cost" onclick="this.focus()" contenteditable="true">${Math.round(distance(p, q) / 20)}
        </p></foreignObject>`;
    document.querySelector('#plane').innerHTML += cost;
}

export { undirected };