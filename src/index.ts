import {GraphRenderer, OnFinish} from "./renderer";
import {Graph} from "./models";
import fs from "fs";
import {VSCODE_THEME} from "./renderer-themes";
import {GraphRendererLayout} from "./renderer-layout";
import {GraphParser} from "./parser";
import * as path from "path";
import yargs from "yargs";

const argv = yargs
    .option('template', {
        description: 'the json template config file',
        alias: 't',
        type: 'string'
    })
    .option('answer_set', {
        description: 'the json answer set file',
        alias: 'a',
        type: 'string'
    })
    .option('output_dir', {
        description: 'the output dir',
        alias: 'o',
        type: 'string'
    }).parseSync();

const renderer = new GraphRenderer();
renderer.width = 1280;
renderer.height = 1280;
renderer.theme = VSCODE_THEME;
renderer.layout = GraphRendererLayout.Tree;

const templatePath = argv.template || path.join(__dirname, "../input/example-template.json");
const answerSetPath = argv.answer_set || path.join(__dirname, "../input/example-wrapper.json");
const outputDirPath = argv.output_dir || path.join(__dirname, "../output");
const graphParser = new GraphParser(templatePath, answerSetPath);

console.log("Using " + templatePath + " as template file...");
console.log("Using " + answerSetPath + " as answer set file...");
console.log("Using " + outputDirPath + " as output directory...");

try {
    graphParser.toGraphs().forEach((graph: Graph, index) => {
        console.log(`Rendering graph ${index}...`);

        renderer.render(graph).then((img: OnFinish) => {
            const filename = 'graph-' + index + '-' + Date.now() + '.png';
            const filepath = outputDirPath + '/' + filename;
            fs.writeFileSync(filepath, img.base64Data, 'base64');
            console.log(`Graph ${index} saved as ${filename}`);
        });
    });
} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.log('an error occurred: ', error);
    }
}