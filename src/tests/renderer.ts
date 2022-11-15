import {GraphRenderer, OnFinish} from "../renderer";
import {VSCODE_THEME} from "../renderer-themes";
import {GraphRendererLayout} from "../renderer-layout";
import {Graph, GraphEdge, GraphNode} from "../models";
import * as assert from "assert";
import * as fs from "fs";

// describe("Renderer_Test", function () {
//     this.timeout(100000);
//
//     it("should generate the correct image base64 data according to the input graph", (done) => {
//         const nodes: GraphNode[] = [new GraphNode("a"), new GraphNode("b")];
//         const edges: GraphEdge[] = [new GraphEdge(nodes[0], nodes[1])];
//         const graph = new Graph(nodes, edges);
//
//         const renderer = new GraphRenderer();
//         renderer.width = 1280;
//         renderer.height = 1280;
//         renderer.theme = VSCODE_THEME;
//         renderer.layout = GraphRendererLayout.Tree;
//         renderer.render(graph).then((img: OnFinish) => {
//             let expectedBase64 = fs.readFileSync('base64-renderer-graph');
//             let generatedBase64 = img.base64Data;
//             assert.equal(generatedBase64, expectedBase64);
//             done();
//         });
//     });
// });
