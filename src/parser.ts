import fs from 'fs'
import {createGraphEdge, createGraphNode, Graph, GraphEdge, GraphNode} from "./models";
import {validateAnswerSetsSchema, validateTemplateSchema} from "./schema-validators";
import assert from "assert";
import {ExpressionEvaluator} from "./expressions";

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
     * @param {string|null} [outputFile=null] - the file to write the output to. If null, the output is
     * returned as an array of objects.
     * @returns An array of objects. Each object has two properties: nodes and edges.
     */
    public extractNodesAndEdgesFromAnswerSets(outputFile: string|null = null){
        const node_atom = new RegExp(this.template.nodes.atom.name+'\(.+\)'),
              node_arity_template = this.template.nodes.atom.variables.length;

        const edge_atom = new RegExp(this.template.edges.atom.name+'\(.+\)'),
              edge_arity_template = this.template.edges.atom.variables.length;

        const output: any = [];
        this.answerSets.forEach(answerSet => {
            const nodes: string[] = [];
            const edges: string[] = [];
            answerSet.as.forEach((atom: string) => {
                if (node_atom.test(atom))
                    nodes.push(atom);
                else if (edge_atom.test(atom)) 
                    edges.push(atom);
            })
            if (nodes) {
                output.push({"nodes": nodes, "edges": edges});
            }
        })
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
        }
        return output;
    }
    
    /**
     * @returns An array of Graphs.
     */
    public parse(): Graph[] {
        const answerSets = this.extractNodesAndEdgesFromAnswerSets();
        const node_variables = this.findVariableIndexes(this.template.nodes.atom.variables);
        const edge_variables = this.findVariableIndexes(this.template.edges.atom.variables);

        return answerSets.map((as: any) => {
            const nodes: GraphNode[] = as.nodes.map((atom:string) => {
                return this.create_node(atom,node_variables);
            });

            const edges: GraphEdge[] = as.edges.map((atom:string) => {
                return this.create_edge(atom, edge_variables);
            });

            this.checkEdgesConnections(edges, nodes);
            this.assignDefaultNodesColors(nodes, edges);
            this.assignDefaultEdgesColors(edges);

            return <Graph>{
                nodes: nodes,
                edges: edges,
                oriented: this.template.edges.style
                    ? this.template.edges.style.oriented
                    : false,

            };
        });
    }

    /**
     * If specified, assign the default color to edges which are not colored
     * @param nodes
     * @param edges
     * @private
     */
    private assignDefaultEdgesColors(edges: GraphEdge[]) {
        if (this.template.edges.style.color) {
            edges.filter(e => !e.color).forEach(e => {
                e.color = this.parseColor(this.template.edges.style.color, e.variables)
            });
        }
    }

    /**
     * If specified, assign the default colors to nodes which are not colored
     * @param nodes
     * @param edges
     * @private
     */
    private assignDefaultNodesColors(nodes: GraphNode[], edges: GraphEdge[]) {
        if (this.template.nodes.style.color) {
            nodes.filter(n => !n.color).forEach(n => {
                if (!edges.find(e => e.to == n.label)) {
                    // Root
                    n.color = this.parseColor(
                        this.template.nodes.style.color.root || this.template.nodes.style.color.all, n.variables);
                } else if (!edges.find(e => e.from == n.label)) {
                    // Leave
                    n.color = this.parseColor(
                        this.template.nodes.style.color.leaves || this.template.nodes.style.color.all, n.variables);
                } else {
                    // Non-root
                    n.color = this.parseColor(
                        this.template.nodes.style.color.nonRoot || this.template.nodes.style.color.all, n.variables);
                }
            });
        }
    }

    private parseColor(color: string|any, variables: {[key: string]: any}): string {
        // color is a string, just return it
        if (typeof color === 'string') {
            return color;
        }
        // color is an object with "if conditions + else" that must be evaluated
        return new ExpressionEvaluator(color).evaluate(variables);
    }

    /**
     * Check if edges are connected to existing nodes
     * @param edges
     * @param nodes
     * @private
     */
    private checkEdgesConnections(edges: GraphEdge[], nodes: GraphNode[]) {
        edges.forEach((e: GraphEdge) => {
            if (!nodes.find(n => n.label == e.from)) {
                throw Error(`edge from <${e.from}> to <${e.to}> is invalid, from node <${e.from}> does not exist`);
            }
            if (!nodes.find(n => n.label == e.to)) {
                throw Error(`edge from <${e.from}> to <${e.to}> is invalid, to node <${e.to}> does not exist`);
            }
        });
    }

    private findVariableIndexes(variables: string[]): {[key: string]: number} {
        let values:  {[key: string]: number} = {};
        for (let i = 0; i < variables.length; i++) {
            values[variables[i]] = i;
        }
        return values;
    }

    private create_node(node: string, variableIndexes: {[key: string]: number}): GraphNode{
        let node_var = node.split("(")[1].split(")")[0].split(",");

        const variables: {[key: string]: any} = {};
        for (let key in variableIndexes) {
            const index = variableIndexes[key];
            variables[key] = node_var[index];
        }

        return createGraphNode({
            label: variables['label'],
            color: 'color' in variables ? variables['color'] : null,
            variables: variables
        });
    }

    private create_edge(edge: string, variableIndexes: {[key: string]: number}): GraphEdge {
        let edge_var = edge.split("(")[1].split(")")[0].split(",");

        const variables: {[key: string]: any} = {};
        for (let key in variableIndexes) {
            const index = variableIndexes[key];
            variables[key] = edge_var[index];
        }

        return createGraphEdge({
            from: variables['from'],
            to: variables['to'],
            weight: variables['weight'],
            color: 'color' in variables ? variables['color'] : null,
            variables: variables
        });
    }
}