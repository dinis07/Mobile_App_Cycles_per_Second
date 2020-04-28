$(document).ready(function () {


    var screenWidth = screen.width - 16;
    var screenHeight = screen.height - 16;
    var panInactive = document.getElementById('panel-inactive');
    var freqSlider = document.getElementById("frequency-select");
    var freqOutput = document.getElementById("freqNum");
    var eqRange = document.getElementById('eq-range');
    var title = document.getElementById('title');
    var btnSub = document.getElementById('submit');
    var btnNext = document.getElementById('next');
    var btnUAnswer = document.getElementById("userAnswer");
    var btnCAnswer = document.getElementById("cAnswer");
    var score = document.getElementById('score');
    var btnPlay = document.getElementById("play");
    var btnStop = document.getElementById("stop");
    var btnFilter = document.getElementById('filter');


    var difficulty = 20;
    var per;
    var pixVal;
    var margin;
    var rightAns = 0;
    var scorePerc;
    var freq;
    var qNum = 1;
    var cFreqPos;
    var cFreqPerc;
    var freqVis;
    var freqNum;
    // var answer = freqNum;

    var audioCtx = new AudioContext();
    var filter = audioCtx.createBiquadFilter();
    var audioBuffer;
    var getSound = new XMLHttpRequest();



    var inputWidth = screenWidth * 0.95;
    // var inputHeight = screenHeight * 0.95;
    var inputRangeWidth

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

    function loadDifficulty() {
        $('#diffTitle').hide(0);
        inputRangeWidth = (inputWidth / 2) - ((inputWidth * (difficulty / 100)) / 2);
        eqRange.style.width = difficulty + "%";
        eqRange.style.left = inputRangeWidth;
        margin = (inputWidth * (difficulty / 100)) / 2;
        freqSlider.value = "unset";
        freqOutput.hidden = true;
    }

    panInactive.style.width = screenWidth;
    panInactive.style.height = screenHeight;

    freqSlider.style.width = inputWidth;

    //Filter Values
    filter.type = "peaking";
    filter.gain.value = 10;
    filter.Q.value = 1;

    //--------------------| Loading Sample |-------------------//
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
    //--------------------| END Loading Sample |-------------------//

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
    //-------------------| ENDGENERATE NOISE |-----------------//  

    //--------------------| Generate Random Frequency |-------------------//
    function randomFrequency() {
        //Generating a random number between 1 and 100 to later be used as the
        //frequency of noise boost
        freq = (Math.random() * 100).toFixed(1);

        //Creating a 50% chance that the random number genertated will
        //be between 20 and 2000, a 25% chance the random number will be 
        //between 2001 and 10 000 and a 25% chance the random number will be
        //between 10 001 and 20 000
        if (freq <= 65) {

            freq = (Math.random() * 1980 + 20).toFixed(0);

            // document.getElementById("cAnswer").innerHTML = freq;
        }
        else if (freq <= 90 && freq > 65) {
            freq = (Math.random() * 8000 + 2000).toFixed(0);
            // document.getElementById("cAnswer").innerHTML = freq;
        }
        else {
            freq = (Math.random() * 10000 + 10000).toFixed(0);
            // document.getElementById("cAnswer").innerHTML = freq;
        }

        filter.frequency.value = freq;

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
        freqVis = document.getElementById('cFreq');
        freqNum = document.getElementById('cFreqNum');

        answer = freqNum;


        answer.innerHTML = freq + " Hz";

    }

    randomFrequency();

     function rightAnswer() {

        freqVis.style.left = cFreqPerc * inputWidth;


        var sliderVal = cFreqPerc * 95.63;

        if (sliderVal >= 85) {

            freqNum.style.left = cFreqPerc * (inputWidth * 0.94);

        }
        else {
            var cFreqPerc1 = (sliderVal - 65) / (80 - 65);
            freqNum.style.left = (cFreqPerc * (inputWidth * 0.97)) - (cFreqPerc1 * 10);
        }
    }

    //------------------| END Generate Random Frequency |-----------------//
    
    //------------------| PLAY TONE |-------------------//
    function playTone(a){

        var osc = audioCtx.createOscillator();
        var toneGain = audioCtx.createGain();


        
        osc.frequency.value = a;

        osc.type = 'sine';
        toneGain.gain.value = 0.2;
        osc.connect(toneGain);
        toneGain.connect(audioCtx.destination);
        osc.start();

        //--------------------------------------------//

        //Loop sound when input is "checked"
        if ($("#loop").prop("checked") == false) {
            setTimeout(function() {
                osc.stop(audioCtx.currentTime, 0.15);
            }, 3000)
        }


        //When the check box is clicked, call function
        $("#loop").click(function () {

            if ($(this).prop("checked") == true) {
                setTimeout(function() {
                    osc.stop(audioCtx.currentTime, 0.15);
                }, 3000)
            }

        });


        $("#finish").click(function () {

            osc.stop(audioCtx.currentTime, 0.15);

        });

        $('#stop').click(function () {

            osc.stop(audioCtx.currentTime, 0.15);

        })

        btnPlay.style = "position: absolute;";
        btnPlay.style = "display: none;"

        btnStop.style = "position: relative;";
        btnStop.style = "display: unset;"

        // btnPlay.style = "filter: invert(20%)";

        //enable play button ones play ends
        osc.onended = function () {
            btnPlay.style = "filter: invert(100%)";
            btnStop.style = "display: none;";

            if ($('#submitOnOff').prop('checked') == true) {
                btnUAnswer.style = "color: white; filter: invert(100%);";
                btnUAnswer.disabled = false;

                btnCAnswer.style = "color: white; filter: invert(100%);";
                btnCAnswer.disabled = false;
            }
        }


    }
    //----------------| END PLAY TONE |----------------//


    //------------------| PLAY NOISE |-------------------//
    function playNoise(){

        var noiseSource = audioCtx.createBufferSource();
        var noiseGain = audioCtx.createGain();

        noiseSource.buffer = noiseBuffer;
        noiseGain.gain.value = 0.1;
        noiseSource.connect(noiseGain);
        noiseGain.connect(filter);
        filter.connect(audioCtx.destination);
        noiseSource.start();

        //Loop sound when input is "checked"
        if ($("#loop").prop("checked") == true) {
            noiseSource.loop = true;
        }
        else {
            noiseSource.loop = false;
        }


        //When the check box is clicked, call function
        $("#loop").click(function () {

            if ($(this).prop("checked") == true) {
                noiseSource.loop = true;
                noiseSource.loopStart = 0;
            }
            else {
                noiseSource.loop = false;
            }
        });


        $("#finish").click(function () {

            noiseSource.stop(audioCtx.currentTime, 0.15);

        });

        $('#stop').click(function () {

            noiseSource.stop(audioCtx.currentTime, 0.15);

        })

        btnPlay.style = "position: absolute;";
        btnPlay.style = "display: none;"

        btnStop.style = "position: relative;";
        btnStop.style = "display: unset;"

        // btnPlay.style = "filter: invert(20%)";

        //enable play button ones play ends
        noiseSource.onended = function () {
            btnPlay.style = "filter: invert(100%)";
            btnStop.style = "display: none;";

            if ($('#submitOnOff').prop('checked') == true) {
                btnUAnswer.style = "color: white; filter: invert(100%);";
                btnUAnswer.disabled = false;

                btnCAnswer.style = "color: white; filter: invert(100%);";
                btnCAnswer.disabled = false;
            }
        }


    }
    //----------------| END PLAY NOISE |----------------//


    //------------------PLAY SAMPLE-------------------//
    function playSample(a) {

        var playSound = audioCtx.createBufferSource();

        playSound.buffer = audioBuffer;
        playSound.connect(filter);
        filter.connect(audioCtx.destination);
        playSound.start();

        //Loop sound when input is "checked"
        if ($("#loop").prop("checked") == true) {
            playSound.loop = true;
        }
        else {
            playSound.loop = false;
        }


        //When the check box is clicked, call function
        $("#loop").click(function () {

            if ($(this).prop("checked") == true) {

                playSound.loop = true;
                playSound.loopStart = 0;

            }
            else {
                playSound.loop = false;
            }
        });


        $("#finish").click(function () {

            playSound.stop(audioCtx.currentTime, 0.15);

        });

        $('#stop').click(function () {

            playSound.stop(audioCtx.currentTime, 0.15);

        })

        btnPlay.style = "position: absolute;";
        btnPlay.style = "display: none;"

        btnStop.style = "position: relative;";
        btnStop.style = "display: unset;"

        // btnPlay.style = "filter: invert(20%)";

        //enable play button ones play ends
        playSound.onended = function () {
            btnPlay.style = "filter: invert(100%)";
            btnStop.style = "display: none;";

            if ($('#submitOnOff').prop('checked') == true) {
                btnUAnswer.style = "color: white; filter: invert(100%);";
                btnUAnswer.disabled = false;

                btnCAnswer.style = "color: white; filter: invert(100%);";
                btnCAnswer.disabled = false;
            }
        }

    };
    //---------------- END PLAY SAMPLE-------------------//

    rightAnswer();

    //---------------- USER INPUT -------------------//    
    freqSlider.oninput = function () {

        freqOutput.hidden = false;

        per = (this.value - 4) / (95.63 - 4);

        freqOutput.innerHTML = this.value;

        pixVal = per * inputWidth;

        eqRange.style.left = pixVal - margin;

        if (this.value >= 85) {

            freqOutput.style.left = per * (inputWidth * 0.94);

        }
        else {
            var per2 = (this.value - 65) / (80 - 65);
            freqOutput.style.left = (per * (inputWidth * 0.97)) - (per2 * 10);
        }

        document.getElementById("submit").disabled = false;

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

        freqOutNum = Math.round(freqOutput.innerHTML);

        freqOutput.innerHTML = Math.round(freqOutput.innerHTML) + " Hz";

        document.getElementById('submit').style = "filter: invert(100%);"
    }


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

    $("#submit").click(function () {

        $("#submitOnOff").click();

        var rfPixPos = cFreqPerc * inputWidth;

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
            }

        }, 50);

    });

    $("#cAnswer").click(function () {

        $('#stop').click();

        filter.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
        setTimeout(function () {
            filter.frequency.value = freq;
            // document.getElementById("frequency-select").innerHTML;
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
            }
            
        }, 50);

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
        }, 100);
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
        

        qNum = 0;
        rightAns = 0;
        $('#next').click();


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

    //---------------- END USER INPUT-------------------//

    // MAIN MENU

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
        btnFilter.style = "filter: invert(100%);"
        $('#mainMenuWrapper').slideUp(400);
        document.getElementById('difficultyWrapper').style = "display: inline-block;";

        resetData();
    });

    $('#instruments').click(function () {
        title.innerHTML = "Cycles Per Second: Instruments";
        btnFilter.disabled = false;
        btnFilter.style = "filter: invert(100%);"
        $('#mainMenuWrapper').slideUp(400);
        document.getElementById('difficultyWrapper').style = "display: inline-block;";

        resetData();
    });

    //--------------- DIFFICULTY ------------------//

    function sampleView() {
        $('#difficultyWrapper').slideUp(400);

        if (title.innerHTML == "Cycles Per Second: Instruments") {

            document.getElementById('sampleWrapper').style = "display: inline-block;";
        }
        else {
            document.getElementById('panel').style = "display: inline-block;";
        }
    }


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

    //---------------END DIFFICULTY------------------//


    //---------------SAMPLE SELECT------------------//


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
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#snare').click(function () {
        loadTrack("samples/Drums/Snare.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#hats').click(function () {
        loadTrack("samples/Drums/Hats.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#rTom').click(function () {
        loadTrack("samples/Drums/HiTom.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#fTom').click(function () {
        loadTrack("samples/Drums/LowTom.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    // STRINGS
    $('#bass').click(function () {
        loadTrack("samples/Bass/Bass.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    $('#guiAcoustic').click(function () {
        loadTrack("samples/Guitar/ac-gui.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#guiRiff').click(function () {
        loadTrack("samples/Guitar/riff.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#guiBlues').click(function () {
        loadTrack("samples/Guitar/blues.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    // PIANO AND SAX
    $('#piano').click(function () {
        loadTrack("samples/PianoSax/piano.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    $('#saxBreathy').click(function () {
        loadTrack("samples/PianoSax/breathySax.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#saxTwindling').click(function () {
        loadTrack("samples/PianoSax/twindlingSax.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    // VOCALS
    $('#voxMale').click(function () {
        loadTrack("samples/Vocals/Male.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });
    $('#voxFemale').click(function () {
        loadTrack("samples/Vocals/Female.wav");
        $('#sampleWrapper').slideUp(400)
        document.getElementById('panel').style = "display: inline-block;";
    });

    //--------------- END SAMPLE SELECT ---------------//

});
