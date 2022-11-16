import {GraphParser} from "../src/parser";
import {expect} from "chai";
import * as sinon from "sinon";
import fs from "fs";
import path from "path";

const GOOD_AS = [
    {
        as: ["node(1)", "cell(74,5)"],
        cost: "1@2 2@3",
    },
    {
        as: ["node(7)", "arch(7,7)"],
        cost: "1@2",
    },
];

const GOOD_TEMPLATE = {
    nodes: "node/1",
    arch: "arch/2",
};

function graph_fixture(
    template: any = GOOD_TEMPLATE,
    wrapper: any = GOOD_AS,
    outputFile: string|null = null
) {
    const fs_stub = sinon.stub(fs, "existsSync").returns(true);
    let g = new GraphParser("", "");
    const stub = sinon
        .stub(g, <any>"getJSON")
        .onCall(0)
        .returns(template)
        .onCall(1)
        .returns(wrapper);
    const out = g.getAnswerSet(outputFile);
    stub.restore();
    fs_stub.restore();
    return out;
}

function get_expected() {
    return JSON.stringify([
        {nodes: ["node(1)"], arch: []},
        {nodes: ["node(7)"], arch: ["arch(7,7)"]},
    ]);
}

describe("Parser_Test", () => {
    it("should throw an error if you try to access an invalid path", () => {
        expect(function () {
            new GraphParser("", "");
        }).to.throw(Error, "Please, check the template_path you have given!");
    });

    it("should throw an exception if the template file is not well formatted", () => {
        const fs_stub = sinon.stub(fs, "existsSync").returns(true);
        let g = new GraphParser(
            "stub_template_path",
            "stub_dlv_path"
        );
        const stub = sinon
            .stub(g, <any>"getJSON")
            .returns({nodes: "asf_3", arch: "try&2"});
        expect(function () {
            g.getAnswerSet();
        }).to.throw(
            "Template Error: The template file is not syntactically right. Please check it!"
        );
        stub.restore();
        fs_stub.restore();
    });

    it("should fetch the json file properly and get the answersets", () => {
        const expected = get_expected();
        const out = JSON.stringify(graph_fixture());
        expect(out).equal(expected);
    });

    it("should save the answerset in a JSON file and be coherent", () => {
        const outputPath = path.join(__dirname, "parser_graph.json");
        const out = graph_fixture(GOOD_TEMPLATE, GOOD_AS, outputPath);
        expect(fs.existsSync(outputPath)).to.be.true;
        const expected = get_expected();
        expect(JSON.stringify(out)).equal(expected);
    });

    it("should parse the answer set correctly", () => {
        const AS = [
            {
                as: ["blocco(1)", "blocco(2)", "arco(1,2)"],
                cost: "1@2",
            },
        ];
        //Expected output
        const template = {
            nodes: "blocco/1",
            arch: "arco/2",
        };
        console.log("AS: ", AS);
        console.log("Template: ", template);

        let out = graph_fixture(template, AS);
        console.log(out);
    });
});
