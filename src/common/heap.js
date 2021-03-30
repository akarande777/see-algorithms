import { addVertex, addEdge } from './utils';
import { Point } from './graph';

var flag;

function xco(theta, hyp, dx) {
    return flag
        ? dx - hyp * Math.sin(theta * (Math.PI / 180))
        : dx + hyp * Math.sin(theta * (Math.PI / 180));
}

function yco(theta, hyp, dy) {
    return dy + hyp * Math.cos(theta * (Math.PI / 180));
}

function heap(n) {
    let p = new Point(325, 25);
    addVertex(p, '');
    let v = new Array();
    v.push(p);
    let dx = 325,
        dy = 25;
    let theta = 70,
        hyp = 150;
    let size = 2;
    let k = 1;
    flag = true;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < size; j++) {
            let x1 = xco(theta, 15, dx);
            let y1 = yco(theta, 15, dy);
            let x2 = xco(theta, hyp, dx);
            let y2 = yco(theta, hyp, dy);
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
        if (v.length === n) {
            break;
        }
        theta = i === 1 ? theta - 20 : theta - 25;
        hyp = i === 1 ? hyp - 30 : hyp - 50;
        dy = v[v.length - 1].y;
        size *= 2;
    }
    return v;
}

export default heap;
