
export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    oriented: boolean;
}

export interface GraphNode {
    name: string;
    color?: string|null;
}

export interface GraphEdge {
    from: string;
    destination: string;
    weight: string|null;
    color?: string|null;
}

export function createGraphNode(options?: Partial<GraphNode>):GraphNode{
    const defaults ={
        name: "node",
    }
    return {
        ...defaults,
        ...options,
    }
}

export function createGraphEdge(options?: Partial<GraphEdge>):GraphEdge{
    const defaults ={
        from: "a",
        destination:"b",
        weight: null,
        oriented: true
    }
    return {
        ...defaults,
        ...options,
    }
}