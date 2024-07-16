import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
k.loadAseprite("spritesheet", "./spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
  const mapData = await (await fetch("./map.json")).json();
  const layers = mapData.layers;
});

//create a game object (in this case the map) objects that contains thifferent components ej. position
const map = k.make([
  //component to display
  k.sprite("map"),
  //position component
  k.pos(0),
  // scale component
  k.scale(scaleFactor),
]);

const player = k.make([
  k.sprite("spitesheet", { anim: "idle-down" }),
  k.area({
    shape: new k.Rect(k.vec2(0, 3), 10, 10),
  }),
  k.body(),
  k.anchor("center"),
  k.pos()
]);
k.go("main");
