"tkinter.colorchooser" --- Color choosing dialog
************************************************

**Source code:** Lib/tkinter/colorchooser.py

======================================================================

The "tkinter.colorchooser" module provides the "Chooser" class as an
interface to the native color picker dialog. "Chooser" implements a
modal color choosing dialog window. The "Chooser" class inherits from
the "Dialog" class.

class tkinter.colorchooser.Chooser(master=None, **options)

   The class implementing the modal color-choosing dialog. Most
   applications use the "askcolor()" convenience function rather than
   instantiating this class directly.

tkinter.colorchooser.askcolor(color=None, **options)

   Show a modal color-choosing dialog and return the chosen color.
   *color* is the color selected when the dialog opens. The return
   value is a tuple "((r, g, b), hexstr)", where "r", "g" and "b" are
   the red, green and blue components as integers in the range 0–255
   and *hexstr* is the equivalent Tk color string, such as
   "'#ff8000'". If the user cancels the dialog, "(None, None)" is
   returned.

   Changed in version 3.10: The RGB values in the returned color are
   now integers in the range 0–255 instead of floats.

See also:

  Module "tkinter.commondialog"
     Tkinter standard dialog module
