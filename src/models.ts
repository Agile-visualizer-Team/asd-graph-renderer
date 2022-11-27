
export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface GraphNode {
    name: string;
    color?: {
        root?: string;
        leaves?: string;
        nonRoot?: string;
    }| string;
}

export interface GraphEdge {
    from: string;
    destination: string;
    weight: string|null;
    color?:{
        branch: string;
        path: string;
    } | string;
    oriented: boolean;
}

export function createGraphNode(options?: Partial<GraphNode>):GraphNode{
    const defaults ={
        name: "node",
        color: {
            root: "green",
            leaves: "magenta",
            nonRoot: "blue"
        }
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
        color: {
            branch: "blue",
            path: "yellow",
        },
        oriented: true
    }
    return {
        ...defaults,
        ...options,
    }
}