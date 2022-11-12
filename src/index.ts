import {GraphRenderer, OnFinish} from "./graph-renderer";
import {GraphEdge, GraphNode} from "./graph-models";
import fs from "fs";
import {VSCODE_THEME} from "./graph-renderer-themes";
import {GraphRendererLayout} from "./graph-renderer-layout";

const renderer = new GraphRenderer();
renderer.width = 1280;
renderer.height = 1280;
renderer.theme = VSCODE_THEME;
renderer.layout = GraphRendererLayout.Tree;

const nodeA = new GraphNode("a"),
    nodeB = new GraphNode("b"),
    nodeC = new GraphNode("c"),
    nodeD = new GraphNode("d"),
    nodeE = new GraphNode("e"),
    nodeF = new GraphNode("f");

const nodes: GraphNode[] = [
    nodeA, nodeB, nodeC,
    nodeD, nodeE, nodeF
];

const edges: GraphEdge[] = [
    new GraphEdge(nodeA, nodeB),
    new GraphEdge(nodeA, nodeC),
    new GraphEdge(nodeB, nodeD),
    new GraphEdge(nodeB, nodeE),
    new GraphEdge(nodeB, nodeF),
    new GraphEdge(nodeC, nodeD)
];

renderer.render(nodes, edges, (img: OnFinish) => {
    const filepath = 'output/graph-' + Date.now() + '.png';

    fs.writeFile(filepath, img.base64Data, 'base64', function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Graph saved as ' + filepath);
        }
        process.exit(1);
    });
});