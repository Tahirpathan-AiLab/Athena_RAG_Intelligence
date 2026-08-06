Porting Extension Modules to Python 3
*************************************

We recommend the following resources for porting extension modules to
Python 3:

* The Migrating C extensions chapter from *Supporting Python 3: An in-
  depth guide*, a book on moving from Python 2 to Python 3 in general,
  guides the reader through porting an extension module.

* The Porting guide from the *py3c* project provides opinionated
  suggestions with supporting code.

* Recommended third party tools offer abstractions over the Python's C
  API. Extensions generally need to be re-written to use one of them,
  but the library then handles differences between various Python
  versions and implementations.
