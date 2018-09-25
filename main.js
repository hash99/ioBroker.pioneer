/**
 *
 * pioneer adapter
 * Tested for VSX-922
 *
 */

/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// you have to require the utils module and call adapter function
const utils =    require(__dirname + '/lib/utils'); // Get common adapter utils

// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.pioneer.0
const adapter = new utils.Adapter('pioneer');

/*Variable declaration, since ES6 there are let to declare variables. Let has a more clearer definition where 
it is available then var.The variable is available inside a block and it's childs, but not outside. 
You can define the same variable name inside a child without produce a conflict with the variable of the parent block.*/
//let variable = 1234;

var avr = require("../pioneer-avr");

var receiver;

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        adapter.setState('Connection', false);
        callback();
    } catch (e) {
        adapter.setState('Connection', false);
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});


// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
adapter.on('message', function (obj) {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command === 'send') {
            // e.g. send email or pushover or whatever
            console.log('send command');

            // Send response in callback if required
            if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }
});

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    main();
});


function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info('config IP: '    + adapter.config.IP);

    
    adapter.setObject('Connection', { type: 'state',
                      common: {
                      name: 'Connection',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

    adapter.setObject('onState', { type: 'state',
                      common: {
                      name: 'onState',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });
   
    adapter.setObject('ZonState', { type: 'state',
                      common: {
                      name: 'ZonState',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

    adapter.setObject('mute', { type: 'state',
                      common: {
                      name: 'mute',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });
    adapter.setObject('Zmute', { type: 'state',
                      common: {
                      name: 'Zmute',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

    adapter.setObject('Input', { type: 'state',
                      common: {
                      name: 'Input',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });
    adapter.setObject('ZInput', { type: 'state',
                      common: {
                      name: 'ZInput',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });
    adapter.setObject('Zvolume', { type: 'state',
                      common: {
                      name: 'Zvolume',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });
    adapter.setObject('volume', { type: 'state',
                      common: {
                      name: 'volume',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });


    adapter.setObject('ZButtonVolumeUp', { type: 'state',
                      common: {
                      name: 'ZButtonVolumeUp',
                      type: 'boolean',
                      role: 'button' },
                      native: {}
                      });

    adapter.setObject('ZButtonVolumeDown', { type: 'state',
                      common: {
                      name: 'ZButtonVolumeDown',
                      type: 'boolean',
                      role: 'button' },
                      native: {}
                      });
    adapter.setObject('ButtonVolumeUp', { type: 'state',
                      common: {
                      name: 'ButtonVolumeUp',
                      type: 'boolean',
                      role: 'button' },
                      native: {}
                      });
    
    adapter.setObject('ButtonVolumeDown', { type: 'state',
                      common: {
                      name: 'ButtonVolumeDown',
                      type: 'boolean',
                      role: 'button' },
                      native: {}
                      });

    adapter.setObject('InputJSON', { type: 'state',
                      common: {
                      name: 'InputJSON',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });

    /*
    adapter.setObject('SetInput', { type: 'state',
                      common: {
                      name: 'SetInput',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });
    adapter.setObject('ZSetInput', { type: 'state',
                      common: {
                      name: 'ZSetInput',
                      type: 'mixed',
                      role: '' },
                      native: {}
                      });

    adapter.setObject('ButtonOnOff', { type: 'state',
                      common: {
                      name: 'ButtonOnOff',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

    adapter.setObject('ZButtonOnOff', { type: 'state',
                      common: {
                      name: 'ZButtonOnOff',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });
    
    adapter.setObject('ZButtonMute', { type: 'state',
                      common: {
                      name: 'ZButtonMute',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

    adapter.setObject('ButtonMute', { type: 'state',
                      common: {
                      name: 'ButtonMute',
                      type: 'boolean',
                      role: 'indicator' },
                      native: {}
                      });

*/
    
    var options = {
    port: 23,
    host: adapter.config.IP,
    log: true
    };

    receiver = new avr.VSX(options);
    
    var inputs = avr.Inputs;
    var inputString = JSON.stringify(inputs);
    adapter.setState('InputJSON', inputString, true);
 
        //trigger on connection
    receiver.on("connect", function() {
                adapter.setState('Connection', true, true);
                });

    receiver.on("power", function(pwrstate) {
                adapter.setState('onState', pwrstate, true );
                });

    receiver.on("zpower", function(pwrstate) {
                adapter.setState('ZonState', pwrstate, true );
                });

    receiver.on("zmute", function(state) {
                adapter.setState('Zmute', state, true );
                });

    receiver.on("mute", function(state) {
                adapter.setState('mute', state, true );
                });

    receiver.on("input", function(state, name ) {
                adapter.setState('Input', state + " : " + name , true );
                });
    receiver.on("zinput", function(state, name ) {
                adapter.setState('ZInput', state + " : " + name , true );
                });
    receiver.on("volume", function(state) {
                adapter.setState('volume', state, true );
                });
    receiver.on("zvolume", function(state) {
                adapter.setState('Zvolume', state, true );
                });
    
    // in this pioneer all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');


    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword('admin', 'iobroker', function (res) {
        console.log('check user admin pw ioboker: ' + res);
    });

    adapter.checkGroup('admin', 'admin', function (res) {
        console.log('check group user admin group admin: ' + res);
    });



};


    // is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {
           // Warning, state can be null if it was deleted
           adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
           if (state && !state.ack) {
           //       adapter.log.info('ack is not set!');
           
           id = id.substring(adapter.namespace.length + 1);
           switch (id)
           {
           case 'ButtonOnOff':
                adapter.log.debug('ButtonOnOff changed');
                receiver.power(state.val);
           break;
           case 'ZButtonOnOff':
                adapter.log.debug('ZButtonOnOff changed');
                receiver.zpower(state.val);
           break;
           case 'onState':
           adapter.log.debug('onState changed');
           receiver.power(state.val);
           break;
           case 'ZonState':
           adapter.log.debug('ZonState changed');
           receiver.zpower(state.val);
           break;
           case 'ZButtonMute':
                adapter.log.debug('ZButtonMute changed');
                receiver.zmute(state.val);
           break;
           case 'Zmute':
           adapter.log.debug('Zmute changed');
           receiver.zmute(state.val);
           break;
           case 'ButtonMute':
                adapter.log.debug('ButtonMute changed');
                receiver.mute(state.val);
           break;
           case 'mute':
           adapter.log.debug('mute changed');
           receiver.mute(state.val);
           break;
           case 'SetInput':
                adapter.log.debug('SetInput changed');
                receiver.selectInput(state.val);
           break;
           case 'ZSetInput':
                adapter.log.debug('ZSetInput changed');
                receiver.selectZInput(state.val);
           break;
           case 'ZInput':
                adapter.log.debug('ZInput changed');
                receiver.selectZInput(state.val);
           break;
           case 'Input':
                adapter.log.debug('ZInput changed');
                receiver.selectInput(state.val);
           break;
           case 'volume':
                adapter.log.debug('volume changed');
                receiver.volume(state.val);
           break;
           case 'Zvolume':
                adapter.log.debug('Zvolume changed');
                receiver.zvolume(state.val);
           break;
           case 'ZButtonVolumeUp':
                adapter.log.debug('ZButtonVolumeUp changed');
                receiver.zvolumeUp();
           break;
           case 'ZButtonVolumeDown':
                adapter.log.debug('ZButtonVolumeDown changed');
                receiver.zvolumeDown();
           break;
           case 'ButtonVolumeUp':
                adapter.log.debug('ButtonVolumeUp changed');
                receiver.volumeUp();
           break;
           case 'ButtonVolumeDown':
                adapter.log.debug('ButtonVolumeDown changed');
                receiver.volumeDown();
           break;

           }
        }
    });
