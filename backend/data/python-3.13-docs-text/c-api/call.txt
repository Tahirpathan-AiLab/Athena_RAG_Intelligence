Call Protocol
*************

CPython supports two different calling protocols: *tp_call* and
vectorcall.


The *tp_call* Protocol
======================

Instances of classes that set "tp_call" are callable. The signature of
the slot is:

   PyObject *tp_call(PyObject *callable, PyObject *args, PyObject *kwargs);

A call is made using a tuple for the positional arguments and a dict
for the keyword arguments, similarly to "callable(*args, **kwargs)" in
Python code. *args* must be non-NULL (use an empty tuple if there are
no arguments) but *kwargs* may be *NULL* if there are no keyword
arguments.

This convention is not only used by *tp_call*: "tp_new" and "tp_init"
also pass arguments this way.

To call an object, use "PyObject_Call()" or another call API.


The Vectorcall Protocol
=======================

Added in version 3.9.

The vectorcall protocol was introduced in **PEP 590** as an additional
protocol for making calls more efficient.

As rule of thumb, CPython will prefer the vectorcall for internal
calls if the callable supports it. However, this is not a hard rule.
Additionally, some third-party extensions use *tp_call* directly
(rather than using "PyObject_Call()"). Therefore, a class supporting
vectorcall must also implement "tp_call". Moreover, the callable must
behave the same regardless of which protocol is used. The recommended
way to achieve this is by setting "tp_call" to "PyVectorcall_Call()".
This bears repeating:

Warning:

  A class supporting vectorcall **must** also implement "tp_call" with
  the same semantics.

Changed in version 3.12: The "Py_TPFLAGS_HAVE_VECTORCALL" flag is now
removed from a class when the class's "__call__()" method is
reassigned. (This internally sets "tp_call" only, and thus may make it
behave differently than the vectorcall function.) In earlier Python
versions, vectorcall should only be used with "immutable" or static
types.

A class should not implement vectorcall if that would be slower than
*tp_call*. For example, if the callee needs to convert the arguments
to an args tuple and kwargs dict anyway, then there is no point in
implementing vectorcall.

Classes can implement the vectorcall protocol by enabling the
"Py_TPFLAGS_HAVE_VECTORCALL" flag and setting "tp_vectorcall_offset"
to the offset inside the object structure where a *vectorcallfunc*
appears. This is a pointer to a function with the following signature:

typedef PyObject *(*vectorcallfunc)(PyObject *callable, PyObject *const *args, size_t nargsf, PyObject *kwnames)
    * Part of the Stable ABI since version 3.12.*

* *callable* is the object being called.

* *args* is a C array consisting of the positional arguments followed
  by the
     values of the keyword arguments. This can be *NULL* if there are
     no arguments.

* *nargsf* is the number of positional arguments plus possibly the
     "PY_VECTORCALL_ARGUMENTS_OFFSET" flag. To get the actual number
     of positional arguments from *nargsf*, use
     "PyVectorcall_NARGS()".

* *kwnames* is a tuple containing the names of the keyword arguments;
     in other words, the keys of the kwargs dict. These names must be
     strings (instances of "str" or a subclass) and they must be
     unique. If there are no keyword arguments, then *kwnames* can
     instead be *NULL*.

PY_VECTORCALL_ARGUMENTS_OFFSET
    * Part of the Stable ABI since version 3.12.*

   If this flag is set in a vectorcall *nargsf* argument, the callee
   is allowed to temporarily change "args[-1]". In other words, *args*
   points to argument 1 (not 0) in the allocated vector. The callee
   must restore the value of "args[-1]" before returning.

   For "PyObject_VectorcallMethod()", this flag means instead that
   "args[0]" may be changed.

   Whenever they can do so cheaply (without additional allocation),
   callers are encouraged to use "PY_VECTORCALL_ARGUMENTS_OFFSET".
   Doing so will allow callables such as bound methods to make their
   onward calls (which include a prepended *self* argument) very
   efficiently.

   Added in version 3.8.

To call an object that implements vectorcall, use a call API function
as with any other callable. "PyObject_Vectorcall()" will usually be
most efficient.


Recursion Control
-----------------

When using *tp_call*, callees do not need to worry about recursion:
CPython uses "Py_EnterRecursiveCall()" and "Py_LeaveRecursiveCall()"
for calls made using *tp_call*.

For efficiency, this is not the case for calls done using vectorcall:
the callee should use *Py_EnterRecursiveCall* and
*Py_LeaveRecursiveCall* if needed.


Vectorcall Support API
----------------------

Py_ssize_t PyVectorcall_NARGS(size_t nargsf)
    * Part of the Stable ABI since version 3.12.*

   Given a vectorcall *nargsf* argument, return the actual number of
   arguments. Currently equivalent to:

      (Py_ssize_t)(nargsf & ~PY_VECTORCALL_ARGUMENTS_OFFSET)

   However, the function "PyVectorcall_NARGS" should be used to allow
   for future extensions.

   Added in version 3.8.

vectorcallfunc PyVectorcall_Function(PyObject *op)

   If *op* does not support the vectorcall protocol (either because
   the type does not or because the specific instance does not),
   return *NULL*. Otherwise, return the vectorcall function pointer
   stored in *op*. This function never raises an exception.

   This is mostly useful to check whether or not *op* supports
   vectorcall, which can be done by checking
   "PyVectorcall_Function(op) != NULL".

   Added in version 3.9.

PyObject *PyVectorcall_Call(PyObject *callable, PyObject *tuple, PyObject *dict)
    * Part of the Stable ABI since version 3.12.*

   Call *callable*'s "vectorcallfunc" with positional and keyword
   arguments given in a tuple and dict, respectively.

   This is a specialized function, intended to be put in the "tp_call"
   slot or be used in an implementation of "tp_call". It does not
   check the "Py_TPFLAGS_HAVE_VECTORCALL" flag and it does not fall
   back to "tp_call".

   Added in version 3.8.


Object Calling API
==================

Various functions are available for calling a Python object. Each
converts its arguments to a convention supported by the called object
– either *tp_call* or vectorcall. In order to do as little conversion
as possible, pick one that best fits the format of data you have
available.

The following table summarizes the available functions; please see
individual documentation for details.

+--------------------------------------------+--------------------+----------------------+-----------------+
| Function                                   | callable           | args                 | kwargs          |
|============================================|====================|======================|=================|
| "PyObject_Call()"                          | "PyObject *"       | tuple                | dict/"NULL"     |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallNoArgs()"                    | "PyObject *"       | ---                  | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallOneArg()"                    | "PyObject *"       | 1 object             | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallObject()"                    | "PyObject *"       | tuple/"NULL"         | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallFunction()"                  | "PyObject *"       | format               | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallMethod()"                    | obj + "char*"      | format               | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallFunctionObjArgs()"           | "PyObject *"       | variadic             | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallMethodObjArgs()"             | obj + name         | variadic             | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallMethodNoArgs()"              | obj + name         | ---                  | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_CallMethodOneArg()"              | obj + name         | 1 object             | ---             |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_Vectorcall()"                    | "PyObject *"       | vectorcall           | vectorcall      |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_VectorcallDict()"                | "PyObject *"       | vectorcall           | dict/"NULL"     |
+--------------------------------------------+--------------------+----------------------+-----------------+
| "PyObject_VectorcallMethod()"              | arg + name         | vectorcall           | vectorcall      |
+--------------------------------------------+--------------------+----------------------+-----------------+

PyObject *PyObject_Call(PyObject *callable, PyObject *args, PyObject *kwargs)
    *Return value: New reference.** Part of the Stable ABI.*

   Call a callable Python object *callable*, with arguments given by
   the tuple *args*, and named arguments given by the dictionary
   *kwargs*.

   *args* must not be *NULL*; use an empty tuple if no arguments are
   needed. If no named arguments are needed, *kwargs* can be *NULL*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   This is the equivalent of the Python expression: "callable(*args,
   **kwargs)".

PyObject *PyObject_CallNoArgs(PyObject *callable)
    *Return value: New reference.** Part of the Stable ABI since
   version 3.10.*

   Call a callable Python object *callable* without any arguments. It
   is the most efficient way to call a callable Python object without
   any argument.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.9.

PyObject *PyObject_CallOneArg(PyObject *callable, PyObject *arg)
    *Return value: New reference.*

   Call a callable Python object *callable* with exactly 1 positional
   argument *arg* and no keyword arguments.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.9.

PyObject *PyObject_CallObject(PyObject *callable, PyObject *args)
    *Return value: New reference.** Part of the Stable ABI.*

   Call a callable Python object *callable*, with arguments given by
   the tuple *args*.  If no arguments are needed, then *args* can be
   *NULL*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   This is the equivalent of the Python expression: "callable(*args)".

PyObject *PyObject_CallFunction(PyObject *callable, const char *format, ...)
    *Return value: New reference.** Part of the Stable ABI.*

   Call a callable Python object *callable*, with a variable number of
   C arguments. The C arguments are described using a
   "Py_BuildValue()" style format string.  The format can be *NULL*,
   indicating that no arguments are provided.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   This is the equivalent of the Python expression: "callable(*args)".

   Note that if you only pass PyObject* args,
   "PyObject_CallFunctionObjArgs()" is a faster alternative.

   Changed in version 3.4: The type of *format* was changed from "char
   *".

PyObject *PyObject_CallMethod(PyObject *obj, const char *name, const char *format, ...)
    *Return value: New reference.** Part of the Stable ABI.*

   Call the method named *name* of object *obj* with a variable number
   of C arguments.  The C arguments are described by a
   "Py_BuildValue()" format string that should produce a tuple.

   The format can be *NULL*, indicating that no arguments are
   provided.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   This is the equivalent of the Python expression: "obj.name(arg1,
   arg2, ...)".

   Note that if you only pass PyObject* args,
   "PyObject_CallMethodObjArgs()" is a faster alternative.

   Changed in version 3.4: The types of *name* and *format* were
   changed from "char *".

PyObject *PyObject_CallFunctionObjArgs(PyObject *callable, ...)
    *Return value: New reference.** Part of the Stable ABI.*

   Call a callable Python object *callable*, with a variable number of
   PyObject* arguments.  The arguments are provided as a variable
   number of parameters followed by *NULL*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   This is the equivalent of the Python expression: "callable(arg1,
   arg2, ...)".

PyObject *PyObject_CallMethodObjArgs(PyObject *obj, PyObject *name, ...)
    *Return value: New reference.** Part of the Stable ABI.*

   Call a method of the Python object *obj*, where the name of the
   method is given as a Python string object in *name*.  It is called
   with a variable number of PyObject* arguments.  The arguments are
   provided as a variable number of parameters followed by *NULL*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

PyObject *PyObject_CallMethodNoArgs(PyObject *obj, PyObject *name)

   Call a method of the Python object *obj* without arguments, where
   the name of the method is given as a Python string object in
   *name*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.9.

PyObject *PyObject_CallMethodOneArg(PyObject *obj, PyObject *name, PyObject *arg)

   Call a method of the Python object *obj* with a single positional
   argument *arg*, where the name of the method is given as a Python
   string object in *name*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.9.

PyObject *PyObject_Vectorcall(PyObject *callable, PyObject *const *args, size_t nargsf, PyObject *kwnames)
    * Part of the Stable ABI since version 3.12.*

   Call a callable Python object *callable*. The arguments are the
   same as for "vectorcallfunc". If *callable* supports vectorcall,
   this directly calls the vectorcall function stored in *callable*.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.8: as "_PyObject_Vectorcall"

   Changed in version 3.9: Renamed to the current name, without the
   leading underscore. The old provisional name is *soft deprecated*.

PyObject *PyObject_VectorcallDict(PyObject *callable, PyObject *const *args, size_t nargsf, PyObject *kwdict)

   Call *callable* with positional arguments passed exactly as in the
   vectorcall protocol, but with keyword arguments passed as a
   dictionary *kwdict*. The *args* array contains only the positional
   arguments.

   Regardless of which protocol is used internally, a conversion of
   arguments needs to be done. Therefore, this function should only be
   used if the caller already has a dictionary ready to use for the
   keyword arguments, but not a tuple for the positional arguments.

   Added in version 3.9.

PyObject *PyObject_VectorcallMethod(PyObject *name, PyObject *const *args, size_t nargsf, PyObject *kwnames)
    * Part of the Stable ABI since version 3.12.*

   Call a method using the vectorcall calling convention. The name of
   the method is given as a Python string *name*. The object whose
   method is called is *args[0]*, and the *args* array starting at
   *args[1]* represents the arguments of the call. There must be at
   least one positional argument. *nargsf* is the number of positional
   arguments including *args[0]*, plus
   "PY_VECTORCALL_ARGUMENTS_OFFSET" if the value of "args[0]" may
   temporarily be changed. Keyword arguments can be passed just like
   in "PyObject_Vectorcall()".

   If the object has the "Py_TPFLAGS_METHOD_DESCRIPTOR" feature, this
   will call the unbound method object with the full *args* vector as
   arguments.

   Return the result of the call on success, or raise an exception and
   return *NULL* on failure.

   Added in version 3.9.


Call Support API
================

int PyCallable_Check(PyObject *o)
    * Part of the Stable ABI.*

   Determine if the object *o* is callable.  Return "1" if the object
   is callable and "0" otherwise.  This function always succeeds.
