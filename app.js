
let rowLen = 5
let colLen = 6
let el = document.getElementsByTagName("body")[0]
let words = Array.from(Array(colLen), () => new Array(rowLen))
let row = 0
let col = 0
let gameOver = false

const backButtonLabel = "<"
const enterButtonLabel = "ENTER"
const YELLOW_CLASS = "yellow"
const GREEN_CLASS = "green"
const DARK_GRAY_CLASS = "dark-gray"
const LIGHT_GRAY_CLASS = "light-gray"

let board = document.querySelector(".board")
let secretWord = "buddy"

let keyboard = document.querySelector(".keyboard")
document.querySelector("body").onload = () => { 
  makeSquares(rowLen, colLen) //change col and row around
  makeKeyboard() 
}

function checkWord() {
  let tempWord = []
  let tempSecretWord = Array.from(secretWord)
  tempSecretWord = tempSecretWord.map((letter) => letter.toUpperCase())
  for (let i = 0;i<rowLen;++i) {
    tempWord.push(words[col][i].toUpperCase() )
  }
  
  // Matches letter and position
  let numRight = 0
  for (let row = 0; row < rowLen;++row) {
    getSquareBack(row, col).classList.add(DARK_GRAY_CLASS)
    let letterVal = words[col][row]
    if ( tempSecretWord[row] === letterVal) {
      let squareBack = getSquareBack(row, col)
      squareBack.classList.remove(DARK_GRAY_CLASS)
      squareBack.classList.remove(YELLOW_CLASS)
      squareBack.classList.add(GREEN_CLASS)
      let key = getKey(letterVal)
      key.classList.remove(YELLOW_CLASS)
      key.classList.add(GREEN_CLASS)
      tempSecretWord[row] = null
      tempWord[row] = null
      numRight++
    } 
  }
  if (numRight === rowLen) {
    document.querySelector(".you-win").style.visibility = "visible"
    gameOver = true
  }
  
  // Matches letter but not position
  for (let row = 0; row < rowLen;++row) {
    let letter = tempWord[row]
    if (letter !== null) {
      let matchingSecretLetter = tempSecretWord.indexOf(letter)
      if (matchingSecretLetter >= 0) {
        let squareBack = getSquareBack(row, col)
        squareBack.classList.remove(DARK_GRAY_CLASS)
        squareBack.classList.add(YELLOW_CLASS)
        let key = getKey(tempSecretWord[matchingSecretLetter])
        if( !key.classList.contains(GREEN_CLASS)) { key.classList.add(YELLOW_CLASS) }
        tempSecretWord[matchingSecretLetter] = null
        tempWord[row] = null
      }
      let boardVal = getSquare(row, col).innerText.toUpperCase()
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

  // Flip Letters
  console.log("row outside flipLetters()" + row)
  flipLetters(col)
}

el.onkeydown = (e) => {
  if (gameOver) return 0

  // enter
  if (e.which === 13 && row === rowLen) {
    enterPressed()
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
  if (row === rowLen) {
    row = 0
    checkWord()
    col++
    if (col >= colLen) {
      document.querySelector(".you-lose").style.visibility = "visible"
      gameOver = true
    }
  }
}

function backSpacePressed() {
  if (row > 0)  {row--}
  words[col][row] = ""
  update(words)
}

function letterPressed(letterChar) {
  words[col][row] = letterChar.toUpperCase()
  update(words) 
  if (row < rowLen) { row++ }
}

function update(words) {
  if (row === rowLen) return 0
  getSquareFront(row, col).innerText = words[col][row]
  getSquareBack(row, col).innerText = words[col][row]

}

function getSquare(x, y) {
  let indexNum = y*rowLen + x
  return Array.from(board.children)[indexNum]
}

function getSquareFront(x, y) {
  let indexNum = y*rowLen + x
  return Array.from(board.children)[indexNum].firstChild.firstChild
}

function getSquareBack(x, y) {
  let indexNum = y*rowLen + x
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
      key.onclick = () => {
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

// row is correct, colLen is really rowLen
function flipLetters(rowToFlip) {
  console.log(`row:${rowToFlip} column len: ${rowLen}`)
  let timeDelay = 0
  for (let col = 0;col < rowLen;++col) {
    
    console.log(getSquare(col, rowToFlip).firstChild.firstChild.innerText)
    setTimeout(() => {
      getSquare(col, rowToFlip).firstChild.classList.add('flip') 
    }, timeDelay)
    timeDelay += 400
  }
}

function makeSquares(rowLen, colLen) {
  let board = document.querySelector(".board")
  let numberOfSquares = rowLen * colLen
  for (let i=0;i<numberOfSquares;++i) {
    let boxContainer = document.createElement('div')
    boxContainer.classList.add('box-container')
    let innerBoxContainer = document.createElement('div')
    innerBoxContainer.classList.add('inner-box-container')
    let boxFrontSide = document.createElement('div')
    boxFrontSide.classList.add('box-front-side')
    let boxBackSide = document.createElement('div')
    boxBackSide.classList.add('box-back-side')
  

    innerBoxContainer.appendChild(boxFrontSide)
    innerBoxContainer.appendChild(boxBackSide)
    boxContainer.appendChild(innerBoxContainer)
    board.appendChild(boxContainer)
  }
}

let keys = ["q", "w", "e", "r", "t", "y", "u", "i","o","p",
            "a","s","d","f","g","h","j","k","l",
            enterButtonLabel,"z","x","c","v","b","n","m", backButtonLabel]