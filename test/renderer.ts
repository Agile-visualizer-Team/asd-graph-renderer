import {GraphRenderer} from "../src/renderer";
import {VSCODE_THEME} from "../src/renderer-themes";
import {GraphRendererLayout} from "../src/renderer-layout";
import {Graph, GraphEdge, GraphNode} from "../src/models";
import * as assert from "assert";
import * as fs from "fs";
import path from "path";
import {expect} from "chai";

function getMockedGraph(): Graph {
    const nodes: GraphNode[] = [
        <GraphNode>{
            name: "a",
            color: "red"
        },
        <GraphNode> {
            name: "foo",
            color: "blue"
        }
    ];
    const edges: GraphEdge[] = [
        {
            from: "a",
            destination: "foo",
            weight: null,
            color: "orange"
        }
    ];
    return <Graph>{
        nodes: nodes,
        edges: edges,
        oriented: true
    };
}

describe("RENDERER TEST", function () {
    this.timeout(100000);

    it("should generate the correct output image according to an input graph and a pre-rendered expected image", (done) => {
        const graph = getMockedGraph();
        const renderer = new GraphRenderer();
        renderer.width = 1280;
        renderer.height = 1280;
        renderer.theme = VSCODE_THEME;
        renderer.layout = GraphRendererLayout.Dagre;
        renderer.render([graph], () => {},
            (index, graph, generatedBase64) => {
            let testImagePath = path.join(__dirname, "renderer-expected-image.png");
            let expectedBase64 = fs.readFileSync(testImagePath).toString('base64');
            assert.equal(generatedBase64, expectedBase64);
            done();
        });
    });

    it("should throw an exception if the layout type is not supported", () => {
        const graph = getMockedGraph();
        const renderer = new GraphRenderer();
        renderer.layout = GraphRendererLayout.Klay;
        expect(() => {
            renderer.render([graph]);
        }).to.throw(Error, "Unsupported layout type");
    });

    it("should map a generic color name to the one mapped by the template", () => {
        const renderer = new GraphRenderer();
        renderer.theme = VSCODE_THEME;
        expect(renderer.convertColorWithThemePalette('red')).to.be.equal(VSCODE_THEME.palette.red);
    });

    it("should not map a generic color name which is not supported by the template", () => {
        const renderer = new GraphRenderer();
        renderer.theme = VSCODE_THEME;
        expect(renderer.convertColorWithThemePalette('cornflowerblue')).to.be.equal('cornflowerblue');
    });
});
