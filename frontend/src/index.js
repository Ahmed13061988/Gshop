const BASE_URL = "http://localhost:3000"
const GAMES_URL = `${BASE_URL}/games`
const USERS_URL = `${BASE_URL}/users`
const FAVORITES_URL = `${BASE_URL}/favorites`
const gameCollection = document.querySelector('#game-collection')
const favCollection = document.querySelector('#fav-collection')
const likeButton = document.querySelector('.like-btn')
const signupForm = document.querySelector('#signup-form')
const signupInputs = document.querySelectorAll(".signup-input")
const header = document.querySelector('.header-banner')
const logout = document.querySelector('.logout')
let currentUser

class Game {
    constructor(gameAttributes) {
        this.title = gameAttributes.title;
        this.price = gameAttributes.price;
        this.category = gameAttributes.category;
        this.description = gameAttributes.description;
        this.link = gameAttributes.link;
        this.image = gameAttributes.image;
        this.id = gameAttributes.id;
    }

    render() {
        return `<div class="card">
                  <h2>${this.title} ($${this.price})</h2>
                  <h4 class="game-cat">${this.category}</h4>
                  <a href=${this.link} target="_blank"><img src=${this.image} class="game-image" /></a>
                  <p>${this.description}<p>
                  <button data-game-id=${this.id} class="like-btn">♡</button>
                </div>`
    }
}

function putGamesOnDom(gameArray){
    gameCollection.innerHTML = `<h2 class="subheader">All Game Ideas</h2>
                                <h4 class="favorites-link">View My Favorites ♡</h4>`
    gameArray.forEach(game => {
        gameCollection.innerHTML += new Game(game).render()
    })
}

function putFavoritesOnDom(favArray){
    favCollection.innerHTML = `<h2 class="subheader">My Favorites</h2>
                               <h4 class="back-link">←Back to Gifts</h4>`
    favArray.forEach(favorite => {
        favCollection.innerHTML += `<div class="card">
          <h2>${favorite.gift.title} ($${favorite.gift.price})</h2>
          <h4 class="gift-cat">${favorite.gift.category}</h4>
          <a href=${favorite.gift.link} target="_blank"><img src=${favorite.gift.image} class="gift-image" /></a>
          <p>${favorite.gift.description}<p>
          <button data-gift-id=${favorite.gift.id} class="like-btn" style="color:red;">♡</button>
        </div>`
    })
}

function fetchGifts(){
    fetch(GIFTS_URL)
    .then(res => res.json())
    .then(gifts => putGiftsOnDom(gifts))
}

function fetchFavorites(){
    fetch(BASE_URL + '/users/' + currentUser.id + '/favorites')
    .then(res => res.json())
    .then(favorites => putFavoritesOnDom(favorites))
}

signupForm.addEventListener('submit', function(e){
    e.preventDefault()
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            user: {
                email: signupInputs[0].value,
                password: signupInputs[1].value
            }
        })
    })
    .then(res => res.json())
    .then(function(object){
        if (object.message) {
            alert(object.message)
        }
        else {
        loggedInUser(object)
        }
    }
    )
})

giftCollection.addEventListener('click', function(e) {
    if (event.target.className == "favorites-link") {
        giftCollection.style.display = 'none';
        fetchFavorites();
        favCollection.style.display = 'initial';
    }
})

favCollection.addEventListener('click', function(e) {
    if (event.target.className == "back-link") {
        favCollection.style.display = 'none';
        giftCollection.style.display = 'initial';
    }
})

function loggedInUser(object){
    currentUser = object
    signupForm.style.display = 'none'
    welcome.innerHTML = `<h3>Hello, <i>${currentUser.email}</i> !</h3>`
    logout.innerText = "Logout"
    fetchGifts()
}

giftCollection.addEventListener('click', function(e){
    // console.log(event.target.className, event.target.style.color)
    // e.preventDefault() was preventing images from being clickable
    if ((event.target.className == "like-btn") && (event.target.style.color !== 'red')) {
        let target = event.target
            fetch(FAVORITES_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                        user_id: `${currentUser.id}`,
                        gift_id: `${event.target.dataset.giftId}`
                })
        })
        .then( res => res.json())
        .then( res => target.dataset.favId = res.id);
        event.target.style.color = 'red';}
    else if ((event.target.className == "like-btn") && (event.target.style.color == 'red')) {
        event.target.style.color = 'black';
        fetch(FAVORITES_URL + '/' + event.target.dataset.favId, {
            method: "DELETE"
        })
    }
})