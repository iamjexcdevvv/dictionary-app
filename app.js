const textState = document.querySelector("#search-effect");
const searchBar = document.querySelector("#search-bar");
const parentElement = document.querySelector("#main-content");
const resultElement = document.querySelector(".result");
const wordElement = document.querySelector(".title");
const definitionElement = document.querySelector(".meaning");
const audioElement = document.querySelector(".audio");

const dictionary = {
  apiKey: "https://api.dictionaryapi.dev/api/v2/entries/en",
  dictionaryWord: null,
  dictionaryDefinition: null,
  dictionaryPronounciation: null,
};

function searchWord(e) {
  const word = searchBar.value;

  if (e.key === "Enter") {
    searchingWord(word);
  }

  return;
}

async function getWord(word) {
  try {
    const response = await fetch(`${dictionary.apiKey}/${word}`);
    const data = await response.json();
    getResults(data);
  } catch (error) {
    textState.textContent = `Error: Cannot find the meaning of "${word}"`;
    searchBar.value = "";
  }
}

function getResults([resultArr]) {
  dictionary.dictionaryPronounciation = getAudio(resultArr).audio;

  const { meanings, word } = resultArr;

  dictionary.dictionaryWord = word;
  dictionary.dictionaryDefinition = meanings[0]?.definitions[0]?.definition;

  showResults.call(dictionary);
}

function getAudio({ phonetics }) {
  return phonetics.find((item) => {
    return item.audio !== "";
  });
}

function showResults() {
  searchBar.value = "";

  wordElement.textContent = `Word Title: ${this.dictionaryWord}`;
  definitionElement.textContent = `Meaning: ${this.dictionaryDefinition}`;
  audioElement.setAttribute("src", this.dictionaryPronounciation);

  textState.classList.add("hide");
  resultElement.classList.remove("hide");
  return;
}

function searchingWord(word) {
  resultElement.classList.add("hide");
  textState.classList.remove("hide");
  textState.innerText = `Searching the meaning of "${word}"`;

  return setTimeout(() => {
    getWord(word);
  }, 1000);
}

searchBar.addEventListener("keyup", searchWord);
