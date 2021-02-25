<!DOCTYPE html>

<html>

<div id='formular'>
  <input type='text' id='first'></input><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <input type='text' id='second'></input><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <input type='text' id='third'></input><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <input type='text' id='fourth'></input><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <div id='incomplete_form' style="display:none; color:red">FORM IS NOT COMPLETE, CHECK ALL THE FIELDS</div>
  <button onclick='check();'>
    odeslat
  </button>
</div>

<script>

class Validator {
  
  /* Validate all input fields within the form (div)
  ** first parameter is an id of the wrapper tag (div, form, section ...), second parameter is the object with options
  ** type_of_inputs = could be text / email / digit, applies only if all inputs within the wrapper should be checked at once (if you want to validate separate inputs, omit type_of_inputs option)
  ** initial_border_color = initial color of the inputs border which should be in case the validation is ok
  ** bordercolor_to_change = color of the input border which should be set in case of failed validation of the input
  ** initial_border_width = initial width of the input border
  ** border_width_to_change = the width of the input border which should be set in case of failed validation 
  ** display_alert_div = false or true, indicates whether we want to display some div with message (there could be just one message displayed in any of the inputs failer)
  ** display_alert_div_id = in case the display_alert is set to true, we pass the id of the div which will be displayed, initialy this div must be set as style.display = 'none'
  ** scroll_to_input = if set to true, page will scroll to the inputs (scroll_to_input has higher priority than scroll_to_alert)
  ** scroll_to_alert = if set to true, page will scroll to the alert message div
  ** scroll_behavior = smooth or auto scrolling (default is smooth), if set to 'auto', the scroll will jump to the spot
  **
  ** If all the fields inside the wrapper should be validated against the same type of input (e.g. text), then we can use validateForm method
  ** If we need to validate particular inputs against different types, then we need to call particular method (e.g. validateInputText) on each input
  */
  
  constructor(options = {}) { 
    // set property which indicates whether the all input fields were validated ok and if not, display (if required) the alert only once after the all input fields control
    this.validation_ok = true;
    // set class options properties
    this.type_of_inputs = options.type_of_inputs ? options.type_of_inputs : 'text';
    this.initial_border_color = options.initial_bordercolor ? options.initial_bordercolor : '';
    this.bordercolor_to_change = options.bordercolor_to_change ? options.bordercolor_to_change : 'red';
    this.initial_border_width = options.initial_borderwidth ? options.initial_borderwidth : '';
    this.border_width_to_change = options.borderwidth_to_change ? options.borderwidth_to_change : '';
    this.display_alert_div = options.display_alert_div ? options.display_alert_div : false;
    this.alert_div_id = options.alert_div_id ? options.alert_div_id : '';
    this.scroll_to_input = options.scroll_to_input ? options.scroll_to_input : false;
    this.scroll_to_alert = options.scroll_to_alert ? options.scroll_to_alert : false;
    this.scroll_behavior = options.scroll_behavior ? options.scroll_behavior : 'smooth';
  }
  
  /* VALIDATION OF TEXT */
  validateInputText(input_id) { 
    // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    if(input_element.value === "") {
      // change border color
      input_element.style.borderColor = this.bordercolor_to_change;
      // if change of the border width was required
      if(this.border_width_to_change !== '') {
        input_element.style.borderWidth = this.border_width_to_change;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
    this.validation_ok = false;
    return false;
    }
    else {
      // set the initial border color
      input_element.style.borderColor = this.initial_border_color;
      // if the change of the border width was required
      if(this.initial_border_width !== '') {
        input_element.style.borderWidth = this.initial_border_width;
      }
    return true;
    }
  }
  /* VALIDATION OF EMAIL */
  validateInputEmail(input_id) {
   // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(input_element.value === "" || !input_element.value.match(mailformat)) {
      // change border color
      input_element.style.borderColor = this.bordercolor_to_change;
      // if change of the border width was required
      if(this.border_width_to_change !== '') {
        input_element.style.borderWidth = this.border_width_to_change;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
    this.validation_ok = false;
    return false;
    }
    else {
      // set the initial border color
      input_element.style.borderColor = this.initial_border_color;
      // if the change of the border width was required
      if(this.initial_border_width !== '') {
        input_element.style.borderWidth = this.initial_border_width;
      }
    return true;
    }
  }
 
  /* VALIDATION OF NUMBER */ 
  validateInputDigit(input_id) {
   // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    if(input_element.value = "" || isNaN(input_element.value)) {
      // change border color
      input_element.style.borderColor = this.border_color;
      // if change of the border width was required
      if(this.border_width_to_change !== '') {
        input_element.style.borderWidth = this.border_width_to_change;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
    this.validation_ok = false;
    return false;
    }
    else {
      // set the initial border color
      input_element.style.borderColor = this.initial_border_color;
      // if the change of the border width was required
      if(this.initial_border_width !== '') {
        input_element.style.borderWidth = this.initial_border_width;
      }
    return true;
    }
 }
  
  // validate all inputs within the wrapper
  validateForm(wrapper_element_id) {
    // set appropriate validation function
    this.validation_fun = (this.type_of_inputs === 'text') ? this.validateInputText :
                           (this.type_of_inputs === 'email') ? this.validateInputEmail :
                           (this.type_of_inputs === 'digit') ? this.validateInputDigit :
                           '';
    document.getElementById(wrapper_element_id).querySelectorAll('input').forEach((item)=> {
      this.validation_fun(item);
    });
    // set the const for the alert div if required 
    let alert_div = (this.display_alert_div) ? document.getElementById(this.alert_div_id) : null;
    // check if all fields were ok, if not display alert div (if required) and scroll to the alert div (if required)
    if(this.validation_ok) { 
      // hide alert div if it exists
      if(this.display_alert_div) {
        alert_div.style.display = "none";
      }
      return true;
    }
    else { 
      if(this.display_alert_div) {
        alert_div.style.display="";
      }
      if(this.scroll_to_alert) { 
        document.getElementById('incomplete_form').scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
    }
  }
  
}

  
function check() { 
 const inst = new Validator({
   initial_bordercolor: 'blue',
   bordercolor_to_change: 'red',
   scroll_to_input: false,
   scroll_behavior: 'auto',
   initial_borderwidth: '2px',
   borderwidth_to_change: '5px',
   display_alert_div: true,
   scroll_to_alert: true,
   alert_div_id: 'incomplete_form'  
 });

 inst.validateForm('formular');
}

</script>

</html>

