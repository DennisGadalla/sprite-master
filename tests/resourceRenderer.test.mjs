import test from "node:test";
import assert from "node:assert/strict";
import { cloneRenderSettings, effectiveRenderRole, effectiveRoleList, torsoLinkedOffset } from "../src/core/resourceRenderer.js";

test("distal limb merge maps hands and feet to parent limb roles", () => {
  const settings = cloneRenderSettings();
  settings.roleMerge.distalLimbs = true;

  assert.equal(effectiveRenderRole("hand_front", settings), "front_arm");
  assert.equal(effectiveRenderRole("hand_back", settings), "back_arm");
  assert.equal(effectiveRenderRole("foot_front", settings), "front_leg");
  assert.equal(effectiveRenderRole("foot_back", settings), "back_leg");
});

test("distal limb merge keeps hands and feet separate when disabled", () => {
  const settings = cloneRenderSettings();
  settings.roleMerge.distalLimbs = false;

  assert.equal(effectiveRenderRole("hand_front", settings), "hand_front");
  assert.equal(effectiveRenderRole("foot_back", settings), "foot_back");
});

test("effective role list removes distal controls when distal limb merge is active", () => {
  const settings = cloneRenderSettings();
  settings.roleMerge.distalLimbs = true;

  assert.deepEqual(
    effectiveRoleList(["front_arm", "hand_front", "front_leg", "foot_front", "weapon"], settings),
    ["front_arm", "front_leg", "weapon"]
  );
});

test("torso length offsets connected upper body modules from torso bottom", () => {
  const boxes = {
    torso: { minY: 44, maxY: 60 },
    head: { cy: 42 },
    front_arm: { cy: 52 },
    hand_front: { cy: 64 },
    front_leg: { cy: 70 }
  };

  assert.deepEqual(torsoLinkedOffset("head", boxes, 1.5), { x: 0, y: -8 });
  assert.deepEqual(torsoLinkedOffset("front_arm", boxes, 1.5), { x: 0, y: -4 });
  assert.deepEqual(torsoLinkedOffset("hand_front", boxes, 1.5), { x: 0, y: -4 });
  assert.deepEqual(torsoLinkedOffset("front_leg", boxes, 1.5), { x: 0, y: 0 });
});

test("head follows torso top instead of overextending from head center", () => {
  const idleLikeBoxes = {
    torso: { minY: 68, maxY: 78 },
    head: { minY: 59, maxY: 66, cy: 62.5 }
  };

  const offset = torsoLinkedOffset("head", idleLikeBoxes, 1.65);
  assert.equal(offset.x, 0);
  assert.ok(Math.abs(offset.y - -6.5) < 0.0001);
});
