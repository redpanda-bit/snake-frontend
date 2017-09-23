const Tail = (function() {
  let tailBlocks = []
  let idCounter = 0
  return class Tail {
    constructor(snakeHead) {
      this.snakeHead = snakeHead
      this.snakeHead.tailBlocks.push(this)
      if (tailBlocks.length === 0) {
        this.moves = []
      } else {
        this.moves = tailBlocks[tailBlocks.length - 1].moves.slice()
      }
      this.setBearingAndCoordinates()
      tailBlocks.push(this)
      this.id = idCounter++
    }

    static tailBlocks() {
      return tailBlocks
    }

    static renderAll() {
      return this.tailBlocks().map(tail => tail.render()).join('')
    }

    coordinatesAndBearing() {
      return {
        coordinates: this.coordinates,
        bearing: this.bearing
      }
    }

    setBearingAndCoordinates() {
      if (tailBlocks.length === 0) {
        this.bearing = this.snakeHead.bearing
        this.coordinates = this.snakeHead.coordinates.slice()
      } else {
        this.bearing = tailBlocks[tailBlocks.length - 1].bearing
        this.coordinates = tailBlocks[tailBlocks.length - 1].coordinates.slice()
      }

      switch (this.bearing) {
        case 38:
            this.coordinates[1] += 15
            break;

        case 39:
            this.coordinates[0] -= 15
            break;

        case 40:
            this.coordinates[1] -= 15
            break;

        case 37:
            this.coordinates[0] += 15
            break;
        }
    }

    static advanceAll() {
      tailBlocks.forEach(tailBlock => tailBlock.advance())
    }

    advance() {

      if (this.moves.length > 0) {
        const move = this.moves[0]
        if (this.coordinates[0] === move.coordinates[0] && this.coordinates[1] === move.coordinates[1]) {
          this.bearing = move.bearing
          this.moves.shift()
        }
      }
      switch (this.bearing) { // position tail BEHIND head
        case 38:
          this.coordinates[1] -= 15
          break;

        case 39:
          this.coordinates[0] += 15
          break;

        case 40:
          this.coordinates[1] += 15
          break;

        case 37:
          this.coordinates[0] -= 15
          break;
      }
    }
    render() {
      return `
          <div class="tail" id="tail-${this.id}" style="left: ${this.coordinates[0]}px; top: ${this.coordinates[1]}px">
            </div>
          `
    }
    static deleteAll() {
      $('.tail').remove()
    }

  }
})()