async function fetchCountry() {
    let query = document.getElementById('countryInput').value;
    if (!query) return;
    
    try {
        let res = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
        let data = await res.json();
        if (data.length > 0) {
            let country = data[0];
            let borders = country.borders || [];
            let neighborsHTML = '';
            
            if (borders.length > 0) {
                let neighborRes = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`);
                let neighborData = await neighborRes.json();
                neighborsHTML = '<h3>Neighbouring Countries:</h3>' + neighborData.map(n => `<span class='neighbor' onclick='fetchNeighbor("${n.name.common}")'>${n.name.common}</span>`).join(' ');
            }
            
            document.getElementById('result').innerHTML = `
                <div class="card">
                    <h2>${country.name.common}</h2>
                    <img src="${country.flags.svg}" class="flag" alt="Flag">
                    <p><strong>Capital:</strong> ${country.capital?.[0]}</p>
                    
                    <div class='neighbors'>${neighborsHTML}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
}

function fetchNeighbor(name) {
    document.getElementById('countryInput').value = name;
    fetchCountry();
}