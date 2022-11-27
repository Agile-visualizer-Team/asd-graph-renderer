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

const NEW_TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: { type: "string" },
        nodes: {
            type: "object",
            properties: {
                atom: {
                    type: "object",
                    properties: {
                        name: { type: "string", default:"node", pattern: "^[A-Za-z][A-Za-z0-9\_]*" },
                        variables: { type: "array", default: ["label"], uniqueItems: true, items: {type:"string"}, minItems: 1}
                    }
                },
                style: {
                    type: "object",
                    properties: {
                        color: {
                            type: "object",
                            properties: {
                                root: { type: "string", pattern: "^[A-Za-z]+"},
                                leaves: { type: "string", pattern: "^[A-Za-z]+" },
                                nonRoot: { type: "string", pattern: "^[A-Za-z]+" }
                            }
                        }
                    }
                }
            },required: ["atom"]
        },
        edge: {
          type: "object",
          properties: {
              atom: {
                  type: "object",
                  properties: {
                      name: { type: "string", pattern: "^[A-Za-z][A-Za-z0-9\_]*"},
                      variables: { type: "array",uniqueItems: true, items: {type:"string"}, minItems: 2}
                  }
              },
              style: {
                  type: "object",
                  properties: {
                      color: {
                          type: "object",
                          properties: {
                              branch: { type: "string", pattern: "^[A-Za-z]+" },
                              path: { type: "string", pattern: "^[A-Za-z]+" }
                          },
                          required:["branch"]
                      },
                      oriented: {type:"boolean"}
                  }
              }
          },required: ["atom"]
      }
    },
    required: ["template", "nodes","edge"]
  };

const ANSWER_SETS_SCHEMA = {
    type: "array"
};

export const validateTemplateSchema = new Ajv().compile(NEW_TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(ANSWER_SETS_SCHEMA);