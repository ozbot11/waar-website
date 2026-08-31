"""Export the SolidWorks STEP as a clean, colored web GLB."""
from pathlib import Path

import cascadio
import numpy as np
import trimesh
from fast_simplification import simplify
from trimesh.visual.material import PBRMaterial

SRC = Path(r"C:\Users\ozben\Downloads\FInal_Aseem.STEP")
TMP = Path(__file__).resolve().parents[1] / "public" / "drones" / "_raw.glb"
OUT = Path(__file__).resolve().parents[1] / "public" / "drones" / "waar-01.glb"

KEEP = (
    "WAAR_DRONE_FRAME",
    "PROPELLER_MOTOR",
    "PROPELLER_BLADE",
    "WAAR_LEG_FINAL",
    "WAAR_LEG_HOLDER",
    "BATTERY_MODEL",
    "WAAR_BATTERY_CAMERA_HOLDER",
    "FRONT_CAMERA",
    "MONO_CAMERA_BRACKET",
    "ESC_WAAR",
    "NEW_BOARD_ADAPTER",
    "VOLTAGE_CONVERTER",
)

# SolidWorks-like part colors (linear-ish sRGB).
COLORS = {
    "FRAME": (0.58, 0.58, 0.60, 1.0),
    "LEG": (0.55, 0.55, 0.57, 1.0),
    "MOTOR": (0.12, 0.38, 0.95, 1.0),
    "BLADE": (0.08, 0.08, 0.09, 1.0),
    "BATTERY": (0.78, 0.42, 0.20, 1.0),
    "CAMERA": (0.22, 0.22, 0.24, 1.0),
    "ELECTRONICS": (0.16, 0.16, 0.18, 1.0),
}


def keep(name: str) -> bool:
    n = name.upper()
    return any(k in n for k in KEEP)


def color_for(name: str) -> tuple[float, float, float, float]:
    n = name.upper()
    if "PROPELLER_BLADE" in n:
        return COLORS["BLADE"]
    if "PROPELLER_MOTOR" in n:
        return COLORS["MOTOR"]
    if "BATTERY" in n:
        return COLORS["BATTERY"]
    if "CAMERA" in n:
        return COLORS["CAMERA"]
    if "ESC" in n or "BOARD" in n or "VOLTAGE" in n:
        return COLORS["ELECTRONICS"]
    if "LEG" in n:
        return COLORS["LEG"]
    return COLORS["FRAME"]


print("tessellating STEP at 2mm…", flush=True)
cascadio.step_to_glb(str(SRC), str(TMP), tol_linear=0.002, tol_angular=0.2, merge_primitives=True)
scene = trimesh.load(TMP)
assert isinstance(scene, trimesh.Scene)

kept: dict[str, trimesh.Trimesh] = {}
for name, geom in scene.geometry.items():
    if not hasattr(geom, "faces") or not keep(name):
        continue
    geom = geom.copy()
    geom.remove_unreferenced_vertices()
    # The camera STEP is extremely dense and reads as a fuzzy cloud in the browser.
    if "FRONT_CAMERA" in name.upper() and len(geom.faces) > 18000:
        pts, faces = simplify(
            geom.vertices.astype(np.float32),
            geom.faces.astype(np.int32),
            target_count=18000,
            agg=7,
        )
        geom = trimesh.Trimesh(vertices=pts, faces=faces, process=True)
    geom.visual = trimesh.visual.TextureVisuals(
        material=PBRMaterial(baseColorFactor=color_for(name), metallicFactor=0.25, roughnessFactor=0.5)
    )
    kept[name] = geom
    print(f"  keep {name:40} faces={len(geom.faces)}", flush=True)

scene.geometry.clear()
scene.geometry.update(kept)

rx = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], dtype=np.float64)
scene.apply_transform(rx)
center = (scene.bounds[0] + scene.bounds[1]) * 0.5
extent = float(np.max(scene.bounds[1] - scene.bounds[0]))
T = np.eye(4)
T[:3, 3] = -center
S = np.eye(4)
s = 3.2 / extent
S[0, 0] = S[1, 1] = S[2, 2] = s
scene.apply_transform(S @ T)

OUT.parent.mkdir(parents=True, exist_ok=True)
scene.export(OUT)
print(f"wrote {OUT} {OUT.stat().st_size / 1024:.0f} KB  parts={len(kept)}", flush=True)
TMP.unlink(missing_ok=True)
