var app = angular.module('baxGame');


app.controller('mainCtrl', function($scope, $firebaseArray) {


  // global firebase url
  var ref = new Firebase('https://baxgame.firebaseio.com/scores');

  var query = ref.orderByChild("score").limitToLast(10);

  $scope.scores = $firebaseArray(query);



  // counter game
  var running = false,
  count = 0,
  // run_for = 30000;
  run_for = 5000;
  var countTime = 500;
  var submitFormIsClicked = false
  $(".try-again").text("");
  $(".submit-score").hide();
  $(".submit-form").hide();

  var end_counter = function() {
    if (running) {
        running = false;
        $("#status").text("Times up!");
        $('.start-button').attr("disabled", true); // endre til try again
        // started_at = 0;
        $(".try-again").text("Try again");
        $(".submit-score").show();
    }
  };

  $scope.tryAgain = function() {
    $('.start-button').attr("disabled", false);
    $("#status").text("Ready?");
    $("#timer").text("5.00 sek");
    $(".submit-score").hide();
    $(".submit-form").hide();

    $(".try-again").text("");
    count = 0;
    countTime = 500;
  }


  $scope.submitScore = function(){
    $(".submit-score").hide();
    $(".submit-form").show();

    $scope.addScore = function() {
    $scope.scores.$add({
      name: $scope.name,
      email: $scope.email,
      score: count
    });

    //resetting form
    $scope.name = '';
    $scope.email = '';
    $scope.score = '';

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
        $("#status").text("Go go go!");
        $(".try-again").text("");

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
        document.getElementById("timer").innerHTML=countTime/100 + " sek"; // watch for spelling
      }
    }
  });


  // query the highscore
  // ref.orderByChild("score").limitToFirst(10).on("child_added", function(snapshot){
  //   snapshot.forEach(function(data) {
  //     console.log(data)
  //      console.log("The " + data.key() + " score is " + data.val());
  //   })
  // });





})