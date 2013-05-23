# Specifications

This page contains extracts from the important specifications defining IMAP data formats to be parsed.  Sections in block quotes are my comments.

## [RFC 3501](http://tools.ietf.org/html/rfc3501#section-4)

### 4. Data Formats

IMAP4rev1 uses textual commands and responses.  Data in IMAP4rev1 can be in one of several forms: atom, number, string, parenthesized list, or NIL.  Note that a particular data item may take more than one form; for example, a data item defined as using "astring" syntax may be either an atom or a string.

#### 4.1. Atom

> Treated as a string by imap-parser

An atom consists of one or more non-special characters.

#### 4.2. Number

> Treated as a string by imap-parser

A number consists of one or more digit characters, and represents a numeric value.

#### 4.3. String

> Treated as a string by imap-parser

A string is in one of two forms: either literal or quoted string.  The literal form is the general form of string.  The quoted string form is an alternative that avoids the overhead of processing a literal at the cost of limitations of characters which may be used.

A literal is a sequence of zero or more octets (including CR and LF), prefix-quoted with an octet count in the form of an open brace ("{"), the number of octets, close brace ("}"), and CRLF. In the case of literals transmitted from server to client, the CRLF is immediately followed by the octet data.  In the case of literals transmitted from client to server, the client MUST wait to receive a command continuation request (described later in this document) before sending the octet data (and the remainder of the command).

A quoted string is a sequence of zero or more 7-bit characters, excluding CR and LF, with double quote (<">) characters at each end.

The empty string is represented as either "" (a quoted string with zero characters between double quotes) or as {0} followed by CRLF (a literal with an octet count of 0).

Note: Even if the octet count is 0, a client transmitting a literal MUST wait to receive a command continuation request.

##### 4.3.1. 8-bit and Binary Strings

> TODO: I'm not yet sure how this is handled by imap-parser

8-bit textual and binary mail is supported through the use of a [MIME-IMB] content transfer encoding.  IMAP4rev1 implementations MAY transmit 8-bit or multi-octet characters in literals, but SHOULD do so only when the [CHARSET] is identified.

Although a BINARY body encoding is defined, unencoded binary strings are not permitted.  A "binary string" is any string with NUL characters.  Implementations MUST encode binary data into a textual form, such as BASE64, before transmitting the data.  A string with an excessive amount of CTL characters MAY also be considered to be binary.

#### 4.4. Parenthesized List

> becomes a nested array when parsed with imap-parser

Data structures are represented as a "parenthesized list"; a sequence of data items, delimited by space, and bounded at each end by parentheses.  A parenthesized list can contain other parenthesized lists, using multiple levels of parentheses to indicate nesting.

The empty list is represented as () -- a parenthesized list with no members.

#### 4.5. NIL

> becomes `null` when parsed with imap-parser

The special form "NIL" represents the non-existence of a particular data item that is represented as a string or parenthesized list, as distinct from the empty string "" or the empty parenthesized list ().

Note: NIL is never used for any data item which takes the form of an atom.  For example, a mailbox name of "NIL" is a mailbox named NIL as opposed to a non-existent mailbox name.  This is because mailbox uses "astring" syntax which is an atom or a string.  Conversely, an addr-name of NIL is a non-existent personal name, because addr-name uses "nstring" syntax which is NIL or a string, but never an atom.

## [RFC 2088](http://tools.ietf.org/html/rfc2088)

> An extension to the string literal format that improves performance.  Still treated as a string.

### 3. Specification

The non-synchronizing literal is added an alternate form of literal, and may appear in communication from client to server instead of the IMAP4 form of literal.  The IMAP4 form of literal, used in communication from client to server, is referred to as a synchronizing literal.

Non-synchronizing literals may be used with any IMAP4 server implementation which returns "LITERAL+" as one of the supported capabilities to the CAPABILITY command.  If the server does not advertise the LITERAL+ capability, the client must use synchronizing literals instead.

The non-synchronizing literal is distinguished from the original synchronizing literal by having a plus ('+') between the octet count and the closing brace ('}').  The server does not generate a command continuation request in response to a non-synchronizing literal, and clients are not required to wait before sending the octets of a non-synchronizing literal.