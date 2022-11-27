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
        this.check_variables_name(this.template.edge.atom.variables, this.MANDATORY_EDGE_VARIABLE);

        if (!validateAnswerSetsSchema(answerSets)) {
            assert(validateTemplateSchema.errors);
            const error = validateTemplateSchema.errors[0];
            const path = error.instancePath || "answer sets";
            throw Error("Answer sets are not valid: " + path + " " + error.message);
        }
        if (!answerSets.length) {
            throw Error("Answer set list is empty");
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
    private oldbuildOutput(options: any, outputFile: string|null = null) {    
        const nodes = options.node;
        const edge = options.edge;
        const node_atom = new RegExp(nodes[0]+'\(.+\)'), node_ariety = +nodes[1];
        const edge_atom = new RegExp(edge[0]+'\(.+\)'), edge_ariety = +edge[1];
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
                output.push({"nodes": n, "edge": a})
            }
        })
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
        }
        return output
    }

    private buildOutput(options: any, outputFile: string|null = null){
        const node_atom = new RegExp(options.nodes.atom.name+'\(.+\)'), node_ariety = +options.nodes.atom.variables.length;
        const edge_atom = new RegExp(options.edge.atom.name+'\(.+\)'), edge_ariety = +options.edge.atom.variables.length;
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
                output.push({"nodes": n, "edge": a})
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
        const edge_variables = this.get_edge_variables(this.template.edge.atom.variables);
        return answerSets.map((as:any) => {
            const nodes: GraphNode[] = as.nodes.map((atom:string) => {
                return this.create_node(atom,node_variables);
            });

            const edges: GraphEdge[] = as.edge.map((atom:string) => {
                return this.create_edge(atom, edge_variables);
            });

            return <Graph>{
                nodes: nodes,
                edges: edges,
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

        return "style" in this.template.nodes ? createGraphNode({name: node_name, color: this.template.nodes.style.color}):
                        variables['color'] != -1 ? createGraphNode({name: node_name, color:node_var[variables['color']]}):
                                                    createGraphNode({name: node_name});
    }

    private create_edge(edge: string, variables: any): GraphEdge{   
        let edge_var = edge.split("(")[1].split(")")[0].split(",");
        const edge_from = edge_var[variables['from']];
        const edge_to = edge_var[variables['to']];
        const edge_weight = variables['weight'] != -1? edge_var[variables['weight']]: null;
        return "style" in this.template.nodes ? createGraphEdge({from: edge_from, destination: edge_to, weight:edge_weight, color: this.template.edge.style.color}):
                        variables['color'] != -1 ? createGraphEdge({from: edge_from, destination: edge_to, weight:edge_weight, color:edge_var[variables['color']]}):
                                                    createGraphEdge({from: edge_from, destination: edge_to, weight:edge_weight});
    }
}