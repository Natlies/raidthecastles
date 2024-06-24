$(document).ready ( function() {
                        $('#newItemTemplate').hide();
                        $('#newItemSelect').change(changeNewItemSelection);

                        function changeNewItemSelection(event)
                        {
                                var select = $(event.currentTarget);
                                var value  = event.currentTarget.value;

                                if (value == '')
                                {
                                        return;
                                }

                                // Remove the option from the select
                                $("option[value='" + value + "']", select).remove();

                                // Create a new row for the added option
                                var newItemRow = $('#newItemTemplate').clone(true);

                                newItemRow.removeAttr('id');

                                $('td.itemName', newItemRow).html(value);

                                $('input', newItemRow).attr('name', 'ITEM_' + value);

                                // Show the new row to the user
                                $('#newItemRows').append(newItemRow);

                                newItemRow.fadeIn();
                        }
                    }
                );

//------------------------------------------------------------------------------
/* check all expansions */
function checkAllExpansionSections (master) {
    /*
    var inputs = document.getElementById('expansionSections').getElementsByTagName('input');
    
    for (var i = 0; i < inputs.length; ++i) {
    
        var input = inputs[i];
        
        if (input.type == 'checkbox' && input != master) {
            
            input.checked = master.checked;
        }
    }
    */
    var checkboxes = $(master).closest('form').find(':checkbox');
    if($(master).is(':checked')) {
        checkboxes.attr('checked', 'checked');
    } else {
        checkboxes.removeAttr('checked');
    }
} // end method checkAllExpansionSections

//------------------------------------------------------------------------------
/* comments here */
function toggleBlobSection (linkElem, blobSectionName) {
    
    var blobSection = document.getElementById (blobSectionName);
    
    if (blobSection.style.display == 'none') {
        
        blobSection.style.display = 'table-row';
        linkElem.innerHTML = '<i><u>hide</u></i>';
    }
    else {
        
        blobSection.style.display = 'none';
        linkElem.innerHTML = '<i><u>show</u></i>';
    }
    
} // end method toggleBlobSection

//------------------------------------------------------------------------------
/* comments here */
function validateBlobsToSave() {
    
    var blobNames = ['userBlob','userSummaryBlob','socialBlob','homeWorldBlob'];
    
    var blobContent = [];
    
    for (var i=0; i < blobNames.length; i++) {
        
        var textArea = document.getElementsByName (blobNames[i])[0];
        
        if (textArea) {
            
            blobContent [ blobNames[i] ] = textArea.innerHTML;
            
            textArea.innerHTML = '';
        }
    }
    
    var countSelected = 0;
    
    var blobs = document.getElementsByName ('blobs[]');
    
    for(var i = 0; i <  blobs.length; i++) {
      
      if ( blobs[i].checked ) {
        countSelected++;
      }
    }
    
    if (countSelected > 0) {
        
        var blobForm = document.getElementById ('blobsManagerForm');
        
        if (blobForm) {
            
            blobForm.submit();
            
            for (var i=0; i < blobNames.length; i++) {

                var textArea = document.getElementsByName (blobNames[i])[0];

                if (textArea) {

                    textArea.innerHTML = blobContent [ blobNames[i] ];
                }
            }
        }
    }
    else {
        alert ("You must select at least 1 blob to save");
    }
    
    return false;
    
} // end method validateBlobsToSave

//------------------------------------------------------------------------------
/* comments here */
function getHTTPObject(){
    
   if (window.ActiveXObject) {
       return new ActiveXObject("Microsoft.XMLHTTP");
   }
   else if (window.XMLHttpRequest) {
       return new XMLHttpRequest();
   }
   else {
       
      alert("Your browser does not support AJAX");
      
      return null;
   }
   
} // end method getHTTPObject

//------------------------------------------------------------------------------
/* comments here */
function fetchWorldBlob (progressLinkElem, sectionLinkElemId, progressIndicatorId, sectionId, textAreaId, worldId, ajaxUrl) {
    
    var linkElem = document.getElementById (sectionLinkElemId)
    
    var progressIndicator = document.getElementById (progressIndicatorId);
    
    var textArea = document.getElementById (textAreaId);
    
    var blobSection = document.getElementById (sectionId);
    
    xmlHttp = getHTTPObject();
    
    if (xmlHttp != null) {
        
        progressIndicator.innerHTML = '<img src="images/loading.gif">';
        
        xmlHttp.onreadystatechange = function() {
            
                                            if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
                                                
                                                /*
                                                var response = xmlHttp.responseText.toString();
                                                
                                                // seeing HTML in the responseText, not sure why?!
                                                var htmlIndex = response.indexOf ('<!DOCTYPE', 0);
                                                
                                                if ( htmlIndex >= 0 ) {
                                                    response = response.substring (0, htmlIndex);
                                                }
                                                */
                                                
                                                textArea.innerHTML = xmlHttp.responseText; // response;
                                                
                                                progressIndicator.innerHTML = '';
                                                
                                                if (xmlHttp.responseText != 'XSRF attempt.') {
                                                    
                                                    progressLinkElem.innerHTML = '';
                                                    
                                                    progressLinkElem.style.display = 'none';
                                                }
                                                
                                                if ( blobSection.style.display == 'none' ) {
                                                    
                                                    blobSection.style.display = 'table-row';
                                                    
                                                    linkElem.innerHTML = '<i><u>hide</u></i>';
                                                }
                                            }
                                        }
        
        xmlHttp.open ("GET", ajaxUrl + "&worldID=" + worldId, true);
        
        xmlHttp.send();
    }
    
    return true;
    
} // end method fetchWorldBlob

//------------------------------------------------------------------------------
/* comments here */
function analyzesBlob (resultsSectionId, objectTree, ajaxUrl) {
    
    var resultsArea = document.getElementById (resultsSectionId);
    
    var blob = document.forms['BlobAnalyzer']['blob'].value;
    
    var limit = document.forms['BlobAnalyzer']['limit'].value;
    
    // var objectTree = document.forms['BlobAnalyzer']['tree'].value;
    
    xmlHttp = getHTTPObject();
    
    if (xmlHttp != null) {
        
        resultsArea.innerHTML = '<img src="images/loading.gif">';
        
        xmlHttp.onreadystatechange = function() {
            
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                
                resultsArea.innerHTML = xmlHttp.responseText;
            }
        }
        
        xmlHttp.open ("GET", ajaxUrl + "&blob=" + blob + "&limit=" + limit + "&tree=" + objectTree, true);
        
        xmlHttp.send();
    }
    
    return true;
    
} // end method analyzeBlob
