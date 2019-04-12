/**
 * @author afflitto / https://github.com/afflitto
 * part of the free-sad project: https://github.com/free-sad
 *
 * based on https://github.com/spite/THREE.GamepadControls
 */

THREE.DroneGamepadControls = function ( callback ) {

  this.callback = callback

  this.rotMatrix = new THREE.Matrix4();
 	this.dir = new THREE.Vector3( 0, 0, 1 );
 	this.tmpVector = new THREE.Vector3();
 	//this.object = object;
 	this.lon = -90;
 	this.lat = 0;
 	this.target = new THREE.Vector3();
 	this.threshold = 0.1;

  this.accel = new THREE.Vector3(0, 0, 0);
  this.vel = new THREE.Vector3(0, 0, 0);

 	this.init = function(){

    var gamepadSupportAvailable = navigator.getGamepads ||
 		!!navigator.webkitGetGamepads ||
 		!!navigator.webkitGamepads;

 		if (!gamepadSupportAvailable) {
 			console.log( 'NOT SUPPORTED' );
 		} else {
 			if ('ongamepadconnected' in window) {
 				window.addEventListener('gamepadconnected', onGamepadConnect.bind( this ), false);
 				window.addEventListener('gamepaddisconnected', gamepadSupport.onGamepadDisconnect.bind( this ), false);
 			} else {
 				this.startPolling();
 			}
 		}
 	}

 	this.startPolling = function() {
 		if (!this.ticking) {
 			this.ticking = true;
 			this.tick();
 		}
 	}

 	this.stopPolling = function() {
 		this.ticking = false;
 	}

 	this.tick = function() {
 		this.pollStatus();
 		this.scheduleNextTick();
 	}

 	this.scheduleNextTick = function() {

 		if (this.ticking) {
 			requestAnimationFrame( this.tick.bind( this ) );
 		}
 	}

 	this.pollStatus = function() {

 		this.pollGamepads();

 	}

 	this.filter = function( v ) {

 		return ( Math.abs( v ) > this.threshold ) ? v : 0;

 	}

  this.sign = function(v) {
    if(this.filter(v) === 0) {
      return 0;
    } else if(v > 0) {
      return 1;
    } else if(v < 0) {
      return -1;
    }
  }

  this.pollGamepads = function() {

    var rawGamepads =
 		(navigator.getGamepads && navigator.getGamepads()) ||
 		(navigator.webkitGetGamepads && navigator.webkitGetGamepads());


    if( rawGamepads && rawGamepads[ 0 ] ) {
      var g;
      //find correct gamepad
      for(var i = 0; i < rawGamepads.length; i++) {
        if(rawGamepads[i] && rawGamepads[i].mapping) { //prevent keyboards showing as game controllers
          g = rawGamepads[i];
          break;
        }
      }

      if(g) {
        this.callback(g);
      }
 		}
 	}

 	this.init();

 };

 THREE.DroneGamepadControls.prototype = Object.create( THREE.EventDispatcher.prototype );
