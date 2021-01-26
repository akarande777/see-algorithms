import { addVertex, addEdge } from '../graph/utils';
import { Point } from '../graph/Graph';
var flag;

function xco(t, h, dx) {
    return flag ? dx - h * Math.sin(t * (Math.PI / 180)) : dx + h * Math.sin(t * (Math.PI / 180));
}

function yco(t, h, dy) {
    return dy + h * Math.cos(t * (Math.PI / 180));
}

function heap(n) {
    let p = new Point(325, 25);
    addVertex(p, '');
    let v = new Array();
    v.push(p);
    let dx = 325,
        dy = 25;
    let t = 70,
        h = 150;
    let size = 2;
    let k = 1;
    flag = true;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < size; j++) {
            let x1 = xco(t, 15, dx);
            let y1 = yco(t, 15, dy);
            let x2 = xco(t, h, dx);
            let y2 = yco(t, h, dy);
            p = new Point(x2, y2);
            addEdge(new Point(x1, y1), p);
            addVertex(p, '');
            v.push(p);
            if (v.length == n) {
                break;
            }
            flag = !flag;
            if (flag) {
                dx = v[k++].x;
            }
        }
        if (v.length == n) break;
        t = i == 1 ? t - 20 : t - 25;
        h = i == 1 ? h - 30 : h - 50;
        dy = v[v.length - 1].y;
        size *= 2;
    }
    return v;
}

export default heap;
