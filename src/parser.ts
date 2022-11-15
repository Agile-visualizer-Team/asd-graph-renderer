import fs from 'fs'
import {Graph, GraphEdge, GraphNode} from "./models";

export class GraphParser {
    private template_path: string;
    private dlv_path: string;
    private SYNTAX_ERROR: string = "Template Error: The template file is not syntactically right. Please check it!"

    constructor(template_path: string, dlv_path: string) {
        if (!fs.existsSync(template_path))
            throw Error("Please, check the template_path you have given!");
        if (!fs.existsSync(dlv_path))
            throw Error("Please, check the dlv_path you have given!");
        this.template_path = template_path;
        this.dlv_path = dlv_path;
    }

    getAnswerSet(outputFile: string|null = null) {
        try {
            const options = this.getJSON(this.template_path);
            //console.log("JSON builded successfully. Check in your folder...")
            return this.buildOutput(options, outputFile);
        } catch (err) {
            if (err instanceof Error) {
                throw(err.message);
            }
        }
    }

    private buildOutput(options: any, outputFile: string|null = null) {
        const nodes = this.checkAtomsSyntax(options.nodes);
        const arch = this.checkAtomsSyntax(options.arch);
        const node_atom = nodes[0], node_ariety = nodes[1];
        const arch_atom = arch[0], arch_ariety = arch[1];
        const answerSet = this.getJSON(this.dlv_path);
        let output = [];
        for (var i = 0; i < answerSet.length; ++i) {
            const n: string[] = [];
            const a: string[] = [];
            let _as = answerSet[i].as;
            for (var j = 0; j < _as.length; ++j) {
                if (_as[j].split("(")[0] === node_atom && _as[j].split(",").length == node_ariety) {
                    n.push(_as[j]);
                } else if (_as[j].split("(")[0] === arch_atom && _as[j].split(",").length == arch_ariety)
                    a.push(_as[j]);
            }
            if (n.length != 0) {
                output.push({"nodes": n, "arch": a})
            }
        }
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(output, null, 4));
        }
        return output
    }

    private getJSON(path: string) {
        return require(path);
    }

    private checkAtomsSyntax(node_string: string) {
        if (!/^\S+\/\d+$/.test(node_string)) {
            throw new Error(this.SYNTAX_ERROR);
        }

        return node_string.split("/");
    }

    toGraphs(): Graph[] {
        const options = this.getJSON(this.template_path);
        const answerSets = this.buildOutput(options);

        return answerSets.map(as => {
            const nodes: GraphNode[] = as.nodes.map(atom => {
                let symbols = atom.split("(")[1].split(")")[0].split(",");
                let name = symbols[0];
                if (!name) {
                    throw Error("Invalid node name: " + name);
                }
                let weight = symbols.length >= 2 ? symbols[1] : null;
                return new GraphNode(name, weight);
            });

            const edges: GraphEdge[] = as.arch.map(atom => {
                let symbols = atom.split("(")[1].split(")")[0].split(",");

                let from = nodes.find(n => n.name === symbols[0]);
                if (!from) {
                    throw Error("Invalid arc from node: " + symbols[0]);
                }

                let destination = nodes.find(n => n.name === symbols[1]);
                if (!destination) {
                    throw Error("Invalid arc destination node: " + symbols[1]);
                }

                let weight = symbols.length >= 3 ? symbols[2] : null;
                return new GraphEdge(from, destination, weight);
            });

            return new Graph(nodes, edges);
        });
    }
}