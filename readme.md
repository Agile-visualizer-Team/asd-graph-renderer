## Commands
    npm install
    npm run build
    npm run start
    npm run test
    node build/script.js --help

## How to render from file input

    node build/script.js fromfile --template ./input/demo-template.json --as ./input/demo-as.json --output ./output

## How to render from string input

    node build/script.js fromstr --template ./input/demo-template.json --output ./output

Then type an example answer set as json string:

    [{"as":["node(a,red)","node(b,green)","edge(a,b,3,blue)"]}]

## Demo

In order to generate a demo graph rendering, run `npm start`. The following json files will be used as input:

**Template:** (`input/demo-template.json`)

    {
        "template": "graph",
        "nodes": {
            "atom": {
                "name": "node",
                "variables": ["label"]
            },
            "style": {
                "color": {
                    "nonRoot": "yellow",
                    "all": {
                        "if": [
                            {"variable": "label", "matches": "b", "then": "blue"},
                            {"variable": "label", "matches": "e", "then": "green"}
                        ],
                        "else": "red"
                    }
                }
            }
        },
        "edges": {
            "atom": {
                "name": "edge",
                "variables": ["from", "to", "weight", "deepness"]
            },
            "style": {
                "color": {
                    "if": [
                        {"variable": "deepness", "matches": "1", "then": "yellow"},
                        {"variable": "deepness", "matches": "2", "then": "orange"},
                        {"variable": "deepness", "gte": "3", "then": "red"}
                    ],
                    "else": "grey"
                },
                "oriented": true
            }
        }
    }

**Answer sets:** (`input/demo-answer-set.json`)

    [
        {
            "as" : [
                "node(a)",
                "node(b)",
                "node(c)",
                "node(d)",
                "node(e)",
                "node(f)",
                "node(g)",
                "edge(a,b,2,1)",
                "edge(a,c,10,1)",
                "edge(b,d,6,2)",
                "edge(c,d,4,2)",
                "edge(b,e,7,2)",
                "edge(b,f,5,2)",
                "edge(d,g,3,3)"
            ],
            "cost" : "1@2"
        },
        {
            "as" : [
                "node(a)",
                "node(b)",
                "node(g)",
                "edge(a,b,1,1)",
                "edge(b,g,2,2)",
                "edge(a,g,10,1)"
            ],
            "cost" : "1@2"
        }
    ]

After the script execution is completed check the `output` folder, you should get a graph-*.png image for each input answer set.


## Template

### IF condition operators

| IF Condition operator | Description and example |
|-----------------------|-------------------------|
| `matches: foo` | True if the fact variable is exactly `foo` (case sensitive equal comparator) |
| `imatches: foo` | True if the fact variable is `FOO` or `foo` (case insensitive equal comparator) |
| `contains: bar` | True if the fact variable contains `bar`, example: `foobar` (case sensitive) |
| `icontains: bar` | True if the fact variable contains `bar` or `BAR`, example: `fooBAR` (case insensitive) |
| `lt: 25` | True if the fact variable is less than `25`, example: `24` |
| `lte: 25` | True if the fact variable is less than `25` or equal to `25`, example: `25` or `24` |
| `gt: 50` | True if the fact variable is greater than `50`, example: `51` |
| `gte: 50` | True if the fact variable is greater than `50` or equal to `50`, example: `51` or `52` |
