
export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface GraphNode {
    name: string;
}

export interface GraphEdge {
    from: string;
    destination: string;
    weight: string|null;
}
