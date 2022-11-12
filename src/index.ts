import {GraphRenderer, OnFinish} from "./graph-renderer";
import {GraphEdge, GraphNode} from "./graph-models";
import fs from "fs";
import {VSCODE_THEME} from "./graph-renderer-themes";
import {GraphRendererLayout} from "./graph-renderer-layout";

// TODO add tests (e.g. image output file checksum)
// TODO integrate with dlv answer set parser

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
    nodeF = new GraphNode("f"),
    nodeG = new GraphNode("g");

const nodes: GraphNode[] = [
    nodeA, nodeB, nodeC,
    nodeD, nodeE, nodeF, nodeG
];

const edges: GraphEdge[] = [
    new GraphEdge(nodeA, nodeB, "1"),
    new GraphEdge(nodeA, nodeC, "5"),
    new GraphEdge(nodeB, nodeD, "2"),
    new GraphEdge(nodeB, nodeE, "4"),
    new GraphEdge(nodeB, nodeF, "7"),
    new GraphEdge(nodeC, nodeD, "10"),
    new GraphEdge(nodeD, nodeG, "8")
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