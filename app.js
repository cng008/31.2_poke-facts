let baseURL = 'https://pokeapi.co/api/v2/pokemon';
let numOfPokemon;
// 1. Figure out how to make a single request to the Pokemon API to get names and URLs for every pokemon in the database.
// $.getJSON(`${baseURL}/?limit=1126`).then(data => {
//   console.log(data.results);
// });

// axios.get(`${baseURL}/?limit=1126`).then(res => {
//   console.log(res.data.results);
// });

// 2. Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs. Once those requests are complete, console.log the data for each pokemon.

// axios
//   .get(`${baseURL}/?limit=1126`)
//   .then(res => {
//     let randomPokemonUrls = [];
//     for (let i = 0; i < 3; i++) {
//       numOfPokemon = res.data.results.length;
//       let randomIdx = Math.floor(Math.random() * numOfPokemon);
//       let url = res.data.results[randomIdx]['url'];
//       randomPokemonUrls.push(url);
//     }
//     return Promise.all(randomPokemonUrls.map(url => axios.get(url)));
//   })
//   .then(pokemon => {
//     pokemon.forEach(p => console.log(p.data));
//   });

// 3. Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s species URL (you should see a key of species in the data). Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English. If you find one, console.log the name of the pokemon along with the description you found.
// Example: “ducklett: They are better at swimming than flying, and they happily eat their favorite food, peat moss, as they dive underwater.”
// let names;

// axios
//   .get(`${baseURL}/?limit=1126`)
//   .then(res => {
//     let randomPokemonUrls = [];
//     for (let i = 0; i < 3; i++) {
//       numOfPokemon = res.data.results.length;
//       let randomIdx = Math.floor(Math.random() * numOfPokemon);
//       let url = res.data.results[randomIdx]['url'];
//       randomPokemonUrls.push(url);
//     }
//     return Promise.all(randomPokemonUrls.map(url => axios.get(url)));
//   })
//   .then(pokemon => {
//     names = pokemon.map(p => p.data.name);
//     return Promise.all(pokemon.map(p => axios.get(p.data.species.url)));
//   })
//   .then(pokemon => {
//     let descriptions = pokemon.map(p => {
//       let descriptionObj = p.data.flavor_text_entries.find(
//         entry => entry.language.name === 'en'
//       );
//       return descriptionObj
//         ? descriptionObj.flavor_text
//         : 'No description available.';
//     });
//     descriptions.forEach((desc, i) => {
//       console.log(`${names[i]}: ${desc}`);
//     });
//   });

// 4. BONUS Instead of relying on console.log, let’s create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3.
let $btn = $('#generate-poke');
let $pokeDiv = $('#poke-container');

$btn.on('click', () => {
  $pokeDiv.empty();
  let namesAndImages = [];

  axios
    .get(`${baseURL}/?limit=1126`)
    .then(res => {
      let randomPokemonUrls = [];
      for (let i = 0; i < 3; i++) {
        numOfPokemon = res.data.results.length;
        let randomIdx = Math.floor(Math.random() * numOfPokemon);
        let url = res.data.results[randomIdx]['url'];
        randomPokemonUrls.push(url);
      }
      return Promise.all(randomPokemonUrls.map(url => axios.get(url)));
    })
    .then(pokemonData => {
      namesAndImages = pokemonData.map(p => ({
        name: p.data.name,
        imgSrc: p.data.sprites.front_default
      }));
      return Promise.all(pokemonData.map(p => axios.get(p.data.species.url)));
    })
    .then(speciesData => {
      speciesData.forEach((p, i) => {
        let descriptionObj = p.data.flavor_text_entries.find(function (entry) {
          return entry.language.name === 'en';
        });
        let description = descriptionObj ? descriptionObj.flavor_text : '';
        let { name, imgSrc } = namesAndImages[i];
        $pokeDiv.append(makePokeCard(name, imgSrc, description));
      });
    });
});

function makePokeCard(name, img, blurb) {
  return `
    <div class="card border-secondary mb-3 mx-4 col-3" style="max-width: 20rem;">
    <div class="card-body">
        <h4 class="card-title">${name}</h4>
        <img class="card-img-top mx-auto" src="${img}" alt="${name} image" style="max-width:10rem;">
            <p class="card-text">${blurb}</p>
        </div>
    </div>
    `;
}
