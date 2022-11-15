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
    textColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
}

export interface GraphRendererNodeTheme {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    ellipse: {
        sizeMultiplier: number
    };
    roundRectangle: {
        widthMultiplier: number,
        heightMultiplier: number
    }
}

const VSCODE_THEME_FONT = 'Cascadia Code';
export const VSCODE_THEME = {
    backgroundColor: '#1e1e1e',
    node: <GraphRendererNodeTheme>{
        backgroundColor: '#252526',
        borderColor: '#2765ab',
        textColor: '#fff',
        fontFamily: VSCODE_THEME_FONT,
        fontSize: '18px',
        fontWeight: '400',
        ellipse: {
            sizeMultiplier: 24
        },
        roundRectangle: {
            widthMultiplier: 14,
            heightMultiplier: 26
        }
    },
    rootNode: {
        backgroundColor: '#252526',
        borderColor: '#12674a',
        textColor: '#fff',
        fontFamily: VSCODE_THEME_FONT,
        fontSize: '18px',
        fontWeight: '500',
    },
    leafNode: {
        backgroundColor: '#252526',
        borderColor: '#a12d7c',
        textColor: '#fff',
        fontFamily: VSCODE_THEME_FONT,
        fontSize: '18px',
        fontWeight: '400',
    },
    edge: {
        lineColor: '#3794ff',
        arrowColor: '#3794ff',
        textColor: '#cccccc',
        fontFamily: VSCODE_THEME_FONT,
        fontSize: '7px',
        fontWeight: '300',
    }
} as GraphRendererTheme;