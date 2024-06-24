import sys
import os

# Bundled data (extracted to a temp dir)

TMP_BUNDLED_DIR = sys._MEIPASS if getattr(sys, 'frozen', None) else "."

TEMPLATES_DIR = os.path.join(TMP_BUNDLED_DIR, "templates")
CASTLES_DIR = os.path.join(TMP_BUNDLED_DIR, "castles")

# Not bundled data (next to server EXE)

BASE_DIR = "."

SAVES_DIR = os.path.join(BASE_DIR, "saves")
