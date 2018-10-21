var Webcam = require("webcamjs");
var location = require("browser-location")
import io from 'socket.io-client';

const socket = io();

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});

Webcam.attach('#my_camera');

const makeblob = function (dataURL) {
    var parts = dataURL.split(',');
    return parts[1];
}

const sendText =  (number, data, text) =>{

fetch('/text', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({number: number, image: data, text: text})
  });


}

window.take_snapshot_continues = () => {
  setInterval(() => { console.log("Capture"); }, 3000);
} 

window.take_snapshot = function() {
    Webcam.snap( function(data_uri) {

        document.getElementById('results').innerHTML = 
            '<center><h2>Your image is now processing...</h2>' + 
            '<img src="'+data_uri+'"/></center>';

            (async () => {
                const response = await fetch('/getKey');
                const some = await response.json();
                const rawResponse = await fetch('https://vision.googleapis.com/v1/images:annotate?key='+some.niceText, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "requests": [
                      {
                        "image": {
                          "content": makeblob(data_uri)
                        },
                        "features": [
                          {
                            "type": "TEXT_DETECTION",
                            "maxResults": 5
                          }
                        ]
                      }
                    ]
                  })
                });
                const content = await rawResponse.json();
                if(!!content.responses[0]){
                  let impMessage = content.responses[0].fullTextAnnotation.text;
                  console.log(impMessage);

                  location.get(function (err, position) {
                    socket.emit('onImageDetect', {
                      message : impMessage,
                      mapPoint : {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      }
                    });
                  })
        
                
                }
              })();
      //sendText('3123588613', data_uri, 'Info');
      //sendText('3123588613', null, 'Info');


    } );
}
// let btnOnTakeSnap = window.document.getElementById("onTakeSnap");
// btnOnTakeSnap.addEventListener("click", take_snapshot)
