﻿/// <reference path="batfish-common.js" />
/// <reference path="workclient.js" />

var spinOpts = {
    lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}

//this function populates the config text box with the chosen file
function loadConfigText() {

    //sanity check HTML configuration elements
    if (errorCheck(typeof elementTestrigFile === 'undefined' || bfIsInvalidElement(elementTestrigFile),
           "Testrig file element (elementTestrigFile) is not configured in the HTML header",
            "loadconfigtext") ||
        errorCheck(typeof elementConfigText === 'undefined' || bfIsInvalidElement(elementConfigText),
           "Config text (elementConfigText) is not configured in the HTML header",
            "loadconfigtext") ||
        errorCheck(typeof elementConfigSelect === 'undefined' || bfIsInvalidElement(elementConfigSelect),
            "Config select element (elementConfigSelect) is not configured in te HTML header",
            "loadconfigtext"))
        return;

    var configFile = jQuery(elementTestrigFile).get(0).files[0];

    if (configFile.type && (configFile.type == 'application/x-zip-compressed' || configFile.type == 'application/zip')) {
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                testrigZip = new JSZip(e.target.result);
                jQuery(elementConfigText).val("Packaged testrig contents:\n" + zipToOverviewText(testrigZip, "    "));
            }
            catch (e) {
                errorCheck(true, "Looks like a bad zip file: " + e.message, "loadconfigtext");

                //empty the textbox and the file chooser
                jQuery(elementConfigText).val("");
                jQuery(elementTestrigFile).val('');
            }

        }
        reader.readAsArrayBuffer(configFile);
    }
    else {
        //empty testrigZip
        testrigZip = "";

        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            jQuery(elementConfigText).val(contents);
        }
        r.readAsText(configFile);
    }

    //if a config had been selected from the drop down menu, remove it
    //so that only one type of input is active
    jQuery(elementConfigSelect).prop('selectedIndex', 0);
}

//this function populates the question text box with the chosen file
function loadQuestionText() {

    //sanity check HTML configuration elements
    if (errorCheck(typeof elementQuestionFile === 'undefined' || bfIsInvalidElement(elementQuestionFile),
           "Questoin file element (elementQuestionFile) is not configured in the HTML header",
            "loadquestiontext") ||
        errorCheck(typeof elementQuestionText === 'undefined' || bfIsInvalidElement(elementQuestionText),
           "Question text element (elementQuestionText) is not configured in the HTML header",
            "loadquestiontext") ||
        errorCheck(typeof elementQuestionSelect === 'undefined' || bfIsInvalidElement(elementQuestionSelect),
            "Question select element (elementQuestionSelect) is not configured in te HTML header",
            "loadquestiontext"))
        return;

    var questionFile = jQuery(elementQuestionFile).get(0).files[0];

    var r = new FileReader();
    r.onload = function (e) {
        var contents = e.target.result;
        jQuery(elementQuestionText).val(contents);
    }
    r.readAsText(questionFile);

    //if a question had been selected from the drop down menu, remove it
    //so that only one type of input is active
    jQuery(elementQuestionSelect).prop('selectedIndex', 0);
}

//loads the content behind selected value of dropdownId into dstTextBox
//   ... jquery's load function didn't work properly for this use. 
//   ... it wouldn't load once we've loaded content through loadConfigText or loadQuestionText 
function loadText(dropDownId, dstTextBox, elementLocalFile) {

    if (errorCheck(typeof dropDownId === 'undefined' || bfIsInvalidElement(dropDownId),
           "Dropdown selector Id is incorrect", "loadtext") ||
        errorCheck(typeof dstTextBox === 'undefined' || bfIsInvalidElement(dstTextBox),
           "Dst text box id is incorrect", "loadtext") ||
        errorCheck(typeof elementLocalFile === 'undefined' || bfIsInvalidElement(elementLocalFile),
           "Local file element is incorrect", "loadtext") ||
        errorCheck(typeof elementConfigSelect === 'undefined' || bfIsInvalidElement(elementConfigSelect),
            "Config select element (elementConfigSelect) is not configured in te HTML header",
            "loadtext"))
        return;

    var srcUrl = jQuery(dropDownId).val();

    //check if the source URL corresponds to a zip file, which can only happen for configs (not questions)
    var match = srcUrl.match(/^.+(\.[^\.]+)$/);

    if (match && match[1] == ".zip") {

        // loading a zip file
        JSZipUtils.getBinaryContent(srcUrl, function (err, data) {
            if (err) {
                errorCheck(true, "Failed to fetch config/question " + srcUrl, "loadtext");
            }
            try {
                testrigZip = new JSZip(data);
                jQuery(dstTextBox).val("Packaged testrig contents:\n" + zipToOverviewText(testrigZip, "    "));
            }
            catch (e) {
                errorCheck(true, "Looks like a bad zip file: " + e.message, "loadconfigtext");

                //empty the textbox and the drop down menu
                jQuery(dstTextBox).val("");
                jQuery(dropDownId).prop('selectedIndex', 0);
            }
        });
    }
    else {
        jQuery.ajax({
            url: srcUrl,
            success: function (data) {
                jQuery(dstTextBox).val(data);
            }
        }).fail(function () {
            errorCheck(true, "Failed to fetch config/question " + srcUrl, "loadtext");

            //empty the textbox and the drop down menu
            jQuery(dstTextBox).val("");
            jQuery(dropDownId).prop('selectedIndex', 0);
        });

        //if we were the testrig, unset the testrigzip
        if (dropDownId == elementConfigSelect) {
            testrigZip = "";
        }
    }

    //if a local file had been chosen, cancel that 
    //so that only one type of input is active
    jQuery(elementLocalFile).val('');
}

// this is a test function whose contents change based on what we want to test
function testMe() {
    containerName = "js_41aceec6-018e-4434-bd97-e1c9430333a6";
    startCalls("testme", "drawtopology::drawanswer");
}


function zipToOverviewText(zip, strPrefix) {
    var overviewText = "";
    // that, or a good ol' for(var entryName in zip.files)
    $.each(zip.files, function (index, zipEntry) {
        overviewText += strPrefix + zipEntry.name + "\n";
    });
    return overviewText;
}