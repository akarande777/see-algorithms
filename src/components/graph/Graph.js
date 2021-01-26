const points = [];
const segments = [];
const matrix = [];

export default {
    addPoint(point) {
        points.push(point);
        matrix.push([]);
    },

    addSegment(segment) {
        let i = points.findIndex((p) => p.equals(segment.p));
        let j = points.findIndex((p) => p.equals(segment.q));
        matrix[i][j] = segments.length;
        matrix[j][i] = segments.length;
        segments.push(segment);
    },

    totalPoints: () => points.length,

    totalSegments: () => segments.length,

    point: (i) => points[i],

    segment: (i) => segments[i],

    edgeIndex: (i, j) => matrix[i][j],

    initialize() {
        points.length = 0;
        segments.length = 0;
        matrix.length = 0;
    },
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.equals = function (q) {
    if (this.x == q.x && this.y == q.y) {
        return true;
    }
    return false;
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
    if (d == 0) return 0;
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
