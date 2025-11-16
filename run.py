import importlib.util
import pathlib
import sys

HERE = pathlib.Path(__file__).parent.resolve()
BACKEND_DIR = HERE / "travel-discovery-platform-with-camp-origin-sdk" / "backend"
BACKEND_FILE = BACKEND_DIR / "search_controller.py"

if not BACKEND_FILE.exists():
    raise FileNotFoundError(f"Backend file not found: {BACKEND_FILE}")

# Ensure repo root and backend directory are on import path so imports like
# `from search_backend import ...` and module-relative imports work.
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(BACKEND_DIR))

spec = importlib.util.spec_from_file_location("search_controller", BACKEND_FILE)
module = importlib.util.module_from_spec(spec)
# Register module name so its internal imports resolve consistently
sys.modules["search_controller"] = module
spec.loader.exec_module(module)

# Expect the backend file to expose FastAPI app = FastAPI(...)
app = getattr(module, "app")