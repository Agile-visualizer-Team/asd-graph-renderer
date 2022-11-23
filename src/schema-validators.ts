import Ajv from "ajv";

/**
 * @see https://ajv.js.org/guide/getting-started.html#basic-data-validation
 */

const TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: {type: "string"},
        nodes: {type: "string"},
        edge: {type: "string"},
    },
    required: ["nodes", "edge"]
};

// const NEW_TEMPLATE_SCHEMA = {
//     type: "object",
//     properties: {
//         template: {type: "string"},
//         nodes:{
//             type:"object",
//             properties: {
//                 name: {type: "string"},
//                 variables: {type: ["string"]}
//             }
//         },
//         style:{
//             type: "object",
//             properties:{
//                 color: {
//                     type:"object",
//                     properties: {
//                         root: {type: "string"},
//                         leaves: {type: "string"},
//                         nonRoot: {type: "string"}
//                     }
//                 }
//             }
//         },
//         edge:{
//             type:"object",
//             properties: {
//                 name: {type: "string"},
//                 variables: {type: ["string"]}
//             }
//         },
//         style:{
//             type: "object",
//             properties:{
//                 color: {
//                     type:"object",
//                     properties: {
//                         root: {type: "string"},
//                         leaves: {type: "string"},
//                         nonRoot: {type: "string"}
//                     }
//                 }
//             }
//         }
//     },
//     required: ["nodes", "edge"]
// };

const ANSWER_SETS_SCHEMA = {
    type: "array"
};

export const validateTemplateSchema = new Ajv().compile(TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(ANSWER_SETS_SCHEMA);