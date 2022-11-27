import { validateTemplateSchema } from "../src/schema-validators";
import { expect } from "chai";
//import * as sinon from "sinon";

const SCHEMA_TO_BE_VALUATED = {
    "template": "graph",
    "nodes": {
        "atom":{
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
}


describe("TEMPLATE SCHEMA VALIDATOR TEST", () => {
    before(function(){

    })
    it("should fill automatically the required missing field", ()=>{
        validateTemplateSchema(SCHEMA_TO_BE_VALUATED);
        expect((<any>SCHEMA_TO_BE_VALUATED).nodes.atom.name).eq("node");
    })
});

