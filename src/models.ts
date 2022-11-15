
export class Graph {
    readonly nodes: GraphNode[];
    readonly edges: GraphEdge[];

    constructor(nodes: GraphNode[], edges: GraphEdge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }
}

export class GraphNode {
    readonly name: string;
    readonly weight: string|null;

    constructor(label: string, weight: string|null = null) {
        this.name = label;
        this.weight = weight;
    }
}

export class GraphEdge {
    readonly from: GraphNode;
    readonly destination: GraphNode;
    readonly weight: string|null;

    constructor(from: GraphNode, destination: GraphNode, weight: string|null = null) {
        this.from = from;
        this.destination = destination;
        this.weight = weight;
    }
}
