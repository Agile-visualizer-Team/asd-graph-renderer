## Commands
    npm install
    npm start
    npm test
    node build/index.js --help

## How to generate an answer set graph rendering

In order to generate a demo graph, run `npm start`.  The following json example files will be used as demo input:

1) Template configuration (`input/example-template.json`)


    {
        "template": "graph",
        "nodes": "node/1",
        "arch": "arch/3"
    }

2) Answer Set data (`input/example-wrapper.json`)


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

After the execution check the `output` folder, you should get a graph-*.png image for each input answer set.

The first answer set will generate an image like this:

![example](graph-example.png "Example graph")

Run `node build/index.js --help` to discover how to pass custom input files and output directory path.