import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import { PhaserText } from "./types";
export default class UI extends Phaser.Scene {
  private happinessLevel!: PhaserText;
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
  }
  create() {
    this.happinessLevel = this.add.text(16, 16, "😀😀😀😀😀", {
      fontSize: "24px",
    });
    this.reportsLabel = this.add.text(16, 48, "Reports Completed: 0", {
      fontFamily: "NovaSlim",
      fontSize: "16px",
      color: "#000000",
    });
    events.on("coffee-consumed", this.handleCoffeeConsumed, this);
    events.on("reports-written", this.handleReportWritten, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      events.off("coffee-consumed", this.handleCoffeeConsumed, this);
    });
  }
  private handleCoffeeConsumed() {
    this.numberOfCoffees += 1;
    if (this.numberOfCoffees > 0 && this.numberOfCoffees <= 2) {
      this.happinessLevel.text += "😀";
      this.happinessLevel.text = "🤩".repeat(
        this.happinessLevel.text.length / 2
      );
      return;
    }
    if (this.numberOfCoffees > 2 && this.numberOfCoffees <= 4) {
      this.happinessLevel.text += "😀";
      this.happinessLevel.text = "🫨".repeat(
        this.happinessLevel.text.length / 2
      );
      return;
    }
    if (this.numberOfCoffees > 4) {
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
  }
}
