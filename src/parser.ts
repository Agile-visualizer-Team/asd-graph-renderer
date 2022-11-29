import fs from 'fs'
import {createGraphEdge, createGraphNode, Graph, GraphEdge, GraphNode} from "./models";
import {validateAnswerSetsSchema, validateTemplateSchema} from "./schema-validators";
import assert from "assert";

export class GraphParser {
    private readonly template: any;
    private readonly answerSets: any[];
    private readonly MANDATORY_NODE_VARIABLE: string[] = ["label"];
    private readonly MANDATORY_EDGE_VARIABLE: string[] = ["from", "to"];
    /**
     * It takes a template object, which is validated with a schema, and an array of answer set.
     */
    private check_variables_name(variables: string[],mandatory_variables: string[]){
        //TODO Remember to make case insensitive
        const check = mandatory_variables.every(value =>{
            return variables.includes(value);
        })
        if(!check)
            throw Error(`Variables provided: \"${variables}\" must contain \"${mandatory_variables}\"`)
    }

    constructor(template: any, answerSets: any[]) {
        if (!validateTemplateSchema(template)) {
            assert(validateTemplateSchema.errors);
            const error = validateTemplateSchema.errors[0];
            const path = error.instancePath || "template";
            throw Error("Template is not valid: " + path + " " + error.message);
        }
        this.template = template;
        this.check_variables_name(this.template.nodes.atom.variables,this.MANDATORY_NODE_VARIABLE);
        this.check_variables_name(this.template.edges.atom.variables, this.MANDATORY_EDGE_VARIABLE);

        if (!validateAnswerSetsSchema(answerSets)) {
            assert(validateAnswerSetsSchema.errors);
            const error = validateAnswerSetsSchema.errors[0];
            const path = error.instancePath || "answer sets";
            throw Error("Answer sets are not valid: " + path + " " + error.message);
        }
        if (!answerSets.length) {
            throw Error("Answer set list is empty");
        }
        this.answerSets = answerSets;
    }

    /**
     * It takes a JSON object with two properties, nodes and edges, and returns an array of JSON objects
     * with two properties, nodes and edges. The nodes and edges properties are arrays of strings. The
     * strings are atoms. The atoms are extracted from the answer sets of a dlv program. The dlv program is
     * generated from the JSON object
     * @param {any} options - {
     * @param {string|null} [outputFile=null] - the file to write the output to. If null, the output is
     * returned as a string.
     * @returns An array of objects. Each object has two properties: nodes and edges.
     */
    private buildOutput(options: any, outputFile: string|null = null){
        const node_atom = new RegExp(options.nodes.atom.name+'\(.+\)'), node_ariety = +options.nodes.atom.variables.length;
        const edge_atom = new RegExp(options.edges.atom.name+'\(.+\)'), edge_ariety = +options.edges.atom.variables.length;
        let output: any = [];
        this.answerSets.forEach( answerSet => {
            const n: string[] = [];
            const a: string[] = [];
            answerSet.as.forEach((atom: string) => {
                if(node_atom.test(atom) && atom.split(",").length == node_ariety)
                    n.push(atom);
                else if(edge_atom.test(atom) && atom.split(",").length == edge_ariety)
                    a.push(atom);
            })
            if (n.length != 0) {
                output.push({"nodes": n, "edges": a})
            }
        })
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
        }
        return output
    }
    /**
     * It takes a template, runs it through the ASP solver, and then parses the output into a list of graphs
     * @returns An array of Graphs.
     */
    answerSetsToGraphs(): Graph[] {
        const answerSets = this.buildOutput(this.template);
        const node_variables = this.get_node_variables(this.template.nodes.atom.variables);
        const edge_variables = this.get_edge_variables(this.template.edges.atom.variables);
        return answerSets.map((as:any) => {
            const nodes: GraphNode[] = as.nodes.map((atom:string) => {
                return this.create_node(atom,node_variables);
            });

            const edges: GraphEdge[] = as.edges.map((atom:string) => {
                return this.create_edge(atom, edge_variables);
            });

            if (this.template.nodes.style.color) {
                nodes.filter(n => !n.color).forEach(n => {
                    if (!edges.find(e => e.destination == n.name)) {
                        n.color = this.template.nodes.style.color.root;
                    } else if (!edges.find(e => e.from == n.name)) {
                        n.color = this.template.nodes.style.color.leaves;
                    } else {
                        n.color = this.template.nodes.style.color.nonRoot;
                    }
                });
            }

            if (this.template.edges.style.color) {
                edges.filter(e => !e.color).forEach(n => {
                    n.color = this.template.edges.style.color.branch
                });
            }

            return <Graph>{
                nodes: nodes,
                edges: edges,
                oriented: this.template.edges.style
                    ? this.template.edges.style.oriented
                    : false
            };
        });
    }

    private get_node_variables(variables: string[]){
        return {
            name: variables.indexOf('label'),
            color: variables.indexOf('color')
        }
    }

    private get_edge_variables(variables: string[]){
        return {
            from: variables.indexOf('from'),
            to: variables.indexOf('to'),
            weight: variables.indexOf('weight'),
            color: variables.indexOf('color')
        }
    }

    private create_node(node: string, variables: any): GraphNode{
        let node_var = node.split("(")[1].split(")")[0].split(",");
        const node_name = node_var[variables['name']]

        return createGraphNode({
            name: node_name,
            color: variables['color'] != -1 ? node_var[variables['color']] : null
        });
    }

    private create_edge(edge: string, variables: any): GraphEdge{   
        let edge_var = edge.split("(")[1].split(")")[0].split(",");
        const edge_from = edge_var[variables['from']];
        const edge_to = edge_var[variables['to']];
        const edge_weight = variables['weight'] != -1? edge_var[variables['weight']]: null;

        return createGraphEdge({
            from: edge_from,
            destination: edge_to,
            weight: edge_weight,
            color: variables['color'] != -1 ? edge_var[variables['color']] : null,
        });
    }
}