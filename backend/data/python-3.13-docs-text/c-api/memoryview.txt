MemoryView objects
******************

A "memoryview" object exposes the C level buffer interface as a Python
object which can then be passed around like any other object.

PyTypeObject PyMemoryView_Type
    * Part of the Stable ABI.*

   This instance of "PyTypeObject" represents the Python memoryview
   type. This is the same object as "memoryview" in the Python layer.

PyObject *PyMemoryView_FromObject(PyObject *obj)
    *Return value: New reference.** Part of the Stable ABI.*

   Create a memoryview object from an object that provides the buffer
   interface. If *obj* supports writable buffer exports, the
   memoryview object will be read/write, otherwise it may be either
   read-only or read/write at the discretion of the exporter.

PyBUF_READ
    * Part of the Stable ABI since version 3.11.*

   Flag to request a readonly buffer.

PyBUF_WRITE
    * Part of the Stable ABI since version 3.11.*

   Flag to request a writable buffer.

PyObject *PyMemoryView_FromMemory(char *mem, Py_ssize_t size, int flags)
    *Return value: New reference.** Part of the Stable ABI since
   version 3.7.*

   Create a memoryview object using *mem* as the underlying buffer.
   *flags* can be one of "PyBUF_READ" or "PyBUF_WRITE".

   Added in version 3.3.

PyObject *PyMemoryView_FromBuffer(const Py_buffer *view)
    *Return value: New reference.** Part of the Stable ABI since
   version 3.11.*

   Create a memoryview object wrapping the given buffer structure
   *view*. For simple byte buffers, "PyMemoryView_FromMemory()" is the
   preferred function.

PyObject *PyMemoryView_GetContiguous(PyObject *obj, int buffertype, char order)
    *Return value: New reference.** Part of the Stable ABI.*

   Create a memoryview object to a *contiguous* chunk of memory (in
   either 'C' or 'F'ortran *order*) from an object that defines the
   buffer interface. If memory is contiguous, the memoryview object
   points to the original memory. Otherwise, a copy is made and the
   memoryview points to a new bytes object.

   *buffertype* can be one of "PyBUF_READ" or "PyBUF_WRITE".

int PyMemoryView_Check(PyObject *obj)

   Return true if the object *obj* is a memoryview object.  It is not
   currently allowed to create subclasses of "memoryview".  This
   function always succeeds.

Py_buffer *PyMemoryView_GET_BUFFER(PyObject *mview)

   Return a pointer to the memoryview's private copy of the exporter's
   buffer. *mview* **must** be a memoryview instance; this macro
   doesn't check its type, you must do it yourself or you will risk
   crashes.

PyObject *PyMemoryView_GET_BASE(PyObject *mview)

   Return either a pointer to the exporting object that the memoryview
   is based on or "NULL" if the memoryview has been created by one of
   the functions "PyMemoryView_FromMemory()" or
   "PyMemoryView_FromBuffer()". *mview* **must** be a memoryview
   instance.
