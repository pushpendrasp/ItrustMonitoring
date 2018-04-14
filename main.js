var http = require('http');
var request = require('request');
var os = require('os');
var itrust_1 = process.env.itrust1;
var itrust_2 = process.env.itrust2;
var itrust_3 = process.env.itrust3;
var itrust_4 = process.env.itrust4;
var itrust_5 = process.env.itrust5;

// websocket server that website connects to.
var io = require('socket.io')(3000);

// /// CHILDREN instances
var instanceServers =
[
        {url:`http://${itrust_1}:8080/iTrust2/login`, latency: 0},
        {url:`http://${itrust_2}:8080/iTrust2/login`, latency: 0},
        {url:`http://${itrust_3}:8080/iTrust2/login`, latency: 0},
        {url:`http://${itrust_4}:8080/iTrust2/login`, latency: 0},
        {url:`http://${itrust_5}:8080/iTrust2/login`, latency: 0}
];


function measureLatenancy(server)
{
        var options =
        {
                url: server.url
        };
        let start = Date.now();
        // console.log("request to url");
        request(options, function (error, res, body)
        {
                console.log( error || res.statusCode, server.url);
                let end = Date.now();
                server.latency = end-start;
        });
        return server.latency;
}

function calculateColor()
{
        // latency scores of all instances, mapped to colors.
        var instances = instanceServers.map( measureLatenancy ).map( function(latency)
        {
                var color = "#cccccc";
                if( !latency )
                        return {color: color};
                if( latency > 1000 )
                {
                        color = "#ff0000";
                }
                else if( latency > 60 )
                {
                        color = "#ffff00";
                }
                else if( latency > 55 )
                {
                        color = "#f9f90A";
                }
                else if( latency > 50 )
                {
                        color = "#dffc04";
                }
                else if( latency > 40 )
                {
                        color = "#cccc00";
                }
                else if( latency > 30 )
                {
                        color = "#09af09";
                }
                else if( latency > 20 )
                {
                        color = "#04f204";
                }
                else if( latency > 10 )
                {
                        color = "#03fd03";
                }
                else
                {
                        color = "#00ff00";
                }
                console.log( latency );
                return {color: color};
        });
        //console.log( instances );
        return instances;
}


io.on('connection', function (socket) {
        console.log("Received connection");

        ///////////////
        //// Broadcast heartbeat over websockets
        //////////////
        var heartbeatTimer = setInterval( function ()
        {
                var data = {
                        name: "Itrust",instances: calculateColor()
                };
                // console.log("interval", data)
                //io.sockets.emit('heartbeat', data );
                socket.emit("heartbeat", data);
        }, 5000);

        socket.on('disconnect', function () {
                console.log("closing connection")
        clearInterval(heartbeatTimer);
        });
});