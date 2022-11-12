export interface GraphRendererTheme {
    backgroundColor: string;
    node: GraphRendererNodeTheme;
    rootNode: GraphRendererNodeTheme;
    leafNode: GraphRendererNodeTheme;
    edge: GraphRendererEdgeTheme;
}

export interface GraphRendererEdgeTheme {
    lineColor: string;
    arrowColor: string;
}

export interface GraphRendererNodeTheme {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
}

export const VSCODE_THEME = {
    backgroundColor: '#1e1e1e',
    node: {
        backgroundColor: '#252526',
        borderColor: '#2765ab',
        textColor: '#fff',
        rootTextColor: '#16825d'
    },
    rootNode: {
        backgroundColor: '#252526',
        borderColor: '#12674a',
        textColor: '#fff',
    },
    leafNode: {
        backgroundColor: '#252526',
        borderColor: '#a12d7c',
        textColor: '#fff',
    },
    edge: {
        lineColor: '#3794ff',
        arrowColor: '#3794ff'
    }
} as GraphRendererTheme;