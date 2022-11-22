
export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface GraphNode {
    name: string;
    weight: string;
}

export interface GraphEdge {
    from: GraphNode;
    destination: GraphNode;
    weight: string|null;
}
