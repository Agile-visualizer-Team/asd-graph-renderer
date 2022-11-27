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

    [{"as":["node(a)","node(b)","arch(a,b)"]}]

## Demo

In order to generate a demo graph rendering, run `npm start`. The following json files will be used as input:

**Template:** (`input/demo-template.json`)

    {
        "template": "graph",
        "nodes": {
            "atom":{
                "name": "node",
                "variables": ["label"]
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

**Answer sets:** (`input/demo-answer-set.json`)

    [
        {
            "as" : [
                "node(a)", "node(b)",
                "node(c)", "node(d)",
                "node(e)", "node(f)",
                "node(g)",
                "edge(a,b,10)",
                "edge(a,c,5)",
                "edge(b,d,6)",
                "edge(b,e,7)",
                "edge(b,f,5)",
                "edge(c,d,4)",
                "edge(d,g,3)"
            ],
            "cost" : "1@2"
        },
        {
            "as" : [
                "node(a)",
                "node(b)",
                "node(g)",
                "edge(a,b,10)",
                "edge(b,g,5)",
                "edge(a,g,3)"
            ],
            "cost" : "1@2"
        }
    ]

After the script execution is completed check the `output` folder, you should get a graph-*.png image for each input answer set.

The first answer set will generate an image like this:

![demo as 1](demo-graph-1.png "Demo graph from answer set 1")

while the second one will be:

![demo as 2](demo-graph-2.png "Demo graph from answer set 2")