$(document).ready(function() {

    User.renderUsersAtStart()

    const snakeHead = new SnakeHead()
    const game      = new Game(snakeHead)
    let food        = new Food()

    const playground = $('#game-container')

    playground.append(food.render())

    let snakeAlive  = true

    let leftBound   = -1
    let rightBound  = 586
    let topBound    = -1
    let bottomBound = 391
    
    const DIRECTIONS         = [ 37, 38, 39, 40 ]  
    const oppositeDirections = { 37: 39, 38: 40, 39: 37, 40: 38 }

    const moves = []
    let user    = ''

    const scoreContainer = $('#score-container')
    const gifContainer   = $('.gif-container')
    let displayingGif    = false

    //  GAME LOGIC
    let gameFlow = setInterval(function() {
      if (isNotWithinBound()) {
        handleGameLost()
      }
      snakeHead.tailBlocks.some(function(tailBlock) {
        if (snakeAteItself(tailBlock)) {
          handleGameLost()
        }
      })

      if (snakeAlive && game.gameOn) {

        snakeHead.advance()

        Tail.advanceAll()

        if (snakeEatsFood()) {

          food = new Food()
          playground.html(food.render())

          let snakeTail = new Tail(snakeHead)

          scoreContainer.html(`<div id="score" class="">Score:<span style="color: darkred">${game.score()}</span></div>`)

          if (game.score() / 100 > 1 && !displayingGif) {
            displayGif("exited")
          }
        }
        playground.html(snakeHead.render() + Tail.renderAll() + food.render())
      }

    }, 50)


// ////////
//
// Users functionalities not yet implemented
//
///////////

    $('#user-form-container').click(function(event) {
      if (event.target.id === 'submit-user') {
        game.gameReady = true
        user = submitUser() //this returns a new User
        game.user = user
        saveGame(game)
      }
    })

    $('#saved-games-container').click(function(event) {
      if (event.target.id === 'resume-saved-game') {
        retrieveGame()
      }
    })

    $(document).on('keydown', function(event) {

      if (game.gameOn) { // DONT LISTEN FOR KEY PRESSED IF GAME IS PAUSED/OVER
        event.preventDefault()
      }

      if (snakeHead.bearingChangeChecker === false) {

        if (DIRECTIONS.includes(event.keyCode) && game.gameOn) {
          changeBearing(event.keyCode)
          pushMoveToMoves(snakeHead)

        }

        if (event.keyCode === 32) { //spacebar pauses the game
          if (game.gameReady) {
            event.preventDefault()
            game.gameOn = !game.gameOn
            if (game.gameOn) {
              gameFlow
              $('#play-instructions').addClass('animated fadeOutUp')
              $('#score').fadeIn()
              $('#save-game').fadeIn()
            }
            if (!game.gameOn) {}
          }
        }
      }
    })

    $('#save-game').click(function() {
      if (game.user) {
        saveGame(game)
      } else {
        UserForm.renderOnPage()
        game.gameReady = false
      }
    })

    $('#message-container').click(function() {
      if (event.target.nodeName === "BUTTON" && event.target.id === "new-game-btn") {
        location.reload();
      }
      if (event.target.nodeName === "BUTTON" && event.target.id === "save-score-btn") {
        submitUser()
      }
    })


    ////////////////
    //
    // HELPER FUNCTIONS 
    //
    ///////////////

    function isNotWithinBound() {
      return snakeHead.coordinates[0] <= leftBound || snakeHead.coordinates[0] >= rightBound || snakeHead.coordinates[1] <= topBound || snakeHead.coordinates[1] >= bottomBound
    }

    function snakeAteItself(tailBlock) {
      return snakeHead.coordinates[0] === tailBlock.coordinates[0] && snakeHead.coordinates[1] === tailBlock.coordinates[1]
    }

    function snakeEatsFood() {
      return (snakeHead.coordinates[0] === food.coordinates[0] && snakeHead.coordinates[1] === food.coordinates[1] )
    }

    function handleGameLost() {
      snakeAlive = false
      game.gameOn = false
      $('#saved-games-container').html('')
      $('#message').html(`Score was: ${snakeHead.tailBlocks.length * 5 * snakeHead.tailBlocks.length}`)
      $('#message-container').show()
      $('#save-game').hide()
      clearInterval(gameFlow)
      displayGif("sad")

    }

    function displayGif(mood) {

      gifContainer.show()

      displayingGif = true

      setTimeout(function() {
        gifContainer.hide()
        gifContainer.attr('style', `background-image: url(${ mood == "exited" ? getExitedGif() : getSadGif() })`)
        displayingGif = false
      }, 4000)

    }

    function getSadGif() {
      const sadGifs = ["https://media.giphy.com/media/5WmyaeDDlmb1m/giphy.gif", "https://media.giphy.com/media/xlnD8sWgnBBja/giphy.gif", "https://media.giphy.com/media/vcNsKUQ07oPLy/giphy.gif", "https://media.giphy.com/media/Ys2Z1pTvkGhH2/giphy.gif", "https://media.giphy.com/media/2WxWfiavndgcM/giphy.gif"]

      return sadGifs[Math.floor(Math.random() * sadGifs.length)]
    }

    function getExitedGif() {
      const exitedGifs = ['https://media.giphy.com/media/10ERZqYioLWJ6U/giphy.gif', 'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif', 'https://media.giphy.com/media/l0MYxef0mpdcnQnvi/giphy.gif', 'https://media.giphy.com/media/jpXAdNRiwGL0k/giphy.gif', "https://media.giphy.com/media/msKNSs8rmJ5m/giphy.gif", "https://media.giphy.com/media/d4blihcFNkwE3fEI/giphy.gif"]

      return exitedGifs[Math.floor(Math.random() * exitedGifs.length)]
    }

    function changeBearing(keycode) {
      if (snakeHead.bearing != keycode && keycode != oppositeDirections[snakeHead.bearing]) {
        snakeHead.bearing = keycode
      }
    }

    function pushMoveToMoves(snakeHead) {
      moves.push({
        coordinates: snakeHead.coordinates.slice(),
        bearing: snakeHead.bearing
      })
      snakeHead.tailBlocks.forEach(tailBlock => tailBlock.moves.push(moves.slice(-1)[0]))
      snakeHead.bearingChangeChecker = true
    }

  })