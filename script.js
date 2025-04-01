function fetchCountry() {
    let query = document.getElementById('countryInput').value;
    if (!query) return;
    
    fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let country = data[0];
                displayCountryInfo(country);
                if (country.borders) {
                    fetchNeighbors(country.borders);
                }
            }
        })
        .catch(error => console.error('Error fetching country:', error));
}

function fetchNeighbors(borders) {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`)
        .then(response => response.json())
        .then(neighborData => {
            displayNeighbors(neighborData);
        })
        .catch(error => console.error('Error fetching neighbors:', error));
}

function displayCountryInfo(country) {
    document.getElementById('result').innerHTML = `
        <div class="card">
            <h2>${country.name.common}</h2>
            <img src="${country.flags.svg}" class="flag" alt="Flag">
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <div id="neighbors" class='neighbors'></div>
        </div>
    `;
}

function displayNeighbors(neighborData) {
    let neighborsDiv = document.getElementById("neighbors");
    let neighborsHTML = '<h3>Neighbouring Countries:</h3>';
    neighborData.forEach(n => {
        neighborsHTML += `<span class='neighbor' onclick='fetchNeighbor("${n.name.common}")'>${n.name.common}</span> `;
    });
    neighborsDiv.innerHTML = neighborsHTML;
}

function fetchNeighbor(name) {
    document.getElementById('countryInput').value = name;
    fetchCountry();
}