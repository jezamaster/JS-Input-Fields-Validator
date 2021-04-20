class Validator {
     
  constructor(options = {}) { 
    // set class options properties
    this.validate_only_on_submit = options.validate_only_on_submit ? options.validate_only_on_submit : false;
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
    this.password_regex = options.password_regex ? options.password_regex : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    // start validator if validate_only_on_submit === false
    if(this.validate_only_on_submit === false) {
      this.fetchInputs();
    }
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
  async runCallback(input_element) {  
    // check if callback is required on this input element
    const attributes = this.readAttributes(input_element);
    const callback_id = attributes.callback;
    const callback_message = attributes.callback_message_id;
    // get the callback function from options
    const callback_func = this.callbacks[callback_id];
    if(callback_id !== undefined || callback_id === '') { 
      const callback_result = await callback_func(input_element.value);
     // if callback result is ok
      if(callback_result===true) {
        // return true as valid
        return true;
      }
      else {
        // apply style change
        this.applyStyles(input_element, 'custom_styles_change');
        // check if there is any callback message to display, if so, display it
        if(this.error_message_display && callback_message!=='' && callback_message !== 'undefined') {
          this.renderErrorDiv(input_element, callback_message);
        }
        // return false as not valid
        return Promise.resolve(false);
      }
    }
    else {
      // return true as valid
      return Promise.resolve(true);
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
  
  // check particular input
  async checkInput(input_element) {
    // find out validation type and message id 
    const validation_type = this.readAttributes(input_element).type;
    // check if the value is not empty, if returned true, execute other check according to the validation_type 
    if(this.testIfNotEmpty(input_element)===true) {
      if(validation_type === 'text') {
        // run callback function, if callback is true or there is no callback, return true as valid to the caller function, else return false as not valid result
        const returned_value = await this.runCallback(input_element);
        return returned_value === true ? Promise.resolve(true) : Promise.resolve(false);
      }
      if(validation_type === 'email') {
        // run email check function
        if(this.testEmail(input_element.value)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
           // return false to the caller function as not valid
           return Promise.resolve(false);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
          // run callback function, if callback is true or there is no callback, return true as valid to the caller function, else return false as not valid result
          const returned_value = await this.runCallback(input_element);
          return returned_value === true ? Promise.resolve(true) : Promise.resolve(false);
        }
      }
      if(validation_type === 'digit') {
        // run digit check function
        if(this.testDigit(input_element.value)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
           // return false to the caller function as not valid
           return Promise.resolve(false);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
          // run callback function, if callback is true or there is no callback, return true as valid to the caller function, else return false as not valid result
          const returned_value = await this.runCallback(input_element);
          return returned_value === true ? Promise.resolve(true) : Promise.resolve(false);
        }
      }
      // first check of password is on valid criteria
      if(validation_type === 'password1' || validation_type === 'password2') { 
        this.first_check_of_password = 'not valid';
        // run password check function
        if(this.testPass(input_element)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element);
           // return false to the caller function as not valid
           return Promise.resolve(false);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
          // set first_check_of_password to valid so that the check of the passwords match against each other can be executed
          this.first_check_of_password = 'valid';
          // not returning anything so that it doesn't quit this function and testPasswordMatch can be now executed
        }
      }
      // second check of password is on the match against the other password
      if((validation_type === 'password1' || validation_type === 'password2') && this.first_check_of_password === 'valid') {
        // run password check function
        if(this.testPasswordsMatch(input_element)) {
           this.applyStyles(input_element, 'custom_styles_change');
           this.scrollShowMessage(input_element, false, true);
           // return false to the caller function as not valid
           return Promise.resolve(false);
        }
        else {
          // set the initial styles and remove error message
          this.applyStyles(input_element, 'custom_styles_initial');
          this.removeErrorDiv(input_element);
          // return true as valid
          return Promise.resolve(true);
        }
      }
    } 
    else {
      // scroll and display message if required (second argument 'true' is passed only because this function is being run based on empty field so I have to set fixed message_id)
      this.scrollShowMessage(input_element, true);
      // return false as not valid
      return Promise.resolve(false);
    }
  }
  
  // fetch all input fields with attribute data-inputvalidator, add blur event listener on each of them 
  fetchInputs() {
    this.inputs_to_validate = document.querySelectorAll('[data-inputvalidator]');
    for (let el of this.inputs_to_validate) {
      el.addEventListener('blur', (evt)=>{
        this.checkInput(evt.target);
      });
    }
  }
  
  // get the message text according to the required message id
  getMessageText(message_id) {
    return this.error_messages[message_id];
  }
  
  /* create error div above the input field */
  // width of the message div must be the width of the input field width
  // input_element = element passed based on the current data-inputvalidator attribute, message_id = id of the message passed into the constructor options
  renderErrorDiv(input_element, message_id) { 
    // first remove any previous error message if there exists any
    this.removeErrorDiv(input_element);
    const div_width = window.getComputedStyle(input_element).getPropertyValue('width');
    const message = this.getMessageText(message_id);
    const div = `<div errormessage="true" style="display:block;width:${div_width};">${message}</div>`;
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
  async validateForm(parent_element) {
    let all_inputs_ok = true;
    this.inputs_to_validate = document.querySelectorAll('[data-inputvalidator]');
    for (let el of this.inputs_to_validate) {
      // validate each input element, if any of them fails, set all_inputs_filled to false
      let res = await this.checkInput(el);
      //console.log(el, `returned value is: ${res}`);
      if(res === false) all_inputs_ok = false;
    }
    // if all field are filled and valid, return true to the external on submit function
    if(all_inputs_ok === true) {
      return Promise.resolve(true);
    }
    else {
    // return false to the external on submit function
      return Promise.resolve(false);
    }
  }
}
