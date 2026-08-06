Boolean Objects
***************

Booleans in Python are implemented as a subclass of integers.  There
are only two booleans, "Py_False" and "Py_True".  As such, the normal
creation and deletion functions don't apply to booleans.  The
following macros are available, however.

PyTypeObject PyBool_Type
    * Part of the Stable ABI.*

   This instance of "PyTypeObject" represents the Python boolean type;
   it is the same object as "bool" in the Python layer.

int PyBool_Check(PyObject *o)

   Return true if *o* is of type "PyBool_Type".  This function always
   succeeds.

PyObject *Py_False

   The Python "False" object.  This object has no methods and is
   *immortal*.

   Changed in version 3.12: "Py_False" is *immortal*.

PyObject *Py_True

   The Python "True" object.  This object has no methods and is
   *immortal*.

   Changed in version 3.12: "Py_True" is *immortal*.

Py_RETURN_FALSE

   Return "Py_False" from a function.

Py_RETURN_TRUE

   Return "Py_True" from a function.

PyObject *PyBool_FromLong(long v)
    *Return value: New reference.** Part of the Stable ABI.*

   Return "Py_True" or "Py_False", depending on the truth value of
   *v*.
