let baseURL = 'https://pokeapi.co/api/v2/pokemon';
let numOfPokemon;

// 1. Figure out how to make a single request to the Pokemon API to get names and URLs for every pokemon in the database.
async function getAllPokemon() {
  let pokeData = await axios.get(`${baseURL}/?limit=1126`);
  console.log(pokeData.data.results);
}

// 2. Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs. Once those requests are complete, console.log the data for each pokemon.

async function somePokeData() {
  let pokeData = await axios.get(`${baseURL}/?limit=1126`);
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    numOfPokemon = pokeData.data.results.length;
    let randomIdx = Math.floor(Math.random() * numOfPokemon);
    let url = pokeData.data.results[randomIdx]['url'];
    randomPokemonUrls.push(url);
  }
  let pokemon = await Promise.all(randomPokemonUrls.map(url => axios.get(url)));
  pokemon.forEach(p => console.log(p.data));
}

// 3. Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s species URL (you should see a key of species in the data). Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English. If you find one, console.log the name of the pokemon along with the description you found.
// Example: “ducklett: They are better at swimming than flying, and they happily eat their favorite food, peat moss, as they dive underwater.”

async function catchSomeOfEm() {
  let allData = await axios.get(`${baseURL}/?limit=1126`);
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    numOfPokemon = allData.data.results.length;
    let randomIdx = Math.floor(Math.random() * numOfPokemon);
    let url = allData.data.results[randomIdx]['url'];
    randomPokemonUrls.push(url);
  }
  let pokemonData = await Promise.all(
    randomPokemonUrls.map(url => axios.get(url))
  );
  let speciesData = await Promise.all(
    pokemonData.map(p => axios.get(p.data.species.url))
  );
  let descriptions = speciesData.map(p => {
    let descriptionObj = p.data.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return descriptionObj
      ? descriptionObj.flavor_text
      : 'No description available.';
  });
  descriptions.forEach((desc, i) => {
    console.log(`${pokemonData[i].data.name}: ${desc}`);
  });
}

// 4. BONUS Instead of relying on console.log, let’s create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3.
let $btn = $('#generate-poke');
let $pokeDiv = $('#poke-container');

$btn.on('click', async function catchSomeOfEm() {
  $pokeDiv.empty();
  let allData = await axios.get(`${baseURL}/?limit=1126`);
  let randomPokemonUrls = [];
  for (let i = 0; i < 3; i++) {
    numOfPokemon = allData.data.results.length;
    let randomIdx = Math.floor(Math.random() * numOfPokemon);
    let url = allData.data.results[randomIdx]['url'];
    randomPokemonUrls.push(url);
  }
  let pokemonData = await Promise.all(
    randomPokemonUrls.map(url => axios.get(url))
  );
  let speciesData = await Promise.all(
    pokemonData.map(p => axios.get(p.data.species.url))
  );
  speciesData.forEach((p, i) => {
    let descriptionObj = p.data.flavor_text_entries.find(function (entry) {
      return entry.language.name === 'en';
    });
    let description = descriptionObj
      ? descriptionObj.flavor_text
      : 'No description available.';
    let name = pokemonData[i].data.name;
    let imgSrc = pokemonData[i].data.sprites.front_default;
    $pokeDiv.append(makePokeCard(name, imgSrc, description));
  });
});

function makePokeCard(name, imgSrc, description) {
  return `
    <div class="card border-primary mb-3 mx-4 col-3" style="max-width: 20rem;">
    <div class="card-body">
        <h4 class="card-title">${name}</h4>
        <img class="card-img-top mx-auto" src="${imgSrc}" alt="${name} image" style="max-width:10rem;">
            <p class="card-text">${description}</p>
        </div>
    </div>
    `;
}
