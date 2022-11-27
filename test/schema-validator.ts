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
    edge: {
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
            edge: {
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
            edge: {
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
            edge: {
                atom:{
                    name: "1234_asdsa",
                    variables: ["from","to","weight","color"] 
                },
            }
        }
        expect(validateTemplateSchema(regex_mismatch)).to.be.false;
    }),
    it("should fail if there aren't the required keys ", ()=>{
        const regex_mismatch ={
            template: "graph",
            nodes: {
            },
            edge: {
            }
        }
        expect(validateTemplateSchema(regex_mismatch)).to.be.false;
    })
});

