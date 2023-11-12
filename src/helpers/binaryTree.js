import { Colors } from '../common/constants';
import { Point } from '../common/graph';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

const _size = (node) => {
    if (!node) return 0;
    const size = _size(node.left) + _size(node.right);
    return size + 1;
};

const _find = (node, fn) => {
    if (!node) return;
    if (fn(node)) return node;
    return _find(node.left, fn) || _find(node.right, fn);
};

export function binaryTree({ tx, txy, width, bgcolor, rotate }) {
    var root, _isLeft = true;

    const findNode = (fn) => _find(root, fn);

    const appendNode = (node) => {
        const p = node.parent;
        if (node.isLeft) {
            p.left = node;
            node.x = p.x - dx;
        } else {
            p.right = node;
            node.x = p.x + dx;
        }
        node.y = p.y + dy;
        node.index = _size(root) - 1;
        return node;
    };

    const shiftNode = async (node, d, flag) => {
        if (!node) return;
        const x2 = _isLeft ? node.x - d : node.x + d;
        txy(`#node${node.index}`, x2, node.y);
        const ei = node.index - 1;
        tx(`#edge${ei}`, x2 + 25);
        node.x = x2;
        if (flag) {
            const [hypot, angle] = nodeAngle(node);
            width(`#edge${ei}`, hypot, 0);
            rotate(`#edge${ei}`, angle, 0);
        }
        shiftNode(node.left, d);
        shiftNode(node.right, d);
        cleanup(node);
    };

    const cleanup = async (node) => {
        const closer = findNode((nx) => {
            if (nx.parent !== node.parent) {
                const d = Point.distance(node, nx);
                if (d < 30) return true;
            }
            return false;
        });
        if (closer) {
            const subroot = findSubroot(
                closer.isLeft === _isLeft ? node.parent : closer.parent
            );
            await shiftNode(subroot, 60, true);
        }
    };

    const findSubroot = (node) => {
        if (node.isLeft === _isLeft) return node;
        return findSubroot(node.parent);
    };

    const setNodePath = (node) => {
        if (node.parent === root) {
            _isLeft = node.isLeft;
            return;
        }
        setNodePath(node.parent);
    };

    return Object.freeze({
        root: () => root,
        size: () => _size(root),
        findNode,
        async createNode(value, parent, isLeft = true) {
            if (!root) {
                const [x, y] = [300, 70];
                root = { value, index: 0, x, y };
                await txy(`#node${0}`, x, y);
                return root;
            }
            const node = appendNode({ value, parent, isLeft });
            setNodePath(node);
            await cleanup(node);
            await txy(`#node${node.index}`, node.x, node.y);
            const ei = node.index - 1;
            await txy(`#edge${ei}`, node.x + 25, node.y + 20, 0);
            const [hypot, angle] = nodeAngle(node);
            await width(`#edge${ei}`, hypot, 0);
            await rotate(`#edge${ei}`, angle, 0);
            await bgcolor(`#edge${ei}`, Colors.stroke, 0);
            return node;
        },
    });
}
