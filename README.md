# mortal-coil-js

A simple brute forcer with debugging UI for the mortal coil puzzle, implemented using [P5](https://p5js.org/) and
TypeScript.

Mortal coil can be played at [hacker.org](https://www.hacker.org/coil/)
or [Hack The Web](https://hack.arrrg.de/mortal-coil/).

<p align="center">
    <img src="https://github.com/akleemans/mortal-coil-js/blob/main/demo.gif" alt="level">
</p>

## Features

* Rendering and displaying a level
* Displaying node states like visited/unvisited, start/end node
* Displaying neighbor edges
* A naive brute forcer
* Step-by-step navigation or

## Get started

To get started, you need [Node.js](https://nodejs.org/en), which comes with the npm package manager.

To install the dependencies (like P5 for drawing) for the first time, run

    npm install

You can then run

    npm run start

which should open your Browser at `http://localhost:3000/` and show the UI.
You can then edit `src/app.ts` and changes should appear as you save.

