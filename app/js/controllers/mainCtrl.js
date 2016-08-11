var app = angular.module('baxGame');


app.controller('mainCtrl', function($scope, $firebaseArray) {


$scope.isMobile = function() {

  return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

  var ref = firebase.database().ref();
  var query = ref.orderByChild("score").limitToLast(100);
  var queryTop100 = ref.orderByChild("score").limitToLast(300);
  var rank = ref.orderByChild("score");

  $scope.scores = $firebaseArray(query);
  $scope.scoresTop100 = $firebaseArray(queryTop100);



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
        start:  300,
        end:    0,
        easing: 'linear',
        duration: 30000,
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
  run_for = 29900;
  // run_for = 5000;
  var countTime = 3000;
  // var countTime = 500;
  var submitFormIsClicked = false
  $(".try-again").hide();
  $(".submit-score").hide();

  // $('.start-button').attr("disabled", true);
  $('.start-button-img').show();
  $('.start-button-disable').hide();

  $(".modal-box-simple").hide();

  $(".submit-form").hide();
  $(".modal-buttons").hide();

  $(".yourRank").hide();




  var end_counter = function() {
    if (running) {
      running = false;
      $('.start-button-img').hide();
      $('.start-button-disable').show();
      $("#status").text("Tiden er ute!");
      // $('.start-button').button('disable'); // funker ikke, kanskje bruke opacity: 0 ?
      // $('.start-button').attr("disabled", true);  // NBNBNBNB Denne funker!!!

      // started_at = 0;
      // $(".try-again").show();
      // $(".submit-score").show();

      // Dette er modal ting:
      $(".modal-box-simple").show();
      $(".submit-score").show(); // dette er dårlig: at denne ligger under modal-buttons
      $(".modal-buttons").show();

    }
  };

  $scope.tryAgain = function() {
    $('.start-button').attr("disabled", false);
    $('.start-button-img').show();
    $('.start-button-disable').hide();
    $("#status").text("TRYKK FOR Å BEGYNNE!");
    $("#timer").text("300");
    $(".modal-box-simple").hide();
    $(".modal-box-onload-mobile").hide();
    $(".submit-score").hide();
    $(".submit-form").hide();
    $(".yourRank").hide();
    $("#buttonCounter").text("0");
    $scope.yourRank = ''

    $(".try-again").hide();
    count = 0;
    countTime = 3000;
    // countTime = 500;




  }


  $scope.submitScore = function(){
    $(".submit-score").hide();
    $(".try-again").hide();
    $(".submit-form").show();
    $(".modal-buttons").hide();


    $scope.addScore = function(form) {

    if( form.$valid ) {

      $scope.scores.$add({
        name: $scope.name,
        email: $scope.email,
        score: count
      }).then(function(res){

        $(".try-again-modal").show();
        $(".yourPoints").show();
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
    $("#timer").text("300");
    $(".submit-score").hide();
    $(".submit-form").hide();
    $("#buttonCounter").text("0");

    $(".try-again").hide();
    count = 0;
    countTime = 3000;
    // countTime = 500;
  } // if form is valid
  };
  }


  $('.start-button').tap(function() {

    if (running) {

      count++;
      document.getElementById("buttonCounter").innerHTML=count;
      document.getElementById("buttonCounterFinish").innerHTML=count;

    } else {
      running = true;

      $('#timer').jQuerySimpleCounter({
        start:  300,
        end:    -1,
        duration: 30000
      });
      $("#status").text("TRYKK TRYKK TRYKK!");
      $(".try-again").hide();
      $(".start-button-svg").stop().css({scale: '0,9'});


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




    $(".modal-buttons").hide();

    }
  });

  $(".header").click(function () {

    $header = $(this);
    //getting the next element
    $content = $header.next();
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        $header.text(function () {
            //change text based on condition
            return $content.is(":visible") ? "Collapse" : "Expand";
        });
    });

  });



});