// ------------------   SELECTORS   ----------------
const globalStatsDiv = document.querySelector('.globalStats');
// -------------    EVENT LISTENERS    -------------

// ------------   FUNCTIONS   ----------------------

async function GlobalStats() {
  const data = await getData('https://corona.lmao.ninja/v2/all');
  renderGlobalStats(data);
}

// ---- sub functions -------
async function getData(url) {
  const data = await fetch(url).then((response) => response.json());
  return data;
}

function renderGlobalStats(data) {
  const {
    cases,
    todayCases,
    deaths,
    todayDeaths,
    recovered,
    active,
    critical,
    casesPerOneMillion,
    deathsPerOneMillion,
    tests,
    testsPerOneMillion,
    affectedCountries,
  } = data;

  globalStatsDiv.insertAdjacentHTML(
    'afterbegin',
    `

    <div class="stats-group">
    <div class="stat" id="total-cases">
      <div class="numStat">${cases / 1000000}</div>
      <p class="textStat">total&nbspcases</p>
        </div>
    <div class="stat" id="recovered">
      <div class="numStat" >${recovered / 1000}</div>
      <p class="textStat">total&nbsprecovered</p>
        </div>
    <div class="stat" id="total-deaths">
      <div class="numStat">${deaths / 1000}</div>
      <p class="textStat">total&nbspdeaths</p>
        </div>
        </div>

    <div class="stats-group">
    <div class="stat">
      <div class="numStat">${todayCases / 1000}</div>
      <p class="textStat">today&nbspcases</p>
        </div>
    <div class="stat">
      <div class="numStat">${todayDeaths}</div>
      <p class="textStat">today&nbspdeaths</p>
        </div>
    <div class="stat">
      <div class="numStat">${active / 1000000}</div>
      <p class="textStat">active&nbspcases</p>
        </div>
    <div class="stat">
      <div class="numStat">${critical / 1000}</div>
      <p class="textStat">critical&nbspcases</p>
        </div>
        </div>

  <div class="stats-group">
    <div class="stat">
      <div class="numStat">${casesPerOneMillion}</div>
      <p class="textStat">cases/1M</p>
        </div>
    <div class="stat">
      <div class="numStat">${deathsPerOneMillion}</div>
      <p class="textStat">deaths/1M</p>
        </div>
    <div class="stat">
      <div class="numStat">${testsPerOneMillion}</div>
      <p class="textStat">tests/1M</p>
        </div>
  </div>

     <div class="stats-group"> 
    <div class="stat">
      <div class="numStat">${affectedCountries}</div>
      <p class="textStat">affected countries</p>
        </div>
        </div>
  `
  );
}

GlobalStats();
