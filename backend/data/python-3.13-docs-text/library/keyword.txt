"keyword" --- Testing for Python keywords
*****************************************

**Source code:** Lib/keyword.py

======================================================================

This module allows a Python program to determine if a string is a
keyword or soft keyword.

keyword.iskeyword(s)

   Return "True" if *s* is a Python keyword.

keyword.kwlist

   Sequence containing all the keywords defined for the interpreter.
   If any keywords are defined to only be active when particular
   "__future__" statements are in effect, these will be included as
   well.

keyword.issoftkeyword(s)

   Return "True" if *s* is a Python soft keyword.

   Added in version 3.9.

keyword.softkwlist

   Sequence containing all the soft keywords defined for the
   interpreter.  If any soft keywords are defined to only be active
   when particular "__future__" statements are in effect, these will
   be included as well.

   Added in version 3.9.
