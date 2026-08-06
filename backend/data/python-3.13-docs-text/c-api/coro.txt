Coroutine Objects
*****************

Added in version 3.5.

Coroutine objects are what functions declared with an "async" keyword
return.

type PyCoroObject

   The C structure used for coroutine objects.

PyTypeObject PyCoro_Type

   The type object corresponding to coroutine objects.

int PyCoro_CheckExact(PyObject *ob)

   Return true if *ob*'s type is "PyCoro_Type"; *ob* must not be
   "NULL". This function always succeeds.

PyObject *PyCoro_New(PyFrameObject *frame, PyObject *name, PyObject *qualname)
    *Return value: New reference.*

   Create and return a new coroutine object based on the *frame*
   object, with "__name__" and "__qualname__" set to *name* and
   *qualname*. A reference to *frame* is stolen by this function.  The
   *frame* argument must not be "NULL".
