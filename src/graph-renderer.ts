import {GraphEdge, GraphNode} from "./graph-models";
import {GraphRendererTheme, VSCODE_THEME} from "./graph-renderer-themes";
import {GraphRendererLayout} from "./graph-renderer-layout";

declare function require(name: string): any;
const cytosnap = require('cytosnap');
cytosnap.use(['cytoscape-dagre', 'cytoscape-klay']);

export class GraphRenderer {
    width: number = 800;
    height: number = 600;
    theme: GraphRendererTheme = VSCODE_THEME;
    layout: GraphRendererLayout = GraphRendererLayout.Graph;

    private generateCytoscapeElements(nodes: GraphNode[], edges: GraphEdge[]): object[] {
        const elements: any[] = [];

        nodes.forEach(n => {
            const classes: string[] = [];
            if (!edges.find(e => e.destination == n)) {
                classes.push('root');
            } else if (!edges.find(e => e.from == n)) {
                classes.push('leaf');
            }
            elements.push({
                data: {
                    id: n.label
                },
                classes: classes
            });
        });

        edges.forEach(e => {
            elements.push({
                data: {
                    id: e.from.label + '-' + e.destination.label,
                    source: e.from.label,
                    target: e.destination.label,
                    weight: e.weight
                }
            });
        });

        return elements;
    }

    private generateCytoscapeLayout(): object {
        if (this.layout == GraphRendererLayout.Graph) {
            return {
                name: 'klay',
                klay: {
                    direction: 'DOWN'
                }
            };
        }

        if (this.layout == GraphRendererLayout.Tree) {
            return {
                name: 'dagre'
            };
        }

        throw new Error("Unsupported layout type");
    }

    private generateCytoscapeStyle() {
        return [
            {
                selector: 'node',
                style: {
                    'font-family': this.theme.node.fontFamily,
                    'font-size': this.theme.node.fontSize,
                    'font-weight': this.theme.node.fontWeight,
                    'label': 'data(id)',
                    'background-color': this.theme.node.backgroundColor,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'border-width': '1px',
                    'border-color': this.theme.node.borderColor,
                    'color': this.theme.node.textColor,
                    'padding': '0 0 0 100px'
                }
            },
            {
                selector: 'node.root',
                style: {
                    'font-family': this.theme.rootNode.fontFamily,
                    'font-size': this.theme.rootNode.fontSize,
                    'font-weight': this.theme.rootNode.fontWeight,
                    'background-color': this.theme.rootNode.backgroundColor,
                    'border-color': this.theme.rootNode.borderColor,
                    'color': this.theme.rootNode.textColor,
                }
            },
            {
                selector: 'node.leaf',
                style: {
                    'font-family': this.theme.leafNode.fontFamily,
                    'font-size': this.theme.leafNode.fontSize,
                    'font-weight': this.theme.leafNode.fontWeight,
                    'background-color': this.theme.leafNode.backgroundColor,
                    'border-color': this.theme.leafNode.borderColor,
                    'color': this.theme.leafNode.textColor,
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 1,
                    'line-color': this.theme.edge.lineColor,
                    'line-style': 'dashed',
                    'line-dash-pattern': [6, 3],
                    'line-dash-offset': 0,
                    'curve-style': 'bezier',
                    'arrow-scale': 0.7,
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': this.theme.edge.arrowColor,
                    'source-label': 'data(weight)',
                    'source-text-margin-x': 8,
                    'source-text-offset': 18,
                    'font-family': this.theme.edge.fontFamily,
                    'font-size': this.theme.edge.fontSize,
                    'font-weight': this.theme.edge.fontWeight,
                    'color': this.theme.edge.textColor,
                }
            }
        ];
    }

    render(nodes: GraphNode[], edges: GraphEdge[], onFinish: CallableFunction) {
        const that = this;

        const snap = cytosnap();
        snap.start().then(function () {
            return snap.shot({
                elements: that.generateCytoscapeElements(nodes, edges),
                layout: that.generateCytoscapeLayout(),
                style: that.generateCytoscapeStyle(),
                resolvesTo: 'base64',
                format: 'png',
                quality: 100,
                width: that.width,
                height: that.height,
                background: that.theme.backgroundColor
            });
        }).then(function (img: any) {
            onFinish({
                base64Data: img
            } as OnFinish);
        });
    }
}

export interface OnFinish {
    base64Data: string;
}