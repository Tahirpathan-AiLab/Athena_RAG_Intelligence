Binary Data Services
********************

The modules described in this chapter provide some basic services
operations for manipulation of binary data. Other operations on binary
data, specifically in relation to file formats and network protocols,
are described in the relevant sections.

Some libraries described under Text Processing Services also work with
either ASCII-compatible binary formats (for example, "re") or all
binary data (for example, "difflib").

In addition, see the documentation for Python's built-in binary data
types in Binary Sequence Types --- bytes, bytearray, memoryview.

* "struct" --- Interpret bytes as packed binary data

  * Functions and Exceptions

  * Format Strings

    * Byte Order, Size, and Alignment

    * Format Characters

    * Examples

  * Applications

    * Native Formats

    * Standard Formats

  * Classes

* "codecs" --- Codec registry and base classes

  * Codec Base Classes

    * Error Handlers

    * Stateless Encoding and Decoding

    * Incremental Encoding and Decoding

      * IncrementalEncoder Objects

      * IncrementalDecoder Objects

    * Stream Encoding and Decoding

      * StreamWriter Objects

      * StreamReader Objects

      * StreamReaderWriter Objects

      * StreamRecoder Objects

  * Encodings and Unicode

  * Standard Encodings

  * Python Specific Encodings

    * Text Encodings

    * Binary Transforms

    * Standalone Codec Functions

    * Text Transforms

  * "encodings" --- Encodings package

  * "encodings.idna" --- Internationalized Domain Names in
    Applications

  * "encodings.mbcs" --- Windows ANSI codepage

  * "encodings.utf_8_sig" --- UTF-8 codec with BOM signature
