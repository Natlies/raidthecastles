/**
 * File Name: survey.js
 *
 * These functions are used for controlling the survey overlay
 * © 2010 Zynga Game Network Inc.
 */

/** Start the suveyClosePoller on page load */
window.onload = function() {
    init();
}

/** global reference to interval timer for the survey close poller */
var interval = null;

var init = function() {
    interval = setInterval(surveyClosePoller, 500);
};

/** Callback when the user clicks the submit survey button */
var submitSurvey = function() {
    interval = setInterval(surveyClosePoller, 500);
};

/** Calls into the parent frame to close the survey overlay */
var closeSurvey = function() {
    clearInterval(interval);
    parent.ZYFrameManager.hideDialogOverlay();
};

/** Polls the survey html to bind a click handler to the final ok button */
var surveyClosePoller = function() {
    try {
        var okbutton = $('#okbutton');
        if(okbutton && okbutton.length > 0) {
            clearInterval(interval);
            okbutton.click(closeSurvey);
        }
        var forwardbutton = $('#forwardbutton');
        if(forwardbutton && forwardbutton.length > 0) {
            forwardbutton.click(submitSurvey);
        }
    } catch(e) {

    }
};