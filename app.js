
let rowLen = 5
let colLen = 6
let el = document.getElementsByTagName("body")[0]
let words = Array.from(Array(colLen), () => new Array(rowLen))
let row = 0
let col = 0
const backButtonLabel = "<"
const enterButtonLabel = "ENTER"
// const YELLOW = "#f1ba14"
// const GREEN = "green"
// const LIGHT_GRAY = "#aaa3a3"
// const DARK_GRAY = "#534c4c"

const YELLOW_CLASS = "yellow"
const GREEN_CLASS = "green"
const DARK_GRAY_CLASS = "dark-gray"
const LIGHT_GRAY_CLASS = "light-gray"




let board = document.querySelector(".board")
let secretWord = "buddy"

let keyboard = document.querySelector(".keyboard")
document.querySelector("body").onload = () => { makeKeyboard() }

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
    // getSquare(row, col).style.backgroundColor = DARK_GRAY
    // getSquare(row, col).style.border = DARK_GRAY
    getSquare(row, col).classList.add(DARK_GRAY_CLASS)

    let letterVal = words[col][row]
    if ( tempSecretWord[row] === letterVal) {
      let square = getSquare(row, col)
      // square.style.backgroundColor = GREEN
      // square.style.borderColor = GREEN
      square.classList.remove(DARK_GRAY_CLASS)
      square.classList.remove(YELLOW_CLASS)
      square.classList.add(GREEN_CLASS)
      let key = getKey(letterVal)
      // key.style.backgroundColor = GREEN
      key.classList.remove(YELLOW_CLASS)
      key.classList.add(GREEN_CLASS)
      tempSecretWord[row] = null
      tempWord[row] = null
      numRight++
    } 
  }
  if (numRight === rowLen) {
    document.querySelector(".you-win").style.visibility = "visible"
  }
  
  // Matches letter but not position
  for (let row = 0; row < rowLen;++row) {
    let letter = tempWord[row]
    if (letter !== null) {
      let matchingSecretLetter = tempSecretWord.indexOf(letter)
      if (matchingSecretLetter >= 0) {
        let square = getSquare(row, col)
        // square.style.backgroundColor = YELLOW
        // square.style.borderColor = YELLOW
        square.classList.remove(DARK_GRAY_CLASS)
        square.classList.add(YELLOW_CLASS)
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
    console.log(letter + " is " + key.style.backgroundColor)
    if (key.classList.contains(GREEN_CLASS)) continue 
    if (key.classList.contains(YELLOW_CLASS)) continue 

    // if (key.style.backgroundColor === YELLOW) {console.log(key + " yellow already. Skipping")}
    key.classList.add(LIGHT_GRAY_CLASS)
    
  }
}

el.onkeydown = (e) => {
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
    }
  }
}

function backSpacePressed() {
  if (row > 0)  {row--}
  let currentSpace =  getSquare(row, col)
  currentSpace.innerText = ""
}

function letterPressed(letterChar) {
  words[col][row] = letterChar.toUpperCase()
  update(words) 
  if (row < rowLen) { row++ } 
}

function update(words) {
  if (row === rowLen) return 0
  getSquare(row, col).innerText = words[col][row]
}

function getSquare(x, y) {
  let indexNum = y*rowLen + x
  return Array.from(board.children)[indexNum]
}


// param: letter A-Z 
function getKey(letter) {
  // console.log(`searching for .key-${letter}`)
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

let keys = ["q", "w", "e", "r", "t", "y", "u", "i","o","p",
            "a","s","d","f","g","h","j","k","l",
            enterButtonLabel,"z","x","c","v","b","n","m", backButtonLabel]