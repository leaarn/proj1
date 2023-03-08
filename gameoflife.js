const unitLength = 20;
let boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let pauseButton;
let randomButton;
let deathSlider;
let colorPicker;
let lonelinessSelect;
let overpopulationSelect;
let reproductionSelect;
let stop_flag = false;
let divWidth, divHeight;
//change dark mode
let mode;
let modeFlag = false;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  //pause button
  pauseButton = createButton("STOP");
  pauseButton.mousePressed(buttonToStart);
  pauseButton.parent(document.querySelector(".pauseButton"));
  //random button
  randomButton = createButton("RANDOM");
  randomButton.mousePressed(startRandom);
  randomButton.parent(select(".randomButton"));
  // dark mode
  mode = createButton("MODE");
  mode.mousePressed(noLifeCol);
  mode.parent(select(".modeButton"));

  //   speed slider
  speedSlider = createSlider(1, 60, 25, 1);
  speedSlider.parent(select(".slider"));
  //   colorPicker
  colorPicker = createColorPicker("#ed225d");
  colorPicker.parent(select(".color-picker"));

  //rules
  // loneliness
  lonelinessSelect = createSelect();
  lonelinessSelect.parent(select(".lonelinessSelector"));
  //overpopulation
  overpopulationSelect = createSelect();
  overpopulationSelect.parent(select(".overpopulationSelector"));
  // reproduction
  reproductionSelect = createSelect();
  reproductionSelect.parent(select(".reproductionSelector"));
  for (let i = 1; i < 8; i++) {
    lonelinessSelect.option(i);
    lonelinessSelect.selected("2");
    overpopulationSelect.option(i);
    overpopulationSelect.selected("3");
    reproductionSelect.option(i);
    reproductionSelect.selected("3");
  }

  //canvas!
  redrawCanvas();
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

function redrawCanvas() {
  var mainDiv = select("#canvas");
  divWidth = mainDiv.width;
  divHeight = mainDiv.height;
  const canvas = createCanvas(divWidth, divHeight);
  canvas.parent(select("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength + 1);
  rows = floor(height / unitLength + 1);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
}

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  lonelinessSelect.selected("2");
  overpopulationSelect.selected("3");
  reproductionSelect.selected("3");
  speedSlider.value(25);
}

function draw() {
  background(255);
  frameRate(speedSlider.value());
  boxColor = colorPicker.color();
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor);
      } else {
        if (modeFlag == true) {
          fill(80);
        } else fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      lValue = int(lonelinessSelect.value());
      oValue = int(overpopulationSelect.value());
      rValue = int(reproductionSelect.value());
      if (lValue) {
        loneliness = lValue;
      }
      if (oValue) {
        overpopulation = oValue;
      }
      if (rValue) {
        reproduction = rValue;
      }
      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < lValue) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > oValue) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == rValue) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0) {
    return;
  }
  console.log(mouseY);
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  if (!stop_flag) {
    loop();
  }
}

function buttonToStart() {
  if (stop_flag == false) {
    noLoop();
    stop_flag = true;
    pauseButton.html("START");
    return;
  }
  if (stop_flag == true) {
    loop();
    stop_flag = false;
    pauseButton.html("STOP");
    return;
  }
}

document.querySelector("#reset-game").addEventListener("click", function () {
  loop();
  init();
});

function startRandom() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let ranResult = random();
      if (ranResult > 0.5) {
        currentBoard[i][j] = 1;
        loop();
      }
    }
  }
}

function random() {
  return random(0, 2);
}

let saveBoard = [];
function windowResized() {
  noLoop();
  saveBoard = currentBoard;
  oldRow = saveBoard.length;
  var mainDiv = select("#canvas");
  divWidth = mainDiv.width;
  divHeight = mainDiv.height;
  const canvas = createCanvas(divWidth, divHeight);
  canvas.parent(select("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength + 1);
  rows = floor(height / unitLength + 1);
  newRow = currentBoard.length;
  /* check increase rows or decrease rows */
  if (newRow < oldRow) {
    for (iRow = 0; iRow < newRow; iRow++) {
      //if there are more elem
      if (currentBoard[iRow].length > saveBoard[iRow].length) {
        //add the elem into saveBoard
        for (x = 0; x < currentBoard[iRow].length - saveBoard[iRow].length; x++) {
          saveBoard[iRow].push(x);
        }
      } else if (currentBoard[iRow].length < saveBoard[iRow].length) {
        for (x = 0; x < saveBoard[iRow].length - currentBoard[iRow].length; x++) {
          saveBoard[iRow].pop(x);
        }
      }
    }
    for (iRow = newRow; iRow < oldRow; iRow++) {
      saveBoard.splice(iRow, 1);
    }
  } else if (newRow > oldRow) {
    for (iRow = 0; iRow < oldRow; iRow++) {
      //if there are more elem
      if (currentBoard[iRow].length > saveBoard[iRow].length) {
        //add the elem into saveBoard
        for (x = 0; x < currentBoard[iRow].length - saveBoard[iRow].length; x++) {
          saveBoard[iRow].push(x);
        }
      }
    }
    /* add row */
    for (iRow = oldRow; iRow < newRow; iRow++) {
      saveBoard.splice(iRow, 0, currentBoard[iRow]);
    }
  } else if ((newRow = oldRow)) {
    saveBoard = currentBoard;
  }
  currentBoard = saveBoard;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor);
      } else {
        if (modeFlag == true) {
          fill(80);
        } else fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  pauseButton.html("START");
  stop_flag = true;
}

//dark mode button
function noLifeCol() {
  if (modeFlag == false) {
    modeFlag = true;
    loop();
  } else if (modeFlag == true) {
    modeFlag = false;
    loop();
  }
}
