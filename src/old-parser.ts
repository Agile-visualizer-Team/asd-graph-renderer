import fs from 'fs'
import {Graph, GraphEdge, GraphNode} from "./models";
import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'
import readlineSync from 'readline-sync'

export class GraphParser {
    private template_path: string;
    private dlv_path: string = "NONE";
    private SYNTAX_ERROR: string = "Template Error: The template file is not syntactically right. Please check it!"
    private argv = yargs(hideBin(process.argv)).options({input: {type: 'boolean', default: false}, json: {type: 'boolean', default: false}},).parseSync();

/**
 * The constructor takes two arguments, a template_path and a dlv_path. If the template_path doesn't
 * exist, it throws an error. If the dlv_path doesn't exist, it throws an error. If the template_path
 * exists, it sets the template_path to the template_path. If the dlv_path exists, it sets the dlv_path
 * to the dlv_path.
 * @param {string} template_path - The path to the template file.
 * @param {string} dlv_path - The path to the dlv executable.
 */
    constructor(template_path: string, dlv_path: string) {
        if (!fs.existsSync(template_path))
            throw Error("Please, check the template_path you have given!");
        if (!fs.existsSync(dlv_path))
            throw Error("Please, check the dlv_path you have given!");
        this.template_path = template_path;
        if(!this.get_input_flag())
            this.dlv_path = dlv_path;
    }

/**
 * It takes a JSON file, and returns a JSON file.
 * @param {string|null} [outputFile=null] - The file to write the output to. If null, the output will
 * be returned as a string.
 * @returns The return value is a Promise.
 */
    getAnswerSet(outputFile: string|null = null) {
        try {
            const options = this.getJSON(this.template_path);
            return this.buildOutput(options, outputFile);
        } catch (err) {
            if (err instanceof Error) {
                throw(err.message);
            }
        }
    }

/**
 * Private get_json_flag(){
 *         return this.argv.json;
 *     }
 * @returns The value of the json property of the argv object.
 */
    private get_json_flag(){
        return this.argv.json;
    }

/**
 * Private get_input_flag(){
 *         return this.argv.input;
 *     }
 * @returns The input flag.
 */
    private get_input_flag(){
        return this.argv.input;
    }

/**
 * It takes a JSON object with two properties, nodes and edge, and returns an array of JSON objects
 * with two properties, nodes and edge. The nodes and edge properties are arrays of strings. The
 * strings are atoms. The atoms are extracted from the answer sets of a dlv program. The dlv program is
 * generated from the JSON object
 * @param {any} options - {
 * @param {string|null} [outputFile=null] - the file to write the output to. If null, the output is
 * returned as a string.
 * @returns An array of objects. Each object has two properties: nodes and edge.
 */
    private buildOutput(options: any, outputFile: string|null = null) {
        const nodes = this.checkAtomsSyntax(options.nodes);
        const edge = this.checkAtomsSyntax(options.edge);
        const node_atom = new RegExp(nodes[0]+'\(.+\)'), node_ariety = nodes[1];
        const edge_atom = new RegExp(edge[0]+'\(.+\)'), edge_ariety = edge[1];
        const answerSet = this.getJSON(this.dlv_path);
        let output = [];
        for (var i = 0; i < answerSet.length; ++i) {
            const n: string[] = [];
            const a: string[] = [];
            let _as = answerSet[i].as;
            for (var j = 0; j < _as.length; ++j) {
                if (node_atom.test(_as[j]) && _as[j].split(",").length == node_ariety) 
                    n.push(_as[j]);               
                else if (edge_atom.test(_as[j]) && _as[j].split(",").length == edge_ariety)
                    a.push(_as[j]);
            }
            if (n.length != 0) {
                output.push({"nodes": n, "edge": a})
            }
        }
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
        }
        return output
    }

/**
 * If the user has specified that they want to input the JSON file in the command line, then we ask them for the JSON file,
 * otherwise we just require it.
 * @param {string} path - The path to the JSON file.
 * @returns The return value is a JSON object.
 */
    getJSON(path: string){
        if(this.get_input_flag() && path === this.dlv_path){
            var res = readlineSync.question('');
            return JSON.parse(res);
        }

        return require(path);
    }

/**
 * "If the node_string doesn't match the regex, throw an error. Otherwise, return the node_string split
 * by the slash."
 * 
 * The regex is a simple check to make sure the node_string is in the format of "node/1".
 * 
 * The function is private because it's only used internally by the class.
 * 
 * @param {string} node_string - The string that is being checked for syntax.
 * @returns The return value is an array of strings.
 */
    private checkAtomsSyntax(node_string: string) {
        if (!/^\S+\/\d+$/.test(node_string)) {
            throw new Error(this.SYNTAX_ERROR);
        }

        return node_string.split("/");
    }
}