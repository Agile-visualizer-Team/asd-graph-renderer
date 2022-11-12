export class GraphNode {
    readonly label: string;

    constructor(label: string) {
        this.label = label;
    }
}

export class GraphEdge {
    readonly from: GraphNode;
    readonly destination: GraphNode;
    readonly weight: string|null;

    constructor(from: GraphNode, destination: GraphNode, weight: string|null) {
        this.from = from;
        this.destination = destination;
        this.weight = weight;
    }
}