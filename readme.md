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
                "variables": ["label", "color"]
            },
            "style": {
                "color": {
                    "root": "yellow",
                    "leaves": "fuchsia",
                    "nonRoot": "blue"
                }
            }
        },
        "edges": {
            "atom": {
                "name": "edge",
                "variables": ["from", "to", "weight", "color"]
            },
            "style": {
                "color": {
                    "branch": "green",
                    "path": "yellow"
                },
                "oriented": true
            }
        }
    }

**Answer sets:** (`input/demo-answer-set.json`)

    [
        {
            "as" : [
                "node(a,green)",
                "node(b,blue)",
                "node(c,grey)",
                "node(d,blue)",
                "node(e,grey)",
                "node(f,grey)",
                "node(g,fuchsia)",
                "edge(a,b,2,green)",
                "edge(a,c,10,grey)",
                "edge(b,d,6,green)",
                "edge(b,e,7,grey)",
                "edge(b,f,5,grey)",
                "edge(c,d,4,grey)",
                "edge(d,g,3,green)"
            ],
            "cost" : "1@2"
        },
        {
            "as" : [
                "node(a,green)",
                "node(b,green)",
                "node(g,green)",
                "edge(a,b,1,blue)",
                "edge(b,g,2,blue)",
                "edge(a,g,10,grey)"
            ],
            "cost" : "1@2"
        }
    ]

After the script execution is completed check the `output` folder, you should get a graph-*.png image for each input answer set.

The first answer set will generate an image like this:

![demo as 1](demo-graph-1.png "Demo graph from answer set 1")

while the second one will be:

![demo as 2](demo-graph-2.png "Demo graph from answer set 2")