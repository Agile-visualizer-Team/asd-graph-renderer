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
        borderColor: '#666666',
        textColor: '#ffffff',
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
    // see TEMPLATE_COLORS_LIST for full list
    palette: {
        red: '#ee273e',
        green: '#18af6c',
        blue: '#3794ff',
        yellow: '#fec20e',
        fuchsia: '#d82983',
        purple: '#7261ab',
        orange: '#f47a20',
        gray: '#666666',
        white: '#ffffff',
        black: '#000000',
        silver: '#99a1a1',
        maroon: '#800000',
        aqua: '#00cec9',
        teal: '#00b894',
        olive: '#badc58',
        navy: '#30336b',
        lime: '#A3CB38'
    }
};