window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./sw.js');
    }
  
    var INDEX = 0; 
//////////////////////////METHODS//////////////////////////////////////////

    function onChatSubmit(e) {
        e.preventDefault();
        var msg = $("#chat-input").val(); 
        if(msg.trim() == ''){
          return false;
        }
        //generate_message(msg, 'self');
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
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }  

    function generate_list_message(result, type) {
      var list = result.list_name;
      INDEX++;
      var str="";
      str += `<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">
                <span class=\"msg-avatar\"><\/span>
                <div class=\"cm-msgList-text\">
                  <table id='messageList'>
                    <th width="100px">Task List</th>`

      for(var i=0; i<list.length; i++){
        str += `<tr><td><span> ${i+1}. <\/span> ${list[i]}<\/tr><\/td>`
        }

      str += ` <\/table><\/div><\/div>`
      
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);   
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }

    function generate_image_message(result, type) {
      var list = result.approve_list;
      var image = result.image_url; //'https://images-na.ssl-images-amazon.com/images/I/61d6m8%2BIjTL._AC_SX425_.jpg'; 
      INDEX++;
      var str = "";
      str += `<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">
                <span class=\"msg-avatar\"><\/span>
                <div class=\"cm-msgList-text\">
                  <table id='messageList'>
                    <th width="100%">Title: ${result.title}</th>`;

      if( result.description){
        str += `<tr><td colspan = "2">${result.description }<\/td><\/td><tr>`;
      }  else if(result.image_url )     {
        str += `<tr><td colspan = "2"><img src = ${image}><\/td><\/td><tr>`;
      } 

      for(var i=0; i<list.length; i++){
        str += `<td><button class="approval-btn"> ${list[i]}</button><\/td>`
        }

      str += `<\/tr><\/table><\/div><\/div>`
      
      $(".chat-logs").append(str);
      $("#cm-msg-"+INDEX).hide().fadeIn(300);   
      $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
    }

    function clearChat(){
      var chatLogs = document.getElementById('chatLogs');
      chatLogs.innerHTML = "";
      $('#chat-input').val('');
    }

   /////////////////////////////////////////////////////////////////////////////////////
   //////////////////Event Listeners////////////////////////////////////////////////// 
    
    $("#chat-circle").click(function() {    
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })
    
    $(".chat-box-toggle").click(function() {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    })

    $(".clear-chat").click(function(e){
      clearChat();
    });
    
    $("#chat-submit").click(function(e){
      onChatSubmit(e);
      var text =  $('#chat-input').val();
      fetchCommandResponse(text,previousMessage); 
    });

    $(".stop-speaking").click(function(e){
      if(synth.speaking){
        synth.cancel();
        $('#chat-input').val('');
      }
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
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  $('#chat-input').val(text);
  window.setTimeout(() => {
    onChatSubmit(e)
  fetchCommandResponse(text,previousMessage)
  ,1});
});

recognition.addEventListener('speechend', (e) => {
    $('#mic-btn img').attr('src','./images/mute.svg');
    recognition.stop();
  
});

recognition.addEventListener('error', (e) => {
    $('#mic-btn img').attr('src','./images/mute.svg')
    console.log('Error: ' + e.error);
});

//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////SPEECH SYNTHESIS/////////////////////////////////////////////

const synth = window.speechSynthesis;  
const utterance = new SpeechSynthesisUtterance();
function synthVoice(text, lang) {
    utterance.voice = synth.getVoices().filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
    utterance.lang = lang;
    utterance.text = text;
    utterance.rate = 0.85;
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
             // generate_message(data.message.message, 'user');
             $('#chat-input').val("Assistant : " + data.message.message);
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
    synth.cancel();
    //$('#chat-input').val(textInput);
  } else if (textInput.indexOf( "pause" )!== -1) {
    synth.pause();
  } else if (textInput.indexOf( "repeat" )!== -1) {
    synth.speak(utterance);
    $('#chat-input').val(utterance.text);
  } else {
      $.ajax("http://pprpatha-1.subnet1phx1.devcecphx.oraclevcn.com:5002/api/workflow", {
        type: "POST",
        async: false,
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        },
        data: JSON.stringify( messageObject ),
        statusCode: {
          500: function(xhr) {
            console.log("500: Internal Server Error");
            var defaultMessage = "I am sorry, I could not find it."
            generate_message(defaultMessage, 'user'); 
            synthVoice(defaultMessage,recogLang);
            $('#chat-input').val('');
          }
        },
        success: function(data, textStatus,xhr) {
        previousMessage = data;
        if(data.result && data.result.message !== ""){
            window.setTimeout( function(){
              if( data.result.item_view ){
              switch (data.result.item_view) {
                case "Item1": 
                      if( data.result.list_name.length > 0){
                        clearChat();
                        generate_list_message(data.result, 'user'); 
                      }
                      if(data.result.approve_list.length > 0){
                        clearChat();
                        generate_image_message(data.result, 'user');
                      }
                      break;
                case "DigitalAsset": 
                      if(data.result.approve_list.length > 0){
                        clearChat();
                        generate_image_message(data.result, 'user');
                      }
                      break;
                case "blog": 
                      if (data.result.blog_flag && data.result.list_name.length > 0) {
                        clearChat();
                        generate_list_message(data.result, 'user');
                      }

                      if (data.result.blog_flag && data.result.list_name.length === 0) {
                        clearChat();
                        generate_image_message(data.result, 'user');
                      }
                      break;
                default:
                      console.log("default");
                      clearChat();
                      generate_message("I could not find anything!", 'user');
              }
            }
                
              $('#chat-input').val("Assistant : " + data.result.message);
              synthVoice(data.result.message,recogLang); 
             
            }, 1000);
          } else {
            var defaultMessage = "I am sorry, I couldn't understand."
            clearChat();
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

///////////////////////////////////////////////////////////////////////////////////
}

 