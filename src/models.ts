export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    oriented: boolean;
    layout: string;
}

export interface GraphVariables {
    [key: string]: any;
}

export interface GraphNode {
    label: string;
    color?: string | null;
    variables: GraphVariables;
    templateIndex: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight: string | null;
    color?: string | null;
    variables: GraphVariables;
    templateIndex: number;
    oriented: boolean;
}

export function createGraphNode(options?: Partial<GraphNode>): GraphNode {
    const defaults = {
        label: "node",
        variables: {},
        templateIndex: 0
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
        variables: {},
        templateIndex: 0
    }
    return {
        ...defaults,
        ...options,
    }
}