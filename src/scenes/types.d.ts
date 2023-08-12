import Phaser from "phaser";
export type Scene = Phaser.Scene;
export type Sprite = Phaser.Physics.Matter.Sprite;
export type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
export type CollisionData = Phaser.Types.Physics.Matter.MatterCollisionData;
export type PhaserText = Phaser.GameObjects.Text;
export type Titles = {
  [index: string]: string;
};
