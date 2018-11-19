# RESTful Web API with Node.js Framework (UDACITY)


> First part of full private Blockchain project

### ONLY SERVER SIDE TESTING WITH CURL OR POSTMAN

* This version does not includes already front end but it is still under development.
* When using postman:
    * POST Request + localhost:8000/api/block --> To add a block with content (specify in Postman the Content-Type as application/x-www-form-urlencoded and use key("body")-value("your message to store on the blockchain") under Body section with application/x-www-form-urlencoded)
    * GET request + localhost:8000/api/block/[number] --> Returns the block with the key requested


## Quick Start

``` bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

## App Info

### Author

Rick Warling

### Version

1.0.0
