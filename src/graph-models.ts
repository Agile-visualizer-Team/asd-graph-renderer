export class GraphNode {
    readonly label: string;

    constructor(label: string) {
        this.label = label;
    }
}

export class GraphEdge {
    readonly from: GraphNode;
    readonly destination: GraphNode;

    constructor(from: GraphNode, destination: GraphNode) {
        this.from = from;
        this.destination = destination;
    }
}