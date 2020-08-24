window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./sw.js');
    }
  
    var INDEX = 0; 
    $("#chat-submit").click(function(e){
        onChatSubmit(e);
    });

    function onChatSubmit(e) {
        e.preventDefault();
        var msg = $("#chat-input").val(); 
        if(msg.trim() == ''){
          return false;
        }
        generate_message(msg, 'self');
        var buttons = [
            {
              name: 'Existing User',
              value: 'existing'
            },
            {
              name: 'New User',
              value: 'new'
            }
          ];
        setTimeout(function() {      
          generate_message(msg, 'user'); 
          synthVoice(msg,'en-US'); 
         // $("#chat-input").val('');
        //   $.ajax("http://pprpatha-1.subnet1phx1.devcecphx.oraclevcn.com:5002/api/tts", {
        //   type: "POST",
        //   async: false,
        //   contentType: "application/json",
        //   beforeSend: function(xhr) {
        //       xhr.setRequestHeader('Access-Control-Allow-Origin', '*');niaJ@123@
        //   },
        //   data: JSON.stringify({"text": msg, "language_code": "en-us"}),
        //   success: function(data) {
        //     console.log(data);
        //     var resAudio = new Audio("data:audio/wav;base64," + data.audio_content);
        //     resAudio.play();
        //   },
        //   error: function(jqXHR, textStatus, errorThrown) {
        //     console.log(errorThrown);
        //   }
        // });
        }, 1)
        
      }
    
    function generate_message(msg, type) {
      INDEX++;
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
      str += "          <span class=\"msg-avatar\">";
      str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);
    //   if(type == 'self'){
    //    $("#chat-input").val(''); 
    //   }    
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }  
    
    function generate_button_message(msg, buttons){    
      /* Buttons should be object array 
        [
          {
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ]
      */
      INDEX++;
      var btn_obj = buttons.map(function(button) {
         return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
      }).join('');
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
      str += "          <span class=\"msg-avatar\">";
      str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
      str += "          <\/span>";
      str += "          <div class=\"cm-msg-text\">";
      str += msg;
      str += "          <\/div>";
      str += "          <div class=\"cm-msg-button\">";
      str += "            <ul>";   
      str += btn_obj;
      str += "            <\/ul>";
      str += "          <\/div>";
      str += "        <\/div>";
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);   
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
      $("#chat-input").attr("disabled", true);
    }
    
    $(document).delegate(".chat-btn", "click", function() {
      var value = $(this).attr("chat-value");
      var name = $(this).html();
      $("#chat-input").attr("disabled", false);
      generate_message(name, 'self');
    })
    
    $("#chat-circle").click(function() {    
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
    $(".chat-box-toggle").click(function() {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
/////////////////SPEECH RECOGNITION/////////////////////////////////////////////
const log = document.querySelector('.output_log');
//const output = document.querySelector('.output_result');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('#mic-btn').addEventListener('click', () => {
  let recogLang = 'en-IN'; // document.querySelector('[name=lang]:checked');
  recognition.lang = recogLang.value;
  $('#mic-btn img').attr('src','./images/mic.svg')
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  log.textContent = 'Speech has been detected.';
});

recognition.addEventListener('result', (e) => {
  log.textContent= 'Result has been detected.';

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  //output.textContent = text;
  
  log.textContent = 'Confidence: ' + e.results[0][0].confidence;
  $('#chat-input').val(text);
  onChatSubmit(e)
});

recognition.addEventListener('speechend', (e) => {
    $('#mic-btn img').attr('src','./images/mute.svg');
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    $('#mic-btn img').attr('src','./images/mute.svg')
    log.textContent = 'Error: ' + e.error;
});


/////////////////////////////SPEECH SYNTHESIS/////////////////////////////////////////////

const synth = window.speechSynthesis;  
const utterance = new SpeechSynthesisUtterance();
function synthVoice(text, lang) {
    utterance.voice = synth.getVoices().filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
    utterance.lang = utterance.voice.lang;
    utterance.text = text;
    synth.speak(utterance);
  }
  
//   document.querySelector('.speak').addEventListener('click', () => {
//     let i = document.querySelector('#chat-input');
//     let text = i.value || i.placeholder;
//     synthVoice(text,'en-US');
//   });
  

  }

 