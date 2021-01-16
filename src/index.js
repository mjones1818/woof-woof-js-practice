const dogBar = document.getElementById('dog-bar')
const dogInfo = document.getElementById('dog-info')
const goodDogFilter = document.getElementById('good-dog-filter')
//const dogSelector = document.getElementById('good-dog-selector')

function fetchDogs(status) {
  dogBar.innerHTML = ""
  let dogStatus = status ? `?q=true` : ``
  fetch(`http://localhost:3000/pups${dogStatus}`)
  .then(function(resp){
    return resp.json()
  })
  .then(function(dogs){
    dogs.forEach(function(dog){
      dogBar.innerHTML += `
      <span>${dog.name}</span>
    `
    })
  })
}

fetchDogs(false)

dogBar.addEventListener('click', handleDogClick)
dogInfo.addEventListener('click', handleGoodDog)
goodDogFilter.addEventListener('click', handleFilter)

function handleDogClick(e) {
  
  if (e.target.innerText.length >1) {
    fetchDog(e.target.innerText)
  }
}

function fetchDog(dog) {
  fetch(`http://localhost:3000/pups?name=${dog}`)
  .then(function(resp){
    return resp.json()
  })
  .then(function(json){
    displayDog(json)
  })
}

function displayDog(returnedDog) {
  
  let selectedDog = Array.isArray(returnedDog) ? returnedDog[0] : returnedDog
  dogInfo.innerHTML = ""
  let goodDogHtml = ""
  if (selectedDog.isGoodDog) {
    goodDogHtml = `<button id="bad-dog-selector" data-id=${selectedDog.id}>Bad Dog!</button>`
  } else {
    goodDogHtml = `<button id="good-dog-selector" data-id=${selectedDog.id}>Good Dog!</button>`
  }
  dogInfo.innerHTML += `
    <img src=${selectedDog.image}></img>
    <h2>${selectedDog.name}</h2>
    
    ${goodDogHtml}
  `
}



function handleGoodDog(e){
  if (e.target.id == 'good-dog-selector') {
    
    changeDogStatus(e.target.dataset.id, true)
  } else if (e.target.id == 'bad-dog-selector') {
    
    changeDogStatus(e.target.dataset.id, false)
  }
}

function changeDogStatus (dog, status) {
  fetch(`http://localhost:3000/pups/${dog}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(
      {
        isGoodDog: status
      }
    )
  })
  .then(function(resp){
    return resp.json()
  })
  .then(function(json){
    displayDog(json)
  })
} 


function handleFilter(e) {
  
  if (e.target.innerText == "Filter good dogs: OFF") {
    e.target.innerText = `Filter good dogs: ON`
    fetchDogs(true)
  } else {
    e.target.innerText = "Filter good dogs: OFF"
    fetchDogs(false)
  }
}