//global variables for DOM elements
const 
  submitForm = document.querySelector("#submit-form"),
  randomBtn = document.querySelector("#random-btn"),
  mealsEl = document.querySelector("#meals1"),
  resultHeadingEl = document.querySelector("#result-heading"),
  single_mealEl = document.querySelector("#single-meal");
  single_mealSmallEl = document.querySelector('#meals2')
containerEl = document.querySelector("#container");

//MealDB API
// https://www.themealdb.com/api.php

//seach for meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = "";
}

//remove error message
function clearErrorMessage() {
    //use vanilla JS to select item 
    let errorMessage = document.querySelector(".error-message");
    //remove from HTML
    errorMessage.remove();
}

//fetch meal by ID
function getMealByID(mealID) {
  //fetch API with meal ID included
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    //JS promise returning response and turning it into JSON
    .then((res) => res.json())
    //JS promise with JSON data
    .then((recipeData) => {
      //setting a variable to contain the returned meal from its place in the array
      const meal = recipeData.meals[0];

      //function to add meal to DOM
      addMealToDOM(meal);
    });
}

//fetch random meal from API
function getRandomMeal() {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeadingEl.innerHTML = "";
  //fetch API used to get random meal
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    //JS promise turning response into JSON
    .then((res) => res.json())
    //JS promise using JSON
    .then((randomData) => {
      // console.log(randomData);
      //variable to put random meal information from array into a variable
      const meal = randomData.meals[0];

      //funciton to add meal to DOM
      addMealToDOM(meal);
    });
}

// modal section
var openmodal = document.querySelectorAll('.modal-open')
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function(event){
    	event.preventDefault()
    	toggleModal()
      })
    }
    
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
    	isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
    	isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
    	toggleModal()
      }
    };
    
    function toggleModal () {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active')
    }

//add recipe to DOM
function addMealToDOM(meal) {
  //empty array to hold ingredients
  const ingredients = [];

  //for loop to go over list of returned ingredients and measurements
  //no more than twenty returned
  for (let i = 1; i <= 20; i++) {
    //logic for if there is an ingredient in the JSON
    if (meal[`strIngredient${i}`]) {
      //add ingreadient and measurement to the end of the ingredients array
      ingredients.push(
        `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
      );
      //logic for what to do if there is no ingredient/measurement
    } else {
      //end the function
      break;
    }
  }

  //adding inner HTML to display the image, and ingredients, and save button
  single_mealEl.innerHTML = `
  <div class="justify-center max-w-sm rounded overflow-hidden shadow-lg">
    <h2 class="font-bold text-xl mb-2">${meal.strMeal}</h2>
    <img class="transform scale-100" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="px-6 py-4 justify-center"> 
         ${meal.strCategory ? `<p class="font-light text-md mb-2">${meal.strCategory}</p>` : ""}
         ${meal.strArea ? `<p class="font-light text-md mb-2">${meal.strArea}</p>` : ""}
   
    <h3 class="font-bold text-xl mb-2">Ingredients</h2>
         <ul class="text-xs">
            ${ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
        </ul>
    <button class="btn my-4 py-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" id="save-button">Save</button>    
    </div>
    </div>
  </div>
  `;

//create variable for save button
var saveBtn = document.querySelector("#save-button");
//create click event listener when save button is clicked
saveBtn.addEventListener("click", saveMeal);

//create function to save meal in meal box
function saveMeal() {
  
  single_mealSmallEl.innerHTML = `
  <div class="flex space-x-4 rounded overflow-hidden shadow-lg">
    <h2 class="font-bold text-xl mb-2">${meal.strMeal}</h2>
    <img class="object-cover h-48 w-full" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="px-3 py-2 justify-center"> 
         ${meal.strCategory ? `<p class="font-light text-md mb-2">${meal.strCategory}</p>` : ""}
         ${meal.strArea ? `<p class="font-light text-md mb-2">${meal.strArea}</p>` : ""}
         <button class="modal-open btn my-4 py-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Expand</button> 
         </div>    
    </div>
  `;
  var modalBtn = document.querySelector('.modal-open')
  modalBtn.addEventListener("click", toggleModal);
  }
}

//add event listeners
//action to complete when the form is submitted
submitForm.addEventListener("submit", searchMeal);
//get random meal
randomBtn.addEventListener("click", getRandomMeal);

//get meal by id for selected meal returned from search
mealsEl.addEventListener("click", (e) => {
  //setting a variable mealinfo to see if the selected item has that class
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      //meal-info dynamically added in search meal function
      return item.classList.contains("meal-info");
      //returning false if there is no class meal-info
    } else {
      return false;
    }
  });

  //if there is the class meal-info then this is logic to use the mealid dynamically added
  //in the search meal function to get meal by ID and display image, directions, and ingredient/measurements
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});
