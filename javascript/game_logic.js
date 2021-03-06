// main user logic
function userKeyDownAction(key) {
  // check user action against last segment on first move
  // or when trying to pick apple
  // but check against second last segment on subsequent move
  var lastSegmentElement = $("#tree").children().last();
  var secondLastSegmentElement = $("#tree").children().eq(secondLastSegment);
  var secondLastSegmentDirection = secondLastSegmentElement.attr("class") + "-arrow";

  // return apple present true/false
  // and apple type
  if (key == "spacebar") {
    var applePlaceholder = lastSegmentElement.children(".branch-wrapper").children(".apple-placeholder");
    var applePlaceholderClass = applePlaceholder.attr("class").split(" ");
    var applePresent = (applePlaceholderClass.length > 1);
    var appleType = (applePlaceholderClass[applePlaceholderClass.length - 1]);
  }

  // when user navigates left/right
  if (key == "left-arrow" || key == "right-arrow") {
    if (key == secondLastSegmentDirection) {
      increaseTime(timeObj.time_increase_correct_branch);
      scrollBackground();
      if (playerScore == 0) {
        bgAudioElement.play();
        // start timer on first move
        progress();
        $("#monkey-start").hide();
      } 
      lastSegmentElement.remove();

      // increase time decay when threshold reached
      if (playerScore % timeObj.next_level_threshold == timeObj.next_level_threshold - 1) {
        timeObj.time_decay += timeObj.time_decay_factor;
        level++;
        flashLevel(level);
      }

      // show and hide monkey depending on user action
      if (secondLastSegmentDirection == "left-arrow") {
        $("#monkey-right").hide();
        $("#monkey-left").show();
      } else {
        $("#monkey-left").hide();
        $("#monkey-right").show();
      }
      
      addRandomTreeSegmentToDom($("#tree"), "prepend");

      playerScore++;
      $("#score").text(playerScore);

    } else {
      // when user misstep after the first move
      if (playerScore > 0) {
        timeObj.time_left -= timeObj.time_decay_penalise_user;
      }
    }
  } else {
  // when user grabs apple
    if (applePresent && appleType == "apple") {
      // user cue: add +2 bonus
      bubbleBonusPoints();
      increaseTime(timeObj.time_increase_fruit_pick);
      applePlaceholder.removeClass("apple");
      playerScore ++;
    } else {
      // when user grabs nothing or rotten apple
      timeObj.time_left -= timeObj.time_decay_penalise_user;
    }
  }
}

// increase time when user makes correct move
function increaseTime(increaseFactor) {
  timeObj.time_left = Math.min(timeObj.time_left + increaseFactor, timeObj.time_total);
  var progressBarIncrease = increaseFactor / timeObj.time_total * progressElementMaxWidth;
  $("#progress").width(Math.min(progressElementMaxWidth, $("#progress").width() + progressBarIncrease));
}

// decrease time 
function progress() {
  timeObj.time_left -= timeObj.time_decay;
  var percentageRemain = timeObj.time_left / timeObj.time_total;
  var progressBarWidth = percentageRemain * progressElementMaxWidth;
  if (percentageRemain >= 0.30) {
    $("#progress").css("background-color", "green");
  } else {
    $("#progress").css("background-color", "red");
  }
  $("#progress").width(progressBarWidth);
  if (timeObj.time_left > 0) {
    setTimeout(function() {
      progress();
    }, 50);
  }
  else {
    showGameOver();
  }
}

function bubbleBonusPoints() {
  $("#score-wrapper").append("<div class=\"bonus-points\">x2 Time</div>");
  var angle = Math.floor(Math.random() * 50) + 50;
  // animate each bonus point to the top (bottom 100%) and reduce opacity as it moves
  // callback function used to remove complete animations
  $(".bonus-points").animate({
      "top": "-80px",
      "left": (15 + angle) + "px",
      "opacity" : "-=0.7"
  }, 2000, function() {
    $(this).remove();
  });    
}

function flashLevel(level) {
  $("#score-wrapper").append("<div class=\"level\"></div>")
  $(".level").text("LEVEL " + level).fadeIn();
  setTimeout(function() {
    $(".level").fadeOut(function() {
      $(this).remove();
    });
  }, 1000);
}
