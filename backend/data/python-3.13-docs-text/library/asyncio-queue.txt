Queues
******

**Source code:** Lib/asyncio/queues.py

======================================================================

asyncio queues are designed to be similar to classes of the "queue"
module.  Although asyncio queues are not thread-safe, they are
designed to be used specifically in async/await code.

Note that methods of asyncio queues don't have a *timeout* parameter;
use "asyncio.wait_for()" function to do queue operations with a
timeout.

See also the Examples section below.


Queue
=====

class asyncio.Queue(maxsize=0)

   A first in, first out (FIFO) queue.

   If *maxsize* is less than or equal to zero, the queue size is
   infinite.  If it is an integer greater than "0", then "await put()"
   blocks when the queue reaches *maxsize* until an item is removed by
   "get()".

   Unlike the standard library threading "queue", the size of the
   queue is always known and can be returned by calling the "qsize()"
   method.

   Changed in version 3.10: Removed the *loop* parameter.

   This class is not thread safe.

   maxsize

      Number of items allowed in the queue.

   empty()

      Return "True" if the queue is empty, "False" otherwise.

   full()

      Return "True" if there are "maxsize" items in the queue.

      If the queue was initialized with "maxsize=0" (the default),
      then "full()" never returns "True".

   async get()

      Remove and return an item from the queue. If queue is empty,
      wait until an item is available.

      Raises "QueueShutDown" if the queue has been shut down and is
      empty, or if the queue has been shut down immediately.

   get_nowait()

      Return an item if one is immediately available, else raise
      "QueueEmpty".

      Raises "QueueShutDown" if the queue has been shut down and is
      empty.

   async join()

      Block until all items in the queue have been received and
      processed.

      The count of unfinished tasks goes up whenever an item is added
      to the queue. The count goes down whenever a consumer coroutine
      calls "task_done()" to indicate that the item was retrieved and
      all work on it is complete.  When the count of unfinished tasks
      drops to zero, "join()" unblocks.

   async put(item)

      Put an item into the queue. If the queue is full, wait until a
      free slot is available before adding the item.

      Raises "QueueShutDown" if the queue has been shut down.

   put_nowait(item)

      Put an item into the queue without blocking.

      If no free slot is immediately available, raise "QueueFull".

      Raises "QueueShutDown" if the queue has been shut down.

   qsize()

      Return the number of items in the queue.

   shutdown(immediate=False)

      Put a "Queue" instance into a shutdown mode.

      The queue can no longer grow. Future calls to "put()" raise
      "QueueShutDown". Currently blocked callers of "put()" will be
      unblocked and will raise "QueueShutDown" in the formerly
      awaiting task.

      If *immediate* is false (the default), the queue can be wound
      down normally with "get()" calls to extract tasks that have
      already been loaded.

      And if "task_done()" is called for each remaining task, a
      pending "join()" will be unblocked normally.

      Once the queue is empty, future calls to "get()" will raise
      "QueueShutDown".

      If *immediate* is true, the queue is terminated immediately. The
      queue is drained to be completely empty and the count of
      unfinished tasks is reduced by the number of tasks drained. If
      unfinished tasks is zero, callers of "join()" are unblocked.
      Also, blocked callers of "get()" are unblocked and will raise
      "QueueShutDown" because the queue is empty.

      Use caution when using "join()" with *immediate* set to true.
      This unblocks the join even when no work has been done on the
      tasks, violating the usual invariant for joining a queue.

      Added in version 3.13.

   task_done()

      Indicate that a formerly enqueued work item is complete.

      Used by queue consumers. For each "get()" used to fetch a work
      item, a subsequent call to "task_done()" tells the queue that
      the processing on the work item is complete.

      If a "join()" is currently blocking, it will resume when all
      items have been processed (meaning that a "task_done()" call was
      received for every item that had been "put()" into the queue).

      Raises "ValueError" if called more times than there were items
      placed in the queue.


Priority Queue
==============

class asyncio.PriorityQueue

   A variant of "Queue"; retrieves entries in priority order (lowest
   first).

   Entries are typically tuples of the form "(priority_number, data)".


LIFO Queue
==========

class asyncio.LifoQueue

   A variant of "Queue" that retrieves most recently added entries
   first (last in, first out).


Exceptions
==========

exception asyncio.QueueEmpty

   This exception is raised when the "get_nowait()" method is called
   on an empty queue.

exception asyncio.QueueFull

   Exception raised when the "put_nowait()" method is called on a
   queue that has reached its *maxsize*.

exception asyncio.QueueShutDown

   Exception raised when "put()", "put_nowait()", "get()" or
   "get_nowait()" is called on a queue which has been shut down.

   Added in version 3.13.


Examples
========

Queues can be used to distribute workload between several concurrent
tasks:

   import asyncio
   import random
   import time


   async def worker(name, queue):
       while True:
           # Get a "work item" out of the queue.
           sleep_for = await queue.get()

           # Sleep for the "sleep_for" seconds.
           await asyncio.sleep(sleep_for)

           # Notify the queue that the "work item" has been processed.
           queue.task_done()

           print(f'{name} has slept for {sleep_for:.2f} seconds')


   async def main():
       # Create a queue that we will use to store our "workload".
       queue = asyncio.Queue()

       # Generate random timings and put them into the queue.
       total_sleep_time = 0
       for _ in range(20):
           sleep_for = random.uniform(0.05, 1.0)
           total_sleep_time += sleep_for
           queue.put_nowait(sleep_for)

       # Create three worker tasks to process the queue concurrently.
       tasks = []
       for i in range(3):
           task = asyncio.create_task(worker(f'worker-{i}', queue))
           tasks.append(task)

       # Wait until the queue is fully processed.
       started_at = time.monotonic()
       await queue.join()
       total_slept_for = time.monotonic() - started_at

       # Cancel our worker tasks.
       for task in tasks:
           task.cancel()
       # Wait until all worker tasks are cancelled.
       await asyncio.gather(*tasks, return_exceptions=True)

       print('====')
       print(f'3 workers slept in parallel for {total_slept_for:.2f} seconds')
       print(f'total expected sleep time: {total_sleep_time:.2f} seconds')


   asyncio.run(main())
