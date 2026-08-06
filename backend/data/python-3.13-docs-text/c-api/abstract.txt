Abstract Objects Layer
**********************

The functions in this chapter interact with Python objects regardless
of their type, or with wide classes of object types (e.g. all
numerical types, or all sequence types).  When used on object types
for which they do not apply, they will raise a Python exception.

It is not possible to use these functions on objects that are not
properly initialized, such as a list object that has been created by
"PyList_New()", but whose items have not been set to some non-"NULL"
value yet.

* Object Protocol

* Call Protocol

  * The *tp_call* Protocol

  * The Vectorcall Protocol

    * Recursion Control

    * Vectorcall Support API

  * Object Calling API

  * Call Support API

* Number Protocol

* Sequence Protocol

* Mapping Protocol

* Iterator Protocol

* Buffer Protocol

  * Buffer structure

  * Buffer request types

    * request-independent fields

    * readonly, format

    * shape, strides, suboffsets

    * contiguity requests

    * compound requests

  * Complex arrays

    * NumPy-style: shape and strides

    * PIL-style: shape, strides and suboffsets

  * Buffer-related functions
