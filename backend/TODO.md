       # Workflow

                     PDF
                     │
                     ▼
              Document Loader
                     │
                     ▼
              Text Splitter
                     │
                     ▼
              Embedding Model
                     │
                     ▼
       PostgreSQL + pgvector
                     │
       ────────────────────────────────
              User Question
                     │
                     ▼
              Embedding Model
                     │
                     ▼
              Similarity Search
                     │
                     ▼
              Relevant Chunks
                     │
                     ▼
              Prompt Builder
                     │
                     ▼
                     LLM
                     │
                     ▼
              Final Answer

       | Phase                   |  Status |
       | ----------------------- | ------- |
       | 1. Setup                | ✅ 100% |
       | 2. Database             | ✅ 100% |
       | 3. Embeddings           | ✅ 100% |
       | 4. Ingestion            | ✅ 100% |
       | 5. Retrieval            | ✅ 100% |
       | 6. Prompt Building      | ✅ 100% |
       | 7. LLM Integration      | ✅ 100% |
       | 8. API                  | ✅ 100% |
       | 9. Chat Interface       | ✅ 100% |
       | 10. Production Features | ✅ 100% |

       Embedding Model:
       BAAI/bge-base-en-v1.5

       Vector Dimension:
       384

       Cost:
       Free

       Runs:
       Locally

       Database:
       PostgreSQL + pgvector

       Component = Technology
       Language = Python 3.13
       Backend = FastAPI
       Database = PostgreSQL
       Vector Database = pgvector
       ORM = SQLAlchemy 2.0
       Embedding Model = BAAI/bge-base-en-v1.5
       LLM = (Baad me add karenge)
       Documents = Python 3.13 Documentation (.txt)
       ## Implementation order

       1. requirements.txt
       2. .env
       3. config.py
       4. database.py
       5. models.py
       6. create_tables.py
       7. ingest.py

       ## Project structure

       Folder PATH listing for volume Windows
       Volume serial number is 00000199 CA9B:F22D
       C:\USERS\TANVI\ONEDRIVE\DESKTOP\TAHIR\SIMPLE_RAG_SYSTEM\BACKEND
       │   .env
       │   docker-compose.yml
       │   README.md
       │   requirements.txt
       │   Simple RAG System.code-workspace
       │   TODO.md
       │   
       ├───app
       │   │   config.py
       │   │   database.py
       │   │   ingest.py
       │   │   main.py
       │   │   models.py
       │   │   __init__.py
       │   │   
       │   ├───services
       │   │   │   embeddings.py
       │   │   │   llm.py
       │   │   │   prompt.py
       │   │   │   rag.py
       │   │   │   retrieval.py
       │   │   │   
       │   │   └───__pycache__
       │   │           embeddings.cpython-313.pyc
       │   │           llm.cpython-313.pyc
       │   │           prompt.cpython-313.pyc
       │   │           rag.cpython-313.pyc
       │   │           retrieval.cpython-313.pyc
       │   │           
       │   └───__pycache__
       │           config.cpython-313.pyc
       │           database.cpython-313.pyc
       │           ingest.cpython-313.pyc
       │           main.cpython-313.pyc
       │           models.cpython-313.pyc
       │           __init__.cpython-313.pyc
       │           
       ├───data
       │   └───python-3.13-docs-text
       │       │   about.txt
       │       │   bugs.txt
       │       │   contents.txt
       │       │   copyright.txt
       │       │   glossary.txt
       │       │   license.txt
       │       │   
       │       ├───c-api
       │       │       abstract.txt
       │       │       allocation.txt
       │       │       apiabiversion.txt
       │       │       arg.txt
       │       │       bool.txt
       │       │       buffer.txt
       │       │       bytearray.txt
       │       │       bytes.txt
       │       │       call.txt
       │       │       capsule.txt
       │       │       cell.txt
       │       │       code.txt
       │       │       codec.txt
       │       │       complex.txt
       │       │       concrete.txt
       │       │       contextvars.txt
       │       │       conversion.txt
       │       │       coro.txt
       │       │       curses.txt
       │       │       datetime.txt
       │       │       descriptor.txt
       │       │       dict.txt
       │       │       exceptions.txt
       │       │       file.txt
       │       │       float.txt
       │       │       frame.txt
       │       │       function.txt
       │       │       gcsupport.txt
       │       │       gen.txt
       │       │       hash.txt
       │       │       import.txt
       │       │       index.txt
       │       │       init.txt
       │       │       init_config.txt
       │       │       intro.txt
       │       │       iter.txt
       │       │       iterator.txt
       │       │       list.txt
       │       │       long.txt
       │       │       mapping.txt
       │       │       marshal.txt
       │       │       memory.txt
       │       │       memoryview.txt
       │       │       method.txt
       │       │       module.txt
       │       │       monitoring.txt
       │       │       none.txt
       │       │       number.txt
       │       │       object.txt
       │       │       objimpl.txt
       │       │       perfmaps.txt
       │       │       picklebuffer.txt
       │       │       refcounting.txt
       │       │       reflection.txt
       │       │       sequence.txt
       │       │       set.txt
       │       │       slice.txt
       │       │       stable.txt
       │       │       structures.txt
       │       │       sys.txt
       │       │       time.txt
       │       │       tuple.txt
       │       │       type.txt
       │       │       typehints.txt
       │       │       typeobj.txt
       │       │       unicode.txt
       │       │       utilities.txt
       │       │       veryhigh.txt
       │       │       weakref.txt
       │       │       
       │       ├───deprecations
       │       │       c-api-pending-removal-in-3.14.txt
       │       │       c-api-pending-removal-in-3.15.txt
       │       │       c-api-pending-removal-in-3.16.txt
       │       │       c-api-pending-removal-in-future.txt
       │       │       index.txt
       │       │       pending-removal-in-3.13.txt
       │       │       pending-removal-in-3.14.txt
       │       │       pending-removal-in-3.15.txt
       │       │       pending-removal-in-3.16.txt
       │       │       pending-removal-in-3.17.txt
       │       │       pending-removal-in-3.18.txt
       │       │       pending-removal-in-future.txt
       │       │       
       │       ├───distributing
       │       │       index.txt
       │       │       
       │       ├───extending
       │       │       building.txt
       │       │       embedding.txt
       │       │       extending.txt
       │       │       index.txt
       │       │       newtypes.txt
       │       │       newtypes_tutorial.txt
       │       │       windows.txt
       │       │       
       │       ├───faq
       │       │       design.txt
       │       │       extending.txt
       │       │       general.txt
       │       │       gui.txt
       │       │       index.txt
       │       │       installed.txt
       │       │       library.txt
       │       │       programming.txt
       │       │       windows.txt
       │       │       
       │       ├───howto
       │       │       a-conceptual-overview-of-asyncio.txt
       │       │       annotations.txt
       │       │       argparse-optparse.txt
       │       │       argparse.txt
       │       │       clinic.txt
       │       │       cporting.txt
       │       │       curses.txt
       │       │       descriptor.txt
       │       │       enum.txt
       │       │       free-threading-extensions.txt
       │       │       free-threading-python.txt
       │       │       functional.txt
       │       │       gdb_helpers.txt
       │       │       index.txt
       │       │       instrumentation.txt
       │       │       ipaddress.txt
       │       │       isolating-extensions.txt
       │       │       logging-cookbook.txt
       │       │       logging.txt
       │       │       mro.txt
       │       │       perf_profiling.txt
       │       │       pyporting.txt
       │       │       regex.txt
       │       │       sockets.txt
       │       │       sorting.txt
       │       │       timerfd.txt
       │       │       unicode.txt
       │       │       urllib2.txt
       │       │       
       │       ├───installing
       │       │       index.txt
       │       │       
       │       ├───library
       │       │       abc.txt
       │       │       aifc.txt
       │       │       allos.txt
       │       │       archiving.txt
       │       │       argparse.txt
       │       │       array.txt
       │       │       ast.txt
       │       │       asynchat.txt
       │       │       asyncio-api-index.txt
       │       │       asyncio-dev.txt
       │       │       asyncio-eventloop.txt
       │       │       asyncio-exceptions.txt
       │       │       asyncio-extending.txt
       │       │       asyncio-future.txt
       │       │       asyncio-llapi-index.txt
       │       │       asyncio-platforms.txt
       │       │       asyncio-policy.txt
       │       │       asyncio-protocol.txt
       │       │       asyncio-queue.txt
       │       │       asyncio-runner.txt
       │       │       asyncio-stream.txt
       │       │       asyncio-subprocess.txt
       │       │       asyncio-sync.txt
       │       │       asyncio-task.txt
       │       │       asyncio.txt
       │       │       asyncore.txt
       │       │       atexit.txt
       │       │       audioop.txt
       │       │       audit_events.txt
       │       │       base64.txt
       │       │       bdb.txt
       │       │       binary.txt
       │       │       binascii.txt
       │       │       bisect.txt
       │       │       builtins.txt
       │       │       bz2.txt
       │       │       calendar.txt
       │       │       cgi.txt
       │       │       cgitb.txt
       │       │       chunk.txt
       │       │       cmath.txt
       │       │       cmd.txt
       │       │       cmdline.txt
       │       │       cmdlinelibs.txt
       │       │       code.txt
       │       │       codecs.txt
       │       │       codeop.txt
       │       │       collections.abc.txt
       │       │       collections.txt
       │       │       colorsys.txt
       │       │       compileall.txt
       │       │       concurrency.txt
       │       │       concurrent.futures.txt
       │       │       concurrent.txt
       │       │       configparser.txt
       │       │       constants.txt
       │       │       contextlib.txt
       │       │       contextvars.txt
       │       │       copy.txt
       │       │       copyreg.txt
       │       │       crypt.txt
       │       │       crypto.txt
       │       │       csv.txt
       │       │       ctypes.txt
       │       │       curses.ascii.txt
       │       │       curses.panel.txt
       │       │       curses.txt
       │       │       custominterp.txt
       │       │       dataclasses.txt
       │       │       datatypes.txt
       │       │       datetime.txt
       │       │       dbm.txt
       │       │       debug.txt
       │       │       decimal.txt
       │       │       development.txt
       │       │       devmode.txt
       │       │       dialog.txt
       │       │       difflib.txt
       │       │       dis.txt
       │       │       distribution.txt
       │       │       distutils.txt
       │       │       doctest.txt
       │       │       email.charset.txt
       │       │       email.compat32-message.txt
       │       │       email.contentmanager.txt
       │       │       email.encoders.txt
       │       │       email.errors.txt
       │       │       email.examples.txt
       │       │       email.generator.txt
       │       │       email.header.txt
       │       │       email.headerregistry.txt
       │       │       email.iterators.txt
       │       │       email.message.txt
       │       │       email.mime.txt
       │       │       email.parser.txt
       │       │       email.policy.txt
       │       │       email.txt
       │       │       email.utils.txt
       │       │       ensurepip.txt
       │       │       enum.txt
       │       │       errno.txt
       │       │       exceptions.txt
       │       │       faulthandler.txt
       │       │       fcntl.txt
       │       │       filecmp.txt
       │       │       fileformats.txt
       │       │       fileinput.txt
       │       │       filesys.txt
       │       │       fnmatch.txt
       │       │       fractions.txt
       │       │       frameworks.txt
       │       │       ftplib.txt
       │       │       functional.txt
       │       │       functions.txt
       │       │       functools.txt
       │       │       gc.txt
       │       │       getopt.txt
       │       │       getpass.txt
       │       │       gettext.txt
       │       │       glob.txt
       │       │       graphlib.txt
       │       │       grp.txt
       │       │       gzip.txt
       │       │       hashlib.txt
       │       │       heapq.txt
       │       │       hmac.txt
       │       │       html.entities.txt
       │       │       html.parser.txt
       │       │       html.txt
       │       │       http.client.txt
       │       │       http.cookiejar.txt
       │       │       http.cookies.txt
       │       │       http.server.txt
       │       │       http.txt
       │       │       i18n.txt
       │       │       idle.txt
       │       │       imaplib.txt
       │       │       imghdr.txt
       │       │       imp.txt
       │       │       importlib.metadata.txt
       │       │       importlib.resources.abc.txt
       │       │       importlib.resources.txt
       │       │       importlib.txt
       │       │       index.txt
       │       │       inspect.txt
       │       │       internet.txt
       │       │       intro.txt
       │       │       io.txt
       │       │       ipaddress.txt
       │       │       ipc.txt
       │       │       itertools.txt
       │       │       json.txt
       │       │       keyword.txt
       │       │       language.txt
       │       │       linecache.txt
       │       │       locale.txt
       │       │       logging.config.txt
       │       │       logging.handlers.txt
       │       │       logging.txt
       │       │       lzma.txt
       │       │       mailbox.txt
       │       │       mailcap.txt
       │       │       markup.txt
       │       │       marshal.txt
       │       │       math.txt
       │       │       mimetypes.txt
       │       │       mm.txt
       │       │       mmap.txt
       │       │       modulefinder.txt
       │       │       modules.txt
       │       │       msilib.txt
       │       │       msvcrt.txt
       │       │       multiprocessing.shared_memory.txt
       │       │       multiprocessing.txt
       │       │       netdata.txt
       │       │       netrc.txt
       │       │       nis.txt
       │       │       nntplib.txt
       │       │       numbers.txt
       │       │       numeric.txt
       │       │       operator.txt
       │       │       optparse.txt
       │       │       os.path.txt
       │       │       os.txt
       │       │       ossaudiodev.txt
       │       │       pathlib.txt
       │       │       pdb.txt
       │       │       persistence.txt
       │       │       pickle.txt
       │       │       pickletools.txt
       │       │       pipes.txt
       │       │       pkgutil.txt
       │       │       platform.txt
       │       │       plistlib.txt
       │       │       poplib.txt
       │       │       posix.txt
       │       │       pprint.txt
       │       │       profile.txt
       │       │       pty.txt
       │       │       pwd.txt
       │       │       pyclbr.txt
       │       │       pydoc.txt
       │       │       pyexpat.txt
       │       │       python.txt
       │       │       py_compile.txt
       │       │       queue.txt
       │       │       quopri.txt
       │       │       random.txt
       │       │       re.txt
       │       │       readline.txt
       │       │       removed.txt
       │       │       reprlib.txt
       │       │       resource.txt
       │       │       rlcompleter.txt
       │       │       runpy.txt
       │       │       sched.txt
       │       │       secrets.txt
       │       │       security_warnings.txt
       │       │       select.txt
       │       │       selectors.txt
       │       │       shelve.txt
       │       │       shlex.txt
       │       │       shutil.txt
       │       │       signal.txt
       │       │       site.txt
       │       │       smtpd.txt
       │       │       smtplib.txt
       │       │       sndhdr.txt
       │       │       socket.txt
       │       │       socketserver.txt
       │       │       spwd.txt
       │       │       sqlite3.txt
       │       │       ssl.txt
       │       │       stat.txt
       │       │       statistics.txt
       │       │       stdtypes.txt
       │       │       string.txt
       │       │       stringprep.txt
       │       │       struct.txt
       │       │       subprocess.txt
       │       │       sunau.txt
       │       │       superseded.txt
       │       │       symtable.txt
       │       │       sys.monitoring.txt
       │       │       sys.txt
       │       │       sysconfig.txt
       │       │       syslog.txt
       │       │       sys_path_init.txt
       │       │       tabnanny.txt
       │       │       tarfile.txt
       │       │       telnetlib.txt
       │       │       tempfile.txt
       │       │       termios.txt
       │       │       test.txt
       │       │       text.txt
       │       │       textwrap.txt
       │       │       threading.txt
       │       │       time.txt
       │       │       timeit.txt
       │       │       tk.txt
       │       │       tkinter.colorchooser.txt
       │       │       tkinter.dnd.txt
       │       │       tkinter.font.txt
       │       │       tkinter.messagebox.txt
       │       │       tkinter.scrolledtext.txt
       │       │       tkinter.ttk.txt
       │       │       tkinter.txt
       │       │       token.txt
       │       │       tokenize.txt
       │       │       tomllib.txt
       │       │       trace.txt
       │       │       traceback.txt
       │       │       tracemalloc.txt
       │       │       tty.txt
       │       │       turtle.txt
       │       │       types.txt
       │       │       typing.txt
       │       │       unicodedata.txt
       │       │       unittest.mock-examples.txt
       │       │       unittest.mock.txt
       │       │       unittest.txt
       │       │       unix.txt
       │       │       urllib.error.txt
       │       │       urllib.parse.txt
       │       │       urllib.request.txt
       │       │       urllib.robotparser.txt
       │       │       urllib.txt
       │       │       uu.txt
       │       │       uuid.txt
       │       │       venv.txt
       │       │       warnings.txt
       │       │       wave.txt
       │       │       weakref.txt
       │       │       webbrowser.txt
       │       │       windows.txt
       │       │       winreg.txt
       │       │       winsound.txt
       │       │       wsgiref.txt
       │       │       xdrlib.txt
       │       │       xml.dom.minidom.txt
       │       │       xml.dom.pulldom.txt
       │       │       xml.dom.txt
       │       │       xml.etree.elementtree.txt
       │       │       xml.sax.handler.txt
       │       │       xml.sax.reader.txt
       │       │       xml.sax.txt
       │       │       xml.sax.utils.txt
       │       │       xml.txt
       │       │       xmlrpc.client.txt
       │       │       xmlrpc.server.txt
       │       │       xmlrpc.txt
       │       │       zipapp.txt
       │       │       zipfile.txt
       │       │       zipimport.txt
       │       │       zlib.txt
       │       │       zoneinfo.txt
       │       │       _thread.txt
       │       │       __future__.txt
       │       │       __main__.txt
       │       │       
       │       ├───reference
       │       │       compound_stmts.txt
       │       │       datamodel.txt
       │       │       executionmodel.txt
       │       │       expressions.txt
       │       │       grammar.txt
       │       │       import.txt
       │       │       index.txt
       │       │       introduction.txt
       │       │       lexical_analysis.txt
       │       │       simple_stmts.txt
       │       │       toplevel_components.txt
       │       │       
       │       ├───tutorial
       │       │       appendix.txt
       │       │       appetite.txt
       │       │       classes.txt
       │       │       controlflow.txt
       │       │       datastructures.txt
       │       │       errors.txt
       │       │       floatingpoint.txt
       │       │       index.txt
       │       │       inputoutput.txt
       │       │       interactive.txt
       │       │       interpreter.txt
       │       │       introduction.txt
       │       │       modules.txt
       │       │       stdlib.txt
       │       │       stdlib2.txt
       │       │       venv.txt
       │       │       whatnow.txt
       │       │       
       │       ├───using
       │       │       android.txt
       │       │       cmdline.txt
       │       │       configure.txt
       │       │       editors.txt
       │       │       index.txt
       │       │       ios.txt
       │       │       mac.txt
       │       │       unix.txt
       │       │       windows.txt
       │       │       
       │       └───whatsnew
       │               2.0.txt
       │               2.1.txt
       │               2.2.txt
       │               2.3.txt
       │               2.4.txt
       │               2.5.txt
       │               2.6.txt
       │               2.7.txt
       │               3.0.txt
       │               3.1.txt
       │               3.10.txt
       │               3.11.txt
       │               3.12.txt
       │               3.13.txt
       │               3.2.txt
       │               3.3.txt
       │               3.4.txt
       │               3.5.txt
       │               3.6.txt
       │               3.7.txt
       │               3.8.txt
       │               3.9.txt
       │               changelog.txt
       │               index.txt
       │               
       ├───scripts
       │   │   create_tables.py
       │   │   ingest_documents.py
       │   │   reset_database.py
       │   │   
       │   └───__pycache__
       │           create_tables.cpython-313.pyc
       │           
       └───test
