import {createGraphEdge, createGraphNode, Graph, GraphEdge, GraphNode, GraphVariables} from "./models";
import {validateAnswerSetsSchema, validateTemplateSchema} from "./schema-validators";
import assert from "assert";
import {ExpressionEvaluator} from "./expressions";

export class GraphParser {
    private readonly template: any;
    private readonly answerSets: any[];
    private readonly MANDATORY_NODE_VARIABLE: string[] = ["label"];
    private readonly MANDATORY_EDGE_VARIABLE: string[] = ["from", "to"];

    constructor(template: any, answerSets: any[]) {
        if (!validateTemplateSchema(template)) {
            assert(validateTemplateSchema.errors);
            const errorMessages = validateTemplateSchema.errors.map(e => {
                const path = e.instancePath || "template";
                return "Template is not valid: " + path + " " + e.message;
            });
            throw Error(errorMessages.join("\n"));
        }
        this.template = template;

        this.template.nodes.forEach((nodeTemplate: any) => {
            this.checkMandatoryVariables(nodeTemplate.atom.variables, this.MANDATORY_NODE_VARIABLE);
        })
        this.template.edges.forEach((edgeTemplate: any) => {
            this.checkMandatoryVariables(edgeTemplate.atom.variables, this.MANDATORY_EDGE_VARIABLE);
        })

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
     * It takes a template object, which is validated with a schema, and an array of answer set.
     */
    private checkMandatoryVariables(variables: string[], mandatoryVariables: string[]) {
        const check = mandatoryVariables.every(value => {
            return variables.includes(value);
        })
        if (!check)
            throw Error(`Variables provided: \"${variables}\" must contain \"${mandatoryVariables}\"`)
    }

    /**
     * @param answerSet
     * @param atomName
     * @returns An array of strings, where each string is a fact
     */
    public extractFactsByAtomNameFromAnswerSet(answerSet: string[], atomName: string): string[] {
        const regex = new RegExp('^' + atomName + '\\(.+\\)');
        return answerSet.filter(fact => {
            return regex.test(fact);
        });
    }

    /**
     * @returns An array of Graphs.
     */
    public parse(): Graph[] {
        return this.answerSets.map((answerSet: any) => {
            const nodes: GraphNode[] = [];
            const edges: GraphEdge[] = [];

            this.template.nodes.forEach((nodeTemplate: any, nodeTemplateIndex: number) => {
                const variableindexes = this.findVariableIndexes(nodeTemplate.atom.variables);
                const facts = this.extractFactsByAtomNameFromAnswerSet(answerSet.as, nodeTemplate.atom.name);

                facts.forEach((fact: string) => {
                    nodes.push(this.createNode(fact, variableindexes, nodeTemplateIndex));
                });
            });

            this.template.edges.forEach((edgeTemplate: any, edgeTemplateIndex: number) => {
                const variableindexes = this.findVariableIndexes(edgeTemplate.atom.variables);
                const facts = this.extractFactsByAtomNameFromAnswerSet(answerSet.as, edgeTemplate.atom.name);

                facts.forEach((fact: string) => {
                    edges.push(this.createEdge(fact, variableindexes, edgeTemplateIndex));
                });
            });

            this.checkEdgesConnections(edges, nodes);
            this.assignDefaultNodesColors(nodes, edges);
            this.assignDefaultEdgesColors(edges);

            return <Graph>{
                nodes: nodes,
                edges: edges,
                layout: this.template.layout
            };
        });
    }

    /**
     * If specified, assign the default color to edges which are not colored
     * @param edges
     * @private
     */
    private assignDefaultEdgesColors(edges: GraphEdge[]) {
        edges.filter(e => !e.color && this.template.edges[e.templateIndex].style.color).forEach(e => {
            const edgeTemplate = this.template.edges[e.templateIndex];
            e.color = this.parseColor(edgeTemplate.style.color, e.variables);
        });
    }

    /**
     * If specified, assign the default colors to nodes which are not colored
     * @param nodes
     * @param edges
     * @private
     */
    private assignDefaultNodesColors(nodes: GraphNode[], edges: GraphEdge[]) {
        nodes.filter(n => !n.color && this.template.nodes[n.templateIndex].style.color).forEach(n => {
            const nodeTemplate = this.template.nodes[n.templateIndex];
            if (!edges.find(e => e.to == n.label)) {
                // Root
                n.color = this.parseColor(
                    nodeTemplate.style.color.root || nodeTemplate.style.color.all, n.variables);
            } else if (!edges.find(e => e.from == n.label)) {
                // Leaf
                n.color = this.parseColor(
                    nodeTemplate.style.color.leaf || nodeTemplate.style.color.all, n.variables);
            } else {
                // Non-root
                n.color = this.parseColor(
                    nodeTemplate.style.color.nonRoot || nodeTemplate.style.color.all, n.variables);
            }
        });
    }

    // noinspection JSMethodCanBeStatic
    private parseColor(color: string | any, variables: GraphVariables): string {
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

    // noinspection JSMethodCanBeStatic
    private findVariableIndexes(variables: string[]): { [key: string]: number } {
        let values: { [key: string]: number } = {};
        for (let i = 0; i < variables.length; i++) {
            values[variables[i]] = i;
        }
        return values;
    }

    // noinspection JSMethodCanBeStatic
    private createNode(node: string, variableIndexes: { [key: string]: number }, templateIndex: number): GraphNode {
        let node_var = node.split("(")[1].split(")")[0].split(",");

        const variables: GraphVariables = {};
        for (let key in variableIndexes) {
            const index = variableIndexes[key];
            variables[key] = node_var[index];
        }

        return createGraphNode({
            label: variables['label'],
            color: 'color' in variables ? variables['color'] : null,
            variables: variables,
            templateIndex: templateIndex
        });
    }

    // noinspection JSMethodCanBeStatic
    private createEdge(edge: string, variableIndexes: { [key: string]: number }, templateIndex: number): GraphEdge {
        let edge_var = edge.split("(")[1].split(")")[0].split(",");

        const variables: GraphVariables = {};
        for (let key in variableIndexes) {
            const index = variableIndexes[key];
            variables[key] = edge_var[index];
        }

        return createGraphEdge({
            from: variables['from'],
            to: variables['to'],
            weight: variables['weight'],
            color: 'color' in variables ? variables['color'] : null,
            variables: variables,
            oriented: this.template.edges[templateIndex].style.oriented,
            templateIndex: templateIndex
        });
    }
}