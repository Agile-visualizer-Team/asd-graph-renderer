import path from "path";
import yargs from "yargs";
import {GraphImagesGenerator} from "./generator";
import fs from "fs";
import {Graph} from "./models";

class GraphScript {
    constructor() {
        try {
            this.run();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.log('an error occurred: ', error);
            }
        }
    }

    private run() {
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
                    GraphScript.runImagesGenerator(template, answerSets, outputDirPath);
                })
            .command('fromstr',
                'generate the graph image from json string inputs', (yargs) => {
                    return yargs
                        .option('template', {
                            describe: 'the input json template',
                            type: 'string',
                            required: true
                        })
                        .option('as', {
                            describe: 'the input json answer sets',
                            type: 'string',
                            required: true
                        })
                        .option('output', {
                            describe: 'the output dir path',
                            type: 'string',
                            required: true
                        })
                }, (argv) => {
                    console.log(`Using input template json (${argv.template.length} chars)...`);
                    console.log(`Using input answer set json  (${argv.as.length} chars)...`);
                    console.log(`Using ${argv.output} as output directory...`);
                    console.log();

                    const template = GraphScript.jsonStringToObject(argv.template);
                    const answerSets = GraphScript.jsonStringToObject(argv.as);
                    const outputDirPath = path.join(FILE_PATHS_RELATIVE_TO, argv.output);
                    GraphScript.runImagesGenerator(template, answerSets, outputDirPath);
                })
            .version(false)
            .parseSync();
    }

    private static jsonFileToObject(path: string) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    private static jsonStringToObject(jsonStr: string) {
        return JSON.parse(jsonStr);
    }

    private static runImagesGenerator(template: any, answerSets: any[], outputDirPath: string) {
        new GraphImagesGenerator(template, answerSets, outputDirPath).run({
            onBeforeRendering: (graph: Graph, index: number) => {
                console.log(`Rendering graph ${index}...`);
            },
            onAfterRendering: (graph: Graph, index: number, imgBase64: string) => {
                console.log(`Graph ${index} rendered successfully...`);
            },
            onFileSaved: (graph: Graph, index: number, filename: string) => {
                console.log(`Graph ${index} saved as ${filename}`);
            }
        });
    }
}

if (require.main === module) {
    new GraphScript();
}