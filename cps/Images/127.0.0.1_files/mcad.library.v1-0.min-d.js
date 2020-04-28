/*
 mcad.library.v1-0 (debug) 2017-02-01 
*/
function BufferLoader(a){if(console.info("%cBufferLoader.BufferLoader:%c Creating buffer loader instance...","font-weight: bold; background-color:CornflowerBlue;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),null===a)throw new TypeError("(BufferLoader.BufferLoader) Invalid AudioContext (did you make a typo or forget to create the context?");this._context=a,this._downloadQueue={},this._downloadIndex=0}function Mseg(){console.info("%cMseg.Mseg:%c Creating MSEG instance...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),this._stages=[],this._release=[0,0],this._stageLengthInSeconds=0}function Scheduler(a,b){if(console.info("%cScheduler.Scheduler:%c Creating Scheduler instance...","font-weight: bold; background-color:LightSeaGreen;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),null===a)throw new TypeError("(Scheduler.Scheduler) Invalid AudioContext (did you make a typo or forget to create the context?");this.tempo=60,this.stepsPerBeat=4,this.beatsPerPattern=4,this.swing=0,this.maxSwing=.5,this.isPlaying=!1,this.resumePlayback=!1,this.resumeStamp=this.createStepStamp(0,0,0),this.stopStamp=this.createStepStamp(0,0,0),this.event={},this.scheduleAheadTime=.02,this.lookAheadTime=.01,"undefined"!=typeof b&&(b.lookAheadTime&&(this.lookAheadTime=b.lookAheadTime),b.scheduleAheadTime&&(this.scheduleAheadTime=b.scheduleAheadTime),b.maxSwing&&(this.maxSwing=b.maxSwing),b.beatsPerPattern&&(this.beatsPerPattern=b.beatsPerPattern),b.stepsPerBeat&&(this.stepsPerBeat=b.stepsPerBeat),b.tempo&&(this.tempo=b.tempo),this.event={onQueue:b.onQueue,onAnim:b.onAnim,onTween:b.onTween}),this._context=a,this._scheduleId=null,this._animId=null,this._tween=0,this._stepTime=0,this._startTime=null,this._currentStamp=this.createStepStamp(0,0,0),this._stepsInAnimationQueue=[],this._lastStepAnimated={time:this.createTimeStamp(0,0),stamp:this.createStepStamp(0,0,-1)},console.info("%cScheduler.Scheduler:%c Tempo: "+this.tempo+", Steps Per Beat: "+this.stepsPerBeat+", Beats Per Pattern: "+this.beatsPerPattern,"font-weight: bold; background-color:LightSeaGreen;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),console.info("%cScheduler.Scheduler:%c onQUeue: "+this.event.onQueue+", onAmim: "+this.event.onAnim+", onTween: "+this.event.onTween,"font-weight: bold; background-color:LightSeaGreen;font-size:12px;","color: grey; font-style:bold;font-size:12px;")}function Rotary(a,b){this._onChange=b.onChange,this._selector=a,this._image_src=b.image_src,this._width=b.width,this._height=b.height,this._pMin=b.paramMin,this._pMax=b.paramMax,this._pVal=this._pMin,this._degMin=225,b.degMin&&(this._degMin=b.degMin),this._degMax=135,b.degMax&&(this._degMax=b.degMax),this._valOffset=360-this._degMin,this._valRange=this._valOffset+this._degMax,this._valNormOffset=this._valOffset/this._valRange,this._rVal=this._degMin,this._lastSide=0,this._nVal=0,$(this._selector).css("width",this._width),$(this._selector).css("height",this._height),$(this._selector).append("<img></img>"),$(this._selector+" img").attr("src",this._image_src),$(this._selector+" img").css("width",this._width),$(this._selector+" img").css("height",this._height),$(this._selector+" img").css("user-select","none"),this._rotate(0),this._downY=0,this._capturing=!1;var c,d=this;$(this._selector).mousedown(function(a){a.stopPropagation&&a.stopPropagation(),a.preventDefault&&a.preventDefault(),a.cancelBubble=!0,a.returnValue=!1,d._capturing=!0,d._downY=a.pageY}),$(this._selector).mouseup(function(a){d._capturing=!1}),$(this._selector).mouseleave(function(a){d._capturing=!1}),$(this._selector).mousemove(function(a){if(a.stopPropagation&&a.stopPropagation(),a.preventDefault&&a.preventDefault(),a.cancelBubble=!0,a.returnValue=!1,d._capturing){var b=d._downY-a.pageY;d._downY=a.pageY,d._rotate(b)}}),b.pinch&&b.pinch!==!0||(this._rotaryHammer=new Hammer($(a)[0]),this._rotaryHammer.get("rotate").set({enable:!0}),this._rotaryHammer.on("rotatestart",function(a){console.log("START"),console.log(a.rotation),console.log("----------"),c=a.rotation}),this._rotaryHammer.on("rotate",function(a){var b=a.rotation-c;d._rotate(b),c=a.rotation})),b.pan&&b.pan!==!0||(this._rotaryHammer.get("pan").set({direction:Hammer.DIRECTION_ALL}),this._rotaryHammer.on("panup pandown",function(a){d._rotate(-25*a.velocity)}))}BufferLoader.prototype.loadBufferList=function(a,b,c,d){if(console.info("%cBufferLoader.loadBufferList:%c Loading sample list/array...","font-weight: bold; background-color:CornflowerBlue;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(b),null===b)throw new TypeError("(BufferLoader.loadBufferList) List of samples to load is invalid");this._downloadQueue[this._downloadIndex]={},this._downloadQueue[this._downloadIndex].urls={},this._downloadQueue[this._downloadIndex].loaded=0,this._downloadQueue[this._downloadIndex].size=0;for(var e in b)"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=2&&console.info("%cBufferLoader.loadBufferList:%c Adding "+b[e]+" with key "+e+" to decode queue...","font-weight: bold; background-color:CornflowerBlue;font-size:8px;","color: grey; font-style:italic;font-size:8px;"),this._downloadQueue[this._downloadIndex].urls[e]=b[e],this._downloadQueue[this._downloadIndex].size++;this._loadQueue(a,this._downloadIndex++,c,d)},BufferLoader.prototype._loadQueue=function(a,b,c,d){"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.info("%cBufferLoader._loadQueue:%c Loading sample queue...","font-weight: bold; background-color:CornflowerBlue;font-size:10px;","color: grey; font-style: normal;font-size:10px;");var e=this._downloadQueue;for(var f in e[b].urls)"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.info("%cBufferLoader._loadQueue:%c Attempting to decode sample "+e[b].urls[f]+" with key "+f+"...","font-weight: bold; background-color:CornflowerBlue;font-size:10px;","color: grey; font-style: normal;font-size:10px;"),this.loadBuffer({url:e[b].urls[f],key:f},function(f,g){a[g.key]=f,d&&d({url:g.url,key:g.key,success:!!f}),++e[b].loaded>=e[b].size&&("undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.info("%cBufferLoader._loadQueue:%c Finished loading "+e[b].size+" samples","font-weight: bold; background-color:CornflowerBlue;font-size:10px;","color: grey; font-style: normal;font-size:10px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=2&&console.debug(e[b].urls),delete e[b],c())})},BufferLoader.prototype.loadBuffer=function(a,b){if(console.info("%cBufferLoader.loadBuffer:%c Loading buffer...","font-weight: bold; background-color:CornflowerBlue;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a),null===a)throw new TypeError("(BufferLoader.loadBuffer) Sample resource to load is invalid");var c,d=this;c="string"==typeof a||a instanceof String?a:a.url;var e=new XMLHttpRequest;e.open("GET",c,!0),e.responseType="arraybuffer",e.onload=function(){d._context.decodeAudioData(e.response,function(d){console.info("%cBufferLoader.loadBuffer:%c Successfully decoded "+c,"font-weight: bold; background-color:CornflowerBlue;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(d),b(d,a)},function(){console.error("%cBufferLoader.loadBuffer:%c Error decoding "+c,"font-weight: bold; background-color:CornflowerBlue;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),b(null,a)})},e.send()},Mseg.prototype.addStage=function(a){console.info("%cMseg.addStage:%c Adding stage...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a);var b=a.duration,c=a.value,d=0;a.type&&(d="linear"==a.type?0:1),this._stages.push(new Array(b,c,d)),this._stageLengthInSeconds+=a.duration},Mseg.prototype.addRelease=function(a){console.info("%cMseg.addRelease:%c Adding release stage...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a);var b=0;a.type&&(b="linear"==a.type?0:1),this._release=new Array(a.duration,b)},Mseg.prototype._applyRelease=function(a,b,c){"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.info("%cMseg._applyRelease:%c Applying release stage...","font-weight: bold; background-color:red;font-size:10px;","color: grey; font-style: normal;font-size:10px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a);var d=0;c&&c.min&&(d=c.min),0===this._release[1]?a.linearRampToValueAtTime(d,b+this._release[0]):a.exponentialRampToValueAtTime(d,b+this._release[0])},Mseg.prototype.durationOfRelease=function(){return this._release[0]},Mseg.prototype.noteOn=function(a,b,c){console.info("%cMseg.noteOn:%c Applying note on...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a),a.cancelScheduledValues(b),a.setValueAtTime(a.value,b);var d=0,e=0,f=1;c&&(c.min&&(e=c.min),c.max&&(f=c.max));for(var g=0;g<this._stages.length;g++){var h=mcad.unsignedNormToParam(this._stages[g][1],e,f),i=b+d+this._stages[g][0];0===this._stages[g][2]?a.linearRampToValueAtTime(h,i):a.exponentialRampToValueAtTime(h,i),d+=this._stages[g][0]}},Mseg.prototype.noteOff=function(a,b,c){console.info("%cMseg.noteOff:%c Applying note off...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a),a.cancelScheduledValues(b),a.setValueAtTime(a.value,b),this._release[0]>0&&this._applyRelease(a,b,c)},Mseg.prototype.noteOnAndOff=function(a,b,c,d){console.info("%cMseg.noteOnAndOff:%c Applying note on and off...","font-weight: bold; background-color:red;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.debug(a),this.noteOn(a,b,d),this._release[0]>0&&this._applyRelease(a,b+c)},Scheduler.prototype._schedule=function(){var a=this._context.currentTime;for(a-=this._startTime;this._stepTime<a+this.scheduleAheadTime;){var b=this._stepTime+this._startTime,c=b,d=this.getStepLength(),e=this.swing*this.maxSwing*d;this._currentStamp.step%2&&(c+=e);var f=this.createTimeStamp(b,c);this._stepsInAnimationQueue.push({time:this.cloneTimeStamp(f),stamp:this.cloneStepStamp(this._currentStamp)}),this.event.onQueue&&this.event.onQueue(this.cloneTimeStamp(f),this.cloneStepStamp(this._currentStamp)),"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=2&&console.info("%cScheduler._schedule:%c Step "+this._currentStamp.step+" queued for playback "+this._stepTime+" plus "+e+" seconds from start time","font-weight: bold; background-color:LightSeaGreen;font-size:8px;","color: grey; font-style:italic;font-size:8px;"),this._advanceStep()}var g=this;this._scheduleId=setTimeout(function(){g._schedule()},1e3*this.lookAheadTime)},Scheduler.prototype._advanceStep=function(){var a=60/this.tempo;this._currentStamp.step++,this.clampStepStamp(this._currentStamp),this._stepTime+=1/this.stepsPerBeat*a},Scheduler.prototype._animate=function(){for(var a=this._lastStepAnimated,b=this._context.currentTime;this._stepsInAnimationQueue.length&&this._stepsInAnimationQueue[0].time.swing<b;)a=this._stepsInAnimationQueue[0],this._stepsInAnimationQueue.splice(0,1);this._tweenAnimate(b),this._lastStepAnimated.stamp.step!=a.stamp.step&&(this.resumeStamp=this.cloneStepStamp(a.stamp),this.offsetStepStamp(this.resumeStamp,1),this.event.onAnim&&this.event.onAnim(this.cloneStepStamp(a.stamp),this.cloneStepStamp(this._lastStepAnimated.stamp)),this._lastStepAnimated=a,"undefined"!=typeof MCAD_DEBUG&&MCAD_DEBUG>=1&&console.info("%cScheduler._animate:%c Step "+a.stamp.step+" animated","font-weight: bold; background-color:LightSeaGreen;font-size:10px;","color: grey; font-style: normal;font-size:10px;"));var c=this;this._animId=requestAnimationFrame(function(){c._animate()})},Scheduler.prototype._tweenAnimate=function(a){if(this._lastStepAnimated.stamp.step>=0&&this.isPlaying){var b=this.getStepLength(),c=a-this._lastStepAnimated.time.straight,d=c/b,e=this._lastStepAnimated.stamp.patternPos+d,f=this.getStepsPerPattern();this._tween=e/f}this.event.onTween&&this.event.onTween(this._tween)},Scheduler.prototype.getStepsPerPattern=function(){return this.stepsPerBeat*this.beatsPerPattern},Scheduler.prototype.start=function(a){console.info("%cScheduler.start:%c Playback started at "+new Date,"font-weight: bold; background-color:LightSeaGreen;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),this.isPlaying===!0&&this.Stop(),this.isPlaying=!0,this._stepTime=0,this._startTime=this._context.currentTime,a?this._currentStamp=this.cloneStepStamp(this.startStamp):this.resumePlayback?this._currentStamp=this.cloneStepStamp(this.resumeStamp):this._currentStamp=this.createStepStamp(0,0,0),this._lastStepAnimated={time:this.createTimeStamp(this._context.currentTime,this._context.currentTime),stamp:this.createStepStamp(0,0,-1)},this._schedule(),this._animate()},Scheduler.prototype.stop=function(){console.info("%cScheduler.stop:%c Playback stopped at "+new Date,"font-weight: bold; background-color:LightSeaGreen;font-size:12px;","color: grey; font-style:bold;font-size:12px;"),this.isPlaying=!1,clearTimeout(this._scheduleId),cancelAnimationFrame(this._animId),this.event.onTween&&!this.resumePlayback&&(this._tween=0,this.event.onTween(this._tween)),this.stopStamp=this.cloneStepStamp(this._lastStepAnimated.stamp),this.resumeStamp=this.cloneStepStamp(this.stopStamp),this.offsetStepStamp(this.resumeStamp,1)},Scheduler.prototype.getStepLength=function(){return 60/this.tempo*(1/this.stepsPerBeat)},Scheduler.prototype.cloneStepStamp=function(a){var b={bar:a.bar,beat:a.beat,step:a.step,patternPos:a.patternPos,guid:a.guid};return b},Scheduler.prototype.createStepStamp=function(a,b,c){var d={bar:a,beat:b,step:c};return this.clampStepStamp(d),d},Scheduler.prototype.clampStepStamp=function(a){var b=a.step+a.bar*this.getStepsPerPattern()+a.beat*this.stepsPerBeat;b<0?a={step:-1,bar:0,beat:0,patternPos:0,guid:-1}:(a.bar=Math.floor(b/this.getStepsPerPattern()),b-=a.bar*this.getStepsPerPattern(),a.beat=Math.floor(b/this.stepsPerBeat),b-=Math.floor(a.beat*this.stepsPerBeat),a.step=b,a.patternPos=a.beat*this.stepsPerBeat+a.step,a.guid=a.bar*this.getStepsPerPattern()+a.patternPos)},Scheduler.prototype.offsetStepStamp=function(a,b){a.step+=b,this.clampStepStamp(a)},Scheduler.prototype.cloneTimeStamp=function(a){var b={straight:a.straight,swing:a.swing};return b},Scheduler.prototype.createTimeStamp=function(a,b){var c={straight:a,swing:b};return c},Scheduler.prototype.quantize=function(a){if(!this.isPlaying)return{step:-1,bar:0,beat:0,patternPos:0,guid:-1};var b=a-this._startTime,c=Math.floor(b/this.getStepLength());return this.createStepStamp(0,0,c)},Rotary.prototype.setNormValue=function(a){this._nVal=a,this._nVal<this._valNormOffset?this._rVal=this._nVal*this._valRange+360-this._valOffset:this._rVal=this._nVal*this._valRange-this._valOffset,this._rotate(0)},Rotary.prototype.setParamValue=function(a){this.setNormValue(mcad.paramToUnsignedNorm(a,this._pMin,this._pMax))},Rotary.prototype.getNormValue=function(a){return this._nVal},Rotary.prototype.getParamValue=function(a){return this._pVal},Rotary.prototype._rotate=function(a){var b,c=this._rVal,d=a;this._rVal>180?(b=this._rVal-180,d<-b&&(d=-b)):(b=180-this._rVal,d>b&&(d=b)),c+=d,c>=359?c=0:c<0&&(c=360+c),this._rVal=c,this._rVal>this._degMax&&this._rVal<this._degMin&&(this._rVal>180?1==this._lastSide?this._rVal=this._degMin:this._rVal=this._degMax:1==this._lastSide?this._rVal=this._degMin:this._rVal=this._degMax),this._rVal<0&&(this._rVal=0),this._rVal>360&&(this._rVal=360),this._rVal>180?(this._nVal=(this._rVal+this._valOffset-360)/this._valRange,this._lastSide=1):(this._nVal=(this._valOffset+this._rVal+.5)/this._valRange,this._lastSide=2),this._nVal>1&&(this._nVal=1),this._nVal<0&&(this._nVal=0),this._pVal=mcad.unsignedNormToParam(this._nVal,this._pMin,this._pMax),$(this._selector).css("transform","rotate("+this._rVal+"deg)"),this._onChange(this._pVal.toFixed(0),this._nVal.toFixed(2))};var mcad={unsignedNormToParam:function(a,b,c){return b+(c-b)*a},paramToUnsignedNorm:function(a,b,c){return(a-b)/(c-b)},unsignedNtoSignedN:function(a){return 2*a-1},signedNtoUnsignedN:function(a){return(a+1)/2},signedNormToParam:function(a,b,c){return this.unsignedNormToParam(this.signedNtoUnsignedN(a),b,c)},paramToSignedNorm:function(a,b,c){return this.unsignedNtoSignedN(this.paramToUnsignedNorm(a,b,c))},logParamToUnsignedNorm:function(a,b,c){var d=Math.log(b),e=Math.log(c),f=e-d;return(Math.log(a)-d)/f},unsignedNormToLogParam:function(a,b,c){var d=Math.log(b),e=Math.log(c),f=e-d;return Math.exp(f*a+d)},paramToParam:function(a,b,c,d,e){var f=this.paramToUnsignedNorm(a,b,c);return this.unsignedNormToParam(f,d,e)},paramToLogParam:function(a,b,c,d,e){var f=this.paramToUnsignedNorm(a,b,c);return this.unsignedNormToLogParam(f,d,e)},logParamToParam:function(a,b,c,d,e){var f=this.logParamToUnsignedNorm(a,b,c);return this.unsignedNormToParam(f,d,e)},midiNoteToHz:function(a){f_0=440,MidA=69;var b=a-MidA,c=Math.pow(2,1/12);return f_0*Math.pow(c,b)}};