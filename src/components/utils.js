import $ from 'jquery';

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.equals = function (q) {
    if (this.x == q.x && this.y == q.y) {
        return true;
    }
    return false;
}

function Segment(p, q) {
    this.p = p;
    this.q = q;
}

Segment.prototype.slope = function () {
    return (this.q.y - this.p.y) / (this.q.x - this.p.x);
}

Segment.prototype.orientation = function (r) {
    let p = this.p;
    let q = this.q;
    let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (d == 0) return 0;
    return d > 0 ? 1 : 2;
}

Segment.prototype.overlaps = function (s) {

    if (this.p.equals(s.p) || this.p.equals(s.q)) {
        if (this.q.equals(s.p) || this.q.equals(s.q)) {
            return true;
        }
    }
    return false;
}

// export class Segment {
//     constructor(p, q) {
//         this.p = p;
//         this.q = q;
//     }

//     slope() {
//         return (this.q.y - this.p.y) / (this.q.x - this.p.x);
//     }

//     orientation(r) {
//         let p = this.p;
//         let q = this.q;
//         let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
//         if (d == 0) {
//             return 0;
//         }
//         return d > 0 ? 1 : 2;
//     }

//     overlaps(s) {
//         if (this.p.equals(s.p) || this.p.equals(s.q)) {
//             if (this.q.equals(s.p) || this.q.equals(s.q))
//                 return true;
//         }
//         return false;
//     }
// }

function distance(p, q) {
    let d = Math.sqrt((q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y));
    return d;
}

function fromEnd(start, end, distance) {
    let x = end.x - start.x;
    let y = end.y - start.y;
    let z = Math.sqrt(x * x + y * y);
    let ratio = distance / z;
    let deltaX = x * ratio;
    let deltaY = y * ratio;
    return new Point(end.x - deltaX, end.y - deltaY);
}

function offset(e) {
    var out = { x: 0, y: 0 };
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend'
        || e.type == 'touchcancel')
    {
        let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX - $('#plane').offset().left;
        out.y = touch.pageY - $('#plane').offset().top;
    }
    else if (e.type == 'click' || e.type == 'mousedown' || e.type == 'mouseup'
        || e.type == 'mousemove' || e.type == 'mouseenter' || e.type == 'mouseleave')
    {
        out.x = e.pageX - $('#plane').offset().left;
        out.y = e.pageY - $('#plane').offset().top;
    }
    return out;
}

function addVertex(p, vlbl, r = 18) {
    let vrtx = `<g><ellipse class="vrtx" cx="${p.x}" cy="${p.y}" rx="${r}" ry="15" stroke="#777" stroke-width="1.5" fill="#eee" />
        <text class="vlbl" x="${p.x}" y="${p.y + 5}" text-anchor="middle" style="cursor:pointer">${vlbl}</text></g>`;
    document.querySelector('#plane').innerHTML += vrtx;
}

function moveVertex(i, r) {
    $('.vrtx').eq(i).attr("cx", r.x);
    $('.vrtx').eq(i).attr("cy", r.y);
    $('.vlbl').eq(i).attr("x", r.x);
    $('.vlbl').eq(i).attr("y", r.y + 5);
}

function addEdge(p, q) {
    let edge = `<line class="edge" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke-width="2.5" stroke="#777" />`;
    document.querySelector('#plane').innerHTML += edge;
    $('line:last').insertBefore($('g:first'));
}

function cloneEdge(i, j) {
    let edge = '<line stroke-width="3" stroke="orange" />';
    document.querySelector('#plane').innerHTML += edge;
    $('line:last').insertBefore($('g:first'));
    let p, q;
    if (this.sgts[j].p.equals(this.pnts[i])) {
        p = this.sgts[j].p;
        q = this.sgts[j].q;
    }
    else {
        p = this.sgts[j].q;
        q = this.sgts[j].p;
    }
    $('line:last').attr('x1', p.x);
    $('line:last').attr('y1', p.y);
    $('line:last').attr('x2', p.x);
    $('line:last').attr('y2', p.y);
    let d = distance(p, q);
    return { p, q, d }
}

export {
    Point, Segment,
    distance, fromEnd, offset,
    addVertex, moveVertex, addEdge, cloneEdge
};