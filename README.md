# JS-Input-Fields-Validator
#DESCRIPTION:

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
- setting own regular 
- setting callback functions 

#IMPLEMENTATION:

Just add the InputValidator.js file as the script source <script src='InputValidator.js'> and initialize the Validator class.
When initializing the class, you pass all the configurations which you require as an object parameter. All the input elements to be validated must have data-inputvalidator attribute with specific options as the attribute value. You can user whatever number of your message or callback variable. Just NOTE that message0 is reserved for the message displaying on empty (not filled out) input, so start numbering your messages with message1, message2 or whatever number except for 0.
Each parameter is separated by '&' sign and must be set in one of the following ways:

#FORMAT OF data-inputvalidator:

data-inputvalidator="type&messageID&callbackID&messageID" 
or 
in case of passwords validation (comparison of two passwords match) you add one more message like data-inputvalidator="password&messageID&messageID&callbackID&messageID"

- data-inputvalidator="text" -> validates only if the value is empty

- data-inputvalidator="text&&callback1&message5" -> will call the callback function (callback function assigned to callback1 variable in the your configuration) which displays message5, **NOTICE that there are two '&&' after the type**, it is because the second parameter should be message, so if there is no message, you just omit it and put next '&' separator sign
   
- data-inputvalidator="email&message1&callback2&message8" -> validates email, if in incorrect format, message1 will be displayed, if not empty, callback2 is called and if false returned, it will display meesage8

- data-inputvalidator="digit@message2" -> if not a number, display message 2

- data-inputvalidator="digit@message2&callback2&message3" -> if not a number, display message 2, if number is valid, call the callback2 function which will display message3 on false return

- data-inputvalidator="password1&message4&message5" -> if not correct format of password, display message4, if there exists second input field for re-entering password and it does not match this one, display message5; NOTE that password type MUST ALWAYS by as password1 variable and the second password as password2 (even if there is only one password field, you must name the variable password1 !!!)

- data-inputvalidator="password2&message4&message5" -> the same settings as password1


#CALLBACK FUNCTIONS:

Callback functions can be called on whatever input except for passwords (minimal requirements for password format is passed as a regex in your custom options, as a default it is set 6 up to 20 characters and at least one uppercase letter and one digit.

Due to callback functions you can make whatever additional check which you want, for instance check if the text field is of at least x length, or make the callback function which checks if the entered email already exists in your database etc. 

For instance, you can validate if any option from <select> element was selected, see the example code below. **BUT KEEP IN MIND, if there is no message after the 'text' type and you want to set callback on that element, DON'T FORGET TO SEPARATE WITH TWO '&&'** (data-inputvalidator['text&&callbackID&messageID']) !!!!!!

