import $ from 'jquery';
import { Point } from './graph';
import { wait } from './timer';
import { addEdge, addVertex, fromDistance } from './utils';

var root = null;
var dx = 40, dy = 60;

var Tree = {
    flag: true,
    root: () => root,

    _size(node) {
        if (!node) return 0;
        let size = this._size(node.left) + this._size(node.right);
        return size + 1;
    },

    _find(node, callback) {
        if (!node) return;
        if (callback(node)) return node;
        let { left, right } = node;
        return this._find(left, callback) || this._find(right, callback);
    },

    size() {
        return this._size(root);
    },

    find(callback) {
        return this._find(root, callback);
    },

    clear: () => void (root = null),

    insert(key, parent, flag) {
        if (!root) {
            root = { key, index: 0 };
            let rx = $('#plane').width() / 2;
            root.point = Point.create(rx, 60);
            addVertex(root.point, key);
            return Promise.resolve(root);
        }
        let { p, q, node } = this.createNode(key, parent, flag);
        if (flag !== this.flag) {
            let subroot = this.findSubRoot(parent);
            let rx = root.point.x;
            if (Math.abs(q.x - rx) < 15) {
                this.shiftNode(subroot, 40);
            } else {
                this.shiftNode(subroot, 60);
            }
        }
        addEdge(p, p);
        let d = Point.distance(p, q);
        return span(node, p, q, d - 2).then(() => node);
    },

    createNode(key, parent, flag) {
        let node = { key, parent, flag };
        node.index = this.size();
        let p = parent.point;
        let x, y;
        if (flag) {
            parent.left = node;
            x = p.x - dx;
        } else {
            parent.right = node;
            x = p.x + dx;
        }
        y = p.y + dy;
        let q = { x, y };
        node.point = q;
        return { node, p, q };
    },

    findSubRoot(node) {
        if (node.flag === this.flag) {
            return node;
        } else {
            return this.findSubRoot(node.parent);
        }
    },

    shiftNode(node, d, flag) {
        if (!node) return;
        if (flag) {
            let { point } = node.parent;
            $('.edge').eq(node.index - 1).attr('x1', point.x);
        }
        let x2;
        if (this.flag) {
            x2 = node.point.x - d;
        } else {
            x2 = node.point.x + d;
        }
        shift(node.index, x2);
        node.point.x = x2;
        this.shiftNode(node.left, d, true);
        this.shiftNode(node.right, d, true);
        this.cleanup(node);
    },

    cleanup(node) {
        let _node = this.find((x) => {
            if (x.parent !== node.parent) {
                let d = Point.distance(node.point, x.point);
                if (d < 30) return true;
            }
            return false;
        });
        if (_node) {
            let subroot;
            if (_node.flag === this.flag) {
                subroot = this.findSubRoot(node.parent);
            } else {
                subroot = this.findSubRoot(_node.parent);
            }
            this.shiftNode(subroot, 50);
        }
    },
};

function shift(i, x) {
    $('.edge').eq(i - 1).attr('x2', x);
    $('.vrtx').eq(i).attr('cx', x);
    $('.vlbl').eq(i).attr('x', x);
}

function span(node, p, q, d) {
    if (d > 0) {
        let r = fromDistance(p, q, d);
        $('.edge').eq(node.index - 1).attr('x2', r.x);
        $('.edge').eq(node.index - 1).attr('y2', r.y);
        return wait(10).then(() => span(node, p, q, d - 2));
    } else {
        addVertex(q, node.key, 15);
        return Promise.resolve();
    }
}

export default Tree;
