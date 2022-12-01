import { validateTemplateSchema } from "../src/schema-validators";
import { expect } from "chai";
//import * as sinon from "sinon";

const RIGHT_SCHEMA = {
    template: "graph",
    nodes: {
        atom:{
        },
        style:{
            color:{
            }
        }
    },
    edges: {
        atom:{
            name: "edge",
            variables: ["from","to","weight","color"] 
        },
        style:{
            color:{
                branch:"green",
                path:"yellow"
            },
            oriented: true
        }
    }
}

const WRONG_SCHEMA = {

}


describe("TEMPLATE SCHEMA VALIDATOR TEST", () => {
    it("should evaluate correctly the schema", () =>{
        expect(validateTemplateSchema(RIGHT_SCHEMA)).to.be.true;
    }),
    it("should fail if the schema provided is wrong", ()=>{
        expect(validateTemplateSchema(WRONG_SCHEMA)).to.be.false;
    }),
    it("should fail if the item provided are not unique", ()=>{
        const not_unique_schema = {
            template: "graph",
            nodes: {
                atom:{
                },
                style:{
                    color:{
                    }
                }
            },
            edges: {
                atom:{
                    name: "edge",
                    variables: ["from","from","weight","color"] 
                },
                style:{
                    color:{
                        branch:"green",
                        path:"yellow"
                    },
                    oriented: true
                }
            }
        }
        expect(validateTemplateSchema(not_unique_schema)).to.be.false;
    }),
    it("should fail if the variable type doesn't match", ()=>{
        const type_mismatch = {
            template: 131,
            nodes: {
                atom:{
                },
            },
            edges: {
                atom:{
                    name: "edge",
                    variables: ["from","from","weight","color"] 
                },
            }
        }
        expect(validateTemplateSchema(type_mismatch)).to.be.false;
    }),
    it("should fail if the regex doesn't match", ()=>{
        const regex_mismatch ={
            template: "graph",
            nodes: {
                atom:{
                    name:"1234_asdsa",
                    variables: ["label"]
                },
            },
            edges: {
                atom:{
                    name: "1234_asdsa",
                    variables: ["from","to","weight","color"] 
                },
            }
        }
        expect(validateTemplateSchema(regex_mismatch)).to.be.false;
    }),
    it("should fail if there aren't the required keys ", ()=>{
        const required_mismatch ={
            template: "graph",
            nodes: {
            },
            edges: {
            }
        }
        expect(validateTemplateSchema(required_mismatch)).to.be.false;
    }),
    it("should fail if there are few arguments in array", ()=>{
        const arguments_mismatch ={
            template: "graph",
            nodes: {
                atom:{
                    name:"node",
                    variables: []
                },
            },
            edges: {
                atom:{
                    name: "edge",
                    variables: [] 
                },
            }
        }
        expect(validateTemplateSchema(arguments_mismatch)).to.be.false;
    }),
    it("should fail if the user set an invalid color", ()=>{
        const wrong_color_schema = {    
            template: "graph",
            nodes: {
                atom:{
                },
                style:{
                    color:{
                    }
                }
            },
            edges: {
                atom:{
                    name: "edge",
                    variables: ["from","to","weight","color"] 
                },
                style:{
                    color:{
                        branch:"prova",
                    },
                    oriented: true
                }
            }
        }
        expect(validateTemplateSchema(wrong_color_schema)).to.be.false;
    }),
    it("should use default value if not provided", () =>{
        validateTemplateSchema(RIGHT_SCHEMA);
        expect((<any>RIGHT_SCHEMA).nodes.atom.name).eq("node");
        expect((<any>RIGHT_SCHEMA).nodes.atom.variables).deep.equal(['label']);
    })

});

