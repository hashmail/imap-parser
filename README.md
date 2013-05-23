# imap-parser

IMAP command parser for use on both client and server.  This is based on work in [andris9/inbox](https://github.com/andris9/inbox) and provides a parser for IMAP line based commands.

[![Build Status](https://travis-ci.org/hashmail/imap-parser.png?branch=master)](https://travis-ci.org/hashmail/imap-parser)

## Installation

```
$ npm install imap-parser
```

## API

To create an instance of the line parser:

```js
var Parser = require('imap-parser')
var parser = new Parser()
```

The parser is a writable & readable stream.  Just pipe the data stream from the TCP connection in and read the parsed lines out as `data` events.  Each data event contains an array with the parsed data for a line.  String literals are also handled more or less automatically (see caviat in events).

### Events

#### log

Is emitted with a string as its data.  This string is the entire unparsed content of the line.  It is useful for logging:

```js
parser.on('log', function (line) {
  console.log('c: ' + line)
})
```

#### literal

Is emitted when the client is sending a literal to the server but is waiting for a command continuation request:

```js
parser.on('literal', function () {
  connection.write('+ Ready for additional command text')
})
```

## Licence

MIT
