/*================================================================
CHANGELIST:

7-3-08 (wilson):
    1. rewrote sendBuy to use a POST request instead of a GET request

7-22-08 (wilson):
    1. added sendBuyAlt as an alternative way to submit the form
        - works with the buy_alt.php and the buy_frame_alt.php files
 * © 2010 Zynga Game Network Inc.
================================================================*/

var io_install_stm = false;
var io_operation = "ioBegin";
var blackbox_value;
var nojs = false;

window.onload = function() {
  io_soap(0);
}

function io_soap(pass) {
  var blackbox = document.getElementById(io_bbout_element_id);
  if (blackbox.value == '') {
    if (pass < 30) {
      setTimeout( 'io_soap('+(pass + 1)+')', 100 );
    } else {
      // timeout error
      nojs = true;
      enable_buttons();
    }
  } else {
    blackbox_value = blackbox.value;
    enable_buttons();
  }
}

function enable_buttons() {
  for (var i = 0; i < button_ids.length; i++) {
    if (document.getElementById(button_ids[i]) != null) document.getElementById(button_ids[i]).disabled = false;
  }
}

function sendBuy(pkg) {
  var form = document.getElementById(buy_form_id);
  document.getElementById(package_input_id).value = pkg;
  form.submit();
}

function sendBuyAlt(provider_id) {
  if (document.getElementById(package_input_id).value == 0) {
    alert('Please select a package.');
    return false;
  }

  var form = document.getElementById(buy_form_id);
  document.getElementById(provider_input_id).value = provider_id;
  form.submit();

  return false;
}
