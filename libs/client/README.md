# Usage

## Create service API library 
```
const get_client = require('@aluminumoxide/direct-democracy-lib-client')
module.exports = get_client(require('./spec.json'), require('./errors.json'))
```

## Use service API library 
```
const my_client = new (require('yourlib'))('ENV')
await my_client.OPID({ arg: val })
```
- Where OPID is the operationId of the endpoint, as specified in the spec.
- Where ENV is the name of the server you want to connect to, from the spec. 
  - This is defaulted to the ENV enviroment variable, if not set on use.
    - If environment variable is not set, it is defaulted to the first server listed in the spec.
