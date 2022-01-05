import $ from 'jquery';
import { Point } from './graph';

var subroot, arr = [];

var Tree = {
    flag: true,
    size: () => arr.length,
    node: (index) => arr[index],
    push: (node) => arr.push(node),

    clear() {
        arr = [];
        subroot = null;
    },

    findSubRoot(node) {
        if (node.flag === this.flag) {
            subroot = node;
        } else {
            this.findSubRoot(node.parent);
        }
    },

    shiftNode(i, x) {
        $('.edge').eq(i - 1).attr('x2', x);
        $('.vrtx').eq(i).attr('cx', x);
        $('.vlbl').eq(i).attr('x', x);
    },

    shiftSubRoot(d) {
        let x2;
        if (this.flag) {
            x2 = subroot.point.x - d;
            this.shiftNode(subroot.index, x2);
        } else {
            x2 = subroot.point.x + d;
            this.shiftNode(subroot.index, x2);
        }
        subroot.point.x = x2;
        this.shift(subroot.left, d);
        this.shift(subroot.right, d);
        this.cleanUp(subroot);
    },

    shift(node, d) {
        if (!node) return;
        let x1 = node.parent.point.x;
        $('line').eq(node.index - 1).attr('x1', x1);
        let x2;
        if (this.flag) {
            x2 = node.point.x - d;
            this.shiftNode(node.index, x2);
        } else {
            x2 = node.point.x + d;
            this.shiftNode(node.index, x2);
        }
        node.point.x = x2;
        this.shift(node.left, d);
        this.shift(node.right, d);
        this.cleanUp(node);
    },

    cleanUp(node) {
        let i;
        for (i = 3; i < arr.length; i++) {
            if (arr[i].index !== node.index) {
                let d = Point.distance(node.point, arr[i].point);
                if (d < 30) break;
            }
        }
        if (i < arr.length) {
            if (arr[i].flag === this.flag) {
                this.findSubRoot(node.parent);
            } else {
                this.findSubRoot(arr[i].parent);
            }
            this.shiftSubRoot(40);
        }
    },
};

export default Tree;
