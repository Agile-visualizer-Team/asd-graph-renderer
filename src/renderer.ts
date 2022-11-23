import {Graph} from "./models";
import {GraphRendererTheme, VSCODE_THEME} from "./renderer-themes";
import {GraphRendererLayout} from "./renderer-layout";

declare function require(name: string): any;
const cytosnap = require('cytosnap');
cytosnap.use(['cytoscape-dagre', 'cytoscape-klay']);

export class GraphRenderer {
    width: number = 800;
    height: number = 600;
    theme: GraphRendererTheme = VSCODE_THEME;
    layout: GraphRendererLayout = GraphRendererLayout.Tree;

    private generateCytoscapeElements(graph: Graph): object[] {
        const elements: any[] = [];

        // TODO nodi colorabili
        graph.nodes.forEach(n => {
            const classes: string[] = [];
            if (!graph.edges.find(e => e.destination == n.name)) {
                classes.push('root');
            } else if (!graph.edges.find(e => e.from == n.name)) {
                classes.push('leaf');
            }

            let shape, width, height;
            if (n.name.length > 1) {
                shape = "round-rectangle";
                width = n.name.length * this.theme.node.roundRectangle.widthMultiplier;
                height = this.theme.node.roundRectangle.heightMultiplier;
            } else {
                shape = "ellipse";
                width = this.theme.node.ellipse.sizeMultiplier;
                height = this.theme.node.ellipse.sizeMultiplier;
            }

            elements.push({
                data: {
                    id: n.name,
                    label: n.name,
                    shape: shape,
                    width: width,
                    height: height
                },
                classes: classes
            });
        });

        // TODO edgei colorabili
        // TODO edgei non orientati
        graph.edges.forEach(e => {
            elements.push({
                data: {
                    id: e.from + '-' + e.destination,
                    source: e.from,
                    target: e.destination,
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
                name: 'dagre',
                edgeSep: 50,
                rankDir: 'TB',
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
                    'label': 'data(label)',
                    'background-color': this.theme.node.backgroundColor,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'border-width': '1px',
                    'border-color': this.theme.node.borderColor,
                    'color': this.theme.node.textColor,
                    'padding': '0 0 0 100px',
                    'width': 'data(width)',
                    'height': 'data(height)',
                    'shape': 'data(shape)'
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
                    'source-text-offset': 18,
                    'font-family': this.theme.edge.fontFamily,
                    'font-size': this.theme.edge.fontSize,
                    'font-weight': this.theme.edge.fontWeight,
                    'color': this.theme.edge.textColor,
                    'text-background-shape': 'round-rectangle',
                    'text-background-padding': '1px',
                    'text-background-color': this.theme.backgroundColor,
                    "text-background-opacity": 1,
                }
            }
        ];
    }

    render(graph: Graph): Promise<OnRenderingComplete> {
        const that = this;

        return new Promise<OnRenderingComplete>((resolve) => {
            const snap = cytosnap(); // TODO testare su ubuntu
            snap.start().then(function () {
                return snap.shot({
                    elements: that.generateCytoscapeElements(graph),
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
                snap.stop();
                resolve(<OnRenderingComplete>{
                    base64Data: img
                } as OnRenderingComplete);
            });
        })
    }
}

export interface OnRenderingComplete {
    base64Data: string;
}