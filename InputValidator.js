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
    this.scroll_to_input = options.scroll_to_input ? options.scroll_to_input : false;
    this.scroll_behavior = options.scroll_behavior ? options.scroll_behavior : 'smooth';
    this.error_message_display = options.error_message_display ? options.error_message_display : false,
    this.error_message_styles = options.error_message_styles ? options.error_message_styles : {
      color: 'red',
      fontSize: '1rem',
      fontWidth: '700'
    }
    this.custom_styles_change = options.custom_styles_change ? options.custom_styles_change : {
      borderColor: 'red',
      borderStyle: 'solid'
    }
    this.custom_styles_initial = options.custom_styles_initial ? options.custom_styles_initial : {
      borderColor: 'rgb(118,118,118)',
      borderStyle: 'solid'
    }
    this.error_messages = options.error_messages ? options.error_messages : {
      message0 : 'The field cannot be empty'
    }
    this.callbacks = options.callbacks ? options.callbacks : {},
    this.password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    // start validator
    this.fetchInputs();
  }
  
  // apply styles (pass the second argument exactly as either 'custom_styles_change' or 'custom_styles_initial')
  applyStyles(input_element, style) { 
    // change the styles, either the style to change or the initial style
      for(const [key, value] of Object.entries(this[style])) {
        input_element.style[key] = value;
      }
  }
  
  // read the attributes
  readAttributes(input_element) {
    const attributes = input_element.getAttribute('data-inputvalidator').split('&');
    // new object with preset values
    const attrib = {
      type: '',
      message_id: '',
      message_password_no_match: '',
      callback: '',
      callback_message_id: null
    }
    // if password attribute contains two messages (first to validate password, second to display no match with second password), but first check if there are at least 3 values in array
    if((attributes.length>2) && (attributes[0]==='password1' || attributes[0]==='password2') && attributes[1].substr(0,4)==='mess' && attributes[2].substr(0,4)==='mess')  {
      attrib.type = attributes[0];
      attrib.message_id = attributes[1];
      attrib.message_password_no_match = attributes[2];
      attrib.callback = attributes[3];
      attrib.callback_message_id = attributes[4];
    }
    else {
      attrib.type = attributes[0];
      attrib.message_id = attributes[1];
      attrib.message_password_no_match = '';
      attrib.callback = attributes[2];
      attrib.callback_message_id = attributes[3];
    }
    return attrib; 
  }
  
  // if callback required, call it and display message
  runCallback(input_element) { 
    // check if callback is required on this input element
    const attributes = this.readAttributes(input_element);
    const callback_id = attributes.callback;
    const callback_message = attributes.callback_message_id;
    // get the callback function from options
    const callback_func = this.callbacks[callback_id];
    if(callback_id !== undefined || callback_id === '') { 
      const callback_result = callback_func(input_element.value);
      // if callback result is ok
      if(callback_result===true) {
        // return true so that the function which called runCallback can continue
        return true;
      }
      else {
        // check if there is any callback message to display, if so, display it
        if(callback_message!=='') {
          this.renderErrorDiv(input_element, callback_message);
        }
        // return false so that it quits the function
        return false;
      }
    }
    else {
      // return true so that the function which called runCallback can continue
      return true;
    }
  }
  
  // test for value emptiness, if so, apply required styles
  testIfNotEmpty(input_element) {
    if(input_element.value === '') {
      this.applyStyles(input_element, 'custom_styles_change');
      return false;
    }
    else {
      // set initial styles
      this.applyStyles(input_element, 'custom_styles_initial');
      // remove error message 
      this.removeErrorDiv(input_element);
      return true;
    }
  }
  
  // test email format match
  testEmail(input_value) { 
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(input_value.match(mailformat) === null) {
      return true;
    }
    else {
      return false;
    }
  }
  
  // test digit format
  testDigit(input_value) {
    if(isNaN(input_value)) { 
       return true;
     }
     else { 
       return false;
     }
  }

  // test if two passwords match one another
  testPasswordsMatch(input_element) {
      // find out if this find the other password input, if exists (can be either password1 or password2)
      const this_password = input_element.getAttribute('data-inputvalidator').substr(0,9);
      const second_password = this_password === 'password1' ? 'password2' : 'password1';
      // loop through all inputs and search for the second password element
      let second_password_element = null;
      for (let el of this.inputs_to_validate) { 
        if(el.getAttribute('data-inputvalidator').includes(second_password)) { second_password_element = el; }
      }
      // if second password element exists and is filled out
      if(second_password_element !== null && second_password_element.value !== '') {  
          // compare values of the two passwords
          if(input_element.value !== second_password_element.value) { 
            return true;
          }
          else {
            return false;
          }    
      }
      else {
          // second password element doesn't exist, return false as the control was ok
          return false;
      }
  }
  
  // test if password is valid
  testPass(input_element) {
      // test the match against the regex passed in options (or the default one)
    if(input_element.value.match(this.password_regex) === null) {
      // password doesn't match (doesn't meet criterions) so return true
      return true;
    }
    else {
      // match against regex alright 
       return false;
      }
   }
  
  
    // if required in options, scroll to input / display error message
  scrollShowMessage(input_element, empty_value_message=false, passwords_match_message=false) {
    // find out message id
    const message_id = this.readAttributes(input_element).message_id;
    // if scrolling was required
    if(this.scroll_to_input) {
        input_element.scrollIntoView({behavior: this.scroll_behavior, block: "end", inline: "nearest"});
    }
    // render error message with its style if required
    if(this.error_message_display) {
      // if the message should be empty value, then I set the message to 0 which is a default message for empty value
      if(empty_value_message===true) {
        this.renderErrorDiv(input_element, 'message0');
      }
      else if(passwords_match_message === true) {
        // if the message is no match of passwords, then find out the message and use it
        const message_no_match = this.readAttributes(input_element).message_password_no_match;
        this.renderErrorDiv(input_element, message_no_match);
      }
      else {
        this.renderErrorDiv(input_element, message_id);
      }
    }
  }
  
  // callback function on blur event
  checkBluredInput(input_element) {
    // find out validation type and message id 
    const validation_type = this.readAttributes(input_element).type;
    // check if the value is not empty, if returned true, execute other check according to the validation_type 
    if(this.testIfNotEmpty(input_element)===true) {
      if(validation_type === 'text') {
        // check only if there is any callback 
        this.runCallback(input_element);
      }
      if(validation_type === 'email') {
        // run email check function
        if(this.testEmail(input_element.value)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
        }
      }
      if(validation_type === 'digit') {
        // run digit check function
        if(this.testDigit(input_element.value)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
        }
      }
      // first check of password is on valid criteria
      if(validation_type === 'password1' || validation_type === 'password2') {
        this.first_check_of_password = 'not valid';
        // run password check function
        if(this.testPass(input_element)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
          // set first_check_of_password to valid so that the check of the passwords match against each other can be executed
          this.first_check_of_password = 'valid';
        }
      }
      // second check of password is on the match against the other password
      if((validation_type === 'password1' || validation_type === 'password2') && this.first_check_of_password === 'valid') {
        // run password check function
        if(this.testPasswordsMatch(input_element)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element, false, true);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
        }
      }
    } 
    else {
      // scroll and display message if required (second argument 'true' is passed only because this function is being run based on empty field so I have to set fixed message_id)
      this.scrollShowMessage(input_element, true);
    }
  }
  
  // fetch all input fields with attribute data-inputvalidator, add blur event listener on each of them 
  fetchInputs() {
    this.inputs_to_validate = document.querySelectorAll('input[data-inputvalidator]');
    for (let el of this.inputs_to_validate) {
      el.addEventListener('blur', (evt)=>{
        this.checkBluredInput(evt.target);
      });
    }
  }
  
  // get the message text according to the required message id
  getMessageText(message_id) {
    return this.error_messages[message_id];
  }
  
  // make validation of all fields on submit (or click or whatever event)
  validateOnSubmit() {
    for (let el of this.inputs_to_validate) {
      // run validation functions
      
    }
  }
  
  /* create error div above the input field */
  // width of the message div must be the width of the input field width
  // input_element = element passed based on the current data-inputvalidator attribute, message_id = id of the message passed into the constructor options
  renderErrorDiv(input_element, message_id) { 
    // first remove any previous error message if there exists any
    this.removeErrorDiv(input_element);
    const div_width = window.getComputedStyle(input_element).getPropertyValue('width');
    const message = this.getMessageText(message_id);
    const div = `<div errormessage='true' style='display:block;width:${div_width};'>${message}</div>`;
    // insert div above the input field
    input_element.insertAdjacentHTML('beforebegin', div);
    // select this inserted error message div
    const inserted_error_div = input_element.previousSibling;
    // apply error message style
    for(const [key, value] of Object.entries(this.error_message_styles)) {
        inserted_error_div.style[key] = value;
      }
  }
  
  // remove the error message div 
  removeErrorDiv(input_element) {
    // remove first div in line above the input_element
   try {
    const error_div = input_element.previousSibling;
    // remove error message if exists (check if the previousSibling has attribute errormessage)
    if(error_div.hasAttribute('errormessage')) error_div.remove();
   }
    catch {}
  }
      
  // check all input fields if not empty
  validateForm(parent_element) {
    let all_inputs_filled = true;
    for (let el of this.inputs_to_validate) {
      if(!this.testIfNotEmpty(el)) {
        // set all_inputs_filled to false
        all_inputs_filled = false;
        // show error message and scroll if required
        this.scrollShowMessage(el, true);
      }
    }
    // if all field are fill, return true to the external on submit function
    if(all_inputs_filled === true) {
      return true;
    }
    else {
    // return false to the external on submit function
      return false;
    }
  }
}
  
  


