import { addVertex, addEdge } from '../graph/common/utils';
import { Point } from '../graph/common/Graph';

var flag;

function xco(theta, hypo, dx) {
    return flag
        ? dx - hypo * Math.sin(theta * (Math.PI / 180))
        : dx + hypo * Math.sin(theta * (Math.PI / 180));
}

function yco(theta, hypo, dy) {
    return dy + hypo * Math.cos(theta * (Math.PI / 180));
}

function heap(n) {
    let p = new Point(325, 25);
    addVertex(p, '');
    let v = new Array();
    v.push(p);
    let dx = 325,
        dy = 25;
    let theta = 70,
        hypo = 150;
    let size = 2;
    let k = 1;
    flag = true;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < size; j++) {
            let x1 = xco(theta, 15, dx);
            let y1 = yco(theta, 15, dy);
            let x2 = xco(theta, hypo, dx);
            let y2 = yco(theta, hypo, dy);
            p = new Point(x2, y2);
            addEdge(new Point(x1, y1), p);
            addVertex(p, '');
            v.push(p);
            if (v.length === n) {
                break;
            }
            flag = !flag;
            if (flag) {
                dx = v[k++].x;
            }
        }
        if (v.length === n) break;
        theta = i === 1 ? theta - 20 : theta - 25;
        hypo = i === 1 ? hypo - 30 : hypo - 50;
        dy = v[v.length - 1].y;
        size *= 2;
    }
    return v;
}

export default heap;
