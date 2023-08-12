import Phaser from "phaser";
import PlayerController from "./PlayerController";
import { sharedInstance as events } from "./EventCenter";
import { CursorKeys, Sprite } from "./types";
import HazardController from "./HazardController";
export default class Game extends Phaser.Scene {
  private cursors!: CursorKeys;

  private character!: Sprite;
  private playerController?: PlayerController;
  private hazards!: HazardController;
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
    this.hazards = new HazardController();

    this.scene.launch("ui");
  }

  preload() {
    this.load.atlas(
      "character",
      "assets/character.png",
      "assets/character.json"
    );
    this.load.atlas("boss", "assets/boss.png", "assets/boss.json");
    this.load.image("tiles", "assets/tilesheet.png");
    this.load.tilemapTiledJSON("tilemap", "assets/game.json");
    this.load.image("coffee", "assets/coffee.png");
    this.load.image("report", "assets/report.png");
    this.load.image("health", "assets/health.png");
    this.load.image("above-and-beyond", "assets/above-and-beyond.png");
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
    events.on("had-too-much", this.handleHadTooMuch, this);
    map.createLayer("hazards", tileset);
    const objectsLayer = map.getObjectLayer("objects");
    objectsLayer?.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
      switch (name) {
        case "char_spawn": {
          this.character = this.matter.add
            .sprite(x + 15, y - 20, "character")
            .setScale(2)
            .setOrigin()
            .setFixedRotation();
          this.playerController = new PlayerController(
            this,
            this.character,
            this.cursors,
            this.hazards
          );
          this.cameras.main.startFollow(this.character);
          break;
        }
        case "coffee": {
          const coffee = this.matter.add
            .sprite(x + 25, y + 25, "coffee", undefined, {
              isStatic: true,
              isSensor: true,
            })
            .setScale(0.01)
            .setFixedRotation();
          coffee.setData("type", "coffee");
          coffee.setData("staminaPoints", 10);
          break;
        }
        case "health": {
          const health = this.matter.add
            .sprite(x, y, "health", undefined, {
              isStatic: true,
              isSensor: true,
            })
            .setScale(0.05)
            .setFixedRotation();
          health.setData("type", "health");
          health.setData("healthPoints", 10);
          break;
        }
        case "report": {
          const report = this.matter.add
            .sprite(x, y, "report", undefined, {
              isStatic: true,
              isSensor: true,
            })
            .setFixedRotation();
          report.setData("type", "report");
          report.setData("staminaPoints", 10);
          break;
        }
        case "above-and-beyond": {
          const report = this.matter.add
            .sprite(x, y, "above-and-beyond", undefined, {
              isStatic: true,
              isSensor: true,
            })
            .setScale(0.5)
            .setFixedRotation();
          report.setData("type", "above-and-beyond");
          report.setData("staminaPoints", 20);
          break;
        }
        case "spikes": {
          const spike = this.matter.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            {
              isStatic: true,
            }
          );
          this.hazards.add("spikes", spike);
          break;
        }
        case "spikes-ceil": {
          const spikeCeil = this.matter.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            {
              isStatic: true,
            }
          );
          this.hazards.add("spikes-ceil", spikeCeil);
          break;
        }
      }
    });
    this.matter.world.convertTilemapLayer(ground);
  }

  update(_t: number, dt: number) {
    this.playerController?.update(dt);
  }

  private handleHadTooMuch(numberOfCoffees: number) {
    const overdoseSeverity = numberOfCoffees - 10;
    if (overdoseSeverity < 5) {
      this.cameras.main.shake(1000 * overdoseSeverity, 0.01 * overdoseSeverity);
    } else if (overdoseSeverity < 10) {
      this.cameras.main.fade(1000 * (overdoseSeverity - 5), 103, 71, 54);
      this.cameras.main.fadeFrom(
        (1000 * (overdoseSeverity - 5)) / 2,
        103,
        71,
        54
      );
    } else if (overdoseSeverity < 15) {
      this.cameras.main.flash(1000 * (overdoseSeverity - 10));
    }
  }
}
