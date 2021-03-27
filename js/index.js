(function () {
    var game = null
      , $aboutWindow = $(".window-about")
      , $closeAboutBtn = $(".close-about")
      , $game = $(".game-info")
      , $enterName = $(".enter-name")
      , $congrats = $(".congrats")
      , $nameInput = $("form input.user-name")
      , $time = $(".time")
      , $pairsCount = $(".pairs-count")
      , $highscores = $(".highscores")
      , $body = $(document.body)
      , $skillSelect = $("select")
      , $gameSkillType = $("span.game-skill-type")
      ;

    function closeAbout() {
        if (game === null) {
            newGame();
        }
        $aboutWindow.addClass("hide");
    }

    $closeAboutBtn.on("click", closeAbout);

    function newGame() {

        if (game) {
            clearInterval(game.timer);
            clearInterval(game.winInterval);
            $congrats.addClass("hide");
            $game.removeClass("bg-win-purple", "bg-win");
            $time.html(0);
            $pairsCount.html(0);
        }

        var gameSize = gameSkill === "little" ? {
            x: 6
          , y: 5
        } : {
            x: 10
          , y: 6
        };

        game = new Match(".game", {
            templateElm: ".templates > div"
          , autoremove: false
          , size: gameSize
          , step: {
                x: 115
              , y: 105
            }
        }, [
            {
                img: "image/algorith(1).png"
            }
          , {
                img: "image/algorithm.png"
            }
          , {
                img: "image/apache(1).png"
            }
          , {
                img: "image/apple(1).png"
            }
          , {
                img: "image/cakephp.png"
            }
          , {
                img: "image/couchdb.png"
            }
          , {
                img: "image/ceylon.png"
            }
          , {
                img: "image/devicon(1).png"
            }
          , {
                img: "image/electron.png"
            }
          , {
                img: "image/elm.png"
            }
          , {
                img: "image/express.png"
            }
          , {
                img: "image/github.png"
            }
          , {
                img: "image/go.png"
            }
          , {
                img: "image/handlebars.png"
            }
          , {
                img: "image/jasmine.png"
            }
          , {
                img: "image/linux.png"
            }
          , {
                img: "image/mocha.png"
            }
          , {
                img: "image/monitor-screen.png"
            }
          , {
                img: "image/sequelize.png"
            }
          , {
                img: "image/sketch.png"
            }
          , {
                img: "image/slack.png"
            }
          , {
                img: "image/smartwatch(1).png"
            }
          , {
                img: "image/slack.png"
            }
          , {
                img: "image/smartwatch(1).png"
            }
          , {
                img: "image/ssh.png"
            }
          , {
                img: "image/stylus.png"
            }
          , {
                img: "image/symfony.png"
            }
          , {
                img: "image/translator.png"
            }
          , {
                img: "image/typescript.png"
            }
          , {
                img: "image/webstorm.png"
            }
          , {
                img: "image/yarn.png"
            }
        ]);

        closeAbout();

        game.on("win", function () {
            setTimeout(function () {
                var time = game.passedTime
                  , pairs = game.flippedPairs
                  ;

                $game.addClass("bg-win");
                game.winInterval = setInterval(function () {
                    $game.toggleClass("bg-win-purple");
                }, 500);

                if (Highscores.check(pairs, time, gameSkill)) {
                    $enterName.removeClass("hide");
                    setTimeout(function() {
                        $nameInput.focus();
                    }, 10);
                } else {
                    $enterName.addClass("hide");
                }
                $congrats.removeClass("hide");
            }, 1500);
        });

        game.on("activate", function (elm) {
            $(elm).removeClass("unspin").addClass("spin");
        });

        game.on("deactivate", function (elm) {
            $(elm).removeClass("spin").addClass("unspin");
        });

        game.on("success", function (elm1, elm2) {
            var $elm1 = $(elm1)
              , $elm2 = $(elm2)
              ;

            setTimeout(function() {
                $elm1.addClass("spinned-zoom-out");
                $elm2.addClass("spinned-zoom-out");
                setTimeout(function() {
                    $elm1.remove();
                    $elm2.remove();
                }, 900);
            }, 1000);
        });

        game.on("time", function (time) {
            var sec = Math.floor(time / 1000);
            $time.html(sec);
            game.passedTime = sec;
        });

        game.on("pair-flip", function () {
            $pairsCount.html(game.flippedPairs + 1);
        });

        game.start();
    }

    function showHighscores() {
        var hScores = Highscores.get(gameSkill);

        function forTable(selector, scores) {
            var elms = $(selector + " table tbody tr");
            elms.each(function (cRow, i) {

                var $cRow = $(cRow)
                  , $tds = $("td", $cRow)
                  ;

                scores[i] = scores[i] || {
                    name: ""
                  , time: ""
                  , pairs: ""
                  , timestamp: ""
                };

                $tds.eq(1).text(scores[i].name);
                $tds.eq(2).text(scores[i].time);
                $tds.eq(4).text(scores[i].pairs);

                $cRow.attr("data-timestamp", scores[i].timestamp.toString());
                $cRow.removeClass("selected");
            });
        }

        forTable(".fastest-times", hScores.fastestTimes);
        forTable(".fewest-pairs", hScores.fewestPairs);
        $highscores.show();
    }

    $(".highscores .ok-btn").on("click", function () {
        $highscores.hide();
    });

    // Restart game
    $(".restart").on("click", newGame);

    // Toggle colors
    $(".toggle-colors").on("click", function () {
        $body.toggleClass("grayscale");
    });

    // Show highscores
    $(".show-highscores").on("click", showHighscores);

    // Reset highscores
    $(".reset-btn").on("click", function () {
        Highscores.reset(gameSkill);
        showHighscores();
    });

    // Form submit
    $("form").on("submit", function (e) {
        var name = $nameInput.val()
          , inserted = Highscores.insert(name, game.passedTime, game.flippedPairs, gameSkill)
          ;

        $enterName.addClass("hide");
        showHighscores();

        var $toSelect = $("[data-timestamp='" + inserted.timestamp + "']");
        $toSelect.addClass("selected");

        e.preventDefault();
    });

    $(".btn-about").on("click", function (e) {
        $aboutWindow.toggleClass("hide");
    });

    $skillSelect.on("change", function () {
        gameSkill = this.value;
        $body.attr("game-skill", gameSkill);
        $gameSkillType.text(gameSkill.charAt(0).toUpperCase() + gameSkill.substring(1));
        if (game) {
            newGame();
        }
    }).trigger("change");
})();