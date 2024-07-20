import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";
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

  //create a game object (in this case the map) objects that contains thifferent components ej. position
  const map = k.add([
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
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);
  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);
        // collision event. The function run when the collision occurs
        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue("todo", () => (player.isInDialogue = false));
          });
        }
      }
      continue;
    }
    if (layer.name === "spawpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  // call the function to resize

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  //make the camera follow the player
  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y + 100);
  });

  //move the player
  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      moouseAngle > lowerBound &&
      moouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      moouseAngle > -lowerBound &&
      moouseAngle < -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (
      moouseAngle > -lowerBound &&
      moouseAngle < -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

  });
});
k.go("main");