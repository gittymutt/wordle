let numCols = 5
let numRows = 6
let words = Array.from(Array(numRows), () => new Array(numCols))
let curCol = 0
let curRow = 0
let gameOver = false

const backButtonLabel = "<"
const enterButtonLabel = "ENTER"
const YELLOW_CLASS = "yellow"
const GREEN_CLASS = "green"
const DARK_GRAY_CLASS = "dark-gray"
const LIGHT_GRAY_CLASS = "light-gray"

let board = document.querySelector(".board")

let list = dict.filter((w) => w.length === 5)
let secretWord = list[Math.floor(list.length * Math.random())]
let secretWordElements = document.querySelectorAll(".secret-word")
let wrongWordElement = document.querySelector(".show-wrong-word")
let wrongWord = document.querySelector(".wrong-word")
let keyboard = document.querySelector(".keyboard")

document.querySelector("body").onload = () => {
  for (let w of secretWordElements) {
    w.textContent = secretWord
  } 
  makeSquares(numCols, numRows)
  makeKeyboard()
  
  let seenDirections = window.localStorage.getItem("seenDirections")
  let overlay = document.querySelector("#overlay")
  if (!window.localStorage.seenDirections) {
    let closeButton = document.querySelector("#close-button")
    let instructionSheet = document.querySelector(".instruction-sheet")
    closeButton.onclick = () => overlay.style.display = "none"
    instructionSheet.onclick = (e) => e.stopPropagation()
    overlay.onclick = (e) => {
      overlay.style.display = "none"
    }
    window.localStorage.setItem("seenDirections", true)
  } else {
    overlay.style.display = "none"
  }
  
}

function checkWord() {
  let tempWord = []
  let tempSecretWord = Array.from(secretWord)
  tempSecretWord = tempSecretWord.map((letter) => letter.toUpperCase())
  for (let i = 0;i<numCols;++i) {
    tempWord.push(words[curRow][i].toUpperCase() )
  }

  let wordIndex = dict.indexOf(tempWord.join('').toLowerCase())
  if (wordIndex === -1) {
    // alert(`${tempWord.join('')} is not in my dictionary.`)
    wrongWord.textContent = tempWord.join('')
    wrongWordElement.style.visibility = "visible"
    setTimeout(() => {
      wrongWordElement.style.visibility = "hidden"
    }, 1500)
    shakeRow()
    return 0
  }
  
  curCol = 0
  
  // Matches letter and position
  let numRight = 0
  for (let curCol = 0; curCol < numCols;++curCol) {
    getSquareBack(curCol, curRow).classList.add(DARK_GRAY_CLASS)
    let letterVal = words[curRow][curCol]
    if ( tempSecretWord[curCol] === letterVal) {
      let squareBack = getSquareBack(curCol, curRow)
      squareBack.classList.remove(DARK_GRAY_CLASS)
      squareBack.classList.remove(YELLOW_CLASS)
      squareBack.classList.add(GREEN_CLASS)
      let key = getKey(letterVal)
      key.classList.remove(YELLOW_CLASS)
      key.classList.add(GREEN_CLASS)
      tempSecretWord[curCol] = null
      tempWord[curCol] = null
      numRight++
    } 
  }
  if (numRight === numCols) {
    document.querySelector(".you-win").style.visibility = "visible"
    gameOver = true
  }
  
  // Matches letter but not position
  for (let curCol = 0; curCol < numCols;++curCol) {
    let letter = tempWord[curCol]
    if (letter !== null) {
      let matchingSecretLetter = tempSecretWord.indexOf(letter)
      if (matchingSecretLetter >= 0) {
        let squareBack = getSquareBack(curCol, curRow)
        squareBack.classList.remove(DARK_GRAY_CLASS)
        squareBack.classList.add(YELLOW_CLASS)
        let key = getKey(tempSecretWord[matchingSecretLetter])
        if( !key.classList.contains(GREEN_CLASS)) { key.classList.add(YELLOW_CLASS) }
        tempSecretWord[matchingSecretLetter] = null
        tempWord[curCol] = null
      }
      let boardVal = getSquare(curCol, curRow).innerText.toUpperCase()
    }
  }

  // Unmatching letters
  tempWord = tempWord.filter((letter) => letter !== null)
  for (const letter of tempWord) {
    let key = getKey(letter)
    if (key.classList.contains(GREEN_CLASS)) continue 
    if (key.classList.contains(YELLOW_CLASS)) continue 
    key.classList.add(LIGHT_GRAY_CLASS) 
  }

  flipLetters(curRow)
  curRow++
}

let body = document.getElementsByTagName("body")[0]
body.onkeydown = (e) => {
  if (gameOver) return 0
  // enter
  if (e.which === 13) {
    if (curCol === numCols) enterPressed()
    document.activeElement.blur() // prevents previously clicked key from firing
    return 0
  }
  
  // backspace
  if (e.which === 8) {
    backSpacePressed()
    return 0
  }
  
  // letters only
  if (e.which >=65 && e.which <= 90) {
    letterPressed(e.key)
  }
}

function enterPressed() {
  if (curCol === numCols) {
    // curCol = 0
    checkWord()
    // curRow++
    if (gameOver) return 0
    if (curRow >= numRows) {
      document.querySelector(".you-lose").style.visibility = "visible"
      gameOver = true
    }
  }
}

function backSpacePressed() {
  if (curCol > 0)  {curCol--}
  words[curRow][curCol] = ""
  if (update(words) !== 0) {
    getSquareFront(curCol, curRow).classList.remove("pulse")
  }
}

function letterPressed(letterChar) {
  words[curRow][curCol] = letterChar.toUpperCase()
  if (update(words) !== 0) {
    getSquareFront(curCol, curRow).classList.add("pulse")
  }
  if (curCol < numCols) { curCol++ }
}

function update(words) {
  if (curCol === numCols) return 0
  getSquareFront(curCol, curRow).firstChild.innerText = words[curRow][curCol]
  getSquareBack(curCol, curRow).firstChild.innerText = words[curRow][curCol]
  return 1
}

function getSquare(x, y) {
  let indexNum = y*numCols + x
  return Array.from(board.children)[indexNum]
}

function getSquareFront(x, y) {
  let indexNum = y*numCols + x
  return Array.from(board.children)[indexNum].firstChild.firstChild
}

function getSquareBack(x, y) {
  let indexNum = y*numCols + x
  return Array.from(board.children)[indexNum].firstChild.lastChild
}

// param: letter A-Z 
function getKey(letter) {
  return document.querySelector(`.key-${letter}`)
}

function makeKeyboard() {
  keys = keys.map((key) => key.toUpperCase())
  for (let i=0; i < keys.length; ++i) {
    let key = document.createElement("button")
    key.className = `key-${keys[i]}`
    key.innerText = keys[i]
    key.style.border = "none"
    key.style.borderRadius = "7px"
    
    
    if (keys[i] != enterButtonLabel && keys[i] != backButtonLabel) { // make an isAlpha function
      key.onclick = (e) => {
        if (gameOver) return
        letterPressed(keys[i])
      }
    }
    if (keys[i] === enterButtonLabel) {
      key.style.gridColumn = "1 / 3"
      key.onclick = () => {
        enterPressed()
      }
    }
    if (keys[i] === backButtonLabel) {
      key.onclick = () => {
        backSpacePressed()
      }
    }
    keyboard.appendChild(key)
  }
}

function flipLetters(rowToFlip) {
  let timeDelay = 0
  for (let curRow = 0;curRow < numCols;++curRow) {
    setTimeout(() => {
      getSquare(curRow, rowToFlip).firstChild.classList.add('flip') 
    }, timeDelay)
    timeDelay += 400
  }
}

function shakeRow() {
  let timeDelay = 800
  for (let curCol = 0;curCol < numCols;++curCol) {
    getSquare(curCol, curRow).classList.add("shake")
    setTimeout(() => {
      getSquare(curCol, curRow).classList.remove("shake")
    }, timeDelay)
  } 
}

function makeSquares(numCols, numRows) {
  let board = document.querySelector(".board")
  let numberOfSquares = numCols * numRows
  for (let i=0;i<numberOfSquares;++i) {
    let boxContainer = document.createElement('div')
    boxContainer.classList.add('box-container')
    let innerBoxContainer = document.createElement('div')
    innerBoxContainer.classList.add('inner-box-container')
    let boxFrontSide = document.createElement('div')
    boxFrontSide.classList.add('box-front-side')
    let boxBackSide = document.createElement('div')
    boxBackSide.classList.add('box-back-side')
    let spanFront = document.createElement('span')
    let spanBack = document.createElement('span')

    boxFrontSide.appendChild(spanFront)
    boxBackSide.appendChild(spanBack)
    innerBoxContainer.appendChild(boxFrontSide)
    innerBoxContainer.appendChild(boxBackSide)
    boxContainer.appendChild(innerBoxContainer)
    board.appendChild(boxContainer)
  }
}

let keys = ["q", "w", "e", "r", "t", "y", "u", "i","o","p",
            "a","s","d","f","g","h","j","k","l",
            enterButtonLabel,"z","x","c","v","b","n","m", backButtonLabel]