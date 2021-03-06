var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client');

var ec2 = new EC2Client();

var worker = new SequelizeQueueWorker({ 
  Class: Gateway, 
  predicate: {
    where: { state: 'instance' }
  },
  job: attachApiKeyToGateway
});

worker.start();

function attachInstanceToGateway(gateway, callback){
  ec2.createInstance(function(err, instance){
    if (err) { callback(err); return };
    gateway.ec2_instance_id = instance.InstanceId;
    gateway.state = 'confirm_instance';
    gateway.save().complete(function(){
      callback(null, instance);
    });
  }); 
}

