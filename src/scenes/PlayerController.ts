import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import HazardController from "./HazardController";
import { Sprite, CursorKeys, CollisionData, Scene } from "./types";
export default class PlayerController {
  private scene: Scene;
  private sprite: Sprite;
  private cursors: CursorKeys;
  private hazards: HazardController;
  private stateMachine: StateMachine;
  private health = 100;
  private stamina = 100;
  private speed = 5;
  constructor(
    scene: Scene,
    sprite: Sprite,
    cursors: CursorKeys,
    hazards: HazardController
  ) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursors;
    this.hazards = hazards;
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
      .addState("spike-hit", {
        onEnter: this.spikeOnEnter,
      })
      .addState("spike-ceil-hit", {
        onEnter: this.spikeCeilOnEnter,
      })
      .setState("idle");

    this.sprite.setOnCollide((data: CollisionData) => {
      const extBody = data.bodyB;

      if (this.hazards.is("spikes", extBody)) {
        this.stateMachine.setState("spike-hit");
        return;
      }
      if (this.hazards.is("spikes-ceil", extBody)) {
        this.stateMachine.setState("spike-ceil-hit");
        return;
      }
      const gameObj = extBody.gameObject;
      if (!gameObj) {
        return;
      }
      // Preventing double-jumps
      if (gameObj instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.isCurrentState("jump")) {
          this.stateMachine.setState("idle");
        }
        return;
      }

      const sprite = gameObj as Sprite;
      const type = sprite.getData("type");
      switch (type) {
        case "health": {
          const value = sprite.getData("healthPoints") ?? 10;
          this.health = Phaser.Math.Clamp(this.health + value, 0, 100);
          events.emit("health-changed", this.health);
          sprite.destroy();
          break;
        }
        case "coffee": {
          const value = sprite.getData("staminaPoints") ?? 10;
          this.stamina = Phaser.Math.Clamp(this.stamina + value, 0, 100);
          events.emit("stamina-changed", this.stamina);
          sprite.destroy();
          this.sprite.setVelocityX(0);
          this.sprite.setVelocityY(0);
          this.sprite.play("drink");
          this.speed += 0.5;
          this.sprite.once("animationcomplete", () => {
            this.stateMachine.setState("idle");
          });
          break;
        }
        case "report": {
          const value = sprite.getData("staminaPoints") ?? 10;
          this.stamina = Phaser.Math.Clamp(this.stamina - value, 0, 100);
          events.emit("stamina-changed", this.stamina);
          events.emit("report-written");
          sprite.destroy();
          break;
        }
        case "above-and-beyond": {
          const value = sprite.getData("staminaPoints") ?? 40;
          this.stamina = Phaser.Math.Clamp(this.stamina - value, 0, 100);
          events.emit("stamina-changed", this.stamina);
          events.emit("went-above-and-beyond");
          sprite.destroy();
          break;
        }
      }
    });
  }
  update(dt: number) {
    this.stateMachine.update(dt);
  }
  private idleOnEnter() {
    this.sprite.play("idle", true);
  }
  private idleOnUpdate() {
    this.sprite.setVelocityX(0);
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.stateMachine.setState("run");
    }
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spacePressed) {
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
      this.sprite.play("run-reverse");
      this.sprite.once("animationcomplete", () => {
        this.stateMachine.setState("idle");
      });
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

  private spikeOnEnter() {
    this.sprite.setVelocityY(-this.speed * 2);
    this.health = Phaser.Math.Clamp(this.health - 10, 0, 100);
    events.emit("health-changed", this.health);
    const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
    const endColor = Phaser.Display.Color.ValueToColor(0xff0000);

    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      repeat: 1,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const val = tween.getValue();
        const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100,
          val
        );
        const color = Phaser.Display.Color.GetColor(
          colorObj.r,
          colorObj.g,
          colorObj.b
        );

        this.sprite.setTintFill(color);
      },
      onComplete: () => {
        this.sprite.clearTint();
      },
    });
    this.sprite.clearTint();
    this.stateMachine.setState("idle");
  }
  private spikeCeilOnEnter() {
    this.sprite.setVelocityY(this.speed);

    const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
    const endColor = Phaser.Display.Color.ValueToColor(0xff0000);

    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      repeat: 1,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const val = tween.getValue();
        const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100,
          val
        );
        const color = Phaser.Display.Color.GetColor(
          colorObj.r,
          colorObj.g,
          colorObj.b
        );

        this.sprite.setTintFill(color);
      },
      onComplete: () => {
        this.sprite.clearTint();
      },
    });
    this.sprite.clearTint();
    this.stateMachine.setState("idle");
  }

  private createAnimations() {
    this.sprite.anims.create({
      key: "idle",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 9,
        prefix: "idle_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "run",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 4,
        prefix: "run_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "run-reverse",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 4,
        end: 1,
        prefix: "run_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.sprite.anims.create({
      key: "jump",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 1,
        prefix: "air_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "fall",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 1,
        prefix: "air_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "drink",
      frames: this.sprite.anims.generateFrameNames("character", {
        start: 1,
        end: 11,
        prefix: "drink_",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: 1,
    });
  }
}
