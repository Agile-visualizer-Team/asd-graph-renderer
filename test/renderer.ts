import {GraphRenderer, OnFinish} from "../src/renderer";
import {VSCODE_THEME} from "../src/renderer-themes";
import {GraphRendererLayout} from "../src/renderer-layout";
import {Graph, GraphEdge, GraphNode} from "../src/models";
import * as assert from "assert";
import * as fs from "fs";
import path from "path";

describe("Renderer_Test", function () {
    this.timeout(100000);

    it("should generate the correct image base64 data according to the input graph and a pre-rendered image", (done) => {
        const nodes: GraphNode[] = [new GraphNode("a"), new GraphNode("b")];
        const edges: GraphEdge[] = [new GraphEdge(nodes[0], nodes[1])];
        const graph = new Graph(nodes, edges);

        const renderer = new GraphRenderer();
        renderer.width = 1280;
        renderer.height = 1280;
        renderer.theme = VSCODE_THEME;
        renderer.layout = GraphRendererLayout.Tree;
        renderer.render(graph).then((img: OnFinish) => {
            let expectedBase64 = fs.readFileSync(path.join(__dirname, "renderer_base64_img"), {encoding:'utf8', flag:'r'});
            let generatedBase64 = img.base64Data;
            assert.equal(generatedBase64, expectedBase64);
            done();
        });
    });
});
