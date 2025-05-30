let allMatches = [];

fetch('https://www.scorebat.com/video-api/v3/')
  .then(response => response.json())
  .then(data => {
    allMatches = data.response;
    renderMatches(allMatches);
    populateLeagueFilter(allMatches);
  })
  .catch(err => {
    console.error("Failed to load match data:", err);
    document.getElementById('match-list').innerHTML = '<li>Could not load upcoming matches.</li>';
  });

function renderMatches(matches) {
  const list = document.getElementById('match-list');
  list.innerHTML = '';

  matches.forEach(match => {
    const title = match.title;
    const date = new Date(match.date);
    const formattedDate = date.toLocaleString();
    const league = match.competition;
    const thumbnail = match.thumbnail;
    const videoLink = match.url; // Link to highlights

    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <img src="${thumbnail}" alt="Logo" class="team-logo">
      <div>
        <strong>${title}</strong><br>
        <small>${formattedDate} — ${league}</small><br>
        <a href="${videoLink}" target="_blank">Watch Highlights</a>
      </div>
    `;
    list.appendChild(listItem);
  });
}

function populateLeagueFilter(matches) {
  const leagues = [...new Set(matches.map(m => m.competition))];
  const leagueDropdown = document.getElementById('league-filter');

  leagues.forEach(league => {
    const option = document.createElement('option');
    option.value = league;
    option.textContent = league;
    leagueDropdown.appendChild(option);
  });
}

function applyFilters() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const league = document.getElementById('league-filter').value;
  const sort = document.getElementById('sort-filter').value;

  let filtered = allMatches;

  // Filter by search text
  if (search) {
    filtered = filtered.filter(match =>
      match.title.toLowerCase().includes(search)
    );
  }

  // Filter by league
  if (league !== 'all') {
    filtered = filtered.filter(match => match.competition === league);
  }

  // Sort by date
  filtered.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sort === 'latest' ? dateB - dateA : dateA - dateB;
  });

  renderMatches(filtered);
}

// Events
document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('league-filter').addEventListener('change', applyFilters);
document.getElementById('sort-filter').addEventListener('change', applyFilters);
