
# Email Validator js

This package enables you to validate an email and check if it is a temorary email
# Installation



```bash
  yarn add email-validator-js
```

Or

```bash
  npm install email-validator-js
```


## Installation
```javascript
import EmailValidator from "email-validator-js";
```

Available functions

## Check syntax

```javascript
new EmailValidator("example@gmail.com")
.syntax()
.then(data =>{
    // do something with the data
    /**
     * DATA FORMAT
     * error:boolean
     * email:string
     * message:string
     */
})
.catch(error =>{
    // handle error
})
```
## Check if email has a valid domain

```javascript
new EmailValidator("example@gmail.com")
.domain()
.then(data =>{
    // do something with the data
    /**
     * DATA FORMAT
     * error:boolean
     * email:string
     * message:string
     * address: string[]
     */
})
.catch(error =>{
    // handle error
})
```

## Check if email is a temp mail

```javascript
new EmailValidator("example@gmail.com")
.temp()
.then(data =>{
    // do something with the data
    /**
     * DATA FORMAT
     * error:boolean
     * email:sting
     * message:string
     * temp:boolean
     */
})
.catch(error =>{
    // handle error
})
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
This is package is still work in progress

## License
[MIT](https://choosealicense.com/licenses/mit/)
