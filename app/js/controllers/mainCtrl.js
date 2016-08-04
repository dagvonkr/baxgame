var app = angular.module('baxGame');


app.controller('mainCtrl', function($scope, $firebaseArray) {




  // global firebase url
  // var ref = new Firebase('https://baxgame.firebaseio.com/scores');

  var ref = firebase.database().ref();
  var query = ref.orderByChild("score").limitToLast(40);
  var rank = ref.orderByChild("score");

  $scope.scores = $firebaseArray(query);



  //fastclick.js
  $(function() {
    FastClick.attach(document.body);
  });


      // on load:
  $( document ).ready(function() {

    //Modal on load
    var appendthisOnload =  ("<div class='modal-overlay-onload js-modal-close-onload'></div>");

      $('a[data-modal-id-onload]').on(function(e) {
        e.preventDefault();
        $("body").append(appendthisOnload);
        $(".modal-overlay-onload").fadeTo(250, 0.7);
        //$(".js-modalbox").fadeIn(500);

        var modalBoxOnload = $(this).attr('data-modal-id-onload');
        $('#'+modalBoxOnload).fadeIn($(this).data());
      });
    $(".js-modal-close-onload, .modal-overlay-onload").click(function() {
        $(".modal-box-onload, .modal-overlay-onload").fadeOut(150, function() {
            $(".modal-overlay-onload").remove();
        });
    });
    $(window).resize(function() {
        $(".modal-box-onload").css({
            top: ($(window).height() - $(".modal-box-onload").outerHeight()) / 2,
            left: ($(window).width() - $(".modal-box-onload").outerWidth()) / 2
        });
    });
    $(window).resize();

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

  $(".modal-box-simple").hide();
  $(".submit-form").hide();
  $(".modal-buttons").hide();
  $(".yourRank").hide();




  var end_counter = function() {
    if (running) {
      running = false;
      $("#status").text("Tiden er ute!");
      $('.start-button').attr("disabled", true); // endre til try again
      // started_at = 0;
      // $(".try-again").show();
      // $(".submit-score").show();

      // Dette er modal ting:
      $(".modal-box-simple").show();
      $(".submit-score").show(); // dette er dårlig: at denne ligger under modal-buttons
      $(".modal-buttons").show();


       // // popup script try again
       //  var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
       //  console.log('Modal hit!');
       //  $("body").append(appendthis);
       //  $(".modal-overlay").fadeTo(250, 0.7);
       //  //$(".js-modalbox").fadeIn(500);
       //  var modalBox = $(this).attr('data-modal-id');
       //  $('#'+modalBox).fadeIn($(this).data());

       //  $(".js-modal-close, .modal-overlay").click(function() {
       //      $(".modal-box, .modal-overlay").fadeOut(150, function() {
       //          $(".modal-overlay").remove();
       //      });
       //  });
       //  $(window).resize(function() {
       //      $(".modal-box").css({
       //          top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
       //          left: ($(window).width() - $(".modal-box").outerWidth()) / 2
       //      });
       //  });
       //  $(window).resize();


    }
  };

  $scope.tryAgain = function() {
    $('.start-button').attr("disabled", false);
    $("#status").text("TRYKK FOR Å BEGYNNE!");
    $("#timer").text("50");
    $(".submit-score").hide();
    $(".submit-form").hide();
    $(".yourRank").hide();
    $("#buttonCounter").text("0");
    $scope.yourRank = ''

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

      $(".try-again-modal").show();
      $(".yourRank").show();

      var yourRankIdTemp = res.path.o;
      var yourRankId = yourRankIdTemp[0];
      var scoresObj = $firebaseArray(rank);

      scoresObj.$loaded().then(function(scores) {
        var scoresArr = scores.reverse();

        for (var i = 0; i < scoresArr.length; i++ ) {

          var scoreArrToStr = scoresArr[i].$id;
          var scoreIdStr = JSON.stringify(scoreArrToStr);

          var yourRankIdStr = JSON.stringify(yourRankId);

        if (scoreIdStr === yourRankIdStr) {
          $scope.yourRank = i + 1;
          console.log('Rank-->', $scope.yourRank);
          break;
        }
        else {
          console.log('Nothing found! :(');
        }
      }
      });
    });

    //resetting form
    // $scope.name = '';
    // $scope.email = '';
    // $scope.score = '';


    // super hack der jeg gjentar tryAgain() funksjonen:
    $("#status").text("Trykk for å begynne!");
    $("#timer").text("50");
    $(".submit-score").hide();
    $(".submit-form").hide();
    $("#buttonCounter").text("0");
    $(".modal-buttons").show();


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
      $("#status").text("TRYKK TRYKK TRYKK!");
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

    $(".modal-buttons").hide();

  }


  });



});