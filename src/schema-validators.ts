import Ajv from "ajv";

/**
 * @see https://ajv.js.org/guide/getting-started.html#basic-data-validation
 */

const TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: {type: "string"},
        nodes: {type: "string"},
        arch: {type: "string"},
    },
    required: ["nodes", "arch"]
};

const ANSWER_SETS_SCHEMA = {
    type: "array"
};

export const validateTemplateSchema = new Ajv().compile(TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(ANSWER_SETS_SCHEMA);