Extending
*********

The main direction for "asyncio" extending is writing custom *event
loop* classes. Asyncio has helpers that could be used to simplify this
task.

Note:

  Third-parties should reuse existing asyncio code with caution, a new
  Python version is free to break backward compatibility in *internal*
  part of API.


Writing a Custom Event Loop
===========================

"asyncio.AbstractEventLoop" declares very many methods.  Implementing
all them from scratch is a tedious job.

A loop can get many common methods implementation for free by
inheriting from "asyncio.BaseEventLoop".

In turn, the successor should implement a bunch of *private* methods
declared but not implemented in "asyncio.BaseEventLoop".

For example, "loop.create_connection()" checks arguments, resolves DNS
addresses, and calls "loop._make_socket_transport()" that should be
implemented by inherited class. The "_make_socket_transport()" method
is not documented and is considered as an *internal* API.


Future and Task private constructors
====================================

"asyncio.Future" and "asyncio.Task" should be never created directly,
please use corresponding "loop.create_future()" and
"loop.create_task()", or "asyncio.create_task()" factories instead.

However, third-party *event loops* may *reuse* built-in future and
task implementations for the sake of getting a complex and highly
optimized code for free.

For this purpose the following, *private* constructors are listed:

Future.__init__(*, loop=None)

   Create a built-in future instance.

   *loop* is an optional event loop instance.

Task.__init__(coro, *, loop=None, name=None, context=None)

   Create a built-in task instance.

   *loop* is an optional event loop instance. The rest of arguments
   are described in "loop.create_task()" description.

   Changed in version 3.11: *context* argument is added.


Task lifetime support
=====================

A third party task implementation should call the following functions
to keep a task visible by "asyncio.all_tasks()" and
"asyncio.current_task()":

asyncio._register_task(task)

   Register a new *task* as managed by *asyncio*.

   Call the function from a task constructor.

asyncio._unregister_task(task)

   Unregister a *task* from *asyncio* internal structures.

   The function should be called when a task is about to finish.

asyncio._enter_task(loop, task)

   Switch the current task to the *task* argument.

   Call the function just before executing a portion of embedded
   *coroutine* ("coroutine.send()" or "coroutine.throw()").

asyncio._leave_task(loop, task)

   Switch the current task back from *task* to "None".

   Call the function just after "coroutine.send()" or
   "coroutine.throw()" execution.
