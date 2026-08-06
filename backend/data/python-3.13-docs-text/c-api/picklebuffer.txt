Pickle buffer objects
*********************

Added in version 3.8.

A "pickle.PickleBuffer" object wraps a buffer-providing object for
out-of-band data transfer with the "pickle" module.

PyTypeObject PyPickleBuffer_Type

   This instance of "PyTypeObject" represents the Python pickle buffer
   type. This is the same object as "pickle.PickleBuffer" in the
   Python layer.

int PyPickleBuffer_Check(PyObject *op)

   Return true if *op* is a pickle buffer instance. This function
   always succeeds.

PyObject *PyPickleBuffer_FromObject(PyObject *obj)

   Create a pickle buffer from the object *obj*.

   This function will fail if *obj* doesn't support the buffer
   protocol.

   On success, return a new pickle buffer instance. On failure, set an
   exception and return "NULL".

   Analogous to calling "pickle.PickleBuffer" with *obj* in Python.

const Py_buffer *PyPickleBuffer_GetBuffer(PyObject *picklebuf)

   Get a pointer to the underlying "Py_buffer" that the pickle buffer
   wraps.

   The returned pointer is valid as long as *picklebuf* is alive and
   has not been released. The caller must not modify or free the
   returned "Py_buffer". If the pickle buffer has been released, raise
   "ValueError".

   On success, return a pointer to the buffer view. On failure, set an
   exception and return "NULL".

int PyPickleBuffer_Release(PyObject *picklebuf)

   Release the underlying buffer held by the pickle buffer.

   Return "0" on success. On failure, set an exception and return
   "-1".

   Analogous to calling "pickle.PickleBuffer.release()" in Python.
