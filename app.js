let el = document.getElementsByTagName("body")[0]
let words = Array.from(Array(6), () => new Array(5))
let row = 0
let col = 0
let rowLen = 5
let colLen = 6
let board = document.querySelector(".container")
let secretWord = "chair"

let keyboard = document.querySelector(".keyboard")
document.querySelector("body").onload = () => { makeKeyboard() }

function checkWord() {
  let tempWord = []
  let tempSecretWord = Array.from(secretWord)
  for (let i = 0;i<rowLen;++i) {
    tempWord.push(words[col][i])
  }
  
  // Match letter and position
  let numRight = 0
  for (let row = 0; row < rowLen;++row) {
    getSquare(row, col).style.backgroundColor = "lightgray"
    let boardVal = getSquare(row, col).innerText

    let letterVal = words[col][row]
    
    if (tempSecretWord[row] === letterVal) {
      getSquare(row, col).style.backgroundColor = "green"

      tempSecretWord[row] = null
      tempWord[row] = null
      numRight++
    } 
  }
  if (numRight === rowLen) {
    document.write("<h1>You win!!!</h1>")
  }
  
  // Matches letter but not position
  for (let row = 0; row < rowLen;++row) {
    let letter = tempWord[row]
    if (letter !== null) {
      let matchingSecretLetter = tempSecretWord.indexOf(letter)
      if (matchingSecretLetter >= 0) {
        getSquare(row, col).style.backgroundColor = "yellow"

        tempSecretWord[matchingSecretLetter] = null
        tempWord[row] = null
      }
      let boardVal = getSquare(row, col).innerText
    }
  }
}

el.onkeydown = (e) => {
  // enter
  if (e.which === 13 && row === 5) {
    row = 0
    checkWord()
    col++
    if (col >= colLen) {document.write("You lose.")}
    return 0
  }
  
  // backspace
  if (e.which === 8) {
    if (row > 0)  {row--}
    let currentSpace =  getSquare(row, col)
    currentSpace.innerText = ""
    return 0
  }
  
  // letters only
  if (e.which >=65 && e.which <= 90) {
    words[col][row] = e.key
    update(words) 
    if (row < rowLen) { row++ } 
  }
}

function enterPressed() {

}

function update(words) {
  if (row === rowLen) return 0
  getSquare(row, col).innerText = words[col][row]
}

function getSquare(x, y) {
  let indexNum = y*rowLen + x
  return Array.from(board.children)[indexNum]
}

function makeKeyboard() {
  console.log("making keyboard")
  for (let i=0; i < keys.length; ++i) {
    let key = document.createElement("button")
    key.innerText = keys[i]
    key.onclick = () => {
      console.log("clicked key:" + keys[i], " ")
    }
    keyboard.appendChild(key)

  }
}

let keys = ["q", "w", "e", "r", "t", "y", "u", "i","o","p",
            "a","s","d","f","g","h","j","k","l",
            "ENTER","Z","X","C","V","B","N","M", "BACK"]