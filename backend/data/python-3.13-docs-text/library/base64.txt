"base64" --- Base16, Base32, Base64, Base85 Data Encodings
**********************************************************

**Source code:** Lib/base64.py

======================================================================

This module provides functions for encoding binary data to printable
ASCII characters and decoding such encodings back to binary data. This
includes the encodings specified in **RFC 4648** (Base64, Base32 and
Base16), the Base85 encoding specified in PDF 2.0, and non-standard
variants of Base85 used elsewhere.

There are two interfaces provided by this module.  The modern
interface supports encoding *bytes-like objects* to ASCII "bytes", and
decoding *bytes-like objects* or strings containing ASCII to "bytes".
Both base-64 alphabets defined in **RFC 4648** (normal, and URL- and
filesystem-safe) are supported.

The legacy interface does not support decoding from strings, but it
does provide functions for encoding and decoding to and from *file
objects*.  It only supports the Base64 standard alphabet, and it adds
newlines every 76 characters as per **RFC 2045**.  Note that if you
are looking for **RFC 2045** support you probably want to be looking
at the "email" package instead.

Changed in version 3.3: ASCII-only Unicode strings are now accepted by
the decoding functions of the modern interface.

Changed in version 3.4: Any *bytes-like objects* are now accepted by
all encoding and decoding functions in this module.  Ascii85/Base85
support added.


RFC 4648 Encodings
==================

The **RFC 4648** encodings are suitable for encoding binary data so
that it can be safely sent by email, used as parts of URLs, or
included as part of an HTTP POST request.

base64.b64encode(s, altchars=None)

   Encode the *bytes-like object* *s* using Base64 and return the
   encoded "bytes".

   Optional *altchars* must be a *bytes-like object* of length 2 which
   specifies an alternative alphabet for the "+" and "/" characters.
   This allows an application to e.g. generate URL or filesystem safe
   Base64 strings.  The default is "None", for which the standard
   Base64 alphabet is used.

   May assert or raise a "ValueError" if the length of *altchars* is
   not 2.  Raises a "TypeError" if *altchars* is not a *bytes-like
   object*.

base64.b64decode(s, altchars=None, validate=False)

   Decode the Base64 encoded *bytes-like object* or ASCII string *s*
   and return the decoded "bytes".

   Optional *altchars* must be a *bytes-like object* or ASCII string
   of length 2 which specifies the alternative alphabet used instead
   of the "+" and "/" characters.

   A "binascii.Error" exception is raised if *s* is incorrectly
   padded.

   If *validate* is "False" (the default), characters that are neither
   in the normal base-64 alphabet nor the alternative alphabet are
   discarded prior to the padding check.  If *validate* is "True",
   these non-alphabet characters in the input result in a
   "binascii.Error".

   For more information about the strict base64 check, see
   "binascii.a2b_base64()"

   May assert or raise a "ValueError" if the length of *altchars* is
   not 2.

base64.standard_b64encode(s)

   Encode *bytes-like object* *s* using the standard Base64 alphabet
   and return the encoded "bytes".

base64.standard_b64decode(s)

   Decode *bytes-like object* or ASCII string *s* using the standard
   Base64 alphabet and return the decoded "bytes".

base64.urlsafe_b64encode(s)

   Encode *bytes-like object* *s* using the URL- and filesystem-safe
   alphabet, which substitutes "-" instead of "+" and "_" instead of
   "/" in the standard Base64 alphabet, and return the encoded
   "bytes".  The result can still contain "=".

base64.urlsafe_b64decode(s)

   Decode *bytes-like object* or ASCII string *s* using the URL- and
   filesystem-safe alphabet, which substitutes "-" instead of "+" and
   "_" instead of "/" in the standard Base64 alphabet, and return the
   decoded "bytes".

base64.b32encode(s)

   Encode the *bytes-like object* *s* using Base32 and return the
   encoded "bytes".

base64.b32decode(s, casefold=False, map01=None)

   Decode the Base32 encoded *bytes-like object* or ASCII string *s*
   and return the decoded "bytes".

   Optional *casefold* is a flag specifying whether a lowercase
   alphabet is acceptable as input.  For security purposes, the
   default is "False".

   **RFC 4648** allows for optional mapping of the digit 0 (zero) to
   the letter O (oh), and for optional mapping of the digit 1 (one) to
   either the letter I (eye) or letter L (el).  The optional argument
   *map01* when not "None", specifies which letter the digit 1 should
   be mapped to (when *map01* is not "None", the digit 0 is always
   mapped to the letter O).  For security purposes the default is
   "None", so that 0 and 1 are not allowed in the input.

   A "binascii.Error" is raised if *s* is incorrectly padded or if
   there are non-alphabet characters present in the input.

base64.b32hexencode(s)

   Similar to "b32encode()" but uses the Extended Hex Alphabet, as
   defined in **RFC 4648**.

   Added in version 3.10.

base64.b32hexdecode(s, casefold=False)

   Similar to "b32decode()" but uses the Extended Hex Alphabet, as
   defined in **RFC 4648**.

   This version does not allow the digit 0 (zero) to the letter O (oh)
   and digit 1 (one) to either the letter I (eye) or letter L (el)
   mappings, all these characters are included in the Extended Hex
   Alphabet and are not interchangeable.

   Added in version 3.10.

base64.b16encode(s)

   Encode the *bytes-like object* *s* using Base16 and return the
   encoded "bytes".

base64.b16decode(s, casefold=False)

   Decode the Base16 encoded *bytes-like object* or ASCII string *s*
   and return the decoded "bytes".

   Optional *casefold* is a flag specifying whether a lowercase
   alphabet is acceptable as input.  For security purposes, the
   default is "False".

   A "binascii.Error" is raised if *s* is incorrectly padded or if
   there are non-alphabet characters present in the input.


Base85 Encodings
================

Base85 encoding is a family of algorithms which represent four bytes
using five ASCII characters.  Originally implemented in the Unix
"btoa(1)" utility, a version of it was later adopted by Adobe in the
PostScript language and is standardized in PDF 2.0 (ISO 32000-2). This
version, in both its "btoa" and PDF variants, is implemented by
"a85encode()".

A separate version, using a different output character set, was
defined as an April Fool's joke in **RFC 1924** but is now used by Git
and other software.  This version is implemented by "b85encode()".

Finally, a third version, using yet another output character set
designed for safe inclusion in programming language strings, is
defined by ZeroMQ and implemented here by "z85encode()".

The functions present in this module differ in how they handle the
following:

* Whether to include and expect enclosing "<~" and "~>" markers.

* Whether to fold the input into multiple lines.

* The set of ASCII characters used for encoding.

* Compact encodings of sequences of spaces and null bytes.

* The encoding of zero-padding bytes applied to the input.

Refer to the documentation of the individual functions for more
information.

base64.a85encode(b, *, foldspaces=False, wrapcol=0, pad=False, adobe=False)

   Encode the *bytes-like object* *b* using Ascii85 and return the
   encoded "bytes".

   *foldspaces* is an optional flag that uses the special short
   sequence 'y' instead of 4 consecutive spaces (ASCII 0x20) as
   supported by 'btoa'. This feature is not supported by the standard
   encoding used in PDF.

   *wrapcol* controls whether the output should have newline ("b'\n'")
   characters added to it. If this is non-zero, each output line will
   be at most this many characters long, excluding the trailing
   newline.

   *pad* controls whether zero-padding applied to the end of the input
   is fully retained in the output encoding, as done by "btoa",
   producing an exact multiple of 5 bytes of output. This is not part
   of the standard encoding used in PDF, as it does not preserve the
   length of the data.

   *adobe* controls whether the encoded byte sequence is framed with
   "<~" and "~>", as in a PostScript base-85 string literal.  Note
   that while ASCII85Decode streams in PDF documents *must* be
   terminated with "~>", they *must not* use a leading "<~".

   Added in version 3.4.

base64.a85decode(b, *, foldspaces=False, adobe=False, ignorechars=b' \t\n\r\x0b')

   Decode the Ascii85 encoded *bytes-like object* or ASCII string *b*
   and return the decoded "bytes".

   *foldspaces* is a flag that specifies whether the 'y' short
   sequence should be accepted as shorthand for 4 consecutive spaces
   (ASCII 0x20). This feature is not supported by the standard Ascii85
   encoding used in PDF and PostScript.

   *adobe* controls whether the "<~" and "~>" markers are present.
   While the leading "<~" is not required, the input must end with
   "~>", or a "ValueError" is raised.

   *ignorechars* should be a byte string containing characters to
   ignore from the input. This should only contain whitespace
   characters, and by default contains all whitespace characters in
   ASCII.

   Added in version 3.4.

base64.b85encode(b, pad=False)

   Encode the *bytes-like object* *b* using base85 (as used in e.g.
   git-style binary diffs) and return the encoded "bytes".

   The input is padded with "b'\0'" so its length is a multiple of 4
   bytes before encoding.  If *pad* is true, all the resulting
   characters are retained in the output, which will always be a
   multiple of 5 bytes, and thus the length of the data may not be
   preserved on decoding.

   Added in version 3.4.

base64.b85decode(b)

   Decode the base85-encoded *bytes-like object* or ASCII string *b*
   and return the decoded "bytes".

   Added in version 3.4.

base64.z85encode(s)

   Encode the *bytes-like object* *s* using Z85 (as used in ZeroMQ)
   and return the encoded "bytes".

   The ZeroMQ specification requires the length of Z85-encoded data to
   be a multiple of 5 bytes. To produce compliant data frames, you
   must pad the input data to this function to a multiple of 4 bytes.

   Added in version 3.13.

base64.z85decode(s)

   Decode the Z85-encoded *bytes-like object* or ASCII string *s* and
   return the decoded "bytes".

   Added in version 3.13.


Legacy Interface
================

base64.decode(input, output)

   Decode the contents of the binary *input* file and write the
   resulting binary data to the *output* file. *input* and *output*
   must be *file objects*. *input* will be read until
   "input.readline()" returns an empty bytes object.

base64.decodebytes(s)

   Decode the *bytes-like object* *s*, which must contain one or more
   lines of base64 encoded data, and return the decoded "bytes".

   Added in version 3.1.

base64.encode(input, output)

   Encode the contents of the binary *input* file and write the
   resulting base64 encoded data to the *output* file. *input* and
   *output* must be *file objects*. *input* will be read until
   "input.read()" returns an empty bytes object. "encode()" inserts a
   newline character ("b'\n'") after every 76 bytes of the output, as
   well as ensuring that the output always ends with a newline, as per
   **RFC 2045** (MIME).

base64.encodebytes(s)

   Encode the *bytes-like object* *s*, which can contain arbitrary
   binary data, and return "bytes" containing the base64-encoded data,
   with newlines ("b'\n'") inserted after every 76 bytes of output,
   and ensuring that there is a trailing newline, as per **RFC 2045**
   (MIME).

   Added in version 3.1.

An example usage of the module:

>>> import base64
>>> encoded = base64.b64encode(b'data to be encoded')
>>> encoded
b'ZGF0YSB0byBiZSBlbmNvZGVk'
>>> data = base64.b64decode(encoded)
>>> data
b'data to be encoded'


Security Considerations
=======================

A new security considerations section was added to **RFC 4648**
(section 12); it's recommended to review the security section for any
code deployed to production.

See also:

  Module "binascii"
     Support module containing ASCII-to-binary and binary-to-ASCII
     conversions.

  **RFC 1521** - MIME (Multipurpose Internet Mail Extensions) Part
  One: Mechanisms for Specifying and Describing the Format of Internet
  Message Bodies
     Section 5.2, "Base64 Content-Transfer-Encoding," provides the
     definition of the base64 encoding.

  ISO 32000-2 Portable document format - Part 2: PDF 2.0
     Section 7.4.3, "ASCII85Decode Filter," provides the definition of
     the Ascii85 encoding used in PDF and PostScript, including the
     output character set and the details of data length preservation
     using zero-padding and partial output groups.

  ZeroMQ RFC 32/Z85
     The "Formal Specification" section provides the character set
     used in Z85.
