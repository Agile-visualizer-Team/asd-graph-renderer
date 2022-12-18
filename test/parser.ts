import {GraphParser} from "../src/parser";
import {expect} from "chai";
import * as sinon from "sinon";
import fs from "fs";


const GOOD_TEMPLATE = {
    "template": "graph",
    "nodes": [
        {
            "atom": {
                "name": "node",
                "variables": ["label"]
            },
            "style": {
                "color": {
                    "root": "yellow",
                    "leaf": "fuchsia",
                    "nonRoot": {
                        "if": [
                            {"variable": "label", "matches": "a", "then": "green"},
                            {"variable": "label", "matches": "g", "then": "fuchsia"}
                        ],
                        "else": "red"
                    }
                }
            }
        }
    ],
    "edges": [
        {
            "atom": {
                "name": "edge",
                "variables": ["from", "to", "weight"]
            },
            "style": {
                "color": "green",
                "oriented": true
            }
        }
    ]
};
const GOOD_AS = [
    {
        "as": [
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
        "cost": "1@2"
    },
    {
        "as": [
            "node(a)",
            "node(b)",
            "node(g)",
            "edge(a,b,10)",
            "edge(b,g,5)",
            "edge(a,g,3)"
        ],
        "cost": "1@2"
    }
];

const GOOD_TEMPLATE_2 = {
    "template": "graph",
    "nodes": [
        {
            "atom": {
                "name": "node",
                "variables": ["label", "color"]
            }
        }
    ],
    "edges": [
        {
            "atom": {
                "name": "edge",
                "variables": ["from", "to", "color"]
            }
        }
    ]
};
const GOOD_AS_2 = [
    {
        "as": [
            "node(a,red)",
            "node(b,greeb)",
            "edge(a,b,blue)",
        ],
        "cost": "1@2"
    }
];

describe("PARSER TEST", () => {
    it("should throw an exception if the template is not valid", () => {
        expect(function () {
            new GraphParser({}, []);
        }).to.throw(Error);
    });
    it("should throw an exception if nodes key does not contain at least one variable", () => {
        expect(function () {
            const no_param_template = {
                "template": "graph",
                "nodes": [{
                    "atom": {
                        "name": "node",
                        "variables": []
                    },
                }],
                "edges": [{
                    "atom": {
                        "name": "edge",
                        "variables": ["to", "from", "weight"]
                    },
                }]
            };
            new GraphParser(no_param_template, []);
        }).to.throw(Error, "Template is not valid: /nodes/0/atom/variables must NOT have fewer than 1 items")
    });
    it("should throw an exception if nodes key does not contain <label> in variables", () => {
        expect(function () {
            const no_label_template = {
                "template": "graph",
                "nodes": [{
                    "atom": {
                        "name": "node",
                        "variables": ["test"]
                    },
                }],
                "edges": [{
                    "atom": {
                        "name": "edge",
                        "variables": ["to", "from", "weight"]
                    },
                }]
            };
            new GraphParser(no_label_template, []);
        }).to.throw(Error, "Variables provided: \"test\" must contain \"label\"")
    });
    it("should throw an exception if edge key does not contain at least two variables", () => {
        expect(function () {
            const no_param_template = {
                "template": "graph",
                "nodes": [{
                    "atom": {
                        "name": "node",
                        "variables": ["label"]
                    },
                }],
                "edges": [{
                    "atom": {
                        "name": "edge",
                        "variables": []
                    },
                }]
            };
            new GraphParser(no_param_template, []);
        }).to.throw(Error, "Template is not valid: /edges/0/atom/variables must NOT have fewer than 2 items")
    });
    it("should throw an exception if edge key does not contain <from, to> in variables", () => {
        expect(function () {
            const no_label_template = {
                "template": "graph",
                "nodes": [{
                    "atom": {
                        "name": "node",
                        "variables": ["label"]
                    },
                }],
                "edges": [{
                    "atom": {
                        "name": "edge",
                        "variables": ["test1", "test2", "weight"]
                    },
                }]
            };
            new GraphParser(no_label_template, []);
        }).to.throw(Error, "Variables provided: \"test1,test2,weight\" must contain \"from,to\"")
    });
    it("should throw an exception if the answersets is not valid", () => {
        expect(function () {
            new GraphParser(GOOD_TEMPLATE, [1, 2, 3, 4, 5])
        }).to.throw(Error, "Answer sets are not valid: /0 must be object")
    });
    it("should throw an exception if the answersets is empty", () => {
        expect(function () {
            new GraphParser(GOOD_TEMPLATE, []);
        }).to.throw(Error, "Answer set list is empty")
    });
    it("should detect edges which have an non-existing from node", () => {
        const as = [
            {
                "as": [
                    "node(a)",
                    "node(b)",
                    "edge(c,b,10)"
                ],
                "cost": "1@2"
            }
        ];
        expect(() => new GraphParser(GOOD_TEMPLATE, as).parse()).to.throw(
            Error, `edge from <c> to <b> is invalid, from node <c> does not exist`);
    });
    it("should detect edges which have an non-existing to node", () => {
        const as = [
            {
                "as": [
                    "node(a)",
                    "node(b)",
                    "edge(a,c,10)"
                ],
                "cost": "1@2"
            }
        ];
        expect(() => new GraphParser(GOOD_TEMPLATE, as).parse()).to.throw(
            Error, `edge from <a> to <c> is invalid, to node <c> does not exist`);
    });
    it("extractFactsByAtomNameFromAnswerSet should extract the required facts by atom name #1", () => {
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const filteredFacts = parser.extractFactsByAtomNameFromAnswerSet(['a(1)'], 'a');
        expect(filteredFacts).to.have.members(['a(1)']);
    });
    it("extractFactsByAtomNameFromAnswerSet should extract the required facts by atom name #2", () => {
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const filteredFacts = parser.extractFactsByAtomNameFromAnswerSet(['a(1)','ab(1)'], 'ab');
        expect(filteredFacts).to.have.members(['ab(1)']);
    });
    it("extractFactsByAtomNameFromAnswerSet should extract the required facts by atom name #3", () => {
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const filteredFacts = parser.extractFactsByAtomNameFromAnswerSet(['b(1)','ba(1)'], 'b');
        expect(filteredFacts).to.have.members(['b(1)']);
    });
    it("should get an index for each node/edge variables", () => {
        const node_variables_spy = sinon.spy(GraphParser.prototype, <any>"findVariableIndexes");
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        parser.parse();
        expect(node_variables_spy.called).to.be.true;
        expect(node_variables_spy.getCall(0).args[0]).to.be.eq(GOOD_TEMPLATE.nodes[0].atom.variables);
        node_variables_spy.restore();
    });
    it("should generate a correct node from a string", () => {
        const create_node_spy = sinon.spy(GraphParser.prototype, <any>"createNode");
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        parser.parse();
        expect(create_node_spy.called).to.be.true;
        const expected_value = ["node(a)", "node(b)", "node(c)", "node(d)", "node(e)", "node(f)", "node(g)"];
        for (let i = 0; i < expected_value.length; ++i)
            expect(create_node_spy.getCall(i).args[0]).to.be.eq(expected_value[i]);

        create_node_spy.restore();
    });
    it("should generate a correct edge from a string", () => {
        const create_edge_spy = sinon.spy(GraphParser.prototype, <any>"createEdge");
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        parser.parse();
        expect(create_edge_spy.called).to.be.true;
        const expected_value = ["edge(a,b,10)", "edge(a,c,5)", "edge(b,d,6)", "edge(b,e,7)",
            "edge(b,f,5)", "edge(c,d,4)", "edge(d,g,3)"];

        for (let i = 0; i < expected_value.length; ++i)
            expect(create_edge_spy.getCall(i).args[0]).to.be.eq(expected_value[i]);

        create_edge_spy.restore();
    });
    it("should create, given the same template and as, always the same result", () => {
        const parser1 = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const parser2 = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const res1 = parser1.parse();
        const res2 = parser2.parse();
        expect(res1.length).to.be.eq(res2.length);
        for (let i = 0; i < res1.length; ++i) {
            for (let j = 0; j < res1[i].nodes.length; ++j) {
                expect(res1[i].nodes[j].label).to.be.eq(res2[i].nodes[j].label);
            }
            // noinspection DuplicatedCode
            for (let j = 0; j < res1[i].edges.length; ++j) {
                expect(res1[i].edges[j].from).to.be.eq(res2[i].edges[j].from);
                expect(res1[i].edges[j].to).to.be.eq(res2[i].edges[j].to);
                expect(res1[i].edges[j].weight).to.be.eq(res2[i].edges[j].weight);
            }
        }
    });
    it("should create, given two template with from-to switched, create a mirror graph", () => {
        const FROM_TO = {
            "template": "graph",
            "nodes": [{
                "atom": {
                    "name": "node",
                    "variables": ["label"]
                },
                "style": {
                    "color": {
                        "root": "yellow",
                        "leaf": "fuchsia",
                        "nonRoot": "blue"
                    }
                }
            }],
            "edges": [{
                "atom": {
                    "name": "edge",
                    "variables": ["from", "to", "weight"]
                },
                "style": {
                    "color": "green"
                }
            }]
        };
        const TO_FROM = {
            "template": "graph",
            "nodes": [{
                "atom": {
                    "name": "node",
                    "variables": ["label"]
                },
                "style": {
                    "color": {
                        "root": "yellow",
                        "leaf": "fuchsia",
                        "nonRoot": "blue"
                    }
                }
            }],
            "edges": [{
                "atom": {
                    "name": "edge",
                    "variables": ["to", "from", "weight"]
                },
                "style": {
                    "color": "green"
                }
            }]
        }
        const AS = [
            {
                "as": [
                    "node(a)",
                    "node(b)",
                    "node(g)",
                    "edge(a,b,10)",
                    "edge(b,g,5)",
                    "edge(a,g,3)"
                ]
            }];
        const parserTO = new GraphParser(TO_FROM, AS);
        const parserFROM = new GraphParser(FROM_TO, AS);
        const resTO = parserTO.parse();
        const resFROM = parserFROM.parse();
        for (let i = 0; i < resTO.length; ++i) {
            // noinspection DuplicatedCode
            for (let j = 0; j < resTO[i].edges.length; ++j) {
                expect(resTO[i].edges[j].from).to.be.eq(resFROM[i].edges[j].to);
                expect(resTO[i].edges[j].to).to.be.eq(resFROM[i].edges[j].from);
                expect(resTO[i].edges[j].weight).to.be.eq(resFROM[i].edges[j].weight);
            }
        }
    });
    // it("should pass colors in createNodeGraph if the provided template contains style", ()=>{
    //     const createGraphNode_spy = sinon.spy(createGraphNode);
    //     const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
    //     parser.answerSetsToGraphs();
    //     expect(createGraphNode_spy.called).to.be.true;
    //     //expect(createGraphNode_spy.getCall(0).args[0]).to.be.eq({name:"a",color:GOOD_TEMPLATE.nodes.style.color});
    //     createGraphNode_spy.restore();
    // });
});