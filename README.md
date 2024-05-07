# JS-Input-Fields-Validator
# DESCRIPTION:

Input Validator is a Java Script validator which allows to validate input elements against defined requirements. The validation types comprise:
- text
- email 
- number
- password minimal requirements
- comparison of two passwords match
- custom validation based on callback functions


It is easy to use. It allows custom configuration like:
- switch on/off if validation should be performed whenever the input is getting out of focus or only on submitting the whole form
- switch on/off scrolling to failed validation input field
- scrolling behavior (smooth or auto)
- switch on/off displaying error messages 
- setting own messages texts on empty value / incorrect format / passwords no match / callback functions
- setting custom css styles for the input elements which fails against validation
- setting custom css styles for the inputs which successfully passed validation
- setting own regular expressions on email format
- setting callback functions 

# IMPLEMENTATION:
Just add the InputValidator.js file as the script source <script src='InputValidator.js'> and initialize the Validator class.
When initializing the class, you pass all the configurations which you require as an object parameter. All the input elements to be validated must have data-inputvalidator attribute with specific options as the attribute value. 
   
You can use whatever number of your message or callback variable. Just NOTE that message0 is reserved for the message displaying on empty (not filled out) input, so start numbering your messages with message1, message2 or whatever number except for 0.
Each parameter is separated by '&' sign and must be set in one of the following ways:

# FORMAT OF data-inputvalidator:
data-inputvalidator="type&messageID&callbackID&messageID" 
or 
in case of passwords validation (comparison of two passwords match) you add one more message like data-inputvalidator="password&messageID&messageID&callbackID&messageID"

- data-inputvalidator="**text**" -> validates only if the value is empty (**NOTE that message0 is ALWAYS reserved only for empty value message, you can configure the message, but never use message0 for anything else**)

- data-inputvalidator="**text&&callback1&message5**" -> will call the callback function (callback function assigned to callback1 variable in the your configuration) which displays message5, **NOTICE that there are two '&&' after the type**, it is because the second parameter should be message, so if there is no message, you just omit it and put next '&' separator sign
   
- data-inputvalidator="**email&message1&callback2&message8**" -> validates email, if in incorrect format, message1 will be displayed, if not empty, callback2 is called and if false returned, it will display meesage8

- data-inputvalidator="**digit&message2**" -> if not a number, display message 2

- data-inputvalidator="**digit&message2&callback2&message3**" -> if not a number, display message 2, if number is valid, call the callback2 function which will display message3 on false return

- data-inputvalidator="**password1&message4&message5**" -> if not correct format of password, display message4, if there exists second input field for re-entering password and it does not match this one, display message5; **NOTE that password type MUST ALWAYS be as password1 variable and the second password as password2 (even if there is only one password field, you must name the variable password1 !!!)**

- data-inputvalidator="**password2&message4&message5**" -> the same settings as password1

# CALLBACK FUNCTIONS:
Callback functions can be called on whatever input except for passwords (minimal requirements for password format is passed as a regex in your custom options, as a default it is set 6 up to 20 characters and at least one uppercase letter and one digit.

Due to callback functions you can make whatever additional check which you want, for instance check if the text field is of at least x length, or make the callback function which checks if the entered email already exists in your database etc.

For instance, you can validate if any option from SELECT element was selected, see the example in the EXAMPLE section.
**BUT KEEP IN MIND, if there is no message after the 'text' type and you want to set callback on that element, DON'T FORGET TO SEPARATE WITH TWO '&&' (data-inputvalidator="text&&callbackID&messageID") !!!!!!**

If your callback function is calling Web API (for instance queries to database to check existence of a value etc.), **YOU MUST RETURN A PROMISE FROM YOUR FUNCTION AND ON SUCCESS RESOLVE THIS PROMISE AS TRUE OR ON FAILURE RESOLVE THIS PROMISE AS FALSE, see the checkUser function in the example code below which checks if user's email address already exists**

# SUBMITTING THE FORM:
When submitting the form (doesn't have to be form, it could be e.g. a div wrapper of the input elements) you call a class method validateForm(parent element) with a parent element (form / div / section or whatever) as a parameter of the method. The method returns a **Promise** which resolves **true** in case the form is successfully filled out, and if it resolves **false**. You can see the example code on how it works and how to use it.


# CUSTOM CONFIGURATION
All the custom configurations are passed as an object parameter when initializing the Class. Options to configure are as follows:

**- validate_only_on_submit** = if true, validation of input fields gets executed only when submitting the whole form (which means not on blur event of particular inputs)

**- scroll_to_input** = if set to true, page will scroll to the inputs (scroll_to_input has higher priority than scroll_to_alert)

**- scroll_behavior** = smooth or auto scrolling (default is smooth), if set to 'auto', the scroll will jump to the spot

**_ custom_styles_change** = object, css styles which will be applied on the input fields when the validation of the field fails (defaulty set as borderColor: 'red', borderStyle: 'solid'), **CSS PROPERTIES MUST BE SET WITHOUT HYPHEN, for instance the border-color property must be set as borderColor**

**- custom_styles_initial** = object, css styles which will be applied on the input fields when the validation of the field succeeds (defaulty set as borderColor: 'rgb(118,118,118), borderStyle: 'solid'), don't forget to set these styles so that 

**- error_message_styles** = object, css styles of the messages 

**- error_message_display** = true if the error message should be displayed

**- error_message_place_class** = if you want to place the div with error message somewhere else than into the default place (which is right above the verified input field), then set the class name of the div (or other element) whitin which you want to place it

**- error_message_place_where** = this parameter specifies where exactly within the error_message_place_class element you want to place the error message, the option are 'beforebegin', 'afterbegin','beforeend','afterend' - see the description of those at https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML

**- error_message_div_contains** = if you want add any class, id or attribute to the error message div, set this parameter to exactly what you want to add, e.g. if you want to the div to contain class='my_class', set this parameter as `class='my_class'`, **just notice that this value is embraced with backticks marks !!!

**- error_messages** = object, set the message you want, 'message0' is always assigned to message on not filled out input field

**- callbacks** = object, callback functions to be executed on the field - must return true on success and false on failure

**- password_regex** = regular expression for password requirements, defaulty set to 6-20 chars with at least one uppercase letter and one number (this regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/  )


# EXAMPLE OF HTML:

```
<form id='testForm'>
    <input type='text' data-inputvalidator='text&&callback1&message1' placeholder="Enter text"><br><br>
    <input type='text' data-inputvalidator='email&message2&callback2&message3' placeholder="Enter email"><br><br>
    <input type='text' data-inputvalidator='digit&message4' placeholder="Enter number"><br><br>
    <input type='text' data-inputvalidator='password1&message5&message6' placeholder="Enter password"><br><br>
    <input type='text' data-inputvalidator='password2&message5&message6' placeholder="Enter password"><br><br><br>
    <select data-inputvalidator='text&&callback3&message7'>
      <option value='default_value'>How old are you?</option>
      <option value='between0_30'>0 - 30 years</option>
      <option value='between30-60'>30 - 60 years</option>
      <option value='between60_more'>60 and more</option>
    </select>
    <input type='submit' value='Submit'>
 </form>
 
 ```
 
 # EXAMPLE OF JAVASCRIPT:
 
 ```
<script>

// callback1 function - for instance, allow only text of at least 3 chars
const testText = (text_value)=> {
    return text_value.length >= 3 ? true : false;
}

// callback2 function - check if the entered user's email address already exists
const checkUser = (user) => {
  return new Promise(async (resolve) => {
     const data = await fetch(`./sql_api.php?q=check_user&user=${user}`);
     const response = await data.text();
     if(response === 'user_exists') { 
       resolve(false);
     } else {
       resolve(true);
     }
  });
 }

// callback3 function - check if any option was selected
const testSelect = (selected_value)=> {
  if(selected_value === 'default_value') {
    return false;
  }
  else {
    return true;
  }
}


// instantiate Validator 
const inst = new Validator({
            validate_only_on_submit: false,
            scroll_to_input: true,
            scroll_behavior: 'smooth',
            error_message_display: true,
            /* error_message_place_class: 'my_class', */
            /* error_message_place_where: 'beforeend', */
            /* error_message_div_contains: `class='my_class'`, */
            custom_styles_change: {
                borderColor: 'red',
                borderRadius: '5px'
            },
            custom_styles_initial: {
                borderColor: 'grey'
            },
            password_regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
            error_messages: {
              // message0 is always intended for not filled input 
              message0: 'The field cannot be empty', 
              message1: 'Text field must be at least 3 characters long',
              message2: 'Not valid email format',
              message3: 'User with this email address already exists',
              message4: 'Not a number',
              message5: 'Password must be at least 6 chars long and must contain an uppercase letter and a number',
              message6: 'Passwords DO NOT match',
              message7: 'You must select some option'
            },
            error_message_styles: {
              marginBottom: '5px',
              color: 'red'
            },
            callbacks: {
              callback1: testText,
              callback2: checkUser,
              callback3: testSelect
            }
    });
 // add event listener on submitting the form
 document.querySelector('form').addEventListener('submit', (e)=>{
 e.preventDefault();
 
 // launch validation of all fields within the parent element (Form) => returns Promise, if true then the form is ok, if false, then the form is NOT ok
 inst.validateForm(document.querySelector('form'))
  .then(val => {
      if(val === true) {
        alert('The form is alright');
      }
      else {
        alert('The form IS NOT alright');
      }
     });
  });
  
</script>

```


 





   
   
