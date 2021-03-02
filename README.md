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
data-inputvalidator="type&messageID&callbackID&messageID" 
or 
in case of passwords validation (comparison of two passwords match) you add one more message like data-inputvalidator="password&messageID&messageID&callbackID&messageID"

- data-inputvalidator="text" -> validates only if the value is empty

- data-inputvalidator="text&&callback1&message5" -> will call the callback function (callback function assigned to callback1 variable in the your configuration) which displays message5, NOTICE that there are two '&&' after the type, it is because the second parameter should be message, so if there is no message, you just omit it and put next '&' separator sign
   
- data-inputvalidator="email&message1&callback2&message8" -> validates email, if in incorrect format, message1 will be displayed, if not empty, callback2 is called and if false returned, it will display meesage8

- data-inputvalidator="digit@message2" -> if not a number, display message 2

- data-inputvalidator="digit@message2&callback2&message3" -> if not a number, display message 2, if number is valid, call the callback2 function which will display message3 on false return

- data-inputvalidator="password1&message4&message5" -> if not correct format of password, display message4, if there exists second input field for re-entering password and it does not match this one, display message5; NOTE that password type MUST ALWAYS by as password1 variable and the second password as password2 (even if there is only one password field, you must name the variable password1 !!!)

- data-inputvalidator="password2&message4&message5" -> the same settings as password1
 
Callback functions can be called on whatever input except for passwords (minimal requirements for password format is passed as a regex in your custom options, as a default it is set 6 up to 20 characters and at least one uppercase letter and one digit.
Due to callback functions you can make whatever additional check which you want, for instance check if the text field is of at least x length, or make the callback function which checks if the entered email already exists in your database etc. 


SUBMITTING THE FORM:
When submitting the form (doesn't have to be form, it could be e.g. a div wrapper of the input elements) you call a class method validateForm(parent element) with a parent element (form / div / section or whatever) as a parameter of the method. Assign a variable to this calling method, the method returns true or false based on if all the input fields were validated successfully or failed. If true is returned, make you action (submit the form etc.).


EXAMPLES:
```
EXAMPLE of html input fields wrapped in the form parent element:

 <form id='testForm'>
    <input type='text' data-inputvalidator='text&&callback1&message1' placeholder="Enter text"><br><br>
    <input type='text' data-inputvalidator='email&message2&callback2&message3' placeholder="Enter email"><br><br>
    <input type='text' data-inputvalidator='digit&message4' placeholder="Enter number"><br><br>
    <input type='text' data-inputvalidator='password1&message5&message6' placeholder="Enter password"><br><br>
    <input type='text' data-inputvalidator='password2&message5&message6' placeholder="Enter password"><br><br><br>
    <input type='submit' value='Submit'>
 </form>
```

EXAMPLE of initialization of the class with custom configuration, two callback functions and calling the final check on submitting the form:

```
<script>

// callback1 function - for instance, allow only text of at least 3 chars
const testText = (text_value)=> {
    return text_value.length >= 3 ? true : false;
}

// callback2 function - for instance, the domain must be gmail.com
const testEmail = (email)=> { 
  const [first_part, domain_name] = email.split('@');
  return (domain_name === 'gmail.com') ? true : false;
}

// instantiate Validator 
const inst = new Validator({
            scroll_to_input: true,
            scroll_behavior: 'smooth',
            error_message_display: true,
            custom_styles_change: {
                borderColor: 'red',
                borderRadius: '5px'
            },
            custom_styles_initial: {
                borderColor: 'grey'
            },
            error_messages: {
              // message0 is always intended for not filled input 
              message0: 'The field cannot be empty', 
              message1: 'Text field must be at least 3 characters long',
              message2: 'Not valid email format',
              message3: 'Email must be at gmail.com domain',
              message4: 'Not a number',
              message5: 'Password must be at least 6 chars long and must contain an uppercase letter and a number',
              message6: 'Passwords DO NOT match'
            },
            error_message_styles: {
              marginBottom: '5px',
              color: 'red'
            },
            callbacks: {
              callback1: testText,
              callback2: testEmail
            }
    });

// add event listener on submitting the form
document.getElementById('testForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  // launch validation of all fields within the parent element (testForm) = return true if all field are ok, else return false
  const result = inst.validateForm(document.getElementById('testForm'));  
  if(result) {
    alert('Validation of all fields succeeded!!!');
  }
  else {
    alert('Validation of all fields failed!!!');
  }

});
  
</script>

```







