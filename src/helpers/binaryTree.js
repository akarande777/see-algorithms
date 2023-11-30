import { Colors } from '../common/constants';
import { Point } from '../common/graph';

const dx = 40, dy = 60;

const nodeAngle = ({ x, parent, isLeft }) => {
    const dx = Math.abs(x - parent.x);
    const a = Math.atan2(dy, dx) * (180 / Math.PI);
    return [Math.hypot(dy, dx), isLeft ? -a : -(180 - a)];
};

const _findNode = (node, fn) => {
    if (!node) return;
    if (fn(node)) return node;
    return _findNode(node.left, fn) || _findNode(node.right, fn);
};

export function binaryTree({ tx, txy, width, bgcolor, rotate, animate }) {
    var root, onLeft;
    var arr = [];

    const findNode = (fn) => _findNode(root, fn);

    const createNode = (node) => {
        const p = node.parent;
        if (node.isLeft) {
            p.left = node;
            node.x = p.x - dx;
        } else {
            p.right = node;
            node.x = p.x + dx;
        }
        node.y = p.y + dy;
        node.index = arr.length;
        arr.push(node);
        return node;
    };

    const shiftNode = async (node, d, isSubroot = false) => {
        if (!node) return;
        const x2 = onLeft ? node.x - d : node.x + d;
        tx(`#node${node.index}`, x2);
        const ei = node.index - 1;
        tx(`#edge${ei}`, x2 + 25);
        node.x = x2;
        if (isSubroot) {
            const [hypot, angle] = nodeAngle(node);
            rotate(`#edge${ei}`, angle, 0);
            width(`#edge${ei}`, hypot, 0);
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
                closer.isLeft === onLeft ? node.parent : closer.parent
            );
            await shiftNode(subroot, 60, true);
        }
    };

    const findSubroot = (node) => {
        if (node.isLeft === onLeft) return node;
        return findSubroot(node.parent);
    };

    const setNodePath = (node) => {
        if (node.parent === root) {
            onLeft = node.isLeft;
            return;
        }
        setNodePath(node.parent);
    };

    const swapNodes = async (i, j) => {
        const a = arr[i], b = arr[j];
        const t = a.value;
        a.value = b.value;
        b.value = t;
        await Promise.all([
            txy(`#node${a.index}`, b.x, b.y, 1),
            txy(`#node${b.index}`, a.x, a.y, 1),
        ]);
        await Promise.all([
            txy(`#node${a.index}`, a.x, a.y, 0),
            txy(`#node${b.index}`, b.x, b.y, 0),
        ]);
    }

    return Object.freeze({
        root: () => root,
        node: (i) => arr[i],
        findNode,
        swapNodes,
        async insert(value, parent, isLeft = true) {
            if (!root) {
                const [x, y] = [300, 40];
                root = { value, index: 0, x, y };
                await txy(`#node${0}`, x, y);
                await animate(`#node${0}`, { opacity: 1 });
                arr.push(root);
                return root;
            }
            const node = createNode({ value, parent, isLeft });
            setNodePath(node);
            await cleanup(node);
            const ei = node.index - 1;
            await txy(`#node${node.index}`, node.x, node.y, 0);
            await txy(`#edge${ei}`, node.x + 25, node.y + 20, 0);
            const [hypot, angle] = nodeAngle(node);
            await width(`#edge${ei}`, hypot, 0);
            await rotate(`#edge${ei}`, angle, 0);
            await animate(`#node${node.index}`, { opacity: 1 });
            await bgcolor(`#edge${ei}`, Colors.stroke);
            return node;
        },
    });
}
