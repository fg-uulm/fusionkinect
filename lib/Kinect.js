/*** FuKit JS Adapter
  author: fg
  version: 1.012
  date: 11/11/16
***/
(function(window){
  'use strict';

  // This function will contain all our code
  function FusionKinect(){
    var _fusionKinectObj = {};

    //Internal scope only
    var settings = {
      ip:"127.0.0.1",
      frequency:30,
      connected:false,
      skeletonsEnabled:true,
      markersEnabled:false,
      blobsEnabled:false,
      depthImageEnabled:false,
      thresholdImageEnabled:false,
      audioEnabled:false
    };

    var websocket;
    var timer;

    var skeletonData;
    var markerData;
    var depthDataAsImage;
    var thresholdDataAsImage;
    var blobData;
    var audioData;
    

    /*** SETTINGS ACCESSORS ***/
    _fusionKinectObj.getUpdateFrequency = function(){
         return settings.frequency;
    };

    //
    _fusionKinectObj.getKinectIP = function(){
         return settings.ip;
    };

    _fusionKinectObj.setSkeletonsEnabled = function(state){
         settings.skeletonsEnabled = state;         
    };

    _fusionKinectObj.setMarkersEnabled = function(state){
         settings.markersEnabled = state;         
    };

    _fusionKinectObj.setBlobsEnabled = function(state){
         settings.blobsEnabled = state;         
    };

    _fusionKinectObj.setDepthImageEnabled = function(state){
         settings.depthImageEnabled = state;         
    };

    _fusionKinectObj.setThresholdImageEnabled = function(state){
         settings.thresholdImageEnabled = state;         
    };

    _fusionKinectObj.setAudioEnabled = function(state){
         settings.audioEnabled = state;         
    };

    _fusionKinectObj.getSkeletonsEnabled = function(state){
         return settings.skeletonsEnabled;
    };

    _fusionKinectObj.getMarkersEnabled = function(state){
         return settings.markersEnabled;        
    };

    _fusionKinectObj.getBlobsEnabled = function(state){
         return settings.blobsEnabled;
    };

    _fusionKinectObj.getDepthImageEnabled = function(state){
         return settings.depthImageEnabled;
    };

    _fusionKinectObj.getThresholdImageEnabled = function(state){
         return settings.thresholdImageEnabled;
    };

    _fusionKinectObj.getAudioEnabled = function(state){
         return settings.audioEnabled;         
    };

    /*** DATA ACCESSORS ***/
    _fusionKinectObj.getSkeletonData = function() {
        return skeletonData;
    }
    
    _fusionKinectObj.getMarkerData = function() {
        return markerData;
    }

    _fusionKinectObj.getBlobData = function() {
        return blobData;
    }

    _fusionKinectObj.getAudioData = function() {
        return audioData;
    }

    _fusionKinectObj.getRawDepthData = function() {
        if(depthDataAsImage == undefined) return [];
        var img = new Image();
        img.src = "data:image/png;base64," + depthDataAsImage.Frame;
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);        
        var imgData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
        //Convert to 2D 1CH array
        var outData = [];
        var flatOutData = []; 
        for (var i=0;i<424;i++) {
            outData[i] = [];
        }
        var linecount = 0;
        var pxCount = 0;
        for (var i=0;i<imgData.length;i+=4)
        {
            var mod = i % 512;
            if(mod = 0) linecount++;
            outData[linecount][mod] = imgData[i];
            flatOutData[pxCount] = imgData[i];
            pxCount++;
        }
        return flatOutData;
        //return outData;
    }

    _fusionKinectObj.getRawThresholdData = function() {
        if(getThresholdDataAsImage == undefined) return [];
        var img = new Image();
        img.src = "data:image/png;base64," + getThresholdDataAsImage.Frame;
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);        
        var imgData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
        //Convert to 2D 1CH array
        var outData = [];
        var flatOutData = []; 
        for (var i=0;i<424;i++) {
            outData[i] = [];
        }
        var linecount = 0;
        var pxCount = 0;
        for (var i=0;i<imgData.length;i+=4)
        {
            var mod = i % 512;
            if(mod = 0) linecount++;
            outData[linecount][mod] = imgData[i];
            flatOutData[pxCount] = imgData[i];
            pxCount++;
        }
        return flatOutData;
        //return outData;
    }

    _fusionKinectObj.getDepthDataAsImage = function() {
        return depthDataAsImage;
    }

    _fusionKinectObj.getThresholdDataAsImage = function() {
        return thresholdDataAsImage;
    }

    _fusionKinectObj.requestMultiple = function() {
      if(websocket.readyState != 1) {
        console.debug("Kinect Network connection unavailable");
        return
      } 
      if(settings.skeletonsEnabled) websocket.send("s");
      if(settings.markersEnabled) websocket.send("m");
      if(settings.depthImageEnabled) websocket.send("d");
      if(settings.thresholdImageEnabled) websocket.send("t");
      if(settings.blobsEnabled) websocket.send("b");
      if(settings.audioEnabled) websocket.send("a");
      setTimeout(window.FusionKinect.requestMultiple, settings.frequency);
    }

    _fusionKinectObj.connect = function(ip) {
         if (typeof(ip)==='undefined') settings.ip = "127.0.0.1";
         else settings.ip = ip;

         if ("WebSocket" in window) {
               // Let us open a web socket
               websocket = new WebSocket("ws://"+settings.ip+":81");
        
               websocket.onopen = function()
               {                  
                  timer = setTimeout(window.FusionKinect.requestMultiple, settings.frequency);
                  settings.connected = true;
                  console.log("Kinect connected at "+settings.ip);
               };
        
               websocket.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;                  
                  var object = jQuery.parseJSON(received_msg);          
                          
                  if(object.Skeletons) skeletonData = object;
                  else if(object.Markers) markerData = object;
                  else if(object.Blobs) blobData = object;
                  else if(object.Min) thresholdDataAsImage = object;
                  else if(object.Frame) depthDataAsImage = object;
                  else if(object.Beams) audioData = object;
               };
        
               websocket.onclose = function()
               { 
                  // websocket is closed.
                  console.warn("Connection was closed..."); 
               };
            }
            
            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
               settings.connected = false;
            }
    }

    _fusionKinectObj.setUpdateFrequency = function(frequency){
         settings.frequency = 1/frequency;
         clearTimeout(timer);
         timer = setTimeout(_fusionKinectObj.requestMultiple, settings.frequency);
         return frequency;
    };

    return _fusionKinectObj;
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.FusionKinect) === 'undefined'){
    window.FusionKinect = FusionKinect();
  }
})(window); // We send the window variable withing our function