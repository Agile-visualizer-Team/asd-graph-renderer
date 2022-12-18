import Ajv from "ajv";

/**
 * @see https://ajv.js.org/guide/getting-started.html#basic-data-validation
 */

 const TEMPLATE_COLORS_LIST = [
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgrey',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'grey',
    'green',
    'greenyellow',
    'honeydew',
    'hotpink',
    'indianred ',
    'indigo ',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgrey',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'rebeccapurple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen',
];

const VARIABLE_NAME_REGEX = "^[A-Za-z][A-Za-z0-9\_]{0,19}$";
const EXPRESSION_REGEX = "^[A-Za-z0-9\_]{0,20}$";

const COLOR_SCHEMA = {
    $id: "COLOR_SCHEMA",
    oneOf: [
        {enum: TEMPLATE_COLORS_LIST},
        {
            type: "object",
            properties: {
                if: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            variable: {type: "string", pattern: VARIABLE_NAME_REGEX},
                            matches: {type: "string", pattern: EXPRESSION_REGEX},
                            imatches: {type: "string", pattern: EXPRESSION_REGEX},
                            contains: {type: "string", pattern: EXPRESSION_REGEX},
                            icontains: {type: "string", pattern: EXPRESSION_REGEX},
                            gte: {oneOf: [{type: "string", pattern: EXPRESSION_REGEX}, {type: "number"}]},
                            lte: {oneOf: [{type: "string", pattern: EXPRESSION_REGEX}, {type: "number"}]},
                            gt: {oneOf: [{type: "string", pattern: EXPRESSION_REGEX}, {type: "number"}]},
                            lt: {oneOf: [{type: "string", pattern: EXPRESSION_REGEX}, {type: "number"}]},
                            then: {enum: TEMPLATE_COLORS_LIST}
                        }, required: ["variable", "then"]
                    }
                },
                else: { enum: TEMPLATE_COLORS_LIST}
            },
            required: ["if", "else"]
        }
    ]
};

const NODE_SCHEMA = {
    type: "object",
    properties: {
        atom: {
            type: "object",
            properties: {
                name: {type: "string", default: "node", pattern: VARIABLE_NAME_REGEX},
                variables: {
                    type: "array",
                    default: ["label"],
                    uniqueItems: true,
                    items: {type: "string"},
                    minItems: 1
                }
            }
        },
        style: {
            type: "object",
            properties: {
                color: {
                    type: "object",
                    properties: {
                        all:{ $ref: "COLOR_SCHEMA", default: "green"},
                        root: { $ref: "COLOR_SCHEMA"},
                        leaf: { $ref: "COLOR_SCHEMA"},
                        nonRoot: { $ref: "COLOR_SCHEMA"}
                    }
                }
            }
        }
    },
    required: ["atom"]
};

const EDGE_SCHEMA = {
    type: "object",
    properties: {
        atom: {
            type: "object",
            properties: {
                name: {type: "string", default: "edge", pattern: VARIABLE_NAME_REGEX},
                variables: {
                    type: "array",
                    default: ["from", "to"],
                    uniqueItems: true,
                    items: {type: "string"},
                    minItems: 2
                }
            }
        },
        style: {
            type: "object",
            properties: {
                color: { $ref: "COLOR_SCHEMA"},
                oriented: {type: "boolean", default: true}
            },
            default: {
                oriented: true
            }
        }
    },
    required: ["atom"]
};

const TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: {type: "string"},
        layout: {enum: ['dagre', 'avsdf'], default: 'dagre'},
        nodes: {
            type: "array",
            items: NODE_SCHEMA
        },
        edges: {
            type: "array",
            items: EDGE_SCHEMA
        }
    },
    required: ["template", "nodes", "edges"]
};

const ANSWER_SETS_SCHEMA = {
    type: "array",
    items: {type: "object"}
};

export const validateTemplateSchema = new Ajv({schemas:[COLOR_SCHEMA],useDefaults: true}).compile(TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(ANSWER_SETS_SCHEMA);