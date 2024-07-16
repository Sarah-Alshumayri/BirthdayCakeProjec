const flame = document.getElementById('flame');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const values = array.reduce((a, b) => a + b, 0);
            const average = values / array.length;

            if (average > 50) { // Adjust the threshold value as needed
                flame.style.display = 'none';
            }
        };
    })
    .catch(err => console.error('The following gUM error occurred: ' + err));
} else {
    console.log('getUserMedia not supported on your browser!');
}
