// $("#main-content").hide();

// setTimeout(() => {
//   $("#intro").fadeOut();
//   $("#main-content").fadeIn();
// }, 2000);

hidePanels();
//URL for all heros information
const queryURL = "https://overwatch-api.net/api/v1/hero";
//URL for player stats (require battletag id)
const queryURL2 = "https://owapi.net/api/v3/u/adventheorex-1416/stats";
//URL for heroes stat for player (require battletag id)
const queryURL3 = "https://owapi.net/api/v3/u/adventheorex-1416/heroes";

function hidePanels() {
  $("#heroes-data-panel").hide();
  $("#data-panel").hide();
  $("#heroes-pic").hide();
}

function emptyHeroesInfo() {
  $("#heroes-portrait").empty();
  $("#stat-data").empty();
}

const heroes = [{
    name: "ana",
    image: "images/heroes/ana.png"
  },
  {
    name: "bastion",
    image: "images/heroes/bastion.png"
  },
  {
    name: "doomfist",
    image: "images/heroes/doomfist.png"
  },
  {
    name: "dva",
    image: "images/heroes/dva.png"
  },
  {
    name: "genji",
    image: "images/heroes/genji.png"
  },
  {
    name: "hanzo",
    image: "images/heroes/hanzo.png"
  },
  {
    name: "junkrat",
    image: "images/heroes/junkrat.png"
  },
  {
    name: "lucio",
    image: "images/heroes/lucio.png"
  },
  {
    name: "mccree",
    image: "images/heroes/mccree.png"
  },
  {
    name: "mei",
    image: "images/heroes/mei.png"
  },
  {
    name: "mercy",
    image: "images/heroes/mercy.png"
  },
  {
    name: "orisa",
    image: "images/heroes/orisa.png"
  },
  {
    name: "pharah",
    image: "images/heroes/pharah.png"
  },
  {
    name: "reaper",
    image: "images/heroes/reaper.png"
  },
  {
    name: "reinhardt",
    image: "images/heroes/reinhardt.png"
  },
  {
    name: "roadhog",
    image: "images/heroes/roadhog.png"
  },
  {
    name: "soldier76",
    image: "images/heroes/soldier76.png"
  },
  {
    name: "sombra",
    image: "images/heroes/sombra.png"
  },
  {
    name: "symmetra",
    image: "images/heroes/symmetra.png"
  },
  {
    name: "torbjorn",
    image: "images/heroes/torbjorn.png"
  },
  {
    name: "tracer",
    image: "images/heroes/tracer.png"
  },
  {
    name: "widowmaker",
    image: "images/heroes/widowmaker.png"
  },
  {
    name: "winston",
    image: "images/heroes/winston.png"
  },
  {
    name: "zarya",
    image: "images/heroes/zarya.png"
  },
  {
    name: "zenyatta",
    image: "images/heroes/zenyatta.png"
  }
];

$.ajaxPrefilter((options) => {
  if (options.crossDomain && $.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

$("#search-button").on("click", (event) => {
  event.preventDefault();
  var search = $("#search").val().trim().toLowerCase();
  var region = $("input[name = 'optradio']:checked").val();

  if (search !== "" && region !== undefined) {
    hidePanels();
    emptyHeroesInfo();
    $("#loading").fadeIn();

    $.ajax({
      url: "https://owapi.net/api/v3/u/" + search + "/stats",
      method: "GET",
      statusCode: {
        404: function() {
          alert(`Error! Please input the battletag in the proper format`);
          $("#loading").fadeOut();
        }
      }
    }).done((response) => {

      if (response[region] === null) {
        alert(`Player's Stats for ${region.toUpperCase()} Are Not Available!`);
        hidePanels();
        $("#loading").fadeOut();

      } else {
        $("#search").val("");
        $("#loading").fadeOut();
        $("#data-panel").fadeIn();
        $("#heroes-pic").fadeIn();
        $("#heroes-data-panel").fadeIn();
        console.log(response);
        var newTr = $(`<tr class='table-row'>`);
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.level + "</td>");
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.tier.toUpperCase() + "</td>");
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.games + "</td>");
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.wins + "</td>");
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.losses + "</td>");
        newTr.append("<td>" + response[region].stats.competitive.overall_stats.win_rate + "%" + "</td>");
        $("#stat-data").append(newTr);

        $.ajax({
          url: "https://owapi.net/api/v3/u/" + search + "/heroes",
          method: "GET",
          statusCode: {
            429: function() {
              alert(`Too many requests! Please refresh the page and try again later`);
              hidePanels();
            }
          }
        }).done((response) => {

          $('html, body').animate({
            scrollTop: $('.row').offset().top
          }, 'slow');

          $("#heroes-stat-data").empty();
          console.log("Request Successful!");
          console.log(response);
          var dataArray = [];

          var obj = response[region].heroes.playtime.competitive;

          //sort the object keys alphabetically and push them into the empty dataArray
          var sortedObj = Object.keys(obj).sort().forEach(function(x, y) {
            dataArray.push(x = obj[x]);
          });

          //assign playtime keys to heroes object
          for (var i = 0; i < heroes.length; i++) {
            heroes[i].playTime = dataArray[i];
          }

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
            var heroTime = response[region].heroes.playtime.competitive;
            var heroStats = response[region].heroes.stats.competitive;
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

            newTr.append("<td>" + Number(heroTime[hero]).toFixed(2) + " hours" + "</td>");
            newTr.append("<td>" + Math.floor(winPercentage * 100) + "%" + "</td>");
            newTr.append("<td>" + eliminations + "</td>");
            newTr.append("<td>" + finalBlows + "</td>");
            newTr.append("<td>" + allDmgDone + "</td>");
            newTr.append("<td>" + medals + "</td>");
            $("#heroes-stat-data").append(newTr);
          });
        });
      }
    });
  } else {
    alert(`Please enter the Battletag name and select the region`);
  }
});
