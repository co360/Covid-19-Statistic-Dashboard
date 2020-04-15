// ------------------   SELECTORS   ----------------
const globalStatsDiv = document.querySelector('.globalStats');
const searchBarList = document.querySelector('.search-bar-list');
const searchInput = document.querySelector('.search-bar-input');
let ctx = document.getElementById('myChart').getContext('2d');

// -------------   EVENT LISTENERS    -------------

searchBarList.addEventListener('click', (e) => {
  if (e.target.classList.contains('search-bar-list-item')) {
    const listItem = e.target;
    const countryName = listItem.children[1].innerText;

    async function renderChartAgain() {
      const data = await getCountryData(
        'https://corona.lmao.ninja/v2/historical',
        countryName
      );

      renderBarChart(data);
    }
    ctx.innerHTML = '';
    renderChartAgain();
  }
});

searchInput.addEventListener('keyup', () => {
  const term = searchInput.value.trim().toLowerCase();
  filterList(term);
});

// ------------  FUNCTIONS  ----------------------

async function overViewPage() {
  const globalData = await getData('https://corona.lmao.ninja/v2/all');
  const globalDaily = await getData(
    'https://corona.lmao.ninja/v2/historical/all?lastdays=10'
  );
  const countryHistoryData = await getCountryData(
    'https://corona.lmao.ninja/v2/historical',
    'Iran'
  );
  const allCountriesStats = await getData(
    'https://corona.lmao.ninja/v2/countries?sort=cases'
  );

  renderSearchBar(allCountriesStats);
  renderBarChart(countryHistoryData);
  renderGlobalChart(globalDaily);
  renderGlobalStats(globalData);
}

// ---- sub functions -------

function filterList(term) {
  Array.from(searchBarList.children)
    .filter(
      (searchItem) =>
        !searchItem.children[1].textContent.toLowerCase().includes(term)
    )
    .forEach((searchItem) => searchItem.classList.add('filtered'));

  Array.from(searchBarList.children)
    .filter((searchItem) =>
      searchItem.children[1].textContent.toLowerCase().includes(term)
    )
    .forEach((searchItem) => searchItem.classList.remove('filtered'));
}

function getData(url) {
  const data = fetch(url).then((response) => response.json());
  return data;
}

function getCountryData(url, countryName) {
  const data = fetch(`${url}/${countryName}?lastdays=25`).then((response) =>
    response.json()
  );
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
    <div class="stat" id="active-cases">
      <div class="numStat">${active / 1000000}</div>
      <p class="textStat">active&nbspcases</p>
        </div>
    <div class="stat" id="critical-cases">
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
      <p class="textStat">countries</p>
        </div>
        </div>
  `
  );
}

function renderBarChart(data) {
  const { country: countryName } = data;
  const { country, cases, deaths, recovered } = data.timeline;
  // getting data from object

  const casesTime = Object.keys(cases);
  const casesValue = Object.values(cases);
  const deathsValue = Object.values(deaths);
  const recoveredValue = Object.values(recovered);

  // getting html p tag from the dom
  const countryPara = document.querySelector('.country-name');

  countryPara.innerText = '';
  countryPara.insertAdjacentHTML('afterbegin', `${countryName} information`);

  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: casesTime,
      datasets: [
        {
          label: `Confirmed`,
          data: casesValue,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          // fill: false,
          Display: false,
        },
        {
          label: 'Recovered',
          data: recoveredValue,
          backgroundColor: 'rgb(108, 209, 0, 0.3)',
          borderColor: 'rgb(108, 209, 0)',
          borderWidth: 1,
          // fill: false,
          steppedLine: false,
        },
        {
          label: 'Deaths',
          data: deathsValue,
          backgroundColor: 'rgb(170, 170, 170, 0.8)',
          borderColor: 'rgb(0,0,0,0.6)',
          borderWidth: 1,
          // fill: false,
        },
      ],
    },
  });
}

function renderSearchBar(data) {
  for (let country of data) {
    const { country: countryName, cases } = country;
    searchBarList.insertAdjacentHTML(
      'beforeend',
      `
    <li class="search-bar-list-item">
      <span class="search-bar-list-item-stats">${cases}</span>
        <p>${countryName}</p></li>
    `
    );
  }
}

function renderGlobalChart(data) {
  const { cases, deaths, recovered } = data;
  const casesValue = Object.values(cases);
  const deathsValue = Object.values(deaths);
  const recoveredValue = Object.values(recovered);
  const time = Object.keys(cases);

  let ctx = document.getElementById('myGlobalChart').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: time,
      datasets: [
        {
          label: 'Confiremd',
          data: casesValue,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Recovered',
          data: recoveredValue,
          backgroundColor: 'rgb(108, 209, 0, 0.2)',
          borderColor: 'rgb(108, 209, 0)',
          borderWidth: 1,
        },
        {
          label: 'Death',
          data: deathsValue,
          backgroundColor: 'rgb(170, 170, 170, 0.8)',
          borderColor: 'rgb(0,0,0,0.6)',
          borderWidth: 1,
        },
      ],
    },
  });
}
// ------------ function calls ---------------------
overViewPage();
