let el = document.getElementsByTagName("body")[0]
let words = Array.from(Array(6), () => new Array(5))
let row = 0
let col = 0
let rowLen = 5
let colLen = 6
let board = document.querySelector(".container")
let secretWord = "chair"

let keyboard = document.querySelector("body")
// keyboard.onLoad = function() {alert("loaded")}
keyboard.onload = () => { makeKeyboard() }

function checkWord() {
  let tempWord = []
  let tempSecretWord = Array.from(secretWord)
  for (let i = 0;i<rowLen;++i) {
    tempWord.push(words[col][i])
  }
  
  // Match letter and position
  let numRight = 0
  for (let row = 0; row < rowLen;++row) {
    Array.from(board.rows)[col].cells[row].style.backgroundColor = "lightgray"
    let boardVal = Array.from(board.rows)[col].cells[row].innerText
    let letterVal = words[col][row]
    
    if (tempSecretWord[row] === letterVal) {
      Array.from(board.rows)[col].cells[row].style.backgroundColor = "green"
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
        Array.from(board.rows)[col].cells[row].style.backgroundColor = "yellow"
        tempSecretWord[matchingSecretLetter] = null
        tempWord[row] = null
      }
      let boardVal = Array.from(board.rows)[col].cells[row].innerText
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
    let currentSpace = Array.from(board.rows)[col].cells[row]
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

function update(words) {
  if (row === rowLen) return 0
  Array.from(board.rows)[col].cells[row].innerText = words[col][row]
}

function makeKeyboard() {
  console.log("making keyboard")
  let key = document.createElement("button")
  key.innerText = "q"
  keyboard.appendChild(key)
  
}

