Objects for Type Hinting
************************

Various built-in types for type hinting are provided.  Currently, two
types exist -- GenericAlias and Union.  Only "GenericAlias" is exposed
to C.

PyObject *Py_GenericAlias(PyObject *origin, PyObject *args)
    * Part of the Stable ABI since version 3.9.*

   Create a GenericAlias object. Equivalent to calling the Python
   class "types.GenericAlias".  The *origin* and *args* arguments set
   the "GenericAlias"'s "__origin__" and "__args__" attributes
   respectively. *origin* should be a PyTypeObject*, and *args* can be
   a PyTupleObject* or any "PyObject*".  If *args* passed is not a
   tuple, a 1-tuple is automatically constructed and "__args__" is set
   to "(args,)". Minimal checking is done for the arguments, so the
   function will succeed even if *origin* is not a type. The
   "GenericAlias"'s "__parameters__" attribute is constructed lazily
   from "__args__".  On failure, an exception is raised and "NULL" is
   returned.

   Here's an example of how to make an extension type generic:

      ...
      static PyMethodDef my_obj_methods[] = {
          // Other methods.
          ...
          {"__class_getitem__", Py_GenericAlias, METH_O|METH_CLASS, "my_obj is generic over its contained type"}
          ...
      }

   See also: The data model method "__class_getitem__()".

   Added in version 3.9.

PyTypeObject Py_GenericAliasType
    * Part of the Stable ABI since version 3.9.*

   The C type of the object returned by "Py_GenericAlias()".
   Equivalent to "types.GenericAlias" in Python.

   Added in version 3.9.
