import path from "path";
import yargs from "yargs";
import {GraphImagesGenerator} from "./generator";
import fs from "fs";
import {Graph} from "./models";

class GraphScript {
    private DEFAULT_INPUT_TEMPLATE_PATH = '../template.json';
    private DEFAULT_INPUT_ANSWER_SET_PATH = '../as.json';
    private DEFAULT_OUTPUT_PATH = '../output';

    constructor() {
        yargs
            .command('fromfile [template_path] [answer_set_path] [output_dir_path]',
                'generate the graph image from files', (yargs) => {
                return yargs
                    .positional('template_path', {
                        describe: 'the input json template file path',
                        type: 'string',
                        default: this.DEFAULT_INPUT_TEMPLATE_PATH
                    })
                    .positional('answer_set_path', {
                        describe: 'the input json answer set file path',
                        type: 'string',
                        default: this.DEFAULT_INPUT_ANSWER_SET_PATH
                    })
                    .positional('output_dir_path', {
                        describe: 'the output dir path',
                        type: 'string',
                        default: this.DEFAULT_OUTPUT_PATH
                    })
            }, (argv) => {
                console.log(`Using <<${argv.template_path}>> as template file...`);
                console.log(`Using <<${argv.answer_set_path}>> as answer set file...`);
                console.log(`Using <<${argv.output_dir_path}>> as output directory...`);
                console.log();

                const template = GraphScript.jsonFileToObject(path.join(__dirname, argv.template_path));
                const answerSets = GraphScript.jsonFileToObject(path.join(__dirname, argv.answer_set_path));
                const outputDirPath = path.join(__dirname, argv.output_dir_path);
                GraphScript.generateImages(template, answerSets, outputDirPath);
            })
            .command('fromstr [template_json] [answer_set_json] [output_dir_path]',
                'generate the graph image from json string inputs', (yargs) => {
                return yargs
                    .positional('template_json', {
                        describe: 'the input json template',
                        type: 'string',
                        default: '{}'
                    })
                    .positional('answer_set_json', {
                        describe: 'the input json answer set',
                        type: 'string',
                        default: '{}'
                    })
                    .positional('output_dir_path', {
                        describe: 'the output dir path',
                        type: 'string',
                        default: this.DEFAULT_OUTPUT_PATH
                    })
            }, (argv) => {
                console.log(`Using stdin template json (${argv.template_json.length} chars)...`);
                console.log(`Using stdin answer set json  (${argv.answer_set_json.length} chars)...`);
                console.log(`Using ${argv.output_dir_path} as output directory...`);
                console.log();

                const template = GraphScript.jsonStringToObject(argv.template_json);
                const answerSets = GraphScript.jsonStringToObject(argv.answer_set_json);
                const outputDirPath = path.join(__dirname, argv.output_dir_path);
                GraphScript.generateImages(template, answerSets, outputDirPath);
            })
        .parseSync();
    }

    private static jsonFileToObject(path: string) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    private static jsonStringToObject(jsonStr: string) {
        return JSON.parse(jsonStr);
    }

    private static generateImages(template: any, answerSets: any[], outputDirPath: string) {
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.log('an error occurred: ', error);
            }
        }
    }
}

if (require.main === module) {
    new GraphScript();
}