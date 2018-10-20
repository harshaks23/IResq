var Webcam = require("webcamjs");

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});

Webcam.attach( '#my_camera' );

// function take_snapshot() {
//     // take snapshot and get image data
//     Webcam.snap( function(data_uri) {
//         // display results in page
//         document.getElementById('results').innerHTML = 
//             '<h2>Here is your image:</h2>' + 
//             '<img src="'+data_uri+'"/>';
//     } );
// }

window.take_snapshot = function() {
    Webcam.snap( function(data_uri) {
        // display results in page
        document.getElementById('results').innerHTML = 
            '<h2>Here is your image:</h2>' + 
            '<img src="'+data_uri+'"/>';
    } );
}
// let btnOnTakeSnap = window.document.getElementById("onTakeSnap");
// btnOnTakeSnap.addEventListener("click", take_snapshot)
