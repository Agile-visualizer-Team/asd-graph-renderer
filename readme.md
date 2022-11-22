## Commands
    npm install
    npm start
    npm test
    node build/script.js --help

## How to generate an answer set graph rendering

In order to generate a demo graph rendering, run `npm start`. The following json files will be used as input:

**Template configuration:** (`input/demo-template.json`)

    {
        "template": "graph",
        "nodes": "node/1",
        "arch": "arch/3"
    }

**Answer set data:** (`input/demo-answer-set.json`)

    [
        {
            "as" : [
                "node(a)", "node(b)",
                "node(c)", "node(d)",
                "node(e)", "node(f)",
                "node(g)",
                "arch(a,b,10)",
                "arch(a,c,5)",
                "arch(b,d,6)",
                "arch(b,e,7)",
                "arch(b,f,5)",
                "arch(c,d,4)",
                "arch(d,g,3)"
            ],
            "cost" : "1@2"
        },
        {
            "as" : [
                "node(a)",
                "node(b)",
                "node(g)",
                "arch(a,b,10)",
                "arch(b,g,5)",
                "arch(a,g,3)"
            ],
            "cost" : "1@2"
        }
    ]

After the script execution is completed check the `output` folder, you should get a graph-*.png image for each input answer set.

The first answer set will generate an image like this:

![demo as 1](demo-graph-1.png "Demo graph from answer set 1")

while the second one will be:

![demo as 2](demo-graph-2.png "Demo graph from answer set 2")

Run `node build/script.js --help` to discover how to pass custom input file and output path.