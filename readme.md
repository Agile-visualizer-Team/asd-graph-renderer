## Commands
    npm install
    npm run build
    npm run start
    npm run test
    node build/script.js --help

## How to render from file input

    node build/script.js fromfile --template ./input/demo-1-template.json --as ./input/demo-1-as.json --output ./output

## How to render from string input

    node build/script.js fromstr --template ./input/demo-1-template.json --output ./output

Then type an example answer set as json string:

    [{"as":["inNode(a)","outNode(b)","inNode(c)","inEdge(a,c,3)","outEdge(a,b,10)"]}]

## Demos

| Command | Description |
|-----------------------|-------------------------|
| `npm run demo:1` | Example of a path coloring problem where the colors of nodes and edges are calculated with custom template conditions |
| `npm run demo:2` | Example of a path coloring problem where the colors of nodes are set directly into the template |
| `npm run demo:3` | Example of a 3 colorability problem where the color of each node is taken from the answer set |

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
