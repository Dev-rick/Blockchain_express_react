# Private Blockchain Notary Service with Node.js Framework (UDACITY)



## Project overview

### CURRENTLY ONLY SERVER SIDE AVAILABLE (USE POSTMAN OR CURL) -- CLIENT UNDER DEVELOPMENT

The goal of the project is to build a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.

## Project specification

https://review.udacity.com/#!/rubrics/2098/view

---

## Framework used

Express.js

## Getting started

Open a command prompt or shell terminal after install node.js and execute:

```
npm install
```

## Testing

```
npm run server
```

## Endpoint description

### 1. Blockchain ID validation request

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/requestValidation
```

**Parameters**

```
address - specify in Postman the Content-Type as application/x-www-form-urlencoded and use key("address")-value("[YourAdress]") under Body section with application/x-www-form-urlencoded)
```

### 2. Blockchain ID message signature validation

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/message-signature/validate
```

**Parameters**

```
address - See last step
signature - Use the your Electrum wallet to sign the message gotten from the first request and specify in Postman another  key("signature")-value("[YourSignature]") under Body section with application/x-www-form-urlencoded)  
```

**Example**

### 3. Star registration

**Method**

```
POST
```

**Endpoint**

```
http://localhost:8000/block
```

**Parameters**

```
Now use the "raw" option under Body in Postman and enter a star following this:
{
"address": "[yourAddress]",
    "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found in the sky"
        }
}

```

### 4. Get block by height

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/block/:height
```

**Parameters**

```
height - Enter a valid height of a block
```

### 6. Get block by address

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/address:address
```

**Parameters**

```
address - [YourAdress]
```

### 5. Get block by hash

**Method**

```
GET
```

**Endpoint**

```
http://localhost:8000/stars/hash:hash
```

**Parameters**

```
hash - [A hash of a block you know]
```

## App Info

### Author

Rick Warling

### Version

1.0.0

## Sources which helped me:

Credits to:

- Udacity Project4 Concepts section
- Udacity slack of nanodegree
- https://github.com/bitcoinjs/bitcoinjs-message
