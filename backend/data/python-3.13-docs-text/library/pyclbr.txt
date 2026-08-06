"pyclbr" --- Python module browser support
******************************************

**Source code:** Lib/pyclbr.py

======================================================================

The "pyclbr" module provides limited information about the functions,
classes, and methods defined in a Python-coded module.  The
information is sufficient to implement a module browser.  The
information is extracted from the Python source code rather than by
importing the module, so this module is safe to use with untrusted
code. This restriction makes it impossible to use this module with
modules not implemented in Python, including all standard and optional
extension modules.

pyclbr.readmodule(module, path=None)

   Return a dictionary mapping module-level class names to class
   descriptors.  If possible, descriptors for imported base classes
   are included.  Parameter *module* is a string with the name of the
   module to read; it may be the name of a module within a package.
   If given, *path* is a sequence of directory paths prepended to
   "sys.path", which is used to locate the module source code.

   This function is the original interface and is only kept for back
   compatibility.  It returns a filtered version of the following.

pyclbr.readmodule_ex(module, path=None)

   Return a dictionary-based tree containing a function or class
   descriptors for each function and class defined in the module with
   a "def" or "class" statement.  The returned dictionary maps module-
   level function and class names to their descriptors.  Nested
   objects are entered into the children dictionary of their parent.
   As with readmodule, *module* names the module to be read and *path*
   is prepended to sys.path.  If the module being read is a package,
   the returned dictionary has a key "'__path__'" whose value is a
   list containing the package search path.

Added in version 3.7: Descriptors for nested definitions.  They are
accessed through the new children attribute.  Each has a new parent
attribute.

The descriptors returned by these functions are instances of Function
and Class classes.  Users are not expected to create instances of
these classes.


Function Objects
================

class pyclbr.Function

   Class "Function" instances describe functions defined by def
   statements.  They have the following attributes:

   file

      Name of the file in which the function is defined.

   module

      The name of the module defining the function described.

   name

      The name of the function.

   lineno

      The line number in the file where the definition starts.

   parent

      For top-level functions, "None".  For nested functions, the
      parent.

      Added in version 3.7.

   children

      A "dictionary" mapping names to descriptors for nested functions
      and classes.

      Added in version 3.7.

   is_async

      "True" for functions that are defined with the "async" prefix,
      "False" otherwise.

      Added in version 3.10.


Class Objects
=============

class pyclbr.Class

   Class "Class" instances describe classes defined by class
   statements.  They have the same attributes as "Functions" and two
   more.

   file

      Name of the file in which the class is defined.

   module

      The name of the module defining the class described.

   name

      The name of the class.

   lineno

      The line number in the file where the definition starts.

   parent

      For top-level classes, "None".  For nested classes, the parent.

      Added in version 3.7.

   children

      A dictionary mapping names to descriptors for nested functions
      and classes.

      Added in version 3.7.

   super

      A list of "Class" objects which describe the immediate base
      classes of the class being described.  Classes which are named
      as superclasses but which are not discoverable by
      "readmodule_ex()" are listed as a string with the class name
      instead of as "Class" objects.

   methods

      A "dictionary" mapping method names to line numbers. This can be
      derived from the newer "children" dictionary, but remains for
      back-compatibility.
