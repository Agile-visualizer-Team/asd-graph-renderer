"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_renderer_1 = require("./graph-renderer");
const graph_models_1 = require("./graph-models");
const fs_1 = __importDefault(require("fs"));
const graph_renderer_themes_1 = require("./graph-renderer-themes");
const graph_renderer_layout_1 = require("./graph-renderer-layout");
const renderer = new graph_renderer_1.GraphRenderer();
renderer.width = 1280;
renderer.height = 1280;
renderer.theme = graph_renderer_themes_1.VSCODE_THEME;
renderer.layout = graph_renderer_layout_1.GraphRendererLayout.Tree;
const nodeA = new graph_models_1.GraphNode("a"), nodeB = new graph_models_1.GraphNode("b"), nodeC = new graph_models_1.GraphNode("c"), nodeD = new graph_models_1.GraphNode("d"), nodeE = new graph_models_1.GraphNode("e"), nodeF = new graph_models_1.GraphNode("f");
const nodes = [
    nodeA, nodeB, nodeC,
    nodeD, nodeE, nodeF
];
const edges = [
    new graph_models_1.GraphEdge(nodeA, nodeB),
    new graph_models_1.GraphEdge(nodeA, nodeC),
    new graph_models_1.GraphEdge(nodeB, nodeD),
    new graph_models_1.GraphEdge(nodeB, nodeE),
    new graph_models_1.GraphEdge(nodeB, nodeF),
    new graph_models_1.GraphEdge(nodeC, nodeD)
];
renderer.render(nodes, edges, (img) => {
    fs_1.default.writeFile('output/graph.png', img.base64Data, 'base64', function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('File saved as output/graph.png');
        }
        process.exit(1);
    });
});
