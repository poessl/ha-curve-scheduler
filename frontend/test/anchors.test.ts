import { afterEach, expect, it } from "vitest";
import "../src/curve";
import type { CurveSchedulerCurve } from "../src/curve";
import { detachDeletedAnchors } from "../src/anchor-editor";
import { validateAnchors } from "../src/model";

afterEach(() => { document.body.innerHTML = ""; });

it("validates local references and detaches partners of deleted anchors", () => {
  const points = [
    { id: "wake", anchor: { entity_id: "input_datetime.alarm" }, t: "07:30", v: 50 },
    { partner_of: "wake", t: "08:30", v: 40 },
  ];
  expect(validateAnchors(points, "points")).toEqual([]);
  expect(validateAnchors(points.slice(1), "points")[0].code).toBe("invalid_anchor");
  expect(detachDeletedAnchors(points.slice(1))[0].partner_of).toBeUndefined();
});

it("draws original, shifted and offset curves while preserving metadata on drag", async () => {
  const graph = document.createElement("curve-scheduler-curve") as CurveSchedulerCurve;
  graph.points = [{ t: "07:30", v: 50 }, { t: "08:30", v: 40 }];
  graph.displayPoints = [[540, 50], [600, 40]];
  graph.referencePoints = [[450, 50], [510, 40]];
  graph.offset = 3;
  graph.min = 20; graph.max = 70;
  document.body.append(graph);
  await graph.updateComplete;
  const paths = graph.shadowRoot!;
  expect(paths.querySelector(".original-curve")).not.toBeNull();
  expect(paths.querySelector(".offset-curve")).not.toBeNull();
  expect(paths.querySelector(".original-curve")!.getAttribute("d")).not.toBe(paths.querySelector("path.curve:not(.original-curve)")!.getAttribute("d"));
  const moved = graph.movePoint([{ id: "wake", anchor: { entity_id: "datetime.alarm" }, t: "07:30", v: 50 }], 0, 480, 55);
  expect(moved[0]).toMatchObject({ id: "wake", anchor: { entity_id: "datetime.alarm" }, t: "08:00", v: 55 });
});


it("accepts datetime-valued sensors as anchor sources", () => {
  expect(validateAnchors([{ id: "alarm", anchor: { entity_id: "sensor.next_alarm" } }], "points")).toEqual([]);
});

it("lists only visible curve layers and can hide the legend", async () => {
  const graph = document.createElement("curve-scheduler-curve") as CurveSchedulerCurve;
  graph.points = [{ t: "07:30", v: 50 }];
  graph.language = "en"; graph.showLegend = true;
  document.body.append(graph); await graph.updateComplete;
  const labels = () => [...graph.shadowRoot!.querySelectorAll('.legend [role="listitem"]')].map(e => e.textContent?.trim());
  expect(labels()).toEqual(["Raw"]);
  graph.referencePoints = [[450, 50]];
  graph.displayPoints = [[540, 50]];
  graph.offset = 3; await graph.updateComplete;
  expect(labels()).toEqual(["Raw", "Shifted", "Shifted + offset"]);
  graph.offset = 0; await graph.updateComplete;
  expect(labels()).toEqual(["Raw", "Shifted"]);
  graph.displayPoints = []; await graph.updateComplete;
  expect(labels()).toEqual(["Raw"]);
  graph.showLegend = false; await graph.updateComplete;
  expect(graph.shadowRoot!.querySelector('.legend')).toBeNull();
});

it.each([false, true])("connects original points across a wrapping %s axis without confusing equal values", async weekly => {
  const graph = document.createElement("curve-scheduler-curve") as CurveSchedulerCurve;
  if (weekly) {
    graph.axis = { source:"day_of_week", input_entity:null, min:1, max:8, step:.01, wrap:true };
    graph.numericPoints = [{x:1.5,v:40}, {x:7.5,v:40}];
    graph.referencePoints = [[1.5,40],[7.5,40]];
    graph.pointPositions = [[2.5,40],[1.5,40]];
    graph.displayPoints = [[1.5,40],[2.5,40]];
  } else {
    graph.points = [{t:"00:30",v:40},{t:"23:30",v:40}];
    graph.referencePoints = [[30,40],[1410,40]];
    graph.pointPositions = [[90,40],[30,40]];
    graph.displayPoints = [[30,40],[90,40]];
  }
  document.body.append(graph); await graph.updateComplete;
  expect(graph.shadowRoot!.querySelectorAll('.original-marker')).toHaveLength(2);
  const lines = [...graph.shadowRoot!.querySelectorAll('.shift-connector')];
  expect(lines).toHaveLength(3); // One ordinary move, two pieces at the wrap boundary.
  const arrows = [...graph.shadowRoot!.querySelectorAll('.shift-arrow')];
  expect(arrows).toHaveLength(lines.length);
  arrows.forEach((arrow, i) => {
    const values = arrow.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    expect(values[2]).toBe(Number(lines[i].getAttribute('x2')));
    expect(Math.sign(values[2] - values[0])).toBe(Math.sign(Number(lines[i].getAttribute('x2')) - Number(lines[i].getAttribute('x1'))));
  });
  for (const line of lines) expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'));
  graph.displayPoints = []; graph.pointPositions = undefined; await graph.updateComplete;
  expect(graph.shadowRoot!.querySelectorAll('.shift-connector')).toHaveLength(0);
  expect(graph.shadowRoot!.querySelectorAll('.shift-arrow')).toHaveLength(0);
  expect(graph.shadowRoot!.querySelectorAll('.original-marker')).toHaveLength(2);
});

it.each([[450,390,-1], [450,510,1], [30,1410,-1]])("points shift arrows from %s toward %s", async (original, shifted, direction) => {
  const graph = document.createElement("curve-scheduler-curve") as CurveSchedulerCurve;
  graph.referencePoints = [[original,40]];
  graph.pointPositions = [[shifted,40]];
  graph.displayPoints = [[shifted,40]];
  document.body.append(graph); await graph.updateComplete;
  const arrows = [...graph.shadowRoot!.querySelectorAll('.shift-arrow')];
  expect(arrows.length).toBeGreaterThan(0);
  for (const arrow of arrows) {
    const values = arrow.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    expect(Math.sign(values[2] - values[0])).toBe(direction);
  }
});

it("draws a smooth offset overlay independently of the output rounding step", async () => {
  const graph = document.createElement("curve-scheduler-curve") as CurveSchedulerCurve;
  graph.axis = { source:"sensor", input_entity:"sensor.input", min:0, max:10, step:.1, wrap:false };
  graph.numericPoints = [{x:0,v:20},{x:10,v:30}];
  graph.min = 10; graph.max = 50; graph.mode = "linear"; graph.step = 1; graph.offset = 5;
  document.body.append(graph); await graph.updateComplete;
  const overlay = () => graph.shadowRoot!.querySelector('.offset-curve')!.getAttribute('d')!;
  const before = overlay();
  graph.step = .1; await graph.updateComplete;
  expect(overlay()).toBe(before);
  const ys = [...before.matchAll(/[ML][-\d.]+,([-\d.]+)/g)].map(m => Number(m[1]));
  expect(new Set(ys).size).toBeGreaterThan(20);
});
