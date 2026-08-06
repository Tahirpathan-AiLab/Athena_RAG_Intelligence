"tkinter.dnd" --- Drag and drop support
***************************************

**Source code:** Lib/tkinter/dnd.py

======================================================================

Note:

  This is experimental and due to be deprecated when it is replaced
  with the Tk DND.

The "tkinter.dnd" module provides drag-and-drop support for objects
within a single application, within the same window or between
windows. To enable an object to be dragged, you must create an event
binding for it that starts the drag-and-drop process. Typically, you
bind a ButtonPress event to a callback function that you write (see
Bindings and events). The function should call "dnd_start()", where
*source* is the object to be dragged, and *event* is the event that
invoked the call (the argument to your callback function).

Selection of a target object occurs as follows:

1. Top-down search of the area under the mouse for a target widget:

   * the target widget should have a callable *dnd_accept* attribute;

   * if *dnd_accept* is not present or returns "None", the search
     moves to the parent widget;

   * if no target widget is found, the target object is "None".

2. Call to "<old_target>.dnd_leave(source, event)".

3. Call to "<new_target>.dnd_enter(source, event)".

4. Call to "<target>.dnd_commit(source, event)" to notify of the drop.

5. Call to "<source>.dnd_end(target, event)" to signal the end of
   drag-and-drop.

class tkinter.dnd.DndHandler(source, event)

   The *DndHandler* class handles drag-and-drop events tracking Motion
   and ButtonRelease events on the root of the event widget.

   cancel(event=None)

      Cancel the drag-and-drop process.

   finish(event, commit=0)

      Execute end of drag-and-drop functions.

   on_motion(event)

      Inspect area below mouse for target objects while a drag is
      performed.

   on_release(event)

      Signal end of drag when the release pattern is triggered.

tkinter.dnd.dnd_start(source, event)

   Factory function for the drag-and-drop process. Return the
   "DndHandler" instance managing the drag, or "None" if a drag could
   not be started.

See also: Bindings and events
