# JS-Input-Fields-Validator
Validator of input fields (text, email, numbers)

This javascript implements solution to validate input fields against empty value / email format / numbers. It is easy to use. It allows custom configuration like:
- scrolling to failed validation input field
- display error message on failed validation
- scrolling to the error message
- scrolling behavior (smooth or auto)
- setting custom css styles for the input which fails against validation
- setting custom css styles for the input which successfully passed validation

Implementation:
Just add the InputValidator.js file as the script source <script src='InputValidator.js'>
Initialize the Validator class - I recommend not to initialize it at the moment of validation event, but it is better to initialize it right after the page is loaded.
Within the initialization you make all the configuration, the configuration as passed as an object.
If you want to validate all inputs within the form, then set type_of_inputs to required type ('text', 'email', or 'digit').
Keep in mind that if the fields are being validated within the form at once, then all the fields can be validated againts only one type (if the form has different inputs of digit / emails / text, then you have to validate them separately).
If you want to display error message on validation failer, insert a non-displayed div with some ID into your page where it should be displayd ( e.g. <div id='error-msg' style='display:none'>Validation failed</div>).
If you want to validate each input separately, then type_of_inputs and display_alert_div are not necessary to set.

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



