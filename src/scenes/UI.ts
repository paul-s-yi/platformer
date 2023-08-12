import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import { PhaserText, Titles } from "./types";
import WebFontFile from "../loaders/WebFontLoader";
import titles from "../assets/title.json";
export default class UI extends Phaser.Scene {
  private happinessLevel!: PhaserText;
  private positionLabel!: PhaserText;
  private titles!: Titles;
  private reportsLabel!: PhaserText;
  private reportsWritten = 0;
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
    this.happinessLevel = this.add.text(16, 16, "😀😀😀😀😀", {
      fontSize: "24px",
    });
    this.positionLabel = this.add.text(16, 48, "Title: Summer Intern", {
      fontFamily: "Electrolize",
      fontSize: "16px",
      color: "#000000",
    });
    this.reportsLabel = this.add.text(16, 64, "Reports Completed: 0", {
      fontFamily: "Play",
      fontSize: "16px",
      color: "#000000",
    });
    events.on("coffee-consumed", this.handleCoffeeConsumed, this);
    events.on("report-written", this.handleReportWritten, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      events.off("coffee-consumed", this.handleCoffeeConsumed, this);
    });
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
}
