import {GraphRenderer} from "../src/renderer";
import {VSCODE_THEME} from "../src/renderer-themes";
import {Graph, GraphEdge, GraphNode} from "../src/models";
import {expect} from "chai";

function getMockedGraph(): Graph {
    const nodes: GraphNode[] = [
        {
            label: "a",
            color: "red",
            templateIndex: 0,
            variables: {
                label: "a",
                color: "red",
            }
        },
        {
            label: "foo",
            color: "blue",
            templateIndex: 0,
            variables: {
                label: "foo",
                color: "blue",
            }
        }
    ];
    const edges: GraphEdge[] = [
        {
            from: "a",
            to: "foo",
            weight: null,
            color: "orange",
            templateIndex: 0,
            oriented: true,
            variables: {
                from: "a",
                to: "foo",
                weight: null,
                color: "orange",
            }
        }
    ];
    return <Graph>{
        nodes: nodes,
        edges: edges,
        layout: "dagre"
    };
}

describe("RENDERER TEST", function () {
    this.timeout(30000);

    it("should generate an output image according to an input graph", (done) => {
        const graph = getMockedGraph();
        const renderer = new GraphRenderer();
        renderer.width = 1280;
        renderer.height = 1280;
        renderer.theme = VSCODE_THEME;
        renderer.render([graph], () => {},
            (index, graph, generatedBase64) => {
            try {
                expect(generatedBase64).to.not.be.empty;
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("should render a graph with dagre", () => {
        const graph = getMockedGraph();
        graph.layout = "dagre";
        expect(() => new GraphRenderer().generateCytoscapeLayout(graph)).to.not.throw(Error, "Unsupported layout type");
    });

    it("should render a graph with avsdf", () => {
        const graph = getMockedGraph();
        graph.layout = "avsdf";
        expect(() => new GraphRenderer().generateCytoscapeLayout(graph)).to.not.throw(Error, "Unsupported layout type");
    });

    it("should not render a graph with an invalid layout and throw an error", () => {
        const graph = getMockedGraph();
        graph.layout = "";
        expect(() => new GraphRenderer().generateCytoscapeLayout(graph)).to.throw(Error, "Unsupported layout type");
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
