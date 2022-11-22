import {GraphRenderer, OnRenderingComplete} from "./renderer";
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
        parser.answerSetsToGraphs().forEach((graph: Graph, index) => {
            if (callbacks) {
                callbacks.onBeforeRendering(graph, index);
            }

            renderer.render(graph).then((img: OnRenderingComplete) => {
                if (callbacks) {
                    callbacks.onAfterRendering(graph, index, img.base64Data);
                }
                const filename = 'graph-' + index + '-' + Date.now() + '.png';
                const filepath = this.outputDirPath + '/' + filename;
                fs.writeFileSync(filepath, img.base64Data, 'base64');
                if (callbacks) {
                    callbacks.onFileSaved(graph, index, filename);
                }
            });
        });
    }
}

export interface RunCallbacks {
    onBeforeRendering: (graph: Graph, index: number) => void;
    onAfterRendering: (graph: Graph, index: number, imgBase64: string) => void;
    onFileSaved: (graph: Graph, index: number, filename: string) => void;
}