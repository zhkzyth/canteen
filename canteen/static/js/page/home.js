// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {

        "bootstrap":{
           deps:['jquery'],
           exports: "$.fn.popover"
         },

         "jqueryReveal":{
            deps:['jquery'],
            exports: "$.fn.reveal"
         }
   },
	paths: {
		jquery: '../lib/jquery/jquery',
        jqueryReveal:'../lib/jquery/jquery.reveal',
        bootstrap:'../lib/bootstrap/bootstrap.min'
	}
});

// Start the main app logic.
requirejs(['jquery', 'jqueryReveal', 'bootstrap','../util/base','../user/User'],
      function ($,jqueryReveal,bootstrap,base,User) {

         $(function() {
            
            //wrap one more level .
            function showReveal(options){
               var defaults = {
                  animation: 'fadeAndPop',
                  animationspeed: 300,
                  closeonbackgroundclick: false,
                  dismissmodalclass: 'close-reveal-modal'
               };

               options = $.extend({}, defaults, options);

               $(options.target).empty().html(options.msg)
                  .reveal({animation: options.animation,
                     animationspeed: options.animationspeed,
                     closeonbackgroundclick: options.closeonbackgroundclick,
                     dismissmodalclass: options.dismissmodalclass
                  });
            }

               var subBtn = $('#ship'),
                   success = $('#ship-form .js-msg'),
                   radioContainer = $('#ship-form .js-container'),
                   user = new User(),
                   messageMap = {
                      //Lunch message
                      1: "<p>午餐预定成功啦。</p><a class='close-reveal-modal'>&#215;</a>",
                      2: "<p>你已经预定过了午餐了。</p><a class='close-reveal-modal'>&#215;</a>",
                      3: "<p>现在不是午餐定餐时间哦～</p><a class='close-reveal-modal'>&#215;</a>",
                     
                      //Dinner message
                      4: "<p>晚餐预定成功啦。</p><a class='close-reveal-modal'>&#215;</a>",
                      5: "<p>你已经预定过了晚餐了。</p><a class='close-reveal-modal'>&#215;</a>",
                      6: "<p>现在不是晚餐定餐时间哦～</p><a class='close-reveal-modal'>&#215;</a>",

                      //handle the 404 or more status
                      404: "<p>貌似出问题了，上水群找下管理猿吧=(</p><a class='close-reveal-modal'>&#215;</a>"
                  };

               //TODO handle the return code like 403, fail gracefully
               $('#ship').bind('click', function () {

                  var val = $('#ship-form').find('input[name="order_type"]:checked').val(),
                  data = {offertime_type: val},
                  msg="";
                  
                  if ( !user.isLogin() ) {
                     //redirect to the login page
                     window.location = '/accounts/login';
                     return false;
                  }

                  var posting = $.post("/order/add/",data);
                  
                  posting.done(function(data) {

                     for (var i = 0; i < data.msgType.length; i += 1) {

                        msg += messageMap[data.msgType[i]];
                     }

                     showReveal({target:"#success-confirm",msg:msg});

                  });

                  //may never fall down here =)
                  posting.fail(function(data){

                     showReveal({target:"#success-confirm",msg:messageMap[404]});

                  });

                  //$(this).attr('disabled', 'disabled');

                  return false;

                  });

               //TODO support the cancel action
               //$('#cancel').bind('click', function () {
                     //$.post("/order/delete/",{},function(data) {
                        //if (data.success === 'True') {
                        //console.log("delete success");
                        //} else {
                        //console.log("not work");
                        //}
                        //});
                     //});
         });
      });
