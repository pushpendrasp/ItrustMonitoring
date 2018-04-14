// var jenkins_ip = process.env.JENKINS_IP;
var StatusModel = function(clients) {
    var self = this;
    self.clients = ko.observableArray();

    self.addClient = function(client) {
        self.clients.push(
            new ClientModel(client)
        );
    };

    self.removeClient = function(client) {
        self.clients.remove(client);
    };

    self.updateClient = function(person)
    {
        for(var i = 0 ; i < self.clients().length ; i++)
        {
            var koObj = self.clients()[i];
            //console.log( koObj.name() )
            if(self.clients()[i].name() === person.name)
            {
                koObj.instances([]);
                for( var j = 0; j < person.instances.length ; j++ )
                {
                    koObj.instances.push( new instanceModel(person.instances[j]) );
                }
                break;
            }
        }
    };

    // initialize first time.
    for( var i = 0; i < clients.length; i++)
    {
        self.addClient( clients[i] );
    }
};

var ClientModel = function(client)
{
    var self = this;
    self.name = ko.observable(client.name);
    self.instances = ko.observableArray([]);

    // init
    for( var i = 0; i < client.instances.length; i++ )
    {
        self.instances.push( new instanceModel(client.instances[i]) );
    }
}

var instanceModel = function(instance) {
    var self = this;
    self.color = ko.observable(instance.color);
};


var viewModel = new StatusModel(
[
    {
        name: "Itrust",
        instances:
        [
            {color:"#ab3fdd"},
            {color:"#ab3fdd"},
            {color:"#ab3fdd"},
            {color:"#ab3fdd"},
            {color:"#ab3fdd"}
        ]
    }
]);


$(document).ready( function()
{
    ko.applyBindings(viewModel);
    $('#statusTable').DataTable( { "paging":   false, "info":     false });

    var socket = io.connect('http://104.131.112.65:3000');
    console.log(socket);

    socket.on("heartbeat", function(client)
    {
        console.log(JSON.stringify(client));
        viewModel.updateClient(
        {
            name:client.name,
            instances:client.instances
        });
    });
});