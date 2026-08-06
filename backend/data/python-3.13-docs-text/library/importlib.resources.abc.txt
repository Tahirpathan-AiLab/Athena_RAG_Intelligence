"importlib.resources.abc" -- Abstract base classes for resources
****************************************************************

**Source code:** Lib/importlib/resources/abc.py

======================================================================

Added in version 3.11.

class importlib.resources.abc.ResourceReader

   *Superseded by TraversableResources*

   An *abstract base class* to provide the ability to read
   *resources*.

   From the perspective of this ABC, a *resource* is a binary artifact
   that is shipped within a package. Typically this is something like
   a data file that lives next to the "__init__.py" file of the
   package. The purpose of this class is to help abstract out the
   accessing of such data files so that it does not matter if the
   package and its data file(s) are stored e.g. in a zip file versus
   on the file system.

   For any of methods of this class, a *resource* argument is expected
   to be a *path-like object* which represents conceptually just a
   file name. This means that no subdirectory paths should be included
   in the *resource* argument. This is because the location of the
   package the reader is for, acts as the "directory". Hence the
   metaphor for directories and file names is packages and resources,
   respectively. This is also why instances of this class are expected
   to directly correlate to a specific package (instead of potentially
   representing multiple packages or a module).

   Loaders that wish to support resource reading are expected to
   provide a method called "get_resource_reader(fullname)" which
   returns an object implementing this ABC's interface. If the module
   specified by fullname is not a package, this method should return
   "None". An object compatible with this ABC should only be returned
   when the specified module is a package.

   Deprecated since version 3.12: Use
   "importlib.resources.abc.TraversableResources" instead.

   abstractmethod open_resource(resource)

      Returns an opened, *file-like object* for binary reading of the
      *resource*.

      If the resource cannot be found, "FileNotFoundError" is raised.

   abstractmethod resource_path(resource)

      Returns the file system path to the *resource*.

      If the resource does not concretely exist on the file system,
      raise "FileNotFoundError".

   abstractmethod is_resource(path)

      Returns "True" if the named *path* is considered a resource.
      "FileNotFoundError" is raised if *path* does not exist.

      Changed in version 3.10: The argument *name* was renamed to
      *path*.

   abstractmethod contents()

      Returns an *iterable* of strings over the contents of the
      package. Do note that it is not required that all names returned
      by the iterator be actual resources, e.g. it is acceptable to
      return names for which "is_resource()" would be false.

      Allowing non-resource names to be returned is to allow for
      situations where how a package and its resources are stored are
      known a priori and the non-resource names would be useful. For
      instance, returning subdirectory names is allowed so that when
      it is known that the package and resources are stored on the
      file system then those subdirectory names can be used directly.

      The abstract method returns an iterable of no items.

class importlib.resources.abc.Traversable

   An object with a subset of "pathlib.Path" methods suitable for
   traversing directories and opening files.

   For a representation of the object on the file-system, use
   "importlib.resources.as_file()".

   name

      Abstract. The base name of this object without any parent
      references.

   abstractmethod iterdir()

      Yield Traversable objects in self.

   abstractmethod is_dir()

      Return "True" if self is a directory.

   abstractmethod is_file()

      Return "True" if self is a file.

   abstractmethod joinpath(*pathsegments)

      Traverse directories according to *pathsegments* and return the
      result as "Traversable".

      Each *pathsegments* argument may contain multiple names
      separated by forward slashes ("/", "posixpath.sep" ). For
      example, the following are equivalent:

         files.joinpath('subdir', 'subsuddir', 'file.txt')
         files.joinpath('subdir/subsuddir/file.txt')

      Note that some "Traversable" implementations might not be
      updated to the latest version of the protocol. For compatibility
      with such implementations, provide a single argument without
      path separators to each call to "joinpath". For example:

         files.joinpath('subdir').joinpath('subsubdir').joinpath('file.txt')

      Changed in version 3.11: "joinpath" accepts multiple
      *pathsegments*, and these segments may contain forward slashes
      as path separators. Previously, only a single *child* argument
      was accepted.

   abstractmethod __truediv__(child)

      Return Traversable child in self. Equivalent to
      "joinpath(child)".

   abstractmethod open(mode='r', *args, **kwargs)

      *mode* may be 'r' or 'rb' to open as text or binary. Return a
      handle suitable for reading (same as "pathlib.Path.open").

      When opening as text, accepts encoding parameters such as those
      accepted by "io.TextIOWrapper".

   read_bytes()

      Read contents of self as bytes.

   read_text(encoding=None)

      Read contents of self as text.

class importlib.resources.abc.TraversableResources

   An abstract base class for resource readers capable of serving the
   "importlib.resources.files()" interface. Subclasses
   "ResourceReader" and provides concrete implementations of the
   "ResourceReader"'s abstract methods. Therefore, any loader
   supplying "TraversableResources" also supplies "ResourceReader".

   Loaders that wish to support resource reading are expected to
   implement this interface.

   abstractmethod files()

      Returns a "importlib.resources.abc.Traversable" object for the
      loaded package.
