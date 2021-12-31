import { addVertex, addEdge } from '../common/utils';

function createHeap(n) {
    let p = { x: 325, y: 25 };
    addVertex(p, '');
    let v = new Array();
    v.push(p);
    let dx = 325, dy = 25;
    let theta = 70, hyp = 150;
    let size = 2, k = 1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < size; j++) {
            let flag = j % 2 === 0;
            let x1 = xco(theta, 15, dx, flag);
            let y1 = yco(theta, 15, dy);
            let x2 = xco(theta, hyp, dx, flag);
            let y2 = yco(theta, hyp, dy);
            let p = { x: x1, y: y1 };
            let q = { x: x2, y: y2 };
            addEdge(p, q);
            addVertex(q, '');
            v.push(q);
            if (v.length === n) break;
            if (!flag) {
                dx = v[k++].x;
            }
        }
        if (v.length === n) break;
        theta = i === 1 ? theta - 20 : theta - 25;
        hyp = i === 1 ? hyp - 30 : hyp - 50;
        dy = v[v.length - 1].y;
        size *= 2;
    }
    return v;
}

function xco(theta, hyp, dx, flag) {
    return flag
        ? dx - hyp * Math.sin(theta * (Math.PI / 180))
        : dx + hyp * Math.sin(theta * (Math.PI / 180));
}

function yco(theta, hyp, dy) {
    return dy + hyp * Math.cos(theta * (Math.PI / 180));
}

export { createHeap, xco, yco };
