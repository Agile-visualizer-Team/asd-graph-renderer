import {GraphEdge, GraphNode} from "./graph-models";
import {GraphRendererTheme, VSCODE_THEME} from "./graph-renderer-themes";
import {GraphRendererLayout} from "./graph-renderer-layout";

declare function require(name: string): any;
const cytosnap = require('cytosnap');
cytosnap.use(['cytoscape-dagre', 'cytoscape-klay']);

// TODO add custom font (Cascadia is the vsccode default font)

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
                    target: e.destination.label
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

        console.error("Unsupported layout, using graph layout");
        this.layout = GraphRendererLayout.Graph;
        return this.generateCytoscapeLayout();
    }

    private generateCytoscapeStyle() {
        return [
            {
                selector: 'node',
                style: {
                    'font-family': 'Arial',
                    'font-size': '18px',
                    'font-weight': '400',
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
                    'background-color': this.theme.rootNode.backgroundColor,
                    'border-color': this.theme.rootNode.borderColor,
                    'color': this.theme.rootNode.textColor,
                }
            },
            {
                selector: 'node.leaf',
                style: {
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
                    'target-arrow-color': this.theme.edge.arrowColor
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