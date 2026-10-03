import test from "node:test";
import assert from "node:assert/strict";

const { buildDedupeKey, mergeSources } = await import("../scripts/discovery-utils.ts");

test("dedupe key uses stable event fields", () => {
  assert.equal(
    buildDedupeKey({
      date: "2026-11-02",
      venue: "Divadlo Dobeška",
      city: "Praha",
      project: "Třaskavá směs",
      title: "Třaskavá směs"
    }),
    "2026-11-02|divadlo-dobeska|praha|traskava-smes|traskava-smes"
  );
});

test("mergeSources keeps unique urls", () => {
  assert.deepEqual(
    mergeSources(
      [{ name: "GoOut", url: "https://goout.net/a" }],
      [
        { name: "GoOut", url: "https://goout.net/a" },
        { name: "Venue", url: "https://venue.example/event" }
      ]
    ),
    [
      { name: "GoOut", url: "https://goout.net/a" },
      { name: "Venue", url: "https://venue.example/event" }
    ]
  );
});
