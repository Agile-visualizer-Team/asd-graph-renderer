// TODO schema json del template
import Ajv from "ajv";

const TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: {type: "string"},
        nodes: {type: "string"},
        arch: {type: "string"},
        // arch: {
        //     type: "object",
        //     properties: {
        //         style: {type: "string"},
        //         arch: {type: "string"},
        //     },
        //     required: ["nodes", "arch"]
        // }
    },
    required: ["nodes", "arch"]
};

const TEMPLATE_AS = {
    type: "array"
};

export const validateTemplateSchema = new Ajv().compile(TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(TEMPLATE_AS);