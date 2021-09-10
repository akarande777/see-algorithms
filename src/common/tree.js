import $ from 'jquery';
import { distance } from './utils';

var subroot, arr = [];

export default {
    size: () => arr.length,

    pushNode: (node) => arr.push(node),

    nodeAt: (index) => arr[index],

    reset() {
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
        $('line').eq(i - 1).attr('x2', x);
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
        this.accomodate(subroot);
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
        this.accomodate(node);
    },

    accomodate(node) {
        let i;
        for (i = 3; i < arr.length; i++) {
            if (arr[i].index !== node.index) {
                let d = distance(node.point, arr[i].point);
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
