Pending removal in Python 3.17
******************************

* "collections.abc":

  * "collections.abc.ByteString" is scheduled for removal in Python
    3.17.

    Use "isinstance(obj, collections.abc.Buffer)" to test if "obj"
    implements the buffer protocol at runtime. For use in type
    annotations, either use "Buffer" or a union that explicitly
    specifies the types your code supports (e.g., "bytes | bytearray |
    memoryview").

    "ByteString" was originally intended to be an abstract class that
    would serve as a supertype of both "bytes" and "bytearray".
    However, since the ABC never had any methods, knowing that an
    object was an instance of "ByteString" never actually told you
    anything useful about the object. Other common buffer types such
    as "memoryview" were also never understood as subtypes of
    "ByteString" (either at runtime or by static type checkers).

    See **PEP 688** for more details. (Contributed by Shantanu Jain in
    gh-91896.)

* "typing":

  * Before Python 3.14, old-style unions were implemented using the
    private class "typing._UnionGenericAlias". This class is no longer
    needed for the implementation, but it has been retained for
    backward compatibility, with removal scheduled for Python 3.17.
    Users should use documented introspection helpers like
    "typing.get_origin()" and "typing.get_args()" instead of relying
    on private implementation details.

  * "typing.ByteString", deprecated since Python 3.9, is scheduled for
    removal in Python 3.17.

    Use "isinstance(obj, collections.abc.Buffer)" to test if "obj"
    implements the buffer protocol at runtime. For use in type
    annotations, either use "Buffer" or a union that explicitly
    specifies the types your code supports (e.g., "bytes | bytearray |
    memoryview").

    "ByteString" was originally intended to be an abstract class that
    would serve as a supertype of both "bytes" and "bytearray".
    However, since the ABC never had any methods, knowing that an
    object was an instance of "ByteString" never actually told you
    anything useful about the object. Other common buffer types such
    as "memoryview" were also never understood as subtypes of
    "ByteString" (either at runtime or by static type checkers).

    See **PEP 688** for more details. (Contributed by Shantanu Jain in
    gh-91896.)
