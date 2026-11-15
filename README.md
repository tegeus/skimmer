# Skimmer

A small browser game prototype. You pilot a hovering wedge-shaped craft across an endless, generated desert of dunes, hills and oases. It is inspired by the feel of 1980s isometric shooters.

## Play

Open `index.html` in a browser. If GitHub Pages is turned on for this repository, it is also playable at the Pages address.

## Controls

- **Steer:** the craft turns to face the mouse pointer.
- **Thrust:** hold the left mouse button or Space.
- **Fire:** hold the right mouse button or F. Thrust and fire work together.
- **Tune:** the panel under the screen has sliders for thrust, top speed, turn speed, drag, side grip, gravity, hover height and more.

## Source

`index.html` is a single self-contained page built from the files in `src/`:

- `src/head.html`: page layout, styles and the tuning panel
- `src/script2.html`: terrain generation, physics, craft, guns and rendering
- `src/sprites.js`: procedurally drawn trees, shrubs, grass and rocks
- `src/build.py`: joins the parts together (run it from inside `src/`, then copy `skimmer.html` to `index.html`)
