import Phaser from "phaser";
import PlayerController from "./PlayerController";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Matter.Sprite;
  private playerController?: PlayerController;

  constructor() {
    super("game");
  }

  init() {
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors) {
      this.cursors = cursors;
    } else {
      throw new Error("Unable to create cursor keys");
    }
  }

  preload() {
    this.load.atlas(
      "character",
      "assets/character.png",
      "assets/character.json"
    );
    this.load.image("tiles", "assets/tilesheet.png");
    this.load.tilemapTiledJSON("tilemap", "assets/game.json");
    this.load.image("coffee", "assets/coffee.png");
  }

  create() {
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("industryland", "tiles");
    if (!tileset) {
      throw new Error("Unable to add tileset");
    }
    const ground = map.createLayer("ground", tileset);
    if (!ground) {
      throw new Error("Unable to generate ground layer");
    }
    ground.setCollisionByProperty({ collides: true });

    const objectsLayer = map.getObjectLayer("objects");
    objectsLayer?.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "char_spawn": {
          console.log("Character spawned");
          this.character = this.matter.add
            .sprite(x + 30, y - 30, "character")
            .setScale(2)
            .setOrigin(0.5, 0.4)
            .setFixedRotation();
          this.playerController = new PlayerController(
            this.character,
            this.cursors
          );
          this.matter.add
            .sprite(x - 100, y - 100, "coffee")
            .setScale(0.01)
            .setFixedRotation();
          this.cameras.main.startFollow(this.character);
          break;
        }
      }
    });
    this.matter.world.convertTilemapLayer(ground);
  }

  update(_t: number, dt: number) {
    if (!this.playerController) {
      return;
    }
    this.playerController.update(dt);
  }
}
