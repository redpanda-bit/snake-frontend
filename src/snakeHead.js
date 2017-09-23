class SnakeHead {

  constructor(bearing = 40, coordinates = [15, 15]) {
    this.bearing     = bearing
    this.coordinates = coordinates
    this.tailBlocks  = []
    this.bearingChangeChecker = false
  }

  coordinatesAndBearing() {
    return {
      coordinates: this.coordinates,
      bearing: this.bearing
    }
  }

  tailCoordinatesAndBearing() {
    return this.tailBlocks.map(tailBlock => tailBlock.coordinatesAndBearing())
  }

  advance() {
    switch (this.bearing) {
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
    // allows bearing to be changeable since the snakeHead has moved
    this.bearingChangeChecker = false
  }

  tailSize() {
    return this.tailblocks.length
  }

  render() {
    // let renderHTML =
    return `
      <div class="head" id="head" style="left: ${this.coordinates[0]}px; top: ${this.coordinates[1]}px">
        </div>
      `
  }

  delete() {
    $('#head').remove()
  }

}