# Occupational Hazard (final title TBD)

⭐ If you like the project or just want to support me, star this on Github - it'll put a smile on my face ( ͡° ͜ʖ ͡°)

![platformer-screenshot](https://www.psycodes.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproject-2.f394ee80.png&w=1920&q=75)

## Table Of Contents

- [Introduction](#introduction)
- [Story](#the-story-so-far)
- [Play the Game / Installation](#installation)
  - [Play in Browser](#play-in-browser)
  - [Developers](#developers)
- [Controls - How to Play](#controls)
- [Planned / Upcoming Features](#planned-features)
  - [Gameplay and Visuals](#gameplay-and-visuals)
  - [Story](#story)
  - [Multiplayer](#multiplayer)
- [Changelog](#changelog)
- [License](#license)
- [Credits](#credits)
  - [Tools and Technologies](#tools-and-technologies)
  - [Resources and Assets](#resources-and-assets)

## Introduction

### A 2-D platformer built with TypeScript!

This fully free-to-play game (WIP) was built with TypeScript, using Phaser.js and Matter.js as the physics engine. It's available to play right in your browser of choice at [https://psycodes.com](https://psycodes.com).

Special thanks to my wife and my friends for being supportive as I work on this fun little project!

## The Story (so far)

You're an office worker entering the rat race, and you've got some obstacles to dodge! With spikes and toxic waste in your path, you need to file those reports to get promoted. But that's not all you have to look out for; your coworkers had dreams that died and haunt the place. Make sure your spirits stay high! All that work can get real tiring - replenish your stamina and get a little boost with coffee (don't drink too much!).

## Installation

### Play in Browser

If you're just looking to try out the game, you can head over to [this site](https://psycodes.com) and start playing right away!

### Developers

To get started, `git clone` the project by typing the following in your terminal:

```
git clone https://github.com/paul-s-yi/platformer.git
```

Don't forget to run `npm install` or `npm i` before running `npm start` to start playing (and developing!)

## Controls

Use `←↑→↓` to move, and `space` to jump. Hit `space` against a wall to do a double jump.

## Planned Features

### Gameplay and Visuals

- Add weapons and additional combat mechanics
- Add levels, final boss, endless mode (will require programmatic generation of map)
- Add save files
- Add audio for character movement and collision (running, jumping, hitting enemy)

### Story

- Add main menu, info in pause screen, add speech bubbles to character and enemies
- Add intro scene to establish character background

### Multiplayer

- Track high scores, add leaderboard
- Add player map creation tools and ability to seed player-made maps (this is a real stretch tbh but we'll see where it takes us)
- Big maybe: add versus modes

## Changelog

<details>

<summary>Click to expand</summary>

### 2023-08-30

Took a little break to focus on work, but I'm back!

- Updated readme and added changelog (retroactive)
- Added basic enemy movement logic (looking into more advanced targeting AI)

### 2023-08-12

- Added enemy sprites
- Added health and stamina items and placement
- Added job titles and advancement logic
- Added listeners for health and stamina changes upon collisions

### 2023-08-04

- Added new fonts (and relevant typings)
- Added collision logic for hazards

### 2023-08-03

- Added tilemap, powerup graphics

</details>

## License

This game is licensed under the terms of the GPL Open Source license and is available for free.

## Credits

### Tools and Technologies

- Code written using [VSCode](https://code.visualstudio.com/) on Mac
- Tilemap designed using [Tiled Map Editor](https://www.mapeditor.org/)
- Spritesheets packaged using [TexturePacker](https://www.codeandweb.com/texturepacker)

### Resources and Assets

- Tileset provided by [Kenney](https://kenney.nl/assets/platformer-pack-industrial)
- Character spritesheet provided by [Kalann](https://kalann.itch.io/a-normal-guy-that-gets-super-strong-normal-guy)
- Enemy spritesheet provided by [Kronovi-](https://darkpixel-kronovi.itch.io/undead-executioner)
- [Coffee](https://pngimg.com/image/16848) and [health](https://pngimg.com/image/68059) graphics provided by [PNGimg](https://pngimg.com)
- A warm thank you to Tommy Leung from Ourcade for his excellent resources on [implementing state machines](https://blog.ourcade.co/posts/2021/character-logic-state-machine-typescript/) and working out other kinks in Phaser.js.
