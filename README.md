# fusionkinect
JS Library for FusionKit Kinect Access

# System Requirements
To use this library, you will need:
* a Kinect for XBox One, connected to
* a suitable PC running Windows 8 or higher
* having the Kinect SDK installed
* and running the FusionKit Server component

Please also make sure the PC is available via network (or use local networking / localhost/ 127.0.0.1).

# Features
The current version of this library allows to retrieve the following information from the Kinect camera via JS in real-time:
* Skeleton tracking data for up to 6 users
* IR marker tracking data (3D positions) for a (theoretically) unlimited number of markers
* Depth / point cloud data in full resolution as image or raw pixel array
* Thresholded 1-bit depth data as image or raw pixel array
* Blob data (size, 2D position) for objects exceeding the thresholds defined in the server software
* Audio stream, indicating direction and confidence for audio events

# Getting started
After importing the JS library to your HTML file, a minimal example routine to query the currently available skeletons looks like this:
```javascript
//Init Kinect Connection
FusionKinect.connect("127.0.0.1");
				
//Start Skeleton Stream
FusionKinect.setSkeletonsEnabled(true);

//Retrieve Current Skeleton Data
var data = FusionKinect.getSkeletonData();
```
Please see the "examples" folder for more examples on how to use the different data streams.

# Available functions
* getUpdateFrequency
* setUpdateFrequency
* getKinectIP

Helpers to get the current Kinect IP address and get/set update frequency 


* setSkeletonsEnabled / getSkeletonsEnabled
* setMarkersEnabled / getMarkersEnabled 
* setBlobsEnabled / getBlobsEnabled
* setDepthImageEnabled / getDepthImageEnabled
* setThresholdImageEnabled / getThresholdImageEnabled
* setAudioEnabled / getAudioEnabled

The set... functions expect one parameter (true or false) to enable or disable the respective stream, while the current state of the stream can be requested with get... (returning true or false, again).


* getSkeletonData
* getMarkerData
* getBlobData
* getAudioData

Returns the respective data as bare JS object


* getRawDepthData
* getRawThresholdData

Returns the depth or threshold data as a flat array of pixels


* getDepthDataAsImage
* getThresholdDataAsImage

Returns the depth or threshold data as an image which can be displayed by the browser (see image example for how to do this)










