# Client Library

## Overview
Creates a client library for communication with an API as specified by the `spec.json` and `errors.json` files.

## Usage

### 1. Create service API library
#### index.js
```
const get_client = require('@aluminumoxide/direct-democracy-lib-client')
module.exports = get_client(require('./spec.json'), require('./errors.json'))
```

#### package.json
```
{
        "name": "@yourhandle/yourlib",
        "version": "1.0.0",
        "description": "Client library for yourapi",
        "main": "index.js",
        "dependencies": {
                "@aluminumoxide/direct-democracy-lib-client": "^1.0.10"
        },
        "files": [
                "spec.json",
                "errors.json"
        ],
        "publishConfig": {
                "registry": "https://npm.pkg.github.com"
        },
        "repository": "https://github.com/yourhandle/yourrepo",
        "devDependencies": {},
        "author": "Your Name",
        "license": "GPL3"
}
```

### 2. Publish API library
```
cp ~/.npmrc .
cp ../spec.json ./
cp ../source/errors.json ./
npm install
npm publish

```

### 3. Use service API library
```
const my_client = require('@yourhandle/yourlib')

try {
    const val = await my_client.OPID({ arg: val })
} catch(e) {
    if(e.message === my_client.errors.ERRID) {
        console.log('known error')
    } else {
        console.log('unknown error')
    }
}
```
- OPID is the operationId of the endpoint, as specified in the spec.
- ERRID is the key in the errors.json for the specified error message.
- ENV environment variable sets the client environment, defaulting to the first server listed in the spec, if not set.
