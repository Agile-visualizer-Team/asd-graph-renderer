import { validateTemplateSchema } from "../src/schema-validators";
import { expect } from "chai";
//import * as sinon from "sinon";

var RIGHT_SCHEMA = {
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

var WRONG_SCHEMA = {

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
    })
});

