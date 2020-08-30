window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./sw.js');
    }
  
    var INDEX = 0; 

    $("#chat-submit").click(function(e){
      onChatSubmit(e);
      var text =  $('#chat-input').val();
      fetchCommandResponse(text,previousMessage); 
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
       
        
      }
    
    function generate_message(msg, type) {
      INDEX++;
      var str="";
      str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
      str += "          <span class=\"msg-avatar\">";
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

    $(".clear-chat").click(function(e){
      var chatLogs = document.getElementById('chatLogs');
      chatLogs.innerHTML = "";
    });
/////////////////SPEECH RECOGNITION/////////////////////////////////////////////
const log = document.querySelector('.output_log');

var previousMessage = {};
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let recogLang = 'en-US';

recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('#mic-btn').addEventListener('click', () => {
  if ($('#mic-btn img').attr('src') === "./images/mute.svg") {
      
    $('#mic-btn img').attr('src','./images/mic.svg');
   
      recognition.lang = recogLang.value;
     // recognition.continuous = true;
      recognition.start();

    } else {
      $('#mic-btn img').attr('src','./images/mute.svg');
      recognition.stop();
    }
});

recognition.addEventListener('speechstart', () => {
  // log.textContent = 'Speech has been detected.';
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  //output.textContent = text;
 // log.textContent = 'Confidence: ' + e.results[0][0].confidence;
  $('#chat-input').val(text);
  onChatSubmit(e);
  fetchCommandResponse(text,previousMessage);

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
    utterance.lang = lang;
    utterance.text = text;
    console.log(utterance);
    synth.speak(utterance);
    let r = setInterval(() => {
      console.log(synth.speaking);
      if (!synth.speaking) {
        clearInterval(r);
      } else {
        synth.resume();
      }
    }, 14000);
  }
  
//   document.querySelector('.speak').addEventListener('click', () => {
//     let i = document.querySelector('#chat-input');
//     let text = i.value || i.placeholder;
//     synthVoice(text,'en-US');
//   });


/////////////////////////////API CALLS/////////////////////////////////////////////
$.ajax("http://pprpatha-1.subnet1phx1.devcecphx.oraclevcn.com:5002/api/greetings", {
          type: "POST",
          async: false,
          contentType: "application/json",
          beforeSend: function(xhr) {
              xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
          },
          data: JSON.stringify( {"message": "harsh"} ),
          success: function(data) {
            console.log(data);
            window.setTimeout(()=> {
              synthVoice(data.message.message, recogLang);
              generate_message(data.message.message, 'user');
          },3000);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        });


function fetchCommandResponse(textInput, data){
  var messageObject = {
    "data": data,
    "text" : textInput
  }

  if (textInput.indexOf("stop")!== -1){
    console.log("stop");
    synth.cancel();
    $('#chat-input').val('');
  }

  $.ajax("http://pprpatha-1.subnet1phx1.devcecphx.oraclevcn.com:5002/api/workflow", {
          type: "POST",
          async: false,
          contentType: "application/json",
          beforeSend: function(xhr) {
              xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
          },
          data: JSON.stringify( messageObject ),
          success: function(data) {
            console.log(data);
           //synthVoice(data.result.message, 'en-US');
           previousMessage = data;
            if( data.result && data.result.message !== ""){
              generate_message(data.result.message, 'user'); 
              synthVoice(data.result.message,recogLang); 
              $('#chat-input').val('');
            } else {
              var defaultMessage = "I am sorry, I think I did not understand."
              generate_message(defaultMessage, 'user'); 
              synthVoice(defaultMessage,recogLang);
              $('#chat-input').val('');
            }
            
    
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
          }
        });
    }        

}

 