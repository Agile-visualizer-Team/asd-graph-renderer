"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphEdge = exports.GraphNode = void 0;
class GraphNode {
    constructor(label) {
        this.label = label;
    }
}
exports.GraphNode = GraphNode;
class GraphEdge {
    constructor(from, destination) {
        this.from = from;
        this.destination = destination;
    }
}
exports.GraphEdge = GraphEdge;
