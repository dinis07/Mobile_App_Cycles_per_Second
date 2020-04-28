$(document).ready(function () {
    //-----------------| Declaring Variables |-----------------//
    
        
    var audioCtx = new AudioContext();
    var cFreqPerc;
    var cFreqPos;
    var difficulty = 20;
    var filter = audioCtx.createBiquadFilter();
    var freq;
    var getSound = new XMLHttpRequest();
    var inputRangeWidth
    var margin;
    var per;
    var pixVal;
    var qNum = 1;
    var rightAns = 0;
    var screenHeight;
    var screenWidth;
    var scorePerc;

    var location;


    var btnCAnswer = document.getElementById("cAnswer");
    var btnFilter = document.getElementById('filter');
    var btnNext = document.getElementById('next');
    var btnPlay = document.getElementById("play");
    var btnStop = document.getElementById("stop");
    var btnSub = document.getElementById('submit');
    var btnUAnswer = document.getElementById("userAnswer");
    var eqRange = document.getElementById('eq-range');
    var freqOutput = document.getElementById("freqNum");
    var freqSlider = document.getElementById("frequency-select");
    var freqVis = document.getElementById('cFreq');
    var freqNum = document.getElementById('cFreqNum');
    var panInactive = document.getElementById('panel-inactive');
    var score = document.getElementById('score');
    var title = document.getElementById('title');

    
    //-----------------| Calibrate to screen |-----------------//
    // Meassuring the screen size and calibrating the wrapper div
    // to fit the screen.
    screenHeight = screen.height - 16;
    screenWidth = screen.width - 16;
    panInactive.style.paddingBottom = screenHeight / screenWidth + "%";

    //-----------------| Setting Filter Values |-----------------//
    // These filter values are set for the 'Noise' & 'Samples' game 
    // types, for the biquad filter createed in the varibales section.
    // the filter type, gain and q do not change. 
    filter.type = "peaking";
    filter.gain.value = 10;
    filter.Q.value = 1;

    //--------------------| GENERATE NOISE |-------------------//
    var noiseBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 3, audioCtx.sampleRate);

    for (var channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {

        // This gives us the actual array that contains the data for the channel
        var nowBuffering = noiseBuffer.getChannelData(channel);

        // Loop round for each sample in the channel's buffer
        for (var i = 0; i < noiseBuffer.length; i++) {

            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = Math.random() * 2 - 1;
        }
    }

    //---------------------------------------------------------//
    //----------------------| FUNCTIONS |----------------------//
    //---------------------------------------------------------//

    //--------------------| SETTING THE DIFFICULTY |-------------------//
    // Setting the difficulty of the game by changing the range from the
    // actual answer. eg. the easy difficulty will increase the range to 
    // 30%, where the insane difficulty will change the range to 2%.
    function loadDifficulty() {

        location = freqSlider.offsetWidth;

        $('#diffTitle').hide(0);
        inputRangeWidth = (location / 2) - ((location * (difficulty / 100)) / 2);
        eqRange.style.width = difficulty + "%";
        eqRange.style.left = inputRangeWidth;
        margin = (location * (difficulty / 100)) / 2;
        freqSlider.value = "unset";
        freqOutput.hidden = true;
    }

    //--------------------| LOADING SAMPLE |-------------------//
    // Depending on which sample is selected, a url is returned to
    // this function, loading the audio files saved in the directory
    // ready to be played. 
    function loadTrack(a) {

        getSound.open("get", a, true);
        getSound.responseType = "arraybuffer";
        getSound.onload = function () {
            audioCtx.decodeAudioData(getSound.response, function (buffer) {
                audioBuffer = buffer;
            });
        };

        getSound.send();
    };

    //--------------------| GENERATE RANDOM FREQUENCY |-------------------//
    // The function will generate a new random frequency everytime it is called
    // and set the filter frequency value or tone value to the random frequency.
    // The fucntion will also set the a visual aid of where the correct frequency
    // lies on the input slider.
    function randomFrequency() {
        //Generating a random number between 1 and 100 to later be used as the
        //frequency of noise boost
        freq = (Math.random() * 100).toFixed(1);

        //Creating a 65% chance that the random number genertated will
        //be between 20 and 2000, a 25% chance the random number will be 
        //between 2001 and 10 000 and a 10% chance the random number will be
        //between 10 001 and 20 000
        if (freq <= 65) {
            freq = (Math.random() * 1980 + 20).toFixed(0);
        }
        else if (freq <= 90 && freq > 65) {
            freq = (Math.random() * 8000 + 2000).toFixed(0);
        }
        else {
            freq = (Math.random() * 10000 + 10000).toFixed(0);
        }

        // setting filter frequency
        filter.frequency.value = freq;

        // Dividing frequency value to match the input slide values
        if (freq >= 20 && freq <= 100) {
            cFreqPos = freq / 5;
        }
        else if (freq > 100 && freq <= 200) {
            cFreqPos = ((freq - 100) / 10) + 20;
        }
        else if (freq > 200 && freq <= 400) {
            cFreqPos = ((freq - 200) / 20) + 30;
        }
        else if (freq > 400 && freq <= 800) {
            cFreqPos = ((freq - 400) / 40) + 40;
        }
        else if (freq > 800 && freq <= 1600) {
            cFreqPos = ((freq - 800) / 80) + 50;
        }
        else if (freq > 1600 && freq <= 3200) {
            cFreqPos = ((freq - 1600) / 160) + 60;
        }
        else if (freq > 3200 && freq <= 6400) {
            cFreqPos = ((freq - 3200) / 320) + 70;
        }
        else if (freq > 6400 && freq <= 12800) {
            cFreqPos = ((freq - 6400) / 640) + 80;
        }
        else if (freq > 12800 && freq <= 20000) {
            cFreqPos = ((freq - 12794) / 1280) + 90;
        }

        cFreqPerc = (cFreqPos - 4) / (95.63 - 4);
        answer = freqNum;
        answer.innerHTML = freq + " Hz";
    }

    //--------------------| RESET GAME |-------------------//
    // When a game type is restarted or ended, the values and styles of the
    // GUI are reset to their initial values. This function is called when a 
    // game type is selected otr when a user try the same game again.
    function resetData() {

        if ($("#submitOnOff").prop('checked') == true) {
            $("#submitOnOff").click();
        }

        qNum = 1;
        rightAns = 0;

        freqSlider.disabled = false;
        btnCAnswer.disabled = true;
        btnUAnswer.disabled = true;

        document.getElementById("qNum").innerHTML = qNum.toString();

        btnSub.style = "display: block;";
        btnNext.style = "display: none;";
        btnUAnswer.style = "color: black; filter: invert(0%);";
        btnCAnswer.style = "color: black; filter: invert(0%);";

        freqVis.style = "display: none;";
        freqNum.style = "display: none;";

        document.getElementById("resultText").innerHTML = "";

        btnSub.disabled = true;
    }

    //--------------------| CORRECT ANSWER DISPLAY |-------------------//
    // Positioning where the correct answer lies on the frequency spectrum.
    // The function is called when the sumbit button it clicked
     function rightAnswer() {

        location = freqSlider.offsetWidth;

        freqVis.style.left = cFreqPerc * location;

        var sliderVal = cFreqPerc * 95.63;

        if (sliderVal >= 85) {

            freqNum.style.left = cFreqPerc * (location * 0.94);

        }
        else {
            var cFreqPerc1 = (sliderVal - 65) / (80 - 65);
            freqNum.style.left = (cFreqPerc * (location * 0.97)) - (cFreqPerc1 * 10);
        }
    }

    //--------------------| SAMPLE VIEW |-------------------//
    // This function hides the difficulty page and opens the sample select
    // page or opens the game window. It is called when a difficulty is selected,
    // and will only open the sample view page if the 'Samples' option was selected  
    // in the main menu.
    function sampleView() {
        $('#difficultyWrapper').slideUp(400);

        if (title.innerHTML == "Cycles Per Second: Samples") {

            document.getElementById('sampleWrapper').style = "display: inline-block;";
        }
        else {
            document.getElementById('panel').style = "display: inline-block;";
        }
    }

    //--------------------| CLOSE SAMPLE VIEW |-------------------//
    // This function hides the samples page and opens the main game panel.
    function closeSampleView() {
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
        loadDifficulty();
    
    }

    //--------------------| AUDIO START |-------------------//
    // Changing the styles of the buttons when a sound is started.
    // This function is called in all three game types and sets the
    // button styles when a sound is ended.
    function onStartAudio(){
        btnPlay.style = "position: absolute;";
        btnPlay.style = "display: none;"

        btnStop.style = "position: relative;";
        btnStop.style = "display: unset;"
    }

    //--------------------| AUDIO STOP |-------------------//
    // Changing the styles of the buttons when a sound is stopped.
    // This function is called in all three game types and sets the
    // button styles when a sound is ended.
    function onEndAudio() {
        btnPlay.style = "filter: invert(100%)";
        btnStop.style = "display: none;";

        if ($('#submitOnOff').prop('checked') == true) {
            btnUAnswer.style = "color: white; filter: invert(100%);";
            btnUAnswer.disabled = false;

            btnCAnswer.style = "color: white; filter: invert(100%);";
            btnCAnswer.disabled = false;
        }
    }
    
    //------------------| PLAY TONE |-------------------//
    // A new oscillator is created everytime the sound is played and is
    // destroyed once stopped. The audio is connected to a gain node
    // and is used to prevent clicking when the sound is stopped.
    // The tone will also be stopped after 2 seconds if the loop button 
    // is not pressed. The random frequency generated is recieved in 
    // this function.
    function playTone(a){

        // creating new oscillatore and can node
        var osc = audioCtx.createOscillator();
        var toneGain = audioCtx.createGain();

        // setting frequency to the randomly generated freq number,
        // setting the oscillator type (fixed on sine) and the gain
        // value is set to 0, but then gradually increased(stop pops and clicks).
        // The oscillator is connected to the gain node, and the gain node
        // is connected to the audio context.
        osc.frequency.value = a;
        osc.type = 'sine';
        toneGain.gain.value = 0;
        osc.connect(toneGain);
        toneGain.connect(audioCtx.destination);
        osc.start();
        toneGain.gain.setTargetAtTime(0.2, audioCtx.currentTime, 0.015);
        onStartAudio();

        // Stop sound if the 'loop' button is not on.
        if ($("#loop").prop("checked") == false) {
            setTimeout(function() {
                toneGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
                setTimeout(function() {
                    osc.stop(audioCtx.currentTime);
                }, 100)
            }, 2000)
        }

        // Stop if the loop button is switched off.
        $("#loop").click(function () {

            if ($(this).prop("checked") == false) {
                setTimeout(function() {
                    toneGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
                    setTimeout(function() {
                        osc.stop(audioCtx.currentTime);
                    }, 100)
                }, 2000)
            }

        });
        
        // Turns down gain gradually before stopping the audio when the stop button is
        // used.
        $('#stop').click(function () {
            toneGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
            setTimeout(function() {
                osc.stop(audioCtx.currentTime);
            }, 100);

        })

        //enable play button and hide stop button on sound end.
        osc.onended = function () {
            onEndAudio();
        }


    }
   
    //------------------| PLAY NOISE |-------------------//
    // A new buffer is created everytime the sound is played and is
    // destroyed once stopped. The audio is connected to a gain node
    // and is used to prevent clicking when the sound is stopped.
    // The noise buffer will continue playing if the loop button is
    // on, otherwise it will stop once the end of the buffer is reached.
    // Noise buffer is filled with the noise generated in line 60 - 75.
    function playNoise(){

        var noiseSource = audioCtx.createBufferSource();
        var noiseGain = audioCtx.createGain();

        noiseSource.buffer = noiseBuffer;
        noiseGain.gain.value = 0.0;
        noiseSource.connect(noiseGain);
        noiseGain.connect(filter);
        filter.connect(audioCtx.destination);
        noiseSource.start();
        noiseGain.gain.setTargetAtTime(0.1, audioCtx.currentTime, 0.015);
        onStartAudio();


        //Loop sound when loop button is on. Otherwise, don't loop. 
        if ($("#loop").prop("checked") == true) {
            noiseSource.loop = true;
        }
        else {
            noiseSource.loop = false;
        }


        //When loop button is clicked, loop buffer or stop buffer.
        $("#loop").click(function () {

            if ($(this).prop("checked") == true) {
                noiseSource.loop = true;
                noiseSource.loopStart = 0;
            }
            else {
                noiseSource.loop = false;
            }
        });

        // Turns down gain gradually before stopping the audio when the stop button is
        // used.
        $('#stop').click(function () {
            noiseGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
            setTimeout(function() {
                noiseSource.stop(audioCtx.currentTime);
            }, 100)

        })

        //enable play button and hide stop button on sound end.
        noiseSource.onended = function () {
            onEndAudio();
        }

    }


    //------------------| PLAY SAMPLE |-------------------//
    // A new buffer is created everytime the sound is played and is
    // destroyed once stopped. The audio is connected to a gain node
    // and is used to prevent clicking when the sound is stopped.
    // The sample buffer will continue playing if the loop button is
    // on, otherwise it will stop once the end of the buffer is reached.
    // The sample buffer is filled with the sample loaded from the function
    // called loadTrack in line 96 - 111.
    function playSample(a) {

        var playSound = audioCtx.createBufferSource();
        var sampleGain = audioCtx.createGain();
        
        playSound.buffer = audioBuffer;
        sampleGain.gain.value = 1;
        playSound.connect(sampleGain);
        sampleGain.connect(filter);
        filter.connect(audioCtx.destination);
        playSound.start();
        onStartAudio();

        //Loop sound when loop button is on. Otherwise, don't loop. 
        if ($("#loop").prop("checked") == true) {
            playSound.loop = true;
        }
        else {
            playSound.loop = false;
        }


        //When loop button is clicked, loop buffer or stop buffer.
        $("#loop").click(function () {

            if ($(this).prop("checked") == true) {

                playSound.loop = true;
                playSound.loopStart = 0;

            }
            else {
                playSound.loop = false;
            }
        });

        // Turns down gain gradually before stopping the audio when the stop button is
        // used.
        $('#stop').click(function () {

            sampleGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
            setTimeout(function() {
                playSound.stop(audioCtx.currentTime);
            }, 100)


        })

        //enable play button and hide stop button on sound end.
        playSound.onended = function () {
            onEndAudio();
        }

    };

    // Call the two functions when the app is loaded.
    randomFrequency();
    rightAnswer();


    //----------------------------------------------------------//
    //----------------------| USER INPUT |----------------------//
    //----------------------------------------------------------//

    //------------------| MAIN MENU |-------------------//
    // Each button in the main menu will change the game title 
    // with the game type added onto it. The filter button is disabled
    // and greyed out for the tone option as it is not used and enabled
    // for the ramining game types. The difficulty page is shown to 
    // used and the setting are all set to inital.
    $('#tone').click(function () {
        title.innerHTML = "Cycles Per Second: Tone";
        btnFilter.disabled = true;
        btnFilter.style = "filter: invert(20%);"
        $('#mainMenuWrapper').slideUp(400);
        document.getElementById('difficultyWrapper').style = "display: inline-block;";

        resetData();
    });

    $('#noise').click(function () {
        title.innerHTML = "Cycles Per Second: Noise";
        btnFilter.disabled = false;
        btnFilter.style = "filter: invert(100%);";
        filter.gain.value = 10;
        $('#mainMenuWrapper').slideUp(400);
        document.getElementById('difficultyWrapper').style = "display: inline-block;";

        resetData();
    });

    $('#instruments').click(function () {
        title.innerHTML = "Cycles Per Second: Samples";
        btnFilter.disabled = false;
        btnFilter.style = "filter: invert(100%);";
        filter.gain.value = 10;
        $('#mainMenuWrapper').slideUp(400);
        document.getElementById('difficultyWrapper').style = "display: inline-block;";

        resetData();
    });


    //--------------- DIFFICULTY SELECT ------------------//
    // The difficulty buttons change the size of the shaded area 
    // on the frequency slider, where if the correct frequency is 
    // inside, the user gets question right. The easiest mode has 
    // the largest range, and insane mode has the shortest
    
    // back button allows the user to go back to the main menu
    $('#dBack').click(function () {
        $('#mainMenuWrapper').slideDown(400);
        setTimeout(function () {
            document.getElementById('difficultyWrapper').style = "display: none;";
        }, 400)
    });
    $('#easy').click(function () {
        difficulty = 30;
        sampleView();
        loadDifficulty();
    });
    $('#medium').click(function () {
        difficulty = 20;
        sampleView();
        loadDifficulty();
    });
    $('#hard').click(function () {
        difficulty = 10;
        sampleView();
        loadDifficulty();
    });
    $('#veryHard').click(function () {
        difficulty = 5;
        sampleView();
        loadDifficulty();
    });
    $('#insane').click(function () {
        difficulty = 2;
        sampleView();
        loadDifficulty();
    });

    //---------------SAMPLE SELECT------------------//
    // The sample select buttons send the correct url to the 'loadtrack'
    // function to be read and ready to play. The closeSampleView function 
    // is also called to hide the sample select page and open the game panel.

     $('#sBack').click(function () {
        $('#difficultyWrapper').slideDown(400);
        $('#diffTitle').show();
        setTimeout(function () {
            document.getElementById('sampleWrapper').style = "display: none;";
        }, 400)
    });

    // DRUMS
    $('#kick').click(function () {
        loadTrack("samples/Drums/Kick.wav");
        closeSampleView();
    });
    $('#snare').click(function () {
        loadTrack("samples/Drums/Snare.wav");
        closeSampleView();
    });
    $('#hats').click(function () {
        loadTrack("samples/Drums/Hats.wav");
        closeSampleView();
    });
    $('#rTom').click(function () {
        loadTrack("samples/Drums/HiTom.wav");
        closeSampleView();
    });
    $('#fTom').click(function () {
        loadTrack("samples/Drums/LowTom.wav");
        closeSampleView();
    });

    // STRINGS
    $('#bass').click(function () {
        loadTrack("samples/Bass/Bass.wav");
        closeSampleView();
    });
    $('#guiAcoustic').click(function () {
        loadTrack("samples/Guitar/ac-gui.wav");
        closeSampleView();
    });
    $('#guiRiff').click(function () {
        loadTrack("samples/Guitar/riff.wav");
        closeSampleView();
    });
    $('#guiBlues').click(function () {
        loadTrack("samples/Guitar/blues.wav");
        closeSampleView();
    });

    // PIANO AND SAX
    $('#piano').click(function () {
        loadTrack("samples/PianoSax/piano.wav");
        closeSampleView();
    });
    $('#saxBreathy').click(function () {
        loadTrack("samples/PianoSax/breathySax.wav");
        closeSampleView();
    });
    $('#saxTwindling').click(function () {
        loadTrack("samples/PianoSax/twindlingSax.wav");
        closeSampleView();
    });

    // VOCALS
    $('#voxMale').click(function () {
        loadTrack("samples/Vocals/Male.wav");
        closeSampleView();
    });
    $('#voxFemale').click(function () {
        loadTrack("samples/Vocals/Female.wav");
        closeSampleView();
    });

    //------------------| FREQUENCY SLIDER |-------------------//
    // The input range slider is used to select a frequency which is thought
    // to be correct. The values of the range slider are scalled up to the
    // match the pixel width of which the input slider occupies. This is done
    // to position the grace margin in which the correct frequency lies. 
    // The value of the slider is then scaled up in 9 different sections, 
    // creating frequency bins and an ideal frequency spectrum.
    freqSlider.oninput = function () {

        location  =  freqSlider.offsetWidth;


        freqOutput.hidden = false;
        
        // Setting the grace margin to the correct position.
        per = (this.value - 4) / (95.63 - 4);
        freqOutput.innerHTML = this.value;
        pixVal = per * location;
        eqRange.style.left = pixVal - margin;

        // setting the number of the frequency being selected to always
        // stay within the frequency specrum when moved.
        if (this.value >= 85) {
            freqOutput.style.left = per * (location * 0.94);
        }
        else {
            var per2 = (this.value - 65) / (80 - 65);
            freqOutput.style.left = (per * (location * 0.97)) - (per2 * 10);
        }

        document.getElementById("submit").disabled = false;

        // scaling the input slider values to frequency values.
        if (freqOutput.innerHTML <= 20) {
            freqOutput.innerHTML = (this.value * 5);
        }
        else if (freqOutput.innerHTML > 20 && freqOutput.innerHTML <= 30) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 20) * 10 + 100;
        }
        else if (freqOutput.innerHTML > 30 && freqOutput.innerHTML <= 40) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 30) * 20 + 200;
        }
        else if (freqOutput.innerHTML > 40 && freqOutput.innerHTML <= 50) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 40) * 40 + 400;
        }
        else if (freqOutput.innerHTML > 50 && freqOutput.innerHTML <= 60) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 50) * 80 + 800;
        }
        else if (freqOutput.innerHTML > 60 && freqOutput.innerHTML <= 70) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 60) * 160 + 1600;
        }
        else if (freqOutput.innerHTML > 70 && freqOutput.innerHTML <= 80) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 70) * 320 + 3200;
        }
        else if (freqOutput.innerHTML > 80 && freqOutput.innerHTML <= 90) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 80) * 640 + 6400;
        }
        else if (freqOutput.innerHTML > 90 && freqOutput.innerHTML <= 95.63) {
            freqOutput.innerHTML = (freqOutput.innerHTML - 90) * 1280 + 12794;
        }

        // rounding the frequency value to a whole number
        freqOutNum = Math.round(freqOutput.innerHTML);

        freqOutput.innerHTML = Math.round(freqOutput.innerHTML) + " Hz";

        document.getElementById('submit').style = "filter: invert(100%);"
    }


    //------------------| PLAY |-------------------//
    //Calls the correct play function depending on the game type.
    $('#play').click(function () {
       
        if (title.innerHTML == "Cycles Per Second: Tone"){
            playTone(freq);
        }
        else if(title.innerHTML == "Cycles Per Second: Noise"){
            playNoise();
        }
        else {
            playSample();
        }

    });

    //------------------| SUBMIT |-------------------//
    
    $("#submit").click(function () {

        $("#submitOnOff").click();

        location = freqSlider.offsetWidth;

        var rfPixPos = cFreqPerc * location;

        $('#stop').click();

        btnSub.style = "display: none;";
        btnSub.disabled = true;
        btnCAnswer.disabled = false;
        btnUAnswer.disabled = false;
        btnNext.style = "display: unset;";
        btnUAnswer.style = "color: white; filter: invert(100%);";
        btnCAnswer.style = "color: white; filter: invert(100%);";

        freqSlider.disabled = true;

        if (rfPixPos >= pixVal - margin && rfPixPos <= pixVal + margin) {
            document.getElementById("resultText").innerHTML = "Correct!";
            freqVis.style = "display: block; background-color: rgb(0, 190, 0);";
            freqNum.style = "display: block; color: rgb(0, 255, 0);";
            rightAnswer();
            rightAns += 1;
        }
        else {
            document.getElementById("resultText").innerHTML = "Wrong!";
            freqVis.style = "display: block; background-color: rgb(180, 128, 0);";
            freqNum.style = "display: block; color: rgb(255, 128, 0);";
            rightAnswer();
        }

        if (qNum > 9) {
            $("#next").hide(0);
            $("#finish").show(0);
            qNum = 0;

        }

    });

    $("#filter").click(function () {


        if (filter.gain.value > 0) {
            filter.gain.value = 0;
            btnFilter.style = "filter: invert(20%);";
        }
        else {
            filter.gain.value = 10;
            btnFilter.style = "filter: invert(100%);";
        }

    });

    $("#userAnswer").click(function () {

        $('#stop').click();

        //ramp down filter gain by 15 miliseconds
        filter.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
        //delay filter frequency value by 15 miliseconds
        setTimeout(function () {
            filter.frequency.value = freqOutNum;
            // document.getElementById("frequency-select").innerHTML;
        }, 15);
        //ramp up filter gain by 15 miliseconds, after a delay of 20 miliseconds
        setTimeout(function () {
            filter.gain.setTargetAtTime(10, audioCtx.currentTime, 0.015);
        }, 20)

        setTimeout(function () {
            btnUAnswer.style = "filter: invert(20%); color: white;";
            btnUAnswer.disabled = true;

            if (title.innerHTML == "Cycles Per Second: Tone"){
                playTone(freqOutNum);
            }
            else{
                $('#play').click();
                btnFilter.style = "filter: invert(100%);";
            }

        }, 200);

    });

    $("#cAnswer").click(function () {

        $('#stop').click();

        filter.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
        setTimeout(function () {
            filter.frequency.value = freq;
        }, 15)
        setTimeout(function () {
            filter.gain.setTargetAtTime(10, audioCtx.currentTime, 0.015);
        }, 20)

        setTimeout(function () {
            btnCAnswer.style = "filter: invert(20%); color: white;";
            btnCAnswer.disabled = true;
            if (title.innerHTML == "Cycles Per Second: Tone"){
                playTone(freq);
            }
            else{
                $('#play').click();
                btnFilter.style = "filter: invert(100%);";
            }
            
        }, 200);

    });

    $("#next").click(function () {

        $("#stop").click();

        randomFrequency();

        freqSlider.disabled = false;
        btnCAnswer.disabled = true;
        btnUAnswer.disabled = true;

        qNum += 1;

        document.getElementById("qNum").innerHTML = qNum.toString();

        $("#submitOnOff").click();

        btnSub.style = "display: block;";
        btnNext.style = "display: none;";
        btnUAnswer.style = "color: black; filter: invert(0%);";
        btnCAnswer.style = "color: black; filter: invert(0%);";

        freqVis.style = "display: none;";
        freqNum.style = "display: none;";

        document.getElementById("resultText").innerHTML = "";

        btnSub.disabled = true;


        
        setTimeout(function () {
            $('#play').click()
        }, 150);
    });

    $('#repeat').click(function () {

        var repeatState = document.getElementById('repeat');

        $('#loop').click();

        if ($('#loop').prop("checked") == true) {
            repeatState.style = "filter: invert(100%)"

        }
        else {
            repeatState.style = "filter: invert(20%)"
        }
    });

    $("#finish").click(function () {

        scorePerc = (rightAns / 10) * 100

        if (rightAns == 10) {
            score.innerHTML = "Perfect Score: " + scorePerc + "%";
        }
        else if (rightAns >= 7) {
            score.innerHTML = "Good Job: " + scorePerc + "%";
        }
        else if (rightAns >= 4) {
            score.innerHTML = "Nice Try: " + scorePerc + "%";
        }
        else if (rightAns < 4) {
            score.innerHTML = "Keep Practicing: " + scorePerc + "%";
        }

        $('#stop').click();
        $('#title').slideUp(100);
        $('#eq-input').slideUp(200);
        $('#panel').slideUp(400);
        $('#qMenuWrapper').show(0);
        $('#tryAgain').show();
        $('#toMainMenu').show();
        $('#exitMenu').hide();

    });

    $('#tryAgain').click(function () {

        $('#title').slideDown(100);
        $('#eq-input').slideDown(200);
        $('#panel').slideDown(400);
        $('#qMenuWrapper').hide(0);
        $('#tryAgain').hide(0);
        $('#exitMenu').show(0);

        resetData()
    });

    $('#qMenu').click(function () {

        $('#title').slideUp(100);
        $('#eq-input').slideUp(200);
        $('#panel').slideUp(400);
        $('#qMenuWrapper').show(0);
        $('#stop').click();

        score.innerHTML = "Menu";

    });

    $('#exitMenu').click(function () {

        $('#title').slideDown(100);
        $('#eq-input').slideDown(200);
        $('#panel').slideDown(400);
        $('#qMenuWrapper').hide(0);

    });

    $('#toMainMenu').click(function () {

        freqOutput.hidden = true;
        freqVis.style = "display: none;";
        freqNum.style = "display: none;";

        $('#title').slideDown(50);
        $('#eq-input').slideDown(100);
        $('#panel').slideDown(400);
        $('#qMenuWrapper').hide(0);
        $('#panel').hide(0);
        $('#mainMenuWrapper').slideDown(600);

        $('#tryAgain').hide();
        $('#exitMenu').show();
        $('#diffTitle').show();
    });



});
