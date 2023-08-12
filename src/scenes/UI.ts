import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import { PhaserText, Titles } from "./types";
import WebFontFile from "../loaders/WebFontLoader";
import titles from "../assets/title.json";
export default class UI extends Phaser.Scene {
  private happinessLevel!: PhaserText;
  private positionLabel!: PhaserText;
  private healthAmt!: PhaserText;
  private staminaAmt!: PhaserText;
  private titles!: Titles;
  private healthGraphics!: Phaser.GameObjects.Graphics;
  private staminaGraphics!: Phaser.GameObjects.Graphics;
  private reportsLabel!: PhaserText;
  private reportsWritten = 0;
  private lastHealth = 100;
  private lastStamina = 100;
  private numberOfCoffees = 0;
  constructor() {
    super({
      key: "ui",
    });
  }
  init() {
    this.reportsWritten = 0;
    this.numberOfCoffees = 0;
    this.titles = titles;
  }
  preload() {
    this.load.addFile(new WebFontFile(this.load, ["Play", "Electrolize"]));
  }
  create() {
    // this.happinessLevel = this.add.text(16, 16, "😀😀😀😀😀", {
    //   fontSize: "24px",
    // });
    this.healthGraphics = this.add.graphics();
    this.healthAmt = this.add.text(150, 15, "100 / 100", {
      fontFamily: "Electrolize",
      fontSize: "10px",
      color: "#000000",
    });
    this.staminaGraphics = this.add.graphics();
    this.staminaAmt = this.add.text(150, 45, "100 / 100", {
      fontFamily: "Electrolize",
      fontSize: "10px",
      color: "#000000",
    });
    this.setHealthBar(100);
    this.setStaminaBar(100);
    this.positionLabel = this.add.text(10, 70, "Title: Summer Intern", {
      fontFamily: "Play",
      fontSize: "16px",
      color: "#000000",
    });
    this.reportsLabel = this.add.text(10, 86, "Reports Completed: 0", {
      fontFamily: "Play",
      fontSize: "16px",
      color: "#000000",
    });
    events.on("health-changed", this.handleHealthChanged, this);
    events.on("stamina-changed", this.handleStaminaChanged, this);
    events.on("coffee-consumed", this.handleCoffeeConsumed, this);
    events.on("report-written", this.handleReportWritten, this);
    events.on("went-above-and-beyond", this.handleStarEmployee, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      events.off("coffee-consumed", this.handleCoffeeConsumed, this);
    });
  }
  private setHealthBar(value: number) {
    const width = 200;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
    this.healthGraphics.clear();
    this.healthGraphics.fillStyle(0x808080);
    this.healthGraphics.fillRoundedRect(10, 10, width, 20, 5);
    if (percent > 0.5) {
      this.healthGraphics.fillStyle(0x0d98ba);
    } else if (percent > 0.25) {
      this.healthGraphics.fillStyle(0xffd700);
    } else {
      this.healthGraphics.fillStyle(0x1c1c1c);
    }
    this.healthGraphics.fillRoundedRect(10, 10, width * percent, 20, 5);
  }
  private setStaminaBar(value: number) {
    const width = 200;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
    this.staminaGraphics.clear();
    this.staminaGraphics.fillStyle(0x808080);
    this.staminaGraphics.fillRoundedRect(10, 40, width, 20, 5);
    if (percent > 0.5) {
      this.staminaGraphics.fillStyle(0xba110c);
    } else if (percent > 0.25) {
      this.staminaGraphics.fillStyle(0xffd700);
    } else {
      this.staminaGraphics.fillStyle(0x900603);
    }
    this.staminaGraphics.fillRoundedRect(10, 40, width * percent, 20, 5);
  }
  private handleCoffeeConsumed() {
    this.numberOfCoffees += 1;
    if (this.numberOfCoffees > 0 && this.numberOfCoffees <= 5) {
      this.happinessLevel.text += "😀";
      this.happinessLevel.text = "🤩".repeat(
        this.happinessLevel.text.length / 2
      );
      return;
    }
    if (this.numberOfCoffees > 5 && this.numberOfCoffees <= 10) {
      this.happinessLevel.text += "😀";
      this.happinessLevel.text = "🫨".repeat(
        this.happinessLevel.text.length / 2
      );
      return;
    }
    if (this.numberOfCoffees > 10) {
      events.emit("had-too-much", this.numberOfCoffees);
      if (this.happinessLevel.text.length >= 2) {
        this.happinessLevel.text = this.happinessLevel.text.slice(2);
      }
      this.happinessLevel.text = "🤢".repeat(
        this.happinessLevel.text.length / 2
      );
      return;
    }
  }

  private handleReportWritten() {
    this.reportsWritten += 1;
    this.reportsLabel.text = `Reports Completed: ${this.reportsWritten}`;
    this.positionLabel.text = `Title: ${this.titles[this.reportsWritten]}`;
  }
  private handleHealthChanged(value: number) {
    if (value < this.lastHealth) {
      this.cameras.main.shake(100, 0.01);
    }
    this.tweens.addCounter({
      from: this.lastHealth,
      to: value,
      duration: 250,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const tweenVal = tween.getValue();
        this.setHealthBar(tweenVal);
      },
    });
    this.lastHealth = value;
    this.healthAmt.text = `${this.lastHealth} / 100`;
  }
  private handleStaminaChanged(value: number) {
    if (value < this.lastStamina) {
      this.cameras.main.shake(100, 0.01);
    }
    this.tweens.addCounter({
      from: this.lastStamina,
      to: value,
      duration: 250,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const tweenVal = tween.getValue();
        this.setStaminaBar(tweenVal);
      },
    });
    this.lastStamina = value;
    this.staminaAmt.text = `${this.lastStamina} / 100`;
  }
  private handleStarEmployee() {
    this.reportsWritten += 5;
    this.reportsLabel.text = `Reports Completed: ${this.reportsWritten}`;
    this.positionLabel.text = `Title: ${this.titles[this.reportsWritten]}`;
  }
}
