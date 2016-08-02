var app = angular.module('baxGame');


app.controller('mainCtrl', function($scope, $firebaseArray) {





  // global firebase url
  // var ref = new Firebase('https://baxgame.firebaseio.com/scores');

  var ref = firebase.database().ref();

  var query = ref.orderByChild("score").limitToLast(40);

  $scope.scores = $firebaseArray(query);


   console.log('rankList', ref);


  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  //fastclick.js
  $(function() {
    FastClick.attach(document.body);
  });


  $.fn.jQuerySimpleCounter = function( options ) {
    var settings = $.extend({
        start:  50,
        end:    0,
        easing: 'linear',
        duration: 5000,
        complete: ''
    }, options );

    var thisElement = $(this);

    $({count: settings.start}).animate({count: settings.end}, {
    duration: settings.duration,
    easing: settings.easing,
    step: function() {
      var mathCount = Math.ceil(this.count);
      thisElement.text(mathCount);
    },
    complete: settings.complete
    });
  };


  // counter game
  var running = false,
  count = 0,
  // run_for = 30000;
  run_for = 5000;
  var countTime = 500;
  var submitFormIsClicked = false
  $(".try-again").hide();
  $(".submit-score").hide();
  $(".submit-form").hide();

  var end_counter = function() {
    if (running) {
        running = false;
        $("#status").text("Tiden er ute!");
        $('.start-button').attr("disabled", true); // endre til try again
        // started_at = 0;
        $(".try-again").show();
        $(".submit-score").show();
    }
  };

  $scope.tryAgain = function() {
    $('.start-button').attr("disabled", false);
    $("#status").text("Trykk for å begynne!");
    $("#timer").text("50");
    $(".submit-score").hide();
    $(".submit-form").hide();
    $("#buttonCounter").text("0");

    $(".try-again").hide();
    count = 0;
    countTime = 500;
  }


  $scope.submitScore = function(){
    $(".submit-score").hide();
    $(".try-again").hide();
    $(".submit-form").show();

    $scope.addScore = function() {
    $scope.scores.$add({
      name: $scope.name,
      email: $scope.email,
      score: count
    }).then(function(res){
      console.log('Res--->', res.path.o)

      var yourRankId = res.path.o;
      var rankList = $firebaseArray(ref);

      console.log('var rankList', rankList.length);

      for (var i = 0; i < rankList.length; i++ ) {
        if (rankList[i] === youRankId) {
          console.log('Match--> ', rankList[i]);
        }
        else {
          console.log('Nothing found');
        }
      }

    });

    //resetting form
    $scope.name = '';
    $scope.email = '';
    $scope.score = '';


    // super hack der jeg gjentar tryAgain() funksjonen:
    $('.start-button').attr("disabled", false);
    $("#status").text("Trykk for å begynne!");
    $("#timer").text("50");
    $(".submit-score").hide();
    $(".submit-form").hide();
    $("#buttonCounter").text("0");

    $(".try-again").hide();
    count = 0;
    countTime = 500;

  };
  }


  $('.start-button').click(function() {

    if (running) {

      count++;
      document.getElementById("buttonCounter").innerHTML=count;
    } else {
      running = true;

      $('#timer').jQuerySimpleCounter({
        start:  50,
        end:    -1,
        duration: 5000
      });
      $("#status").text("Go go go!");
      $(".try-again").hide();
      $(".start-button-svg").stop().css({scale: '1,01'});


      count++;
      setTimeout(end_counter, run_for);

    // grafisk counter
    // var countTime = 3000;

    var counter = setInterval(timer, 10); //1000 will  run it every 1 second
    function timer() {

      countTime--;

      if (countTime <= 0)
      {
         clearInterval(counter);
         //counter ended, do something here
         return;
      }
      // document.getElementById("timer").innerHTML=countTime/100 + " sek"; // watch for spelling
      }


    $(".start-button-svg").mouseup(function() {
      $(this).stop().transition({scale: '1'}, 50, 'ease-in-out');
    })
    .mousedown(function() {
      $(this).stop().transition({scale: '0.98'}, 50, 'ease-in-out');
    });


  }


  });



});