# JS-Input-Fields-Validator
DESCRIPTION:

Input Validator is a Java Script validator which allows to validate input elements against defined requirements. The validation types comprise:
- text
- email 
- number
- password minimal requirements
- comparison of two passwords match
- custom validation based on callback functions


It is easy to use. It allows custom configuration like:
- switch on/off scrolling to failed validation input field
- scrolling behavior (smooth or auto)
- switch on/off displaying error messages 
- setting own messages texts on empty value / incorrect format / passwords no match / callback functions
- setting custom css styles for the input elements which fails against validation
- setting custom css styles for the inputs which successfully passed validation
- setting own regular expressions on email format
- setting own regular 
- setting callback functions 

IMPLEMENTATION:
Just add the InputValidator.js file as the script source <script src='InputValidator.js'> and initialize the Validator class.
When initializing the class, you pass all the configurations which you require as an object parameter. All the input elements to be validated must have data-inputvalidator attribute with specific options as the attribute value. You can user whatever number of your message or callback variable. Just NOTE that message0 is reserved for the message displaying on empty (not filled out) input, so start numbering your messages with message1, message2 or whatever number except for 0.
Each parameter is separated by '&' sign and must be set in one of the following ways:

FORMAT OF data-inputvalidator:
data-inputvalidator="type&messageID&callbackID&messageID" or in case of passwords valiation (comparison of two passwords match) you add one more message data-inputvalidator="password&messageID&messageID&callbackID&messageID"

- data-inputvalidator="text" -> validates only if the value is empty

- data-inputvalidator="text&&callback1&message5" -> will call the callback function (callback function assigned to callback1 variable in the your configuration) which displays message5, NOTICE that there are two '&&' after the type, it is because the second parameter should be message, so if there is no message, you just omit it and put next '&' separator sign
   
- data-inputvalidator="email&message1&callback2&message8" -> validates email, if in incorrect format, message1 will be displayed, if not empty, callback2 is called and if false returned, it will display meesage8

- data-inputvalidator="digit@message2" -> if not a number, display message 2

- data-inputvalidator="digit@message2&callback2&message3" -> if not a number, display message 2, if number is valid, call the callback2 function which will display message3 on false return

- data-inputvalidator="password1&message4&message5" -> if not correct format of password, display message4, if there exists second input field for re-entering password and it does not match this one, display message5; NOTE that password type MUST ALWAYS by as password1 variable and the second password as password2 (even if there is only one password field, you must name the variable password1 !!!)

- data-inputvalidator="password2&message4&message5" -> the same settings as password1
 
Callback functions can be called on whatever input except for passwords (minimal requirements for password format is passed as a regex in your custom options, as a default it is set 6 up to 20 characters and at least one uppercase letter and one digit.
Due to callback functions you can make whatever additional check which you want, for instance check if the text field is of at least x length, or make the callback function which checks if the entered email already exists in your database etc. 


SUBMITTING THE FORM
When submitting the form (doesn't have to be form, it could be e.g. a div wrapper of the input elements) you call a class method validateForm(parent element) with a parent element (form / div / section or whatever) as a parameter of the method. Assign a variable to this calling method, the method returns true or false based on if all the input fields were validated successfully or failed. If true is returned, make you action (submit the form etc.).



```
EXAMPLE:

// INSTANTIATE NEW VALIDATOR
const form_validator = new Validator({
            type_of_inputs: 'text', 
            scroll_to_input: false,
            scroll_behavior: 'auto',
            display_alert_div: true,
            scroll_to_alert: true,
            alert_div_id: 'validation-failed-message',
            custom_styles_change: {
                borderColor: 'red',
                borderStyle: 'solid'
            },
            custom_styles_initial: {
                borderColor: 'grey',
                borderStyle: 'solid',
                backgroundColor: 'green'
            }  
     });
```

Then on the validation event (e.g. submiting the form) you run the particular function. There are four functions available:

- validateForm('form or a wrapper id') - use for validating all inputs at once
- validateInputText('input field id') - validates separate input against the void
- validateInputEmail('input field id') - validates separate input against the void and email format
- validateInputDigit('input field id') - validates separate input against the void and number format

If you want to validate all input fields whithin the form,  e.g.:

```
// EVENT HANDLER ON THE FORM INPUTS VALIDATION
document.getElementById('submit-button').addEventListener('click', (e)=>{
   const validation_result = form_validator.validateForm('form-to-validate');
    // if all the input fields were validated successfully
    if(validation_result) {
        alert('All fields validated successfully');
    }
}
```

Or if you want to validate input fields separately, e.g:

```
    // VALIDATION OF SEPARATE INPUTS
    // validate as text
    const input1_result = instSeparate.validateInputText('one');
    // validate as email
    const input2_result = instSeparate.validateInputEmail('two');
    // validate as number
    const input3_result = instSeparate.validateInputDigit('three');

    // if the above three inputs were validated successfully
    if(input1_result && input2_result && input3_result) {
        alert('All the separate fields validated successfully');
    }

```



