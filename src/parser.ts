import fs from 'fs'
import {Graph, GraphEdge, GraphNode} from "./models";
import {validateAnswerSetsSchema, validateTemplateSchema} from "./schema-validators";
import assert from "assert";

export class GraphParser {
    private readonly template: any;
    private readonly answerSets: any[];

    /**
     * It takes a template object, which is validated with a schema, and an array of answer set.
     */
    constructor(template: any, answerSets: any[]) {
        if (!validateTemplateSchema(template)) {
            assert(validateTemplateSchema.errors);
            const error = validateTemplateSchema.errors[0];
            const path = error.instancePath || "template";
            throw Error("Template is not valid: " + path + " " + error.message);
        }
        this.template = template;

        if (!validateAnswerSetsSchema(answerSets)) {
            assert(validateTemplateSchema.errors);
            const error = validateTemplateSchema.errors[0];
            const path = error.instancePath || "answer sets";
            throw Error("Answer sets are not valid: " + path + " " + error.message);
        }
        this.answerSets = answerSets;
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
        if (!this.answerSets.length) {
            throw Error("Answer set list is empty");
        }
        const nodes = GraphParser.checkAtomsSyntax(options.nodes);
        const edge = GraphParser.checkAtomsSyntax(options.edge);
        const node_atom = new RegExp(nodes[0]+'\(.+\)'), node_ariety = nodes[1];
        const edge_atom = new RegExp(edge[0]+'\(.+\)'), edge_ariety = edge[1];
        let output = [];
        for (var i = 0; i < this.answerSets.length; ++i) {
            const n: string[] = [];
            const a: string[] = [];
            let _as = this.answerSets[i].as;
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
    private static checkAtomsSyntax(node_string: string) {
        if (!/^\S+\/\d+$/.test(node_string)) {
            throw new Error("Template Error: The atom syntax is not syntactically right. Please check it: " + node_string);
        }

        return node_string.split("/");
    }

    /**
     * It takes a template, runs it through the ASP solver, and then parses the output into a list of graphs
     * @returns An array of Graphs.
     */
    answerSetsToGraphs(): Graph[] {
        const answerSets = this.buildOutput(this.template);

        return answerSets.map(as => {
            const nodes: GraphNode[] = as.nodes.map(atom => {
                let variables = atom.split("(")[1].split(")")[0].split(",");
                let name = variables[0];

                return <GraphNode>{
                    name: name
                };
            });

            const edges: GraphEdge[] = as.edge.map(atom => {
                let variables = atom.split("(")[1].split(")")[0].split(",");
                let from = variables[0];
                let destination = variables[1];
                let weight = variables.length >= 3 ? variables[2] : null;

                return <GraphEdge>{
                    from: from,
                    destination: destination,
                    weight: weight
                };
            });

            return <Graph>{
                nodes: nodes,
                edges: edges,
            };
        });
    }
}