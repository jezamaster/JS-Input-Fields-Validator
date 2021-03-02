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
- scrolling to failed validation input field
- scrolling to the failed validation input field
- scrolling behavior (smooth or auto)
- switch on/off displaying error messages 
- setting own messages texts on empty value / incorrect format / passwords no match / callback functions
- setting custom css styles for the input elements which fails against validation
- setting custom css styles for the inputs which successfully passed validation
- setting own regular expressions on email format
- setting own regular 
- setting callback functions 

IMPLEMENTATION:
Just add the InputValidator.js file as the script source <script src='InputValidator.js'> and initiate the Validator class.
When initiating the class, you pass all the configurations which you require as an object parameter. 

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



