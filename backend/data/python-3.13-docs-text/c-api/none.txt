The "None" Object
*****************

Note that the "PyTypeObject" for "None" is not directly exposed in the
Python/C API.  Since "None" is a singleton, testing for object
identity (using "==" in C) is sufficient. There is no "PyNone_Check()"
function for the same reason.

PyObject *Py_None

   The Python "None" object, denoting lack of value.  This object has
   no methods and is *immortal*.

   Changed in version 3.12: "Py_None" is *immortal*.

Py_RETURN_NONE

   Return "Py_None" from a function.
