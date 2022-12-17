import fs from 'fs'
import {createGraphEdge, createGraphNode, Graph, GraphEdge, GraphNode} from "./models";
import {validateAnswerSetsSchema, validateTemplateSchema} from "./schema-validators";
import assert from "assert";
import exp from "constants";

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
        const node_variables = this.get_node_variables(this.template.nodes.atom.variables);
        const edge_variables = this.get_edge_variables(this.template.edges.atom.variables);

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
                    : false
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
            edges.filter(e => !e.color).forEach(n => {
                n.color = this.parseColor(this.template.edges.style.color.branch, {})
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
                if (!edges.find(e => e.destination == n.name)) {
                    n.color = this.parseColor(this.template.nodes.style.color.root, {});
                } else if (!edges.find(e => e.from == n.name)) {
                    n.color = this.parseColor(this.template.nodes.style.color.leaves, {});
                } else {
                    n.color = this.parseColor(this.template.nodes.style.color.nonRoot, {});
                }
            });
        }
    }

    // TODO any per color non va bene, specificare un'interface
    // TODO in input servono le variabiles con i relativi valori,ad es: {"from": "a", "to": "b", "weight": ..}
    private parseColor(color: string|any, variables: {[key: string]: any}): string {
        // color is a string, just return it
        if (typeof color === 'string') {
            return color;
        }
        // color is a set of OR conditions + default case that must be evaluated
        return this.evaluateConditions(color, variables);
    }

    private evaluateConditions(conditions: any, variables: {[key: string]: any}) {
        for (let condition of conditions.if) {
            if (this.evaluateCondition(condition, variables)) {
                return condition.then;
            }
        }
        return conditions.default;
    }

    private evaluateCondition(condition: any, variables: {[key: string]: any}) {
        if ('matches' in condition) {
            return variables[condition.variable] == condition.matches;
        }
        if ('imatches' in condition) {
            return variables[condition.variable].toUpperCase() == condition.imatches.toUpperCase();
        }
        if ('contains' in condition) {
            return variables[condition.variable].indexOf(condition.contains) >= 0;
        }
        if ('icontains' in condition) {
            return variables[condition.variable].toUpperCase().indexOf(condition.icontains.toUpperCase()) >= 0;
        }
        if ('lt' in condition) {
            return variables[condition.variable] < condition.lt;
        }
        if ('lte' in condition) {
            return variables[condition.variable] <= condition.lte;
        }
        if ('gt' in condition) {
            return variables[condition.variable] < condition.gt;
        }
        if ('gte' in condition) {
            return variables[condition.variable] <= condition.gte;
        }
        // TODO exception?
    }

    /**
     * Check if edges are connected to existing nodes
     * @param edges
     * @param nodes
     * @private
     */
    private checkEdgesConnections(edges: GraphEdge[], nodes: GraphNode[]) {
        edges.forEach((e: GraphEdge) => {
            if (!nodes.find(n => n.name == e.from)) {
                throw Error(`edge from <${e.from}> to <${e.destination}> is invalid, from node <${e.from}> does not exist`);
            }
            if (!nodes.find(n => n.name == e.destination)) {
                throw Error(`edge from <${e.from}> to <${e.destination}> is invalid, destination node <${e.destination}> does not exist`);
            }
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