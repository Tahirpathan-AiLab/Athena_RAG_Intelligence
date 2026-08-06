"syslog" --- Unix syslog library routines
*****************************************

======================================================================

This module provides an interface to the Unix "syslog" library
routines. Refer to the Unix manual pages for a detailed description of
the "syslog" facility.

Availability: Unix, not WASI, not iOS.

This module wraps the system "syslog" family of routines.  A pure
Python library that can speak to a syslog server is available in the
"logging.handlers" module as "SysLogHandler".

The module defines the following functions:

syslog.syslog(message)
syslog.syslog(priority, message)

   Send the string *message* to the system logger.  A trailing newline
   is added if necessary.  Each message is tagged with a priority
   composed of a *facility* and a *level*.  The optional *priority*
   argument, which defaults to "LOG_INFO", determines the message
   priority.  If the facility is not encoded in *priority* using
   logical-or ("LOG_INFO | LOG_USER"), the value given in the
   "openlog()" call is used.

   If "openlog()" has not been called prior to the call to "syslog()",
   "openlog()" will be called with no arguments.

   Raises an auditing event "syslog.syslog" with arguments "priority",
   "message".

   Changed in version 3.2: In previous versions, "openlog()" would not
   be called automatically if it wasn't called prior to the call to
   "syslog()", deferring to the syslog implementation to call
   "openlog()".

   Changed in version 3.12: This function is restricted in
   subinterpreters. (Only code that runs in multiple interpreters is
   affected and the restriction is not relevant for most users.)
   "openlog()" must be called in the main interpreter before
   "syslog()" may be used in a subinterpreter.  Otherwise it will
   raise "RuntimeError".

syslog.openlog([ident[, logoption[, facility]]])

   Logging options of subsequent "syslog()" calls can be set by
   calling "openlog()".  "syslog()" will call "openlog()" with no
   arguments if the log is not currently open.

   The optional *ident* keyword argument is a string which is
   prepended to every message, and defaults to "sys.argv[0]" with
   leading path components stripped.  The optional *logoption* keyword
   argument (default is 0) is a bit field -- see below for possible
   values to combine.  The optional *facility* keyword argument
   (default is "LOG_USER") sets the default facility for messages
   which do not have a facility explicitly encoded.

   Raises an auditing event "syslog.openlog" with arguments "ident",
   "logoption", "facility".

   Changed in version 3.2: In previous versions, keyword arguments
   were not allowed, and *ident* was required.

   Changed in version 3.12: This function is restricted in
   subinterpreters. (Only code that runs in multiple interpreters is
   affected and the restriction is not relevant for most users.) This
   may only be called in the main interpreter. It will raise
   "RuntimeError" if called in a subinterpreter.

syslog.closelog()

   Reset the syslog module values and call the system library
   "closelog()".

   This causes the module to behave as it does when initially
   imported.  For example, "openlog()" will be called on the first
   "syslog()" call (if "openlog()" hasn't already been called), and
   *ident* and other "openlog()" parameters are reset to defaults.

   Raises an auditing event "syslog.closelog" with no arguments.

   Changed in version 3.12: This function is restricted in
   subinterpreters. (Only code that runs in multiple interpreters is
   affected and the restriction is not relevant for most users.) This
   may only be called in the main interpreter. It will raise
   "RuntimeError" if called in a subinterpreter.

syslog.setlogmask(maskpri)

   Set the priority mask to *maskpri* and return the previous mask
   value.  Calls to "syslog()" with a priority level not set in
   *maskpri* are ignored. The default is to log all priorities.  The
   function "LOG_MASK(pri)" calculates the mask for the individual
   priority *pri*.  The function "LOG_UPTO(pri)" calculates the mask
   for all priorities up to and including *pri*.

   Raises an auditing event "syslog.setlogmask" with argument
   "maskpri".

The module defines the following constants:

syslog.LOG_EMERG
syslog.LOG_ALERT
syslog.LOG_CRIT
syslog.LOG_ERR
syslog.LOG_WARNING
syslog.LOG_NOTICE
syslog.LOG_INFO
syslog.LOG_DEBUG

   Priority levels (high to low).

syslog.LOG_AUTH
syslog.LOG_AUTHPRIV
syslog.LOG_CRON
syslog.LOG_DAEMON
syslog.LOG_FTP
syslog.LOG_INSTALL
syslog.LOG_KERN
syslog.LOG_LAUNCHD
syslog.LOG_LPR
syslog.LOG_MAIL
syslog.LOG_NETINFO
syslog.LOG_NEWS
syslog.LOG_RAS
syslog.LOG_REMOTEAUTH
syslog.LOG_SYSLOG
syslog.LOG_USER
syslog.LOG_UUCP
syslog.LOG_LOCAL0
syslog.LOG_LOCAL1
syslog.LOG_LOCAL2
syslog.LOG_LOCAL3
syslog.LOG_LOCAL4
syslog.LOG_LOCAL5
syslog.LOG_LOCAL6
syslog.LOG_LOCAL7

   Facilities, depending on availability in "<syslog.h>" for
   "LOG_AUTHPRIV", "LOG_FTP", "LOG_NETINFO", "LOG_REMOTEAUTH",
   "LOG_INSTALL" and "LOG_RAS".

   Changed in version 3.13: Added "LOG_FTP", "LOG_NETINFO",
   "LOG_REMOTEAUTH", "LOG_INSTALL", "LOG_RAS", and "LOG_LAUNCHD".

syslog.LOG_PID
syslog.LOG_CONS
syslog.LOG_NDELAY
syslog.LOG_ODELAY
syslog.LOG_NOWAIT
syslog.LOG_PERROR

   Log options, depending on availability in "<syslog.h>" for
   "LOG_ODELAY", "LOG_NOWAIT" and "LOG_PERROR".


Examples
========


Simple example
--------------

A simple set of examples:

   import syslog

   syslog.syslog('Processing started')
   if error:
       syslog.syslog(syslog.LOG_ERR, 'Processing started')

An example of setting some log options, these would include the
process ID in logged messages, and write the messages to the
destination facility used for mail logging:

   syslog.openlog(logoption=syslog.LOG_PID, facility=syslog.LOG_MAIL)
   syslog.syslog('E-mail processing initiated...')
