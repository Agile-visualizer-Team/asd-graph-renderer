// @ts-ignore
const cytosnap = require('cytosnap');

cytosnap.use(['cytoscape-dagre', 'cytoscape-klay']);

var snap = cytosnap();

snap.start().then(function(){
    return snap.shot({
        elements: [ // http://js.cytoscape.org/#notation/elements-json
            { data: { id: 'foo' } },
            { data: { id: 'bar' } },
            { data: { source: 'foo', target: 'bar' } }
        ],
        layout: { // http://js.cytoscape.org/#init-opts/layout
            name: 'grid' // you may reference a `cytoscape.use()`d extension name here
        },
        style: [ // http://js.cytoscape.org/#style
            {
                selector: 'node',
                style: {
                    'background-color': 'red'
                }
            },
            {
                selector: 'edge',
                style: {
                    'line-color': 'red'
                }
            }
        ],
        resolvesTo: 'base64uri',
        format: 'png',
        width: 640,
        height: 480,
        background: 'transparent'
    });
}).then(function( img ){
    // do whatever you want with img
    console.log( img );
});