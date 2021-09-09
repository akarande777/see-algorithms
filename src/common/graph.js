var points = [];
var segments = [];
var matrix = [];
var steps = [];
var directed = false;

export default {
    addPoint(point) {
        points.push(point);
        matrix.push([]);
    },

    setPoint: (i, p) => void (points[i] = p),

    allSegments: () => segments,

    position(segment) {
        let i = points.findIndex((p) => p.equals(segment.p));
        let j = points.findIndex((p) => p.equals(segment.q));
        return [i, j];
    },

    addSegment(segment) {
        let [i, j] = this.position(segment);
        matrix[i][j] = segments.length;
        if (!directed) {
            matrix[j][i] = segments.length;
        }
        segments.push(segment);
        steps.push([i, j]);
    },

    totalPoints: () => points.length,

    point: (index) => points[index],

    segment: (index) => segments[index],

    edgeIndex: (i, j) => matrix[i][j],

    reset(type) {
        points = [];
        segments = [];
        matrix = [];
        steps = [];
        directed = Boolean(type);
    },

    forEach(callback) {
        let np = points.length;
        for (let i = 0; i < np; i++) {
            for (let j = 0; j < np; j++) {
                callback(i, j);
            }
        }
    },

    isDirected: () => directed,

    isConnected() {
        let visited = this.dfs(0, [0]);
        return visited.length === this.totalPoints();
    },

    dfs(u, visited) {
        let np = points.length;
        for (let v = 0; v < np; v++) {
            if (visited.indexOf(v) === -1) {
                let cost = matrix[u][v];
                let alt = matrix[v][u];
                if (cost !== undefined || alt !== undefined) {
                    visited.push(v);
                    this.dfs(v, visited);
                }
            }
        }
        return visited;
    },

    switchType() {
        directed = !directed;
        if (points.length > 1) {
            if (directed) {
                steps.forEach(([i, j]) => {
                    matrix[j][i] = undefined;
                });
            } else {
                steps.forEach(([i, j]) => {
                    matrix[j][i] = matrix[i][j];
                });
            }
        }
    },

    removeSegment(segment) {
        let [i, j] = this.position(segment);
        segments.splice(matrix[i][j], 1);
        matrix[i][j] = undefined;
        if (!directed) {
            matrix[j][i] = undefined;
        }
        let k = steps.findIndex(([u, v]) => u === i && v === j);
        steps.splice(k, 1);
    },

    indegree() {
        let np = points.length;
        let ind = new Array(np).fill(0);
        steps.forEach(([i, j]) => ind[j]++);
        return ind;
    },

    hasCycle() {
        let np = points.length;
        let ind = this.indegree();
        let stack = [];
        for (let i = 0; i < np; i++) {
            if (ind[i] === 0) stack.push(i);
        }
        if (stack.length === 0) {
            return true;
        }
        let k = 0;
        while (stack.length > 0) {
            let i = stack.pop();
            for (let j = 0; j < np; j++) {
                let ei = this.edgeIndex(i, j);
                if (ei !== undefined && ind[j] !== 0) {
                    --ind[j];
                    if (ind[j] === 0) stack.push(j);
                }
            }
            k++;
        }
        return k !== np;
    },
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.equals = function (q) {
    return this.x === q.x && this.y === q.y;
};

function Segment(p, q) {
    this.p = p;
    this.q = q;
}

Segment.prototype.slope = function () {
    return (this.q.y - this.p.y) / (this.q.x - this.p.x);
};

Segment.prototype.orientation = function (r) {
    let p = this.p;
    let q = this.q;
    let d = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (d === 0) return 0;
    return d > 0 ? 1 : 2;
};

Segment.prototype.overlaps = function (s) {
    if (this.p.equals(s.p) || this.p.equals(s.q)) {
        if (this.q.equals(s.p) || this.q.equals(s.q)) {
            return true;
        }
    }
    return false;
};

export { Point, Segment };
