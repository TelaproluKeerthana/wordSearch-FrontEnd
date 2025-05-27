import { Grid } from './grid.js';

const submitWordBtn = document.querySelector(".submit-word");
const xAxisInput = document.getElementById("x-axis");
const yAxisInput = document.getElementById("y-axis");
const wordInput = document.getElementById("add-word");
const wordListDisplay = document.getElementById("word-list-display");
const defaultWords = ["APPLE", "MANGO", "JACKFRUIT", "PINEAPPLE", "LEMON", "BLUEBERRY"];

const wordList = [];
const grid = new Grid();

submitWordBtn.addEventListener("click", async () => {
    const newWord = wordInput.value.trim().toUpperCase();
    if (newWord && !wordList.includes(newWord)){
        wordList.push(newWord);
    }
    console.log("Button clicked with words:", wordList);
     const xAxis = parseInt(xAxisInput.value, 10);
    const yAxis = parseInt(yAxisInput.value, 10);
    const finalWords = wordList.length > 0 ? wordList : defaultWords;
    window.validWords = finalWords;
    updateWordListDisplay(finalWords);
    const wordGridText = await fetchGridInfo(finalWords, xAxis, yAxis);
    
    const chars = wordGridText.replace(/\s/g, "").split("");
    grid.renderGrid(xAxis, yAxis, chars); 
    wordInput.value = "";
});

async function fetchGridInfo(words, xAxis, yAxis){
    const commaSeperatedWords = words.join(",");
    let response = await fetch(`http://localhost:8080/wordgrid?xAxis=${xAxis}&yAxis=${yAxis}&words=${commaSeperatedWords}`);
    let result = await response.text();
    return result;
}

function updateWordListDisplay(words) {
    wordListDisplay.innerHTML = words.map(word => `<li>${word}</li>`).join("");
}