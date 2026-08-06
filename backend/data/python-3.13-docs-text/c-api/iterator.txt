Iterator Objects
****************

Python provides two general-purpose iterator objects.  The first, a
sequence iterator, works with an arbitrary sequence supporting the
"__getitem__()" method.  The second works with a callable object and a
sentinel value, calling the callable for each item in the sequence,
and ending the iteration when the sentinel value is returned.

PyTypeObject PySeqIter_Type
    * Part of the Stable ABI.*

   Type object for iterator objects returned by "PySeqIter_New()" and
   the one-argument form of the "iter()" built-in function for built-
   in sequence types.

int PySeqIter_Check(PyObject *op)

   Return true if the type of *op* is "PySeqIter_Type".  This function
   always succeeds.

PyObject *PySeqIter_New(PyObject *seq)
    *Return value: New reference.** Part of the Stable ABI.*

   Return an iterator that works with a general sequence object,
   *seq*.  The iteration ends when the sequence raises "IndexError"
   for the subscripting operation.

PyTypeObject PyCallIter_Type
    * Part of the Stable ABI.*

   Type object for iterator objects returned by "PyCallIter_New()" and
   the two-argument form of the "iter()" built-in function.

int PyCallIter_Check(PyObject *op)

   Return true if the type of *op* is "PyCallIter_Type".  This
   function always succeeds.

PyObject *PyCallIter_New(PyObject *callable, PyObject *sentinel)
    *Return value: New reference.** Part of the Stable ABI.*

   Return a new iterator.  The first parameter, *callable*, can be any
   Python callable object that can be called with no parameters; each
   call to it should return the next item in the iteration.  When
   *callable* returns a value equal to *sentinel*, the iteration will
   be terminated.


Range Objects
=============

PyTypeObject PyRange_Type
    * Part of the Stable ABI.*

   The type object for "range" objects.

int PyRange_Check(PyObject *o)

   Return true if the object *o* is an instance of a "range" object.
   This function always succeeds.


Builtin Iterator Types
======================

These are built-in iteration types that are included in Python's C
API, but provide no additional functions. They are here for
completeness.

+----------------------------------------------------+----------------------------------------------------+
| C type                                             | Python type                                        |
|====================================================|====================================================|
| PyTypeObject PyEnum_Type  * Part of the Stable     | "enumerate"                                        |
| ABI.*                                              |                                                    |
+----------------------------------------------------+----------------------------------------------------+
| PyTypeObject PyFilter_Type  * Part of the Stable   | "filter"                                           |
| ABI.*                                              |                                                    |
+----------------------------------------------------+----------------------------------------------------+
| PyTypeObject PyMap_Type  * Part of the Stable      | "map"                                              |
| ABI.*                                              |                                                    |
+----------------------------------------------------+----------------------------------------------------+
| PyTypeObject PyReversed_Type  * Part of the Stable | "reversed"                                         |
| ABI.*                                              |                                                    |
+----------------------------------------------------+----------------------------------------------------+
| PyTypeObject PyZip_Type  * Part of the Stable      | "zip"                                              |
| ABI.*                                              |                                                    |
+----------------------------------------------------+----------------------------------------------------+


Other Iterator Objects
======================

PyTypeObject PyByteArrayIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyBytesIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyListIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyListRevIter_Type
    * Part of the Stable ABI.*

PyTypeObject PySetIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyTupleIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyRangeIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyLongRangeIter_Type
    * Part of the Stable ABI.*

PyTypeObject PyDictIterKey_Type
    * Part of the Stable ABI.*

PyTypeObject PyDictRevIterKey_Type
    * Part of the Stable ABI since version 3.8.*

PyTypeObject PyDictIterValue_Type
    * Part of the Stable ABI.*

PyTypeObject PyDictRevIterValue_Type
    * Part of the Stable ABI since version 3.8.*

PyTypeObject PyDictIterItem_Type
    * Part of the Stable ABI.*

PyTypeObject PyDictRevIterItem_Type
    * Part of the Stable ABI since version 3.8.*

PyTypeObject PyODictIter_Type

   Type objects for iterators of various built-in objects.

   Do not create instances of these directly; prefer calling
   "PyObject_GetIter()" instead.

   Note that there is no guarantee that a given built-in type uses a
   given iterator type. For example, iterating over "range" will use
   one of two iterator types depending on the size of the range. Other
   types may start using a similar scheme in the future, without
   warning.
