// ------------------   SELECTORS   ----------------
const globalStatsDiv = document.querySelector('.globalStats');
const searchBarList = document.querySelector('.search-bar-list');
// -------------    EVENT LISTENERS    -------------

// ------------   FUNCTIONS   ----------------------

async function overViewPage() {
  const globalData = await getData('https://corona.lmao.ninja/v2/all');
  const iranData = await getData(
    'https://corona.lmao.ninja/v2/historical/Iran?lastdays=30'
  );
  const countriesStats = await getData(
    'https://corona.lmao.ninja/v2/countries?sort=cases'
  );

  renderSearchBar(countriesStats);
  renderIranChart(iranData);
  renderGlobalStats(globalData);
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
      <div class="numStat">${cases}</div>
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

function renderIranChart(data) {
  const { cases, deaths, recovered } = data.timeline;
  // getting data from object
  const casesTime = Object.keys(cases);
  const casesValue = Object.values(cases);
  const deathsValue = Object.values(deaths);
  const recoveredValue = Object.values(recovered);

  let ctx = document.getElementById('myChart').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: casesTime,
      datasets: [
        {
          label: 'Iran Total Cases',
          data: casesValue,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Iran Recovered',
          data: recoveredValue,
          backgroundColor: 'rgb(108, 209, 0, 0.3)',
          borderColor: 'rgb(108, 209, 0)',
          borderWidth: 1,
        },
        {
          label: 'Iran Total Deaths',
          data: deathsValue,
          backgroundColor: 'rgb(170, 170, 170, 0.8)',
          borderColor: 'rgb(0,0,0,0.6)',
          borderWidth: 1,
        },
      ],
    },
  });
}

function renderSearchBar(data) {
  console.log(data);
  for (let country of data) {
    console.log(country);
    const { country: keshvar, cases } = country;
    searchBarList.insertAdjacentHTML(
      'beforeend',
      `
    <li class="search-bar-list-item">
      <span class="search-bar-list-item-stats">${cases / 1000}</span>
        ${keshvar}</li>
    `
    );
  }
}
// ------------ function calls ---------------------
overViewPage();
