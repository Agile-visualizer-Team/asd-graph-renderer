import {GraphRenderer} from "./renderer";
import {Graph} from "./models";
import fs from "fs";
import {VSCODE_THEME} from "./renderer-themes";
import {GraphRendererLayout} from "./renderer-layout";
import {GraphParser} from "./parser";

export class GraphImagesGenerator {
    private readonly template: any;
    private readonly answerSets: any[];
    private readonly outputDirPath: string;

    constructor(template: any, answerSets: any[], outputDirPath: string) {
        this.template = template;
        this.answerSets = answerSets;
        this.outputDirPath = outputDirPath;
    }

    run(callbacks?: RunCallbacks) {
        const renderer = new GraphRenderer();
        renderer.width = 1280;
        renderer.height = 1280;
        renderer.theme = VSCODE_THEME;
        renderer.layout = GraphRendererLayout.Tree;

        const parser = new GraphParser(this.template, this.answerSets);
        const graphs = parser.answerSetsToGraphs();

        renderer.render(graphs, (index, graph) => {
            if (callbacks) {
                callbacks.onBeforeRendering(graph, index);
            }
        }, (index, graph, base64Data) => {
            if (callbacks) {
                callbacks.onAfterRendering(graph, index, base64Data);
            }
            const filename = 'graph-' + index + '-' + Date.now() + '.png';
            const filepath = this.outputDirPath + '/' + filename;
            // TODO fix: se la cartella outputDirPath non esiste, va creata
            fs.writeFileSync(filepath, base64Data, 'base64');
            if (callbacks) {
                callbacks.onFileSaved(graph, index, filename);
            }
        });
    }
}

export interface RunCallbacks {
    onBeforeRendering: (graph: Graph, index: number) => void;
    onAfterRendering: (graph: Graph, index: number, imgBase64: string) => void;
    onFileSaved: (graph: Graph, index: number, filename: string) => void;
}