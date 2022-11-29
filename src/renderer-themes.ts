export interface GraphRendererTheme {
    backgroundColor: string;
    node: GraphRendererNodeTheme;
    edge: GraphRendererEdgeTheme;
    palette: {[key: string]: string};
}

export interface GraphRendererEdgeTheme {
    lineColor: string;
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

export const VSCODE_THEME = <GraphRendererTheme>{
    backgroundColor: '#1e1e1e',
    node: <GraphRendererNodeTheme>{
        backgroundColor: '#252526',
        borderColor: '#666',
        textColor: '#fff',
        fontFamily: 'Cascadia Code, Arial',
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
    edge: {
        lineColor: '#3794ff',
        textColor: '#eeeeee',
        fontFamily: 'Cascadia Code, Arial',
        fontSize: '7px',
        fontWeight: '300',
    },
    palette: {
        red: '#ee273e',
        green: '#18af6c',
        blue: '#3794ff',
        yellow: '#fec20e',
        magenta: '#d82983',
        violet: '#7261ab',
        orange: '#f47a20'
    }
};