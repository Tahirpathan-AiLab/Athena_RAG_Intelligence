"queue" --- A synchronized queue class
**************************************

**Source code:** Lib/queue.py

======================================================================

The "queue" module implements multi-producer, multi-consumer queues.
It is especially useful in threaded programming when information must
be exchanged safely between multiple threads.  The "Queue" class in
this module implements all the required locking semantics.

The module implements three types of queue, which differ only in the
order in which the entries are retrieved.  In a FIFO (first-in, first-
out) queue, the first tasks added are the first retrieved.  In a LIFO
(last-in, first-out) queue, the most recently added entry is the first
retrieved (operating like a stack).  With a priority queue, the
entries are kept sorted (using the "heapq" module) and the lowest
valued entry is retrieved first.

Internally, those three types of queues use locks to temporarily block
competing threads; however, they are not designed to handle reentrancy
within a thread.

In addition, the module implements a "simple" FIFO (first-in, first-
out) queue type, "SimpleQueue", whose specific implementation provides
additional guarantees in exchange for the smaller functionality.

The "queue" module defines the following classes and exceptions:

class queue.Queue(maxsize=0)

   Constructor for a FIFO (first-in, first-out) queue.  *maxsize* is
   an integer that sets the upperbound limit on the number of items
   that can be placed in the queue.  Insertion will block once this
   size has been reached, until queue items are consumed.  If
   *maxsize* is less than or equal to zero, the queue size is
   infinite.

class queue.LifoQueue(maxsize=0)

   Constructor for a LIFO (last-in, first-out) queue.  *maxsize* is an
   integer that sets the upperbound limit on the number of items that
   can be placed in the queue.  Insertion will block once this size
   has been reached, until queue items are consumed.  If *maxsize* is
   less than or equal to zero, the queue size is infinite.

class queue.PriorityQueue(maxsize=0)

   Constructor for a priority queue.  *maxsize* is an integer that
   sets the upperbound limit on the number of items that can be placed
   in the queue.  Insertion will block once this size has been
   reached, until queue items are consumed.  If *maxsize* is less than
   or equal to zero, the queue size is infinite.

   The lowest valued entries are retrieved first (the lowest valued
   entry is the one that would be returned by "min(entries)").  A
   typical pattern for entries is a tuple in the form:
   "(priority_number, data)".

   If the *data* elements are not comparable, the data can be wrapped
   in a class that ignores the data item and only compares the
   priority number:

      from dataclasses import dataclass, field
      from typing import Any

      @dataclass(order=True)
      class PrioritizedItem:
          priority: int
          item: Any=field(compare=False)

class queue.SimpleQueue

   Constructor for an unbounded FIFO (first-in, first-out) queue.
   Simple queues lack advanced functionality such as task tracking.

   Simple queues are generic over the type of their items.

   Added in version 3.7.

exception queue.Empty

   Exception raised when non-blocking "get()" (or "get_nowait()") is
   called on a "Queue" object which is empty.

exception queue.Full

   Exception raised when non-blocking "put()" (or "put_nowait()") is
   called on a "Queue" object which is full.

exception queue.ShutDown

   Exception raised when "put()" or "get()" is called on a "Queue"
   object which has been shut down.

   Added in version 3.13.


Queue Objects
=============

Queue objects ("Queue", "LifoQueue", or "PriorityQueue") provide the
public methods described below.

Queue.qsize()

   Return the approximate size of the queue.  Note, qsize() > 0
   doesn't guarantee that a subsequent get() will not block, nor will
   qsize() < maxsize guarantee that put() will not block.

Queue.empty()

   Return "True" if the queue is empty, "False" otherwise.  If empty()
   returns "True" it doesn't guarantee that a subsequent call to put()
   will not block.  Similarly, if empty() returns "False" it doesn't
   guarantee that a subsequent call to get() will not block.

Queue.full()

   Return "True" if the queue is full, "False" otherwise.  If full()
   returns "True" it doesn't guarantee that a subsequent call to get()
   will not block.  Similarly, if full() returns "False" it doesn't
   guarantee that a subsequent call to put() will not block.

Queue.put(item, block=True, timeout=None)

   Put *item* into the queue.  If optional args *block* is true and
   *timeout* is "None" (the default), block if necessary until a free
   slot is available.  If *timeout* is a positive number, it blocks at
   most *timeout* seconds and raises the "Full" exception if no free
   slot was available within that time. Otherwise (*block* is false),
   put an item on the queue if a free slot is immediately available,
   else raise the "Full" exception (*timeout* is ignored in that
   case).

   Raises "ShutDown" if the queue has been shut down.

Queue.put_nowait(item)

   Equivalent to "put(item, block=False)".

Queue.get(block=True, timeout=None)

   Remove and return an item from the queue.  If optional args *block*
   is true and *timeout* is "None" (the default), block if necessary
   until an item is available. If *timeout* is a positive number, it
   blocks at most *timeout* seconds and raises the "Empty" exception
   if no item was available within that time. Otherwise (*block* is
   false), return an item if one is immediately available, else raise
   the "Empty" exception (*timeout* is ignored in that case).

   Prior to 3.0 on POSIX systems, and for all versions on Windows, if
   *block* is true and *timeout* is "None", this operation goes into
   an uninterruptible wait on an underlying lock.  This means that no
   exceptions can occur, and in particular a SIGINT will not trigger a
   "KeyboardInterrupt".

   Raises "ShutDown" if the queue has been shut down and is empty, or
   if the queue has been shut down immediately.

Queue.get_nowait()

   Equivalent to "get(False)".

Two methods are offered to support tracking whether enqueued tasks
have been fully processed by daemon consumer threads.

Queue.task_done()

   Indicate that a formerly enqueued task is complete.  Used by queue
   consumer threads.  For each "get()" used to fetch a task, a
   subsequent call to "task_done()" tells the queue that the
   processing on the task is complete.

   If a "join()" is currently blocking, it will resume when all items
   have been processed (meaning that a "task_done()" call was received
   for every item that had been "put()" into the queue).

   Raises a "ValueError" if called more times than there were items
   placed in the queue.

Queue.join()

   Blocks until all items in the queue have been gotten and processed.

   The count of unfinished tasks goes up whenever an item is added to
   the queue. The count goes down whenever a consumer thread calls
   "task_done()" to indicate that the item was retrieved and all work
   on it is complete.  When the count of unfinished tasks drops to
   zero, "join()" unblocks.


Waiting for task completion
---------------------------

Example of how to wait for enqueued tasks to be completed:

   import threading
   import queue

   q = queue.Queue()

   def worker():
       while True:
           item = q.get()
           print(f'Working on {item}')
           print(f'Finished {item}')
           q.task_done()

   # Turn-on the worker thread.
   threading.Thread(target=worker, daemon=True).start()

   # Send thirty task requests to the worker.
   for item in range(30):
       q.put(item)

   # Block until all tasks are done.
   q.join()
   print('All work completed')


Terminating queues
------------------

When no longer needed, "Queue" objects can be wound down until empty
or terminated immediately with a hard shutdown.

Queue.shutdown(immediate=False)

   Put a "Queue" instance into a shutdown mode.

   The queue can no longer grow. Future calls to "put()" raise
   "ShutDown". Currently blocked callers of "put()" will be unblocked
   and will raise "ShutDown" in the formerly blocked thread.

   If *immediate* is false (the default), the queue can be wound down
   normally with "get()" calls to extract tasks that have already been
   loaded.

   And if "task_done()" is called for each remaining task, a pending
   "join()" will be unblocked normally.

   Once the queue is empty, future calls to "get()" will raise
   "ShutDown".

   If *immediate* is true, the queue is terminated immediately. The
   queue is drained to be completely empty and the count of unfinished
   tasks is reduced by the number of tasks drained. If unfinished
   tasks is zero, callers of "join()" are unblocked.  Also, blocked
   callers of "get()" are unblocked and will raise "ShutDown" because
   the queue is empty.

   Use caution when using "join()" with *immediate* set to true. This
   unblocks the join even when no work has been done on the tasks,
   violating the usual invariant for joining a queue.

   Added in version 3.13.


SimpleQueue Objects
===================

"SimpleQueue" objects provide the public methods described below.

SimpleQueue.qsize()

   Return the approximate size of the queue.  Note, qsize() > 0
   doesn't guarantee that a subsequent get() will not block.

SimpleQueue.empty()

   Return "True" if the queue is empty, "False" otherwise.  If empty()
   returns "False" it doesn't guarantee that a subsequent call to
   get() will not block.

SimpleQueue.put(item, block=True, timeout=None)

   Put *item* into the queue.  The method never blocks and always
   succeeds (except for potential low-level errors such as failure to
   allocate memory). The optional args *block* and *timeout* are
   ignored and only provided for compatibility with "Queue.put()".

   **CPython implementation detail:** This method has a C
   implementation which is reentrant.  That is, a "put()" or "get()"
   call can be interrupted by another "put()" call in the same thread
   without deadlocking or corrupting internal state inside the queue.
   This makes it appropriate for use in destructors such as "__del__"
   methods or "weakref" callbacks.

SimpleQueue.put_nowait(item)

   Equivalent to "put(item, block=False)", provided for compatibility
   with "Queue.put_nowait()".

SimpleQueue.get(block=True, timeout=None)

   Remove and return an item from the queue.  If optional args *block*
   is true and *timeout* is "None" (the default), block if necessary
   until an item is available. If *timeout* is a positive number, it
   blocks at most *timeout* seconds and raises the "Empty" exception
   if no item was available within that time. Otherwise (*block* is
   false), return an item if one is immediately available, else raise
   the "Empty" exception (*timeout* is ignored in that case).

SimpleQueue.get_nowait()

   Equivalent to "get(False)".

See also:

  Class "multiprocessing.Queue"
     A queue class for use in a multi-processing (rather than multi-
     threading) context.

  "collections.deque" is an alternative implementation of unbounded
  queues with fast atomic "append()" and "popleft()" operations that
  do not require locking and also support indexing.
