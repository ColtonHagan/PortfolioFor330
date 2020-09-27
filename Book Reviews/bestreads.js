/**
 * Name: Colton Hagan
 * Date: 5/24/19
 * Section: CSE 154 AN
 * This is the JS to implement the UI for my best reads webpage, and
 * manage results when clicks occur.
 */

(function() {
   "use strict";
   const URL = "bestreads.php";
   window.addEventListener("load", main);

   /** Manages the buttons being pressed  */
   function main() {
      loadBooks("");
      id("home").addEventListener("click", function() {
         loadBooks("");
         id("search-term").value = "";
         id("home").disabled = true;
      });
      id("search-btn").addEventListener("click", search);
      id("back").addEventListener("click", returnToList);
   }

   /** Checks to see if the search term is empty */
   function search() {
      let searchTerm = id("search-term").value.trim();
      if (searchTerm !== "") {
         id("home").disabled = false;
         loadBooks("&search=" + searchTerm);
      }
   }

   /**
    * Uses API to fetch books (title and folder) with title containing search term,
    * if search is blank loads all books (title and folder).
    * @param {String} search - Search term, if blank ("") loads all books
    */
   function loadBooks(search) {
      fetch(URL + "?mode=books" + search)
         .then(checkStatus)
         .then(JSON.parse)
         .then(printBooks)
         .catch(error);
   }

   /**
    * Uses API to fetch title and author of a given book
    * @param {String} folder - folder of the book you want to fetch
    */
   function getInfo(folder) {
      fetch(URL + "?mode=info&title=" + folder)
         .then(checkStatus)
         .then(JSON.parse)
         .then(function(info) {
            id("book-title").innerText = info["title"];
            id("book-author").innerText = info["author"];
         })
         .catch(error);
   }

   /** Returns from single book view to book list  */
   function returnToList() {
      id("book-list").classList.remove("hidden");
      id("single-book").classList.add("hidden");
      id("back").classList.add("hidden");
   }

   /**
    * Uses API to fetch reviews of a given book
    * @param {String} folder - folder of the book you want to fetch
    */
   function getReviews(folder) {
      fetch(URL + "?mode=reviews&title=" + folder)
         .then(checkStatus)
         .then(JSON.parse)
         .then(showReviews)
         .catch(error);
   }

   /**
    * Uses API to fetch description of a given book
    * @param {String} folder - folder of the book you want to fetch
    */
   function getDescription(folder) {
      fetch(URL + "?mode=description&title=" + folder)
         .then(checkStatus)
         .then(function(description) {
            id("book-description").innerText = description;
         })
         .catch(error);
   }

   /**
    * Prints out reviewer name, reviews rating, and the reviews text for each given review
    * @param {Json} reviewData - the reviews for each book
    */
   function showReviews(reviewData) {
      let totalRating = 0;
      id("book-reviews").innerHTML = "";
      for (let i = 0; i < reviewData.length; i++) {
         let name = document.createElement("h3");
         name.innerText = reviewData[i]["name"];
         let rating = document.createElement("h4");
         totalRating += parseInt(reviewData[i]["rating"]);
         rating.innerText = "Rating: "
                            + (Math.round(reviewData[i]["rating"] * 10) / 10).toFixed(1);
         let review = document.createElement("p");
         review.innerText = reviewData[i]["text"];
         id("book-reviews").appendChild(name);
         id("book-reviews").appendChild(rating);
         id("book-reviews").appendChild(review);
      }
      totalRating = (Math.round((totalRating / reviewData.length) * 10) / 10).toFixed(1);
      id("book-rating").innerText = totalRating;
   }

   /** Prints iut a error if something went wrong with API*/
   function error() {
      id("error-text").classList.remove("hidden");
      id("error-text").innerText = "Something went wrong with the request. Please try again later.";
   }

   /**
    * Prints out cover and title of each given book
    * @param {Json} bookData - title and folder for each given book
    */
   function printBooks(bookData) {
      returnToList();
      id("book-list").innerHTML = "";
      if (bookData["books"].length === 0) {
         id("error-text").classList.remove("hidden");
         id("error-text").innerText = "No books found that match the search string "
                                      + id("search-term").value + ", please try again.";
      } else {
         id("error-text").classList.add("hidden");
      }
      for (let i = 0; i < bookData["books"].length; i++) {
         let div = document.createElement("div");
         let img = document.createElement("IMG");
         let title = document.createElement("p");
         let src = "books/" + bookData["books"][i]["folder"] + "/cover.jpg";
         img.src = src;
         img.alt = bookData["books"][i]["title"];
         title.innerText = bookData["books"][i]["title"];
         div.appendChild(img);
         div.appendChild(title);
         div.className = "selectable";
         div.addEventListener("click", function() {
            singleBook(bookData["books"][i]["folder"], src);
         });
         id("book-list").appendChild(div);
      }
   }

   /**
    * Switches to single book view and prints cover image
    * @param {String} folder - folder in which picked book contains
    * @param {String} src - src link to cover image
    */
   function singleBook(folder, src) {
      id("back").classList.remove("hidden");
      id("book-cover").src = src;
      id("book-list").classList.add("hidden");
      id("single-book").classList.remove("hidden");
      getDescription(folder);
      getInfo(folder);
      getReviews(folder);
   }

   /**
    * shortcut getting a dom element by id
    * @param {string} idName - the id of the element you want to find
    * @return {element} Returns dom element
    */
   function id(idName) {
      return document.getElementById(idName);
   }

   /**
    *  Function to check the status of an Ajax call, boiler plate code to include,
    *  based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    *  updated from
    *  https://stackoverflow.com/questions/29473426/fetch-reject-promise-with-json-error-object
    *  @param {Object} response the response text from the url call
    *  @return {Object} did we succeed or not, so we know whether or not to continue with
    *                   the handling of this promise
    */
   function checkStatus(response) {
      const OK = 200;
      const ERROR = 300;
      if (response.status >= OK && response.status < ERROR) {
         return response.text();
      } else {
         return response.text().then(Promise.reject.bind(Promise));
      }
   }
})();
