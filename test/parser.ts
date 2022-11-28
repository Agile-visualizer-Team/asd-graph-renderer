import { GraphParser } from "../src/parser";
import { expect } from "chai";
import * as sinon from "sinon";
import fs from "fs";
import readSync from "readline-sync";
import Ajv from "ajv";
// /* A constant that is used to test the parser. */
// const GOOD_AS = [
//   {
//     as: ["node(1)", "cell(74,5)"],
//     cost: "1@2 2@3",
//   },
//   {
//     as: ["node(7)", "edge(7,7)"],
//     cost: "1@2",
//   },
// ];

// /* A constant that is used to test the parser. */
// const GOOD_TEMPLATE = {
//   nodes: "node/1",
//   edge: "edge/2",
// };

// /**
//  * It takes a template and a wrapper, and returns the output of the graph parser.
//  * @param {any} template - the template file
//  * @param {any} wrapper - the JSON object that is returned by the getJSON method
//  * @param {boolean} [flag=false] - boolean = false
//  * @returns The return value of the function.
//  */
// function graph_Fixture(template: any = GOOD_TEMPLATE,wrapper: any = GOOD_AS,flag: boolean = false) {
//   sinon.stub(fs, "existsSync").returns(true);
//   let g = new GraphParser("test1", "test2");
//   sinon.stub(g, <any>"get_json_flag").returns(flag);
//   sinon.stub(g, <any>"getJSON").onCall(0).returns(template).onCall(1).returns(wrapper);
//   const out = g.getAnswerSet();
//   return JSON.stringify(out);
// }
// /**
//  * It takes a list of nodes and a list of edges, and returns a list of objects, each of which has a
//  * list of nodes and a list of edges
//  * @returns The expected result.
//  * </code>
//  */
// function get_expected() {
//   return JSON.stringify([
//     { nodes: ["node(1)"], edge: [] },
//     { nodes: ["node(7)"], edge: ["edge(7,7)"] },
//   ]);
// }

const GOOD_TEMPLATE ={
    "template": "graph",
    "nodes": {
        "atom":{
            "name": "node",
            "variables": ["label"]
        },
        "style":{
            "color":{
                "root":"yellow",
                "leaves":"purple",
                "nonRoot":"blue"
            }
        }
    },
    "edge": {
        "atom":{
            "name": "edge",
            "variables": ["to","from","weight"]
        },
        "style":{
            "color":{
                "branch":"green",
                "path":"yellow"
            },
            "oriented": true
        }
    }
};
const GOOD_AS =[
    {
        "as" : [
            "node(a)",
            "node(b)",
            "node(c)",
            "node(d)",
            "node(e)",
            "node(f)",
            "node(g)",
            "edge(a,b,10)",
            "edge(a,c,5)",
            "edge(b,d,6)",
            "edge(b,e,7)",
            "edge(b,f,5)",
            "edge(c,d,4)",
            "edge(d,g,3)"
        ],
        "cost" : "1@2"
    },
    {
        "as" : [
            "node(a)",
            "node(b)",
            "node(g)",
            "edge(a,b,10)",
            "edge(b,g,5)",
            "edge(a,g,3)"
        ],
        "cost" : "1@2"
    }
]

describe("PARSER TEST", () =>{
    // const graph_sandbox = sinon.createSandbox()

    // beforeEach(function(){
    //     graph_sandbox.spy(GraphParser.prototype);
    // }),
    // afterEach(function(){

    // })
    it("should throw an exception if the template is not valid", ()=>{
        expect(function(){
            new GraphParser({}, [])
        }).to.throw(Error);
    }),
    it("should throw an exception if nodes key does not contain at least one variable", ()=>{
        expect(function(){
            const no_param_template = {
                "template": "graph",
                "nodes": {
                    "atom":{
                        "name": "node",
                        "variables": []
                    },
                },
                "edge": {
                    "atom":{
                        "name": "edge",
                        "variables": ["to","from","weight"]
                    },
                }
        };
            new GraphParser(no_param_template,[]);
        }).to.throw(Error,"Template is not valid: /nodes/atom/variables must NOT have fewer than 1 items")
    }),
    it("should throw an exception if nodes key does not contain <label> in variables", ()=>{
        expect(function(){
            const no_label_template = {
                "template": "graph",
                "nodes": {
                    "atom":{
                        "name": "node",
                        "variables": ["test"]
                    },
                },
                "edge": {
                    "atom":{
                        "name": "edge",
                        "variables": ["to","from","weight"]
                    },
                }
        };
            new GraphParser(no_label_template,[]);
        }).to.throw(Error,"Variables provided: \"test\" must contain \"label\"")
    }),
    it("should throw an exception if edge key does not contain at least two variables", ()=>{
        expect(function(){
            const no_param_template = {
                "template": "graph",
                "nodes": {
                    "atom":{
                        "name": "node",
                        "variables": ["label"]
                    },
                },
                "edge": {
                    "atom":{
                        "name": "edge",
                        "variables": []
                    },
                }
        };
            new GraphParser(no_param_template,[]);
        }).to.throw(Error,"Template is not valid: /edge/atom/variables must NOT have fewer than 2 items")
    }),
    it("should throw an exception if edge key does not contain <from, to> in variables", ()=>{
        expect(function(){
            const no_label_template = {
                "template": "graph",
                "nodes": {
                    "atom":{
                        "name": "node",
                        "variables": ["label"]
                    },
                },
                "edge": {
                    "atom":{
                        "name": "edge",
                        "variables": ["test1","test2","weight"]
                    },
                }
        };
            new GraphParser(no_label_template,[]);
        }).to.throw(Error,"Variables provided: \"test1,test2,weight\" must contain \"from,to\"")
    }),
    it("should throw an exception if the answersets is empty",()=>{
        expect(function(){
            new GraphParser(GOOD_TEMPLATE,[]);
        }).to.throw(Error,"Answer set list is empty")
    }),
    it("should call buildOutput with the correct parameters", ()=> {
        const buildOutputSpy = sinon.spy(GraphParser.prototype,<any>"buildOutput");
        const parser = new GraphParser(GOOD_TEMPLATE,GOOD_AS);
        parser.answerSetsToGraphs()
        expect(buildOutputSpy.calledOnce).to.be.true;
        expect(buildOutputSpy.getCall(0).args[0]).to.be.eq(GOOD_TEMPLATE);
        expect(buildOutputSpy.getCall(0).args[1]).to.be.eq(undefined);
        buildOutputSpy.restore();
    }),
    // it("buildOutput should generate a JSON file if a file path is provided", () =>{
    //     const fs_stub = sinon.stub(fs,"readFileSync");
    //     const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
    //     parser.answerSetsToGraphs()
    //     expect(fs_stub.calledOnce).to.be.true;
    // }),
    it("should get the correct node variables", () =>{
        const node_variables_spy = sinon.spy(GraphParser.prototype,<any>"get_node_variables");
        const parser = new GraphParser(GOOD_TEMPLATE,GOOD_AS);
        parser.answerSetsToGraphs();
        expect(node_variables_spy.calledOnce).to.be.true;
        expect(node_variables_spy.getCall(0).args[0]).to.be.eq(GOOD_TEMPLATE.nodes.atom.variables);
        node_variables_spy.restore();
    }),
    it("should get the correct edge variables", () =>{
        const edge_variables_spy = sinon.spy(GraphParser.prototype,<any>"get_edge_variables");
        const parser = new GraphParser(GOOD_TEMPLATE,GOOD_AS);
        parser.answerSetsToGraphs();
        expect(edge_variables_spy.calledOnce).to.be.true;
        expect(edge_variables_spy.getCall(0).args[0]).to.be.eq(GOOD_TEMPLATE.edge.atom.variables);
        edge_variables_spy.restore()
    }),
    it("should generate a correct node from a string", () =>{
        const create_node_spy = sinon.spy(GraphParser.prototype,<any>"create_node");
        const parser = new GraphParser(GOOD_TEMPLATE,GOOD_AS);
        parser.answerSetsToGraphs();
        expect(create_node_spy.called).to.be.true;
        const expected_value = ["node(a)","node(b)","node(c)","node(d)","node(e)","node(f)","node(g)"];
        for(let i = 0; i < expected_value.length; ++i)
            expect(create_node_spy.getCall(i).args[0]).to.be.eq(expected_value[i]);

        create_node_spy.restore();
    }),
    it("should generate a correct edge from a string", () =>{
        const create_edge_spy = sinon.spy(GraphParser.prototype,<any>"create_edge");
        const parser = new GraphParser(GOOD_TEMPLATE,GOOD_AS);
        parser.answerSetsToGraphs();
        expect(create_edge_spy.called).to.be.true;
        const expected_value = ["edge(a,b,10)","edge(a,c,5)","edge(b,d,6)","edge(b,e,7)",
                                "edge(b,f,5)","edge(c,d,4)","edge(d,g,3)"];

        for(let i = 0; i < expected_value.length; ++i)
            expect(create_edge_spy.getCall(i).args[0]).to.be.eq(expected_value[i]);
        
        create_edge_spy.restore();
    })
})


// describe("Parser_Test", () => {
//   afterEach(function(){
//     sinon.restore();
//   })
//   it("should throw an error if you try to access an invalid template path", () => {
//     expect(function () {
//       new GraphParser("", "");
//     }).to.throw(Error, "Please, check the template_path you have given!");
//   }),
//   it("should throw an expection if you try to access an invalid dlv_path", ()=>{
//     sinon.stub(fs, "existsSync").onCall(0).returns(true).onCall(1).returns(false);
//     expect(function(){
//       let g = new GraphParser("test1", "test2");
//     }).to.throw(Error, "Please, check the dlv_path you have given!")
//   })
//   it("should throw an exception if the template file is not well formatted", () => {
//     sinon.stub(fs, "existsSync").returns(true);
//     let g = new GraphParser("test1","test2");
//     sinon.stub(g, <any>"getJSON").returns({ nodes: "asf_3", edge: "try&2" });
//     expect(function () {
//       g.getAnswerSet();
//     }).to.throw(
//       "Template Error: The template file is not syntactically right. Please check it!"
//     );
//   }),
//   it("should fetch the json file properly and get the answersets", () => {
//     const expected = get_expected();
//     const out = graph_Fixture();
//     expect(out).equal(expected);
//   }),
//   it("should save the answerset in a JSON file and be coherent", () => {
//     const out = graph_Fixture(GOOD_TEMPLATE, GOOD_AS, true);
//     expect(fs.existsSync("./graph.json")).to.be.true;
//     const expected = get_expected();
//     expect(out).equal(expected);
//   }),
//   it('should get the input from stdin and provide the correct answer set', () => {
//     sinon.stub(fs, "existsSync").returns(true);
//     let g = new GraphParser("test1", "test2");
//     sinon.stub(readSync,"question").returns(JSON.stringify(GOOD_AS));
//     sinon.stub(g, <any>"get_input_flag").returns(true);
//     const t = sinon.stub(g, <any>"getJSON").onCall(0).returns(GOOD_TEMPLATE).onCall(1).callsFake(()=>{
//       t.restore()
//       return g.getJSON("test2");
//     });
//     const out = g.getAnswerSet();
//     expect(JSON.stringify(out)).to.eq(get_expected())
//   })
// });
