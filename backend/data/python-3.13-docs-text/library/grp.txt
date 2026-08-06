"grp" --- The group database
****************************

======================================================================

This module provides access to the Unix group database. It is
available on all Unix versions.

Availability: Unix, not WASI, not Android, not iOS.

Group database entries are reported as a tuple-like object, whose
attributes correspond to the members of the "group" structure
(Attribute field below, see "<grp.h>"):

+---------+-------------+-----------------------------------+
| Index   | Attribute   | Meaning                           |
|=========|=============|===================================|
| 0       | gr_name     | the name of the group             |
+---------+-------------+-----------------------------------+
| 1       | gr_passwd   | the (encrypted) group password;   |
|         |             | often empty                       |
+---------+-------------+-----------------------------------+
| 2       | gr_gid      | the numerical group ID            |
+---------+-------------+-----------------------------------+
| 3       | gr_mem      | all the group member's  user      |
|         |             | names                             |
+---------+-------------+-----------------------------------+

The gid is an integer, name and password are strings, and the member
list is a list of strings. (Note that most users are not explicitly
listed as members of the group they are in according to the password
database.  Check both databases to get complete membership
information.  Also note that a "gr_name" that starts with a "+" or "-"
is likely to be a YP/NIS reference and may not be accessible via
"getgrnam()" or "getgrgid()".)

It defines the following items:

grp.getgrgid(id)

   Return the group database entry for the given numeric group ID.
   "KeyError" is raised if the entry asked for cannot be found.

   Changed in version 3.10: "TypeError" is raised for non-integer
   arguments like floats or strings.

grp.getgrnam(name)

   Return the group database entry for the given group name.
   "KeyError" is raised if the entry asked for cannot be found.

grp.getgrall()

   Return a list of all available group entries, in arbitrary order.

See also:

  Module "pwd"
     An interface to the user database, similar to this.
