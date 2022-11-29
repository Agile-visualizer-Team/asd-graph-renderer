import path from "path";
import yargs from "yargs";
import fs from "fs";
import readlineSync from "readline-sync";
import {GraphRenderer} from "./renderer";
import {VSCODE_THEME} from "./renderer-themes";
import {GraphRendererLayout} from "./renderer-layout";
import {GraphParser} from "./parser";

class GraphScript {
    constructor() {
        try {
            this.runCliScript();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.log('an error occurred: ', error);
            }
        }
    }

    private static jsonFileToObject(path: string) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    private static jsonStringToObject(jsonStr: string) {
        return JSON.parse(jsonStr);
    }

    private runCliScript() {
        const FILE_PATHS_RELATIVE_TO = process.cwd();

        yargs
            .command('fromfile',
                'generate the graph image from files', (yargs) => {
                    return yargs
                        .option('template', {
                            describe: 'the input json template file path',
                            type: 'string',
                            required: true
                        })
                        .option('as', {
                            describe: 'the input json answer sets file path',
                            type: 'string',
                            required: true
                        })
                        .option('output', {
                            describe: 'the output dir path',
                            type: 'string',
                            required: true
                        })
                }, (argv) => {
                    console.log(`Using <<${argv.template}>> as template file...`);
                    console.log(`Using <<${argv.as}>> as answer set file...`);
                    console.log(`Using <<${argv.output}>> as output directory...`);
                    console.log();

                    const template = GraphScript.jsonFileToObject(path.join(FILE_PATHS_RELATIVE_TO, argv.template));
                    const answerSets = GraphScript.jsonFileToObject(path.join(FILE_PATHS_RELATIVE_TO, argv.as));
                    const outputDirPath = path.join(FILE_PATHS_RELATIVE_TO, argv.output);
                    GraphScript.runRendering(template, answerSets, outputDirPath);
                })
            .command('fromstr',
                'generate the graph image from json string inputs', (yargs) => {
                    return yargs
                        .option('template', {
                            describe: 'the input json template file path',
                            type: 'string',
                            required: true
                        })
                        .option('output', {
                            describe: 'the output dir path',
                            type: 'string',
                            required: true
                        })
                }, (argv) => {
                    const jsonStr = readlineSync.question('');

                    console.log();
                    console.log(`Using <<${argv.template}>> as template file...`);
                    console.log(`Using answer set json from stdin (${jsonStr.length} chars)...`);
                    console.log(`Using ${argv.output} as output directory...`);
                    console.log();

                    const template = GraphScript.jsonFileToObject(path.join(FILE_PATHS_RELATIVE_TO, argv.template));
                    const answerSets = GraphScript.jsonStringToObject(jsonStr);
                    const outputDirPath = path.join(FILE_PATHS_RELATIVE_TO, argv.output);
                    GraphScript.runRendering(template, answerSets, outputDirPath);
                })
            .version(false)
            .parseSync();
    }

    private static runRendering(template: any, answerSets: any[], outputDirPath: string) {
        const renderer = new GraphRenderer();
        renderer.width = 1280;
        renderer.height = 1280;
        renderer.theme = VSCODE_THEME;
        renderer.layout = GraphRendererLayout.Dagre;
        renderer.outputType = 'base64';

        const parser = new GraphParser(template, answerSets);
        const graphs = parser.answerSetsToGraphs();

        renderer.render(graphs, (index, graph) => {
            console.log(`Rendering graph ${index}...`);
        }, (index, graph, output) => {
            console.log(`Graph ${index} rendered successfully...`);
            const filename = 'graph-' + index + '-' + Date.now() + '.png';
            const filepath = outputDirPath + '/' + filename;

            if (!fs.existsSync(outputDirPath)){
                fs.mkdirSync(outputDirPath, {
                    recursive: true
                });
            }

            fs.writeFileSync(filepath, output, 'base64');
            console.log(`Graph ${index} saved as ${filename}`);
        });
    }
}

if (require.main === module) {
    new GraphScript();
}