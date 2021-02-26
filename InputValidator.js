class Validator {
  
  /* Validates all input fields within the form (div) or separate input fields
  ** INSTANTIATION of this class should be just once, right on the page load
  ** type_of_inputs = could be text / email / digit, applies only if all inputs within the wrapper should be checked at once (if you want to validate separate inputs, omit type_of_inputs option)
  ** display_alert_div = false or true, indicates whether we want to display some div with message (there could be just one message displayed in any of the inputs failer)
  ** display_alert_div_id = in case the display_alert is set to true, we pass the id of the div which will be displayed, initialy this div must be set as style.display = 'none'
  ** scroll_to_input = if set to true, page will scroll to the inputs (scroll_to_input has higher priority than scroll_to_alert)
  ** scroll_to_alert = if set to true, page will scroll to the alert message div
  ** scroll_behavior = smooth or auto scrolling (default is smooth), if set to 'auto', the scroll will jump to the spot
  ** custom_styles_change = styles which will be applied on the input fields when the validation of the field fails (defaulty set as borderColor: 'red', borderStyle: 'solid')
  ** custom_styles_initial = styles which will be applied on the input fields when the validation of the field succeeds (defaulty set as borderColor: 'rgb(118,118,118), borderStyle: 'solid')
  ** CSS PROPERTIES MUST BE SET WITHOUT HYPHEN, for instance the border-color property must be set as borderColor
  **
  ** If all the fields inside the wrapper should be validated against the same type of input (e.g. text), then we can use validateForm method
  ** If you need to validate particular inputs against different types, then you need to call particular method (e.g. validateInputText) on each input
  ** If you want to validate separate input fields, each input has to have a unique ID which will be passed as a text into the particular validation function
  */
  
  constructor(options = {}) { 
    // set property which indicates whether the all input fields were validated ok and if not, display (if required) the alert only once after the all input fields control
    this.validation_ok = true;
    // set class options properties
    this.type_of_inputs = options.type_of_inputs ? options.type_of_inputs : 'text';
    this.display_alert_div = options.display_alert_div ? options.display_alert_div : false;
    this.alert_div_id = options.alert_div_id ? options.alert_div_id : '';
    this.scroll_to_input = options.scroll_to_input ? options.scroll_to_input : false;
    this.scroll_to_alert = options.scroll_to_alert ? options.scroll_to_alert : false;
    this.scroll_behavior = options.scroll_behavior ? options.scroll_behavior : 'smooth';
    this.custom_styles_change = options.custom_styles_change ? options.custom_styles_change : {
      borderColor: 'red',
      borderStyle: 'solid'
    }
    this.custom_styles_initial = options.custom_styles_initial ? options.custom_styles_initial : {
      borderColor: 'rgb(118,118,118)',
      borderStyle: 'solid'
    }
  }
  
  /* VALIDATION OF TEXT */
  validateInputText(input_id) { 
    // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    // if the value of the field is empty
    if(input_element.value === "") {
      // change the styles
      for(const [key, value] of Object.entries(this.custom_styles_change)) {
        input_element.style[key] = value;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
      this.validation_ok = false;
      return false;
    }
    else {
      // set the initial styles 
      for(const [key, value] of Object.entries(this.custom_styles_initial)) {
        input_element.style[key] = value;
      }
      this.validation_ok = true;
      return true;
    }
  }
  /* VALIDATION OF EMAIL */
  validateInputEmail(input_id) {
   // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // if the value of the input is empty or not in email format
    if(input_element.value === "" || !input_element.value.match(mailformat)) {
      // change the styles
      for(const [key, value] of Object.entries(this.custom_styles_change)) {
        input_element.style[key] = value;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
      this.validation_ok = false;
      return false;
    }
    else {
      // set the initial styles 
      for(const [key, value] of Object.entries(this.custom_styles_initial)) {
        input_element.style[key] = value;
      }
      this.validation_ok = true;
      return true;
    }
  }
 
  /* VALIDATION OF NUMBER */ 
  validateInputDigit(input_id) {
   // check if input_id is of type 'object' or 'string'
    const input_element = (typeof(input_id)==="string") ? document.getElementById(input_id) : input_id;
    // if the value of the input is empty or not a number
    if(input_element.value === "" || isNaN(input_element.value)) {
      // change the styles
      for(const [key, value] of Object.entries(this.custom_styles_change)) {
        input_element.style[key] = value;
      }
      // if scrolling was required
      if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
      this.validation_ok = false;
      return false;
    }
    else {
      // set the initial styles 
      for(const [key, value] of Object.entries(this.custom_styles_initial)) {
        input_element.style[key] = value;
      }
      this.validation_ok = true;
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
        document.getElementById(this.alert_div_id).scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
      }
    }
  }
  
}


