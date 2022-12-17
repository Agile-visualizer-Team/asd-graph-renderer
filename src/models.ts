export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    oriented: boolean;
}

export interface GraphVariables {
    [key: string]: any;
}

export interface GraphNode {
    label: string;
    color?: string | null;
    variables: GraphVariables;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight: string | null;
    color?: string | null;
    variables: GraphVariables;
}

export function createGraphNode(options?: Partial<GraphNode>): GraphNode {
    const defaults = {
        label: "node",
        variables: {}
    }
    return {
        ...defaults,
        ...options,
    }
}

export function createGraphEdge(options?: Partial<GraphEdge>): GraphEdge {
    const defaults = {
        from: "a",
        to: "b",
        weight: null,
        oriented: true,
        variables: {}
    }
    return {
        ...defaults,
        ...options,
    }
}