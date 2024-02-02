const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY


function clearResults() {
  const resultsContainer = document.getElementById('resultsImageContainer');
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
  const SuggestedSearchesContainer = document.getElementById('suggestion_list');
  while (SuggestedSearchesContainer.firstChild) {
    SuggestedSearchesContainer.removeChild(SuggestedSearchesContainer.firstChild);
  }
}

function runSearch() {
  clearResults();
  openResultsPane();

  let query = document.querySelector('.search input').value;
  if (!query) return false;

  let request = new XMLHttpRequest();
  request.open('GET', `${bing_api_endpoint}?q=${encodeURIComponent(query)}`);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = 'json';
  request.onload = function() {
    if (request.status >= 200 && request.status < 300) {
      UpdateAllElements(request.response)
    } else {
      alert("search failed")
    }
  };
  request.onerror = function() {alert("search failed")};
  request.send();

  return false;
}

function UpdateAllElements(response){

  let container = document.getElementById('resultsImageContainer');
  response.value.forEach(image => {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'resultImage';
    imgDiv.innerHTML = `<img src="${image.thumbnailUrl}" alt="${image.name}">`;
    imgDiv.addEventListener('click', () => appendMoodBoard(image.contentUrl));
    container.appendChild(imgDiv);
  });

  container = document.getElementById("suggestion_list");
  response.relatedSearches.forEach(search => {
    const SuggSearchDiv = document.createElement('li');
    SuggSearchDiv.innerHTML = `${search.text}`;
    container.appendChild(SuggSearchDiv);
  });

  const suggestions = document.querySelectorAll('.suggestions li');
  suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', (e) => {
      const query = e.target.innerText;
      document.querySelector('.search input').value = query;
      runSearch();
    });
  });
}

function appendMoodBoard(imgUrl) {
  const board = document.getElementById('board');
  const imgDiv = document.createElement('div');
  imgDiv.className = 'savedImage';
  imgDiv.innerHTML = `<img src="${imgUrl}">`;
  board.appendChild(imgDiv);
}

function openResultsPane() {
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  document.querySelector("#resultsExpander").classList.remove("open");
}
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});