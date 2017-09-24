hidePanels();
//URL for all heros information
var queryURL = "https://overwatch-api.net/api/v1/hero";
//URL for player stats (require battletag id)
var queryURL2 = "https://owapi.net/api/v3/u/adventheorex-1416/stats";
//URL for heroes stat for player (require battletag id)
var queryURL3 = "https://owapi.net/api/v3/u/adventheorex-1416/heroes";

function hidePanels() {
  $("#heroes-data-panel").hide();
  $("#data-panel").hide();
  $("#heroes-pic").hide();
}

function emptyHeroesInfo() {
  $("#heroes-portrait").empty();
  $("#stat-data").empty();
}

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

$.ajaxPrefilter((options) => {
  if (options.crossDomain && $.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

const heroes = [{
    name: "ana",
    image: "assets/images/heroes/ana.png"
  },
  {
    name: "bastion",
    image: "assets/images/heroes/bastion.png"
  },
  {
    name: "doomfist",
    image: "assets/images/heroes/doomfist.png"
  },
  {
    name: "dva",
    image: "assets/images/heroes/dva.png"
  },
  {
    name: "genji",
    image: "assets/images/heroes/genji.png"
  },
  {
    name: "hanzo",
    image: "assets/images/heroes/hanzo.png"
  },
  {
    name: "junkrat",
    image: "assets/images/heroes/junkrat.png"
  },
  {
    name: "lucio",
    image: "assets/images/heroes/lucio.png"
  },
  {
    name: "mccree",
    image: "assets/images/heroes/mccree.png"
  },
  {
    name: "mei",
    image: "assets/images/heroes/mei.png"
  },
  {
    name: "mercy",
    image: "assets/images/heroes/mercy.png"
  },
  {
    name: "orisa",
    image: "assets/images/heroes/orisa.png"
  },
  {
    name: "pharah",
    image: "assets/images/heroes/pharah.png"
  },
  {
    name: "reaper",
    image: "assets/images/heroes/reaper.png"
  },
  {
    name: "reinhardt",
    image: "assets/images/heroes/reinhardt.png"
  },
  {
    name: "roadhog",
    image: "assets/images/heroes/roadhog.png"
  },
  {
    name: "soldier76",
    image: "assets/images/heroes/soldier76.png"
  },
  {
    name: "sombra",
    image: "assets/images/heroes/sombra.png"
  },
  {
    name: "symmetra",
    image: "assets/images/heroes/symmetra.png"
  },
  {
    name: "torbjorn",
    image: "assets/images/heroes/torbjorn.png"
  },
  {
    name: "tracer",
    image: "assets/images/heroes/tracer.png"
  },
  {
    name: "widowmaker",
    image: "assets/images/heroes/widowmaker.png"
  },
  {
    name: "winston",
    image: "assets/images/heroes/winston.png"
  },
  {
    name: "zarya",
    image: "assets/images/heroes/zarya.png"
  },
  {
    name: "zenyatta",
    image: "assets/images/heroes/zenyatta.png"
  }
];

$("#search-button").on("click", (event) => {
  event.preventDefault();
  var search = $("#search").val().trim();
  if (search !== "") {
    hidePanels();
    emptyHeroesInfo();
    $("#loading").fadeIn();

    $.ajax({
      url: "https://owapi.net/api/v3/u/" + search + "/stats",
      method: "GET",
      statusCode: {
        404: function() {
          alert("Error! Please input the battletag in the proper format");
        }
      }
    }).done((response) => {
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
            hidePanels();
          }
        }
      }).done((response) => {
        $("#heroes-stat-data").empty();
        console.log("Request Successful!");
        console.log(response);
        var dataArray = [];

        var obj = response.us.heroes.playtime.competitive;

        //sort the object keys alphabetically and push them into the empty dataArray
        var sortedObj = Object.keys(obj).sort().forEach(function(x, y) {
          dataArray.push(x = obj[x]);
        });

        //assign playtime keys to heroes object
        for (var i = 0; i < heroes.length; i++) {
          heroes[i].playTime = dataArray[i];
        }

        console.log(dataArray);

        console.log(heroes);

        var playedHeroes = heroes.filter((item) => {
          return item.playTime > 0.05;
        });

        playedHeroes.forEach((item) => {
          $("#heroes-portrait").append("<img class='port' id=" + item.name + " " + "src=" + item.image + ">");
        });

        console.log(playedHeroes);

        $(".port").on("click", (event) => {
          $("#heroes-stat-data").empty();
          var hero = event.currentTarget.id;
          var heroTime = response.us.heroes.playtime.competitive;
          var heroStats = response.us.heroes.stats.competitive;
          var winPercentage = heroStats[hero].general_stats.win_percentage;
          var eliminations = heroStats[hero].general_stats.eliminations;
          var finalBlows = heroStats[hero].general_stats.final_blows;
          var allDmgDone = heroStats[hero].general_stats.all_damage_done;
          var medals = heroStats[hero].general_stats.medals;
          var newTr = $("<tr class='table-row'>");

          if (eliminations === undefined || finalBlows === undefined) {
            eliminations = 0;
            finalBlows = 0;
          }

          newTr.append("<td>" + Number(heroTime[hero]).toFixed(2) + "</td>");
          newTr.append("<td>" + winPercentage + "</td>");
          newTr.append("<td>" + eliminations + "</td>");
          newTr.append("<td>" + finalBlows + "</td>");
          newTr.append("<td>" + allDmgDone + "</td>");
          newTr.append("<td>" + medals + "</td>");
          $("#heroes-stat-data").append(newTr);
        });
      });
    });
  }
});
