/**
 * Name: Colton Hagan
 * Date: 5/13/19
 * Section: CSE 154 AN
 * This is the JS to implement the UI for my pokedex webpage, loads api, and
 * manage results when clicks occur.
 */

(function() {
	"use strict";
	const URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
	let baseHp = 0;
	let guid = "";
	let pid = "";
	window.addEventListener("load", main);

	/** Manages button presses */
	function main() {
		loadPokedex();
		id("start-btn").addEventListener("click", toBattle);
		id("endgame").addEventListener("click", backToDex);
		id("flee-btn").addEventListener("click", function() {
			playMove("flee");
		});
		for (let i = 0; i < qsa("#p1 .moves button").length; i++) {
			qsa("#p1 .moves button")[i].addEventListener("click", function() {
				id("loading").classList.remove("hidden");
				playMove(this.innerText.split("\n")[0].replace(" ", "").toLowerCase());
			});
		}
	}

	/** Looks at and loads in API containing all pokemon  */
	function loadPokedex() {
		fetch(URL + "pokedex.php?pokedex=all")
			.then(checkStatus)
			.then(loadData)
			.catch(console.error);
	}

	/**
	 * Looks at and loads in API for one pokemon's parms
	 * @param {string} pokemon - pokemon you are getting data for
	 */
	function loadCard(pokemon) {
		fetch(URL + "pokedex.php?pokemon=" + pokemon)
			.then(checkStatus)
			.then(JSON.parse)
			.then(fillCard)
			.catch(console.error);
	}

	/** Looks at and loads in API containing information about your battle  */
	function startGame() {
		let data = new FormData();
		data.append("startgame", true);
		data.append("mypokemon", qs(".name").innerText);
		fetch(URL + "game.php", { method: "POST", body: data })
			.then(checkStatus)
			.then(JSON.parse)
			.then(function(pkmData) {
				fillCard(pkmData.p2);
				guid = pkmData.guid;
				pid = pkmData.pid;
			})
			.catch(console.error);
	}

	/**
	 * Looks at and loads in API for a move action
	 * @param {string} move - move you are getting data for
	 */
	function playMove(move) {
		let data = new FormData();
		data.append("guid", guid);
		data.append("pid", pid);
		data.append("movename", move);
		fetch(URL + "game.php", { method: "POST", body: data })
			.then(checkStatus)
			.then(JSON.parse)
			.then(function(turnData) {
				id("loading").classList.add("hidden");
				checkResults("p1", turnData);
				checkResults("p2", turnData);
			})
			.catch(console.error);
	}

	/** Resets battle information and returns you to the pokedex part of the game  */
	function backToDex() {
		qs("#p1 .hp").innerText = baseHp + "HP";
		id("start-btn").classList.remove("hidden");
		id("endgame").classList.add("hidden");
		id("results-container").classList.add("hidden");
		qs("h1").innerText = "Your Pokedex";
		qs(".hp-info").classList.add("hidden");
		id("pokedex-view").classList.remove("hidden");
		id("p2").classList.add("hidden");
		qs(".buffs").classList.add("hidden");
		for (let i = 0; i < 2; i++) {
			qsa(".health-bar")[i].style.width = "100%";
			qsa(".buffs")[i].innerHTML = "";
			qsa(".health-bar")[i].classList.remove("low-health");
		}
	}

	/** Brings you to the battle part of the game from the pokedex  */
	function toBattle() {
		startGame();
		id("start-btn").classList.add("hidden");
		id("flee-btn").classList.remove("hidden");
		id("results-container").classList.remove("hidden");
		qs("h1").innerText = "Pokemon Battle Mode!";
		qs(".hp-info").classList.remove("hidden");
		id("pokedex-view").classList.add("hidden");
		id("p2").classList.remove("hidden");
		qs(".buffs").classList.remove("hidden");
		for (let i = 0; i < qsa("#p1 .moves button").length; i++) {
			qsa("#p1 .moves button")[i].disabled = false;
		}
	}

	/**
	 * Creates sprite for each pokemon and then lists the three starters as "found"
	 * @param {string} pkmData - pokemon data from api
	 */
	function loadData(pkmData) {
		let allPkm = pkmData.split("\n");
		for (let i = 0; i < allPkm.length; i++) {
			let pkm = allPkm[i].split(":");
			let img = document.createElement("IMG");
			img.src = URL + "sprites/" + pkm[1] + ".png";
			img.alt = pkm[0];
			img.id = pkm[1];
			img.className = "sprite";
			id("pokedex-view").appendChild(img);
			img.addEventListener("click", function() {
				if (this.classList.contains("found")) {
					loadCard(this.id);
				}
			});
		}
		id("charmander").classList.add("found");
		id("bulbasaur").classList.add("found");
		id("squirtle").classList.add("found");
	}

	/**
	 * Loads in information for selected pokemon into left cards
	 * @param {JSON} pkmInfo - data for a pokemon from api
	 */
	function fillCard(pkmInfo) {
		let player = "#p1 ";
		if (id("pokedex-view").classList.contains("hidden")) {
			player = "#p2 ";
		}
		qs(player + ".name").innerText = pkmInfo.name;
		qs(player + ".info").innerText = pkmInfo.info.description;
		qs(player + ".hp").innerText = pkmInfo.hp + "HP";
		qs(player + ".pokepic").src = URL + pkmInfo.images.photo;
		qs(player + ".type").src = URL + pkmInfo.images.typeIcon;
		qs(player + ".weakness").src = URL + pkmInfo.images.weaknessIcon;
		for (let i = 0; i < 4; i++) {
			qsa(player + ".moves button")[i].classList.add("hidden");
		}
		for (let i = 0; i < pkmInfo.moves.length; i++) {
			qsa(player + ".moves button")[i].classList.remove("hidden");
			qsa(player + ".move")[i].innerText = pkmInfo.moves[i].name;
			if (pkmInfo.moves[i].dp !== undefined) {
				qsa(player + ".dp")[i].innerText = pkmInfo.moves[i].dp;
			} else {
				qsa(player + ".dp")[i].innerText = "";
			}
			let moveType = qsa(player + ".moves button img")[i];
			moveType.src = URL + "icons/" + pkmInfo.moves[i].type + ".jpg";
		}
		if (player === "#p1 ") {
			id("start-btn").classList.remove("hidden");
		}
	}

	/**
	 * Looks at the results of a move for a player and displays it
   * @param {string} player - What players results we are looking at
	 * @param {JSON} turnData - Data about the just finished turn from the api
	 */
	function checkResults(player, turnData) {
    baseHp = turnData["p1"]["hp"];
		id(player + "-turn-results").classList.remove("hidden");
		if (turnData["results"][player + "-move"] !== null) {
			id(player + "-turn-results").innerText = "Player " + player.substring(1) + " played "
                                                + turnData["results"][player + "-move"] + " and "
                                                + turnData["results"][player + "-result"] + "!";
		} else {
			id(player + "-turn-results").classList.add("hidden");
		}
		qs("#" + player + " .hp").innerText = turnData[player]["current-hp"] + "HP";
		let percentHealth = (turnData[player]["current-hp"] / turnData[player]["hp"]) * 100;
		qs("#" + player + " .health-bar").style.width = percentHealth + "%";
		if (percentHealth < 20) {
			qs("#" + player + " .health-bar").classList.add("low-health");
		}
		qs("#" + player + " .buffs").innerHTML = "";
		debuffOrBuff("buffs", turnData, player);
		debuffOrBuff("debuffs", turnData, player);
		if (turnData[player]["current-hp"] === 0) {
			endGame(player, turnData);
		}
	}

	/**
	 * Shows the results at the end of a battle, stops further moves,
	   and if you beat a pokemon rewards it to you
   * @param {string} player - What players results we are looking at
	 * @param {JSON} turnData - Data about the just finished turn from the api
	 */
	function endGame(player, turnData) {
		id("endgame").classList.remove("hidden");
		id("flee-btn").classList.add("hidden");
		for (let i = 0; i < qsa("#p1 .moves button").length; i++) {
			qsa("#p1 .moves button")[i].disabled = true;
		}
		if (player === "p1") {
			qs("h1").innerText = "You lost!";
		} else {
			qs("h1").innerText = "You won!";
			if (!(id(turnData["p2"]["shortname"]).classList.contains("found"))) {
				id(turnData["p2"]["shortname"]).classList.add("found");
			}
		}
	}

	/**
	 * Shows results of all buffs/debuffs that have happened to a player
   * @param {string} buffOrDebuff - If we are looking at buff or debuffs
	 * @param {JSON} turnData - Data about the just finished turn from the api
	 * @param {string} player - What players results we are looking at
	 */
	function debuffOrBuff(buffOrDebuff, turnData, player) {
		for (let i = 0; i < turnData[player][buffOrDebuff].length; i++) {
			let type = turnData[player][buffOrDebuff][i];
			let div = document.createElement("div");
			div.className = buffOrDebuff.substring(0, buffOrDebuff.length - 1) + " " + type;
			qs("#" + player + " .buffs").appendChild(div);
		}
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
	 * shortcut getting a dom element using a selector/class
	 * @param {string} selector - the selector/class of the element you want to find
	 * @return {element} Returns dom element
	 */
	function qs(selector) {
		return document.querySelector(selector);
	}
	/**
	 * shortcut getting all dom element using a selector/class
	 * @param {string} selector - the selector/class of the element you want to find
	 * @return {set} Returns set of dom element
	 */
	function qsa(selector) {
		return document.querySelectorAll(selector);
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
