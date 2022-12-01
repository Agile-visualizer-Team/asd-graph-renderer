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

const NEW_TEMPLATE_SCHEMA = {
    type: "object",
    properties: {
        template: {type: "string"},
        nodes: {
            type: "object",
            properties: {
                atom: {
                    type: "object",
                    properties: {
                        name: {type: "string", default: "node", pattern: "^[A-Za-z][A-Za-z0-9\_]*"},
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
                                root: {type: "string", default: "green", enum: TEMPLATE_COLORS_LIST,pattern: "^[A-Za-z]+"},
                                leaves: {type: "string", default: "magenta", enum: TEMPLATE_COLORS_LIST, pattern: "^[A-Za-z]+"},
                                nonRoot: {type: "string", default: "blue", enum: TEMPLATE_COLORS_LIST, pattern: "^[A-Za-z]+"}
                            }
                        }
                    }
                }
            }, required: ["atom"]
        },
        edges: {
            type: "object",
            properties: {
                atom: {
                    type: "object",
                    properties: {
                        name: {type: "string", default: "edge", pattern: "^[A-Za-z][A-Za-z0-9\_]*"},
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
                        color: {
                            type: "object",
                            properties: {
                                branch: {type: "string", default: "blue", enum: TEMPLATE_COLORS_LIST, pattern: "^[A-Za-z]+"},
                                path: {type: "string", default: "yellow", enum: TEMPLATE_COLORS_LIST, pattern: "^[A-Za-z]+"}
                            },
                        },
                        oriented: {type: "boolean", default: true}
                    }
                }
            }, required: ["atom"]
        }
    },
    required: ["template", "nodes", "edges"]
};



const ANSWER_SETS_SCHEMA = {
    type: "array",
    items: {type: "object"}
};

export const validateTemplateSchema = new Ajv({useDefaults: true}).compile(NEW_TEMPLATE_SCHEMA);
export const validateAnswerSetsSchema = new Ajv().compile(ANSWER_SETS_SCHEMA);