import Graph from './Graph';

const { points, segments, matrix } = Graph.data();

export default {
    ...Graph,

    addSegment(segment) {
        let [i, j] = this.position(segment);
        matrix[i][j] = segments.length;
        segments.push(segment);
    },

    indegree() {
        let np = this.totalPoints();
        let ind = new Array(np).fill(0);
        for (let i = 0; i < np; i++) {
            for (let j = 0; j < np; j++) {
                if (matrix[i][j] !== undefined) {
                    ind[j]++;
                }
            }
        }
        return ind;
    },

    hasCycle() {
        let np = points.length;
        let ind = this.indegree();
        let stack = [];
        for (let i = 0; i < np; i++) {
            if (ind[i] == 0) {
                stack.push(i);
            }
        }
        if (stack.length == 0) {
            return true;
        }
        let k = 0;
        while (stack.length > 0) {
            let i = stack.pop();
            for (let j = 0; j < np; j++) {
                let ei = this.edgeIndex(i, j);
                if (ei !== undefined && ind[j] !== 0) {
                    --ind[j];
                    if (ind[j] === 0) {
                        stack.push(j);
                    }
                }
            }
            k++;
        }
        return k !== np;
    },
};
