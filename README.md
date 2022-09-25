
# Email Validator js

This package enables you to validate and email and check whether it is a temorary email
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