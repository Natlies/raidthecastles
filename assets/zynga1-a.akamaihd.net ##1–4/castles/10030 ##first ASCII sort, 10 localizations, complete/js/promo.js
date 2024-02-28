/** 
 * Javascript functions for promotions on payments page.
 * 
 * © 2010 Zynga Game Network Inc.
 */
 
/** Variables for promotion timer countdown. */ 
var promoMinutesLeft = 10;			// Minutes left.
var promoSecondsLeft = 0;			// Seconds left.
var promoUpdateIntervalMs = 1000;	// Timer refresh interval in milliseconds.

/**
 * Update the promo timer display.
 * Reloads page when timer expires.
 */
function updatePromoTimer() {
	if (0 == promoSecondsLeft && 0 == promoMinutesLeft) {
		window.location.reload();
	} else {
		if (0 == promoSecondsLeft) {
			promoSecondsLeft = 59;
			promoMinutesLeft--;
		} else {
			promoSecondsLeft--;
		}

		document.getElementById("promoTimeLeftMin").innerHTML = promoMinutesLeft;
		document.getElementById("promoTimeLeftSec").innerHTML = promoSecondsLeft;
	}
}

/**
 * Start the timer that updates the time left display for the promo.
 */
function startPromoTimer(minutesLeft, secondsLeft) {
	promoMinutesLeft = minutesLeft;
	promoSecondsLeft = secondsLeft;
	setInterval("updatePromoTimer();", promoUpdateIntervalMs);
}