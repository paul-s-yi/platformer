import StateMachine from "../statemachine/StateMachine";
import { Sprite, CursorKeys } from "./types";
export default class PlayerController {
  private sprite: Sprite;
  private cursors: CursorKeys;
  private stateMachine: StateMachine;
  private speed = 5;
  constructor(sprite: Sprite, cursors: CursorKeys) {
    this.sprite = sprite;
    this.cursors = cursors;
    this.createAnimations();

    this.stateMachine = new StateMachine(this, "player");

    this.stateMachine
      .addState("idle", {
        onEnter: this.idleOnEnter,
        onUpdate: this.idleOnUpdate,
      })
      .addState("run", {
        onEnter: this.runOnEnter,
        onUpdate: this.runOnUpdate,
      })
      .addState("jump", {
        onEnter: this.jumpOnEnter,
        onUpdate: this.jumpOnUpdate,
      })
      .addState("fall", {
        onEnter: this.fallOnEnter,
        onUpdate: this.fallOnUpdate,
      })
      .setState("idle");

    this.sprite.setOnCollide(
      (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        if (
          this.stateMachine.isCurrentState("jump") &&
          data.bodyA.position.x <= data.bodyB.position.x + 65 &&
          data.bodyA.position.y <= data.bodyB.position.y + 70
        ) {
          this.stateMachine.setState("idle");
        }
      }
    );
  }
  update(dt: number) {
    this.stateMachine.update(dt);
  }
  private idleOnEnter() {
    this.sprite.play("idle");
  }
  private idleOnUpdate() {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.stateMachine.setState("run");
    } else if (this.cursors.space.isDown) {
      this.stateMachine.setState("jump");
    }
  }
  private runOnEnter() {
    this.sprite.play("run");
  }
  private runOnUpdate() {
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(this.speed);
    } else {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState("idle");
    }
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spacePressed) {
      this.stateMachine.setState("jump");
    }
    if (this.sprite.body && this.sprite.body?.velocity.y > 1) {
      this.stateMachine.setState("fall");
    }
  }
  private jumpOnEnter() {
    this.sprite.play("jump", true);
    this.sprite.setVelocityY(-this.speed * 2);
  }
  private jumpOnUpdate() {
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(this.speed);
    }
    if (this.sprite.body && this.sprite.body?.velocity.y > 1) {
      this.stateMachine.setState("fall");
    }
  }
  private fallOnEnter() {
    this.sprite.play("fall", true);
  }
  private fallOnUpdate() {
    if (this.sprite.body && this.sprite.body.velocity.y === 0) {
      this.stateMachine.setState("idle");
    }
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(this.speed);
    } else {
      this.sprite.setVelocityX(0);
    }
  }
  private createAnimations() {
    this.sprite.anims.create({
      key: "idle",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 6,
        prefix: "idle_",
        suffix: ".png",
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "run",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 8,
        prefix: "run_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "jump",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 3,
        prefix: "jump_",
        suffix: ".png",
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "fall",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 3,
        prefix: "fall_",
        suffix: ".png",
      }),
      frameRate: 3,
      repeat: -1,
    });
  }
}
