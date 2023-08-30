import StateMachine from "../statemachine/StateMachine";
import { Scene, Sprite } from "./types";

export default class BossController {
  private scene: Scene;
  private sprite: Sprite;
  private stateMachine: StateMachine;

  private speed = 1.5;
  private timeSinceMove = 0;

  constructor(scene: Scene, sprite: Sprite) {
    this.scene = scene;
    this.sprite = sprite;
    this.createAnimations();
    this.stateMachine = new StateMachine(this, "boss");
    this.stateMachine
      .addState("idle", {
        onEnter: this.idleOnEnter,
      })
      .addState("move-left", {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate,
      })
      .addState("move-right", {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate,
      })
      .addState("attack")
      .addState("dead")
      .setState("idle");
  }
  update(dt: number) {
    this.stateMachine.update(dt);
  }
  private idleOnEnter() {
    this.sprite.play("idle");
    const rand = Phaser.Math.Between(1, 100);
    if (rand <= 50) {
      this.stateMachine.setState("move-left");
    } else {
      this.stateMachine.setState("move-right");
    }
  }
  private moveLeftOnEnter() {
    this.timeSinceMove = 0;
    this.sprite.play("idle");
  }
  private moveLeftOnUpdate(dt: number) {
    this.timeSinceMove += dt;
    this.sprite.flipX = true;
    this.sprite.setVelocityX(-this.speed);
    const arbitraryFactor = 1 + Math.random();
    if (this.timeSinceMove > 2000 * arbitraryFactor * arbitraryFactor) {
      this.stateMachine.setState("move-right");
    }
  }
  private moveRightOnEnter() {
    this.timeSinceMove = 0;
    this.sprite.play("idle");
  }
  private moveRightOnUpdate(dt: number) {
    this.timeSinceMove += dt;
    this.sprite.flipX = false;
    this.sprite.setVelocityX(this.speed);
    const arbitraryFactor = 1 + Math.random();
    if (this.timeSinceMove > 2000 * arbitraryFactor * arbitraryFactor) {
      this.stateMachine.setState("move-left");
    }
  }
  private createAnimations() {
    this.sprite.anims.create({
      key: "idle",
      frames: this.sprite.anims.generateFrameNames("boss", {
        start: 1,
        end: 8,
        prefix: "idle_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "attack",
      frames: this.sprite.anims.generateFrameNames("boss", {
        start: 1,
        end: 13,
        prefix: "attack_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 1,
    });
    this.sprite.anims.create({
      key: "dead",
      frames: this.sprite.anims.generateFrameNames("dead", {
        start: 1,
        end: 17,
        prefix: "dead_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 1,
    });
  }
}
