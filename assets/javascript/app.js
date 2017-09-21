//URL for all heros information
var queryURL = "https://overwatch-api.net/api/v1/hero";
//URL for player stats (require battletag id)
var queryURL2 = "https://owapi.net/api/v3/u/adventheorex-1416/stats";
//URL for heroes stat for player (require battletag id)
var queryURL3 = "https://owapi.net/api/v3/u/adventheorex-1416/heroes";

function createTableData(response) {
  var newTr = $("<tr class='table-row'>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.level + "</td>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.tier + "</td>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.games + "</td>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.wins + "</td>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.losses + "</td>");
  newTr.append("<td>" + response.us.stats.competitive.overall_stats.win_rate + "</td>");
  $("#stat-data").append(newTr);
}

$("#heroes-data-panel").hide();
$("#data-panel").hide();
$("#heroes-pic").hide();

$.ajaxPrefilter(function(options) {
  if (options.crossDomain && $.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

$("#button").on("click", function(event) {
  event.preventDefault();
  var search = $("#search").val().trim();
  if (search !== "") {
    $("#loading").fadeIn();

    $.ajax({
      url: "https://owapi.net/api/v3/u/" + search + "/stats",
      method: "GET",
      statusCode: {
        404: function() {
          alert("Error! Please input the battletag in the proper format");
        }
      }
    }).done(function(response) {
      $("#stat-data").empty();
      $("#search").val("");
      $("#loading").fadeOut();
      $("#data-panel").fadeIn();
      $("#heroes-pic").fadeIn();
      $("#heroes-data-panel").fadeIn();
      createTableData(response);

      $.ajax({
        url: "https://owapi.net/api/v3/u/" + search + "/heroes",
        method: "GET",
        statusCode: {
          429: function() {
            alert("Too many requests! Please refresh the page and try again later");
          }
        }
      }).done(function(response) {

        console.log("Request Success!");
        $(".port").on("click", function(event) {
          $("#heroes-stat-data").empty();
          var hero = event.currentTarget.id;
          var heroData = response.us.heroes.playtime.competitive;
          var heroStats = response.us.heroes.stats.competitive;

          if (Number(heroData[hero].toFixed(2) > 0.03)) {
            var newTr = $("<tr class='table-row'>");
            newTr.append("<td>" + Number(heroData[hero]).toFixed(2) + "</td>");
            newTr.append("<td>" + heroStats[hero].general_stats.win_percentage + "</td>");
            newTr.append("<td>" + heroStats[hero].general_stats.eliminations + "</td>");
            newTr.append("<td>" + heroStats[hero].general_stats.final_blows + "</td>");
            newTr.append("<td>" + heroStats[hero].general_stats.all_damage_done + "</td>");
            newTr.append("<td>" + heroStats[hero].general_stats.medals + "</td>");
            $("#heroes-stat-data").append(newTr);
          } else {
            alert("Not enough total time played on this hero. Cannot display stats on this hero!");
          }
        });
      });
    });
  }
});
