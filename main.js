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
        {url:`http://${itrust_1}:8080/iTrust2/login`, status: 404},
        {url:`http://${itrust_2}:8080/iTrust2/login`, status: 404},
        {url:`http://${itrust_3}:8080/iTrust2/login`, status: 404},
        {url:`http://${itrust_4}:8080/iTrust2/login`, status: 404},
        {url:`http://${itrust_5}:8080/iTrust2/login`, status: 404}
];


function measureStatus(server)
{
        var options =
        {
                url: server.url
        };
        // console.log("request to url");
        request(options, function (error, res, body)
        {
                console.log( error || res.statusCode, server.url);
                if(error && res.statusCode != 200)
                        server.status = 404;
                else
                        server.status = res.statusCode;
        });
        return server.status;
}

function calculateColor()
{
        var instances = instanceServers.map( measureStatus ).map( function(status)
        {
                var color = "#cccccc";
                if( !status )
                        return {color: color};
                if( status == 200 )
                {
                        color = "#03fd03";
                }
                else
                {
                        color = "#ff0000";
                }
                console.log( status );
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