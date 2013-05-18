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

The parser is a writable stream with some extensions.

### Methods

#### Parser#write(data)

Write some data to be parsed.

#### Parser#writeLiteral(data)

If a literal occurs ({123}\r\n) do not parse it, since the length is known.  Just add it separately and it will included as the node value instead of length property.

#### Parser#end([data])

Mark the end of the data, optionally passing one last chunk of data to be parsed.

#### Parser#finalize()

Generates and returns a structured object with the data currently known. Useful if you need to check parse status in the middle of the process

### Events

To register for these events, do:

```js
parser.on('EventName', function (data) {
  
})
```

#### log

Is emitted with a string as its data.  This string is the entire unparsed content of the line.

#### line

Is emitted with a structured array as its data.  This array is the result of parsing the line.

## Licence

MIT