<?php
/*
  Name: Colton Hagan
  Date: 5/24/19
  Section : CSE 154 AN

  This file provides back-end support for the bestreads API.
  Based on the input parameters supplied using GET requests,
  the API outputs information about books.

  Web Service details:
  =====================================================================
  Required GET parameters:
  - mode
    - Needs a mode (books, info, description, reviews)
      - if mode is info, description, or reviews then a title parameter is needed
  Optional GET parameters:
  - if mode is books then there is also a optional search parameter
  Output formats:
  - Plain text and JSON
  Output Details:
  - If mode is description it outputs a plan text,
    it will output the given books description
  - If mode is books without search parameters it will output a Json object,
    that has a list of all books title and folder, if search parameter is based it
    will just print out a list of all books title and folder who's title contatins
    the search term
  - If mode is info it will output a Json object,
    that will contain the given books title and author
  - If mode is reviews it will output a Json object,
      that will contain the given books reviewer name, rating, and review text
  - If mode is not passed as a parameter or is not valid (description, info, reviews, or books),
    if title is not included in mode (info, reviews, or books)), or if description is valid and
    no book for that title was found outputs plain text 400 error.
*/

// Blank array used to elimenate redundency in many functions
$output = array();
$folder_title = title_and_folder($output);

if (isset($_GET["mode"])) {
  if ($_GET["mode"] === "books") {
    if (isset($_GET["search"])) {
      search($folder_title, $output);
    } else {
      print_json($folder_title);
    }
  } else if (isset($_GET["title"])) {
    $folder = $_GET["title"];
    if ($_GET["mode"] === "description") {
      $description = file_get_contents("books/$folder/description.txt");
      empty_checker(strlen($description));
      print_text($description);
    } else if ($_GET["mode"] === "info") {
      print_json(get_info($folder));
    } else if ($_GET["mode"] === "reviews") {
      read_reviews($folder, $output);
    } else {
      print_error("Please provide a mode of description, info, reviews, or books.");
    }
  } else if (!($_GET["mode"] === "description" || $_GET["mode"] === "books"
             || $_GET["mode"] === "info" || $_GET["mode"] === "reviews")) {
    print_error("Please provide a mode of description, info, reviews, or books.");
  } else {
    print_error("Please remember to add the title parameter when using mode={$_GET["mode"]}.");
  }
} else {
  print_error("Please provide a mode of description, info, reviews, or books.");
}

/**
 * Returns json object with title and author of the book in the given folder
 * @param {String} folder - folder of the book you want info on
 * @return {Json} Returns a Json object with title and author of the book in the given folder
 */
function get_info($folder) {
  $info = file("books/$folder/info.txt");
  empty_checker(count($info));
  $information["title"] = trim($info[0]);
  $information["author"] = trim($info[1]);
  return $information;
}

/**
 * Creates json object with reviewer name, rating, and review text of the book in the given folder
 * @param {String} folder - folder of the book you want reviews on
 * @param {Array} output - blank array to create output on
 */
function read_reviews($folder, $output) {
  $review_files = glob("books/$folder/review*.txt");
  empty_checker(count($review_files));
  foreach ($review_files as $i) {
    $review = file($i);
    $single_review["name"] = trim($review[0]);
    $single_review["rating"] = trim($review[1]);
    $single_review["text"] = trim($review[2]);
    array_push($output, $single_review);
  }
  print_json($output);
}

/**
 * Creates a error if passed object length is 0
 * @param {Integer} length - Length of given string/Json object
 */
function empty_checker($length) {
  if ($length === 0) {
    print_error("No {$_GET["mode"]} for {$_GET["title"]} was found.");
  }
}

/**
 * Creates json object with a books folder and title that match provided search term
 * @param {Json} folder_title - each books folder and title
 * @param {Array} output - blank array to create output on
 */
function search($folder_title, $output) {
  foreach($folder_title["books"] as $i) {
    if (strpos($i["title"], $_GET["search"])) {
      array_push($output, $i);
    }
  }
  print_json(array("books" => $output));
}

/**
 * Prints out given Json object if it contains information, or creates error
 * @param {Json} Json - Json object to print
 */
function print_json($Json) {
  header("Content-type: application/json");
  print(json_encode($Json));
}

/**
 * Prints out given text object if it contains information, or creates error
 * @param {String} txt - Text object to print
 */
function print_text($txt) {
  header("Content-type: text/plain.");
  echo($txt);
}

/**
 * Prints out error with given text
 * @param {String} txt - Text object to print
 */
function print_error($txt) {
  header("Content-type: text/plain.");
  header("HTTP/1.1 400 Invalid Request");
  die($txt);
}

/**
 * Creates json object with a books folder and title for each book
 * @param {Array} output - blank array to create output on
 */
function title_and_folder($output) {
  $path = glob("books/*");
  foreach ($path as $i) {
    $single_book["folder"] = explode("/", $i)[1];
    $single_book["title"] = get_info($single_book["folder"])["title"];
    array_push($output, $single_book);
  }
  return array("books" => $output);
}
?>
