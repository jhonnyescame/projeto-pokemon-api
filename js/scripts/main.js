// scripts do slide principal
var slide_hero = new Swiper(".slide-hero", {
  effect: 'fade',
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
});

const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');
const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');
const countPokemons = document.getElementById('js-count-pokemons');

cardPokemon.forEach(card => {
  card.addEventListener('click', openDetailsPokemon);
})

if(btnCloseModal) {
  btnCloseModal.addEventListener('click', closeDetailsPokemon);
}

const btnDropdownSelect = document.querySelector('.js-open-select-custom');

btnDropdownSelect.addEventListener('click', () => {
  btnDropdownSelect.parentElement.classList.toggle('active');
})

const areaPokemons = document.getElementById('js-list-pokemons');





function primeiraLetraMaiuscula(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//CRIAÇÃO DO CARD
function createCardPokemon(code, type, nome, imagePok){
  // console.log(nome);
  let card = document.createElement('button');
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute('code-pokemon', code);
  areaPokemons.appendChild(card);

  let image = document.createElement('div');
  image.classList = 'image';
  card.appendChild(image);

  let imageSrc = document.createElement('img');
  imageSrc.className = 'thumb-img';
  imageSrc.setAttribute('src',imagePok );//puxando imagem pokemon
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info';
  card.appendChild(infoCardPokemon);

  let infoTextPokemon = document.createElement('div');
  infoTextPokemon.classList = 'text';
  infoCardPokemon.appendChild(infoTextPokemon);

  let codePokemon = document.createElement('span');
  codePokemon.textContent = ( code < 10 ) ? `#00${code}` : ( code < 100 ) ? `#0${code}` : `#${code}` ; //puxando codigo pokemon
  infoTextPokemon.appendChild(codePokemon);

  let namePokemon = document.createElement('h3');
  namePokemon.textContent = primeiraLetraMaiuscula(nome);
  infoTextPokemon.appendChild(namePokemon);

  let areaIcon = document.createElement('div');
  areaIcon.classList = 'icon';
  infoCardPokemon.appendChild(areaIcon);

  let imgType = document.createElement('img');
  imgType.setAttribute('src',`img/icon-types/${type}.svg` );//puxando imagem typo pokemon
  areaIcon.appendChild(imgType);
}


//LISTAGEM POKEMON
function listingPokemons(urlApi){
  axios({
    method: 'GET',
    url: urlApi
  })
  .then((response) => {
    // console.log(response);
    // response.data.results;
    // console.log(response.data.results);

    const { results, next, count } = response.data;

    const countPokemons = document.getElementById('js-count-pokemons'); // quantidade total dos pokemon
    countPokemons.innerHTML = count;// quantidade total dos pokemon
    
    results.forEach(pokemon => {
      let urlApiDetails = pokemon.url;

      // console.log(urlApiDetails);
      axios({
        method: 'GET',
        url: `${urlApiDetails}`
      })
      .then(response => {

        // console.log(response.data);
        const { name, id, sprites, types } = response.data;

        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name
        }
        // console.log(infoCard.nome);
        createCardPokemon(infoCard.code,infoCard.type,infoCard.nome,infoCard.image);

        const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

        cardPokemon.forEach( card => {
          card.addEventListener('click',openDetailsPokemon);
        })

      })
    })
  })
}

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');


function openDetailsPokemon() {
  document.documentElement.classList.add('open-modal');

  let codePokemon = this.getAttribute('code-pokemon');
  let imagePokemon = this.querySelector('.thumb-img');
  let iconTypePokemon = this.querySelector('.info .icon img');
  let nomePokemon = this.querySelector('.info h3').textContent;
  let codeStringPokemon = this.querySelector('.info span').textContent;

  
  const imagePokemonModal = document.getElementById('js-image-pokemon-modal');
  imagePokemonModal.setAttribute('src', imagePokemon.getAttribute('src') );
  
  const modalDetails = document.getElementById('js-modal-details');
  modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
  
  const iconTypePokemonModal = document.getElementById('js-image-type-modal');
  iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));


  const heightPokemonModal = document.getElementById('js-height-pokemon');
  const weightPokemonModal = document.getElementById('js-weight-pokemon');
  const mainAbilitiesPokemonModal = document.getElementById('js-main-abilities');

  const nomePokemonModal = document.getElementById('js-name-pokemon-modal');
  nomePokemonModal.textContent = nomePokemon;

  const codePokemonModal = document.getElementById('js-code-pokemon-modal');
  codePokemonModal.textContent = codeStringPokemon;


  // console.log(codePokemon);
  // js-main-abilities
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`
  })
  .then(response => {
    // console.log(response.data.name);
    const areaTypesModal = document.getElementById('js-types-pokemon');
    areaTypesModal.innerHTML = "";

    let data = response.data;

    // console.log(data);

    let infoPokemon = {
      mainAbilities: primeiraLetraMaiuscula(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url
    }
    // console.log(infoPokemon);

    function listingTypesPokemons(){
      let arrayTypes = infoPokemon.types;
      
      arrayTypes.forEach(itemtype =>{
        let itemList = document.createElement('li');

        areaTypesModal.appendChild(itemList);

        // itemList.textContent = itemtype.type.name;
        // console.log(itemtype.type.name);

        let spanList = document.createElement('span');
        spanList.classList = `tag-type ${itemtype.type.name}`;
        spanList.textContent = primeiraLetraMaiuscula(itemtype.type.name);
        
        itemList.appendChild(spanList);
        
      })
    }

    function listingWeaknesses(){ 
      const areaWeak = document.getElementById('js-area-weak');

      areaWeak.innerHTML = "";

      axios ({
        method: 'GET',
        url: `${infoPokemon.urlType}`
      })
      .then(response => {
        let weaknesses = response.data.damage_relations.double_damage_from;

        // console.log(weaknesses);
        weaknesses.forEach(itemtype =>{
          let itemListWek = document.createElement('li');
          areaWeak.appendChild(itemListWek);
  
          let spanList = document.createElement('span');
          spanList.classList = `tag-type ${itemtype.name}`;
          spanList.textContent = primeiraLetraMaiuscula(itemtype.name);
          
          itemListWek.appendChild(spanList);
        })
      })
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    mainAbilitiesPokemonModal.textContent = infoPokemon.mainAbilities;


    const statsHp = document.getElementById('js-stats-hp');
    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
    
    const statsAttack = document.getElementById('js-stats-attack');
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;

    const statsDefense = document.getElementById('js-stats-defense');
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;

    const statsSpAttack = document.getElementById('js-stats-sp-attack');
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;

    const statsSpDefense = document.getElementById('js-stats-sp-defense');
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
    
    const statsSpeed = document.getElementById('js-stats-speed');
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

    listingTypesPokemons();
    listingWeaknesses();
  })
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove('open-modal');
}

// Aquiéo script para listar todos os tipos de pokemon

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');

axios({
  method:'GET',
  url:'https://pokeapi.co/api/v2/type'
})

.then(response => {
  const { results} = response.data;
  
  // console.log(results);

  results.forEach((type, index) => {
  //   if(index == 18){
  //     console.log(`Criar o index ${index}`);
  //   } else {
  //     console.log(`Não criar o index ${index}`);
  //  }
  if(index < 18){
    let itemType = document.createElement('li') ;
    areaTypes.appendChild(itemType);   

    let buttonType = document.createElement('button');
    buttonType.classList = `type-filter ${type.name}`;
    buttonType.setAttribute('code-type', index + 1);
    itemType.appendChild(buttonType);

    let iconType = document.createElement('div');
    iconType.classList = 'icon';
    buttonType.appendChild(iconType);

    let srcType = document.createElement('img');
    srcType.setAttribute('src',`img/icon-types/${type.name}.svg` );//puxando imagem typo pokemon
    iconType.appendChild(srcType);

    let nameType = document.createElement('span');
    nameType.textContent = primeiraLetraMaiuscula(type.name);
    buttonType.appendChild(nameType);

    //AQUI É O SELECT MOBILE DOS TIPOS
    let itemTypeMobile = document.createElement('li') ;
    areaTypesMobile.appendChild(itemTypeMobile);   

    let buttonTypeMobile = document.createElement('button');
    buttonTypeMobile.classList = `type-filter ${type.name}`;
    buttonTypeMobile.setAttribute('code-type', index + 1);
    itemTypeMobile.appendChild(buttonTypeMobile);

    let iconTypeMobile = document.createElement('div');
    iconTypeMobile.classList = 'icon';
    buttonTypeMobile.appendChild(iconTypeMobile);

    let srcTypeMobile = document.createElement('img');
    srcTypeMobile.setAttribute('src',`img/icon-types/${type.name}.svg` );//puxando imagem typo pokemon
    iconTypeMobile.appendChild(srcTypeMobile);

    let nameTypeMobile = document.createElement('span');
    nameTypeMobile.textContent = primeiraLetraMaiuscula(type.name);
    buttonTypeMobile.appendChild(nameTypeMobile);    

    const allTypes = document.querySelectorAll('.type-filter');

    allTypes.forEach(btn => {
      btn.addEventListener('click', filterByTypes);
    })
  }

  })              
})

// aquiéoscript que fazafuncionalidade do load more

const btnLoadMore = document.getElementById('js-btn-load-more');
const notPokemon = document.getElementById('not-pokemons');
notPokemon.style.display = "none";

let countPagination = 10;

function showMorePokemon(){
  listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`)

  countPagination = countPagination + 9;
}

btnLoadMore.addEventListener('click', showMorePokemon);


//Funcao para filtrar os pokemons por tipo

function filterByTypes(){
  let idPokemon = this.getAttribute('code-type');
  // console.log(this.getAttribute('code-type'));

  const areaPokemons = document.getElementById('js-list-pokemons');
  const btnLoadMore = document.getElementById('js-btn-load-more');
  const countPokemonsType = document.getElementById('js-count-pokemons');

  areaPokemons.innerHTML = "";
  btnLoadMore.style.display = "none";

  const sectionPokemons = document.querySelector('.s-all-info-pokemons');
  const topSection = sectionPokemons.offsetTop;
  // console.log(topSection);
  window.scrollTo({
    top: topSection + 288,
    behavior: 'smooth'
  })

  //Adicionar class avtive no filtro
  const allTypes = document.querySelectorAll('.type-filter');

  allTypes.forEach(type =>{
    type.classList.remove('active');
  })

  this.classList.add('active');

  if(idPokemon){
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${idPokemon}`
    })
    .then((response) => {
      // console.log(response.data.pokemon);
      // console.log(response.data.pokemon.length);
  
      const { pokemon } = response.data;
  
      countPokemonsType.textContent = pokemon.length;
  
      pokemon.forEach(pok => {
        const { url } = pok.pokemon;
  
        axios({
          method: 'GET',
          url: `${url}`
        })
        .then(response =>{
          // console.log(response.data);
          // console.log(response.data);
          const { name, id, sprites, types } = response.data;
  
          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name
          }
          // console.log(infoCard.nome);
  
          if(infoCard.image){
            createCardPokemon(infoCard.code,infoCard.type,infoCard.nome,infoCard.image);
          }
         
  
          const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
  
          cardPokemon.forEach( card => {
            card.addEventListener('click',openDetailsPokemon);
          })
  
          
        })
  
      })
    }) 
  } else{
    areaPokemons.innerHTML = "";

    listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

    btnLoadMore.style.display = "block";  
  }
}


//FUNÇÂO PARA BUSCAR POKEMON js-input-search
const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');

btnSearch.addEventListener('click',searchPokemon);

inputSearch.addEventListener('keyup', (event) => {
  if(event.code == 'Enter') {
    // console.log('buscar funcao');
    searchPokemon();
  }
})

function searchPokemon(){
  // console.log('clicou');
  let valueInput = inputSearch.value.toLowerCase();
  // console.log(valueInput.toLowerCase());
  const typeFilter = document.querySelectorAll('.type-filter');

  typeFilter.forEach( type => {
    type.classList.remove('active');
  })
  var e = btnSearch.parentElement.firstElementChild.value.toLowerCase();
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
  })
  .then(response =>{

    const countPokemons = document.getElementById('js-count-pokemons');
    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";
    countPokemons.textContent = 1;

    const { name, id, sprites, types } = response.data;
  
    const infoCard = {
      nome: name,
      code: id,
      image: sprites.other.dream_world.front_default,
      type: types[0].type.name
    }
    // console.log(infoCard.nome);

    if(infoCard.image){
      createCardPokemon(infoCard.code,infoCard.type,infoCard.nome,infoCard.image);
    }
   
    const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

    cardPokemon.forEach( card => {
      card.addEventListener('click',openDetailsPokemon);
    })

  })
  .catch((error) =>{
    if(error.response){
      areaPokemons.innerHTML = "";
      btnLoadMore.style.display = "none";
      notPokemon.style.display = "block";
      countPokemons.textContent = 0;
      // alert(' não ten');
    }
  })
}
inputSearch.addEventListener("keyup", function(e) {
  0 < inputSearch.value.length ? btnSearch.disabled = !1 : btnSearch.disabled = !0,
  "Enter" === e.code && searchPokemon()
});