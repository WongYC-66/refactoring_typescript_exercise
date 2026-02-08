import { Button, IconButton, TextField } from "./ori";

// tiny test runner
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (e: any) {
    console.error(`❌ ${name}`);
    console.error("   ", e.message);
  }
}

function captureConsole(fn: () => void): string[] {
  const logs: string[] = [];
  const original = console.log;
  console.log = (...args: any[]) => logs.push(args.join(" "));
  try {
    fn();
  } finally {
    console.log = original;
  }
  return logs;
}

// ======================
// Button Tests
// ======================

test("Button.render", () => {
  const b = new Button();
  const logs = captureConsole(() => b.render());
  if (logs[0] !== "Rendering button") throw new Error("wrong output");
});

test("Button.onClick", () => {
  const b = new Button();
  const logs = captureConsole(() => b.onClick());
  if (logs[0] !== "Clicked") throw new Error("wrong output");
});

test("Button.onHover", () => {
  const b = new Button();
  const logs = captureConsole(() => b.onHover());
  if (logs[0] !== "Hovered") throw new Error("wrong output");
});

test("Button.enable/disable", () => {
  const b = new Button();
  const logs = captureConsole(() => {
    b.enable();
    b.disable();
  });
  if (logs[0] !== "Enabled" || logs[1] !== "Disabled") throw new Error("wrong output");
});

// ======================
// IconButton Tests
// ======================

test("IconButton.render", () => {
  const ib = new IconButton();
  const logs = captureConsole(() => ib.render());
  if (logs[0] !== "Rendering icon button") throw new Error("wrong output");
});

test("IconButton.onClick", () => {
  const ib = new IconButton();
  const logs = captureConsole(() => ib.onClick());
  if (logs[0] !== "Clicked") throw new Error("wrong output");
});

test("IconButton.onHover", () => {
  const ib = new IconButton();
  const logs = captureConsole(() => ib.onHover());
  if (logs[0] !== "Hovered") throw new Error("wrong output");
});

test("IconButton.enable/disable", () => {
  const ib = new IconButton();
  const logs = captureConsole(() => {
    ib.enable();
    ib.disable();
  });
  if (logs[0] !== "Enabled" || logs[1] !== "Disabled") throw new Error("wrong output");
});

// ======================
// TextField Tests
// ======================

test("TextField.render", () => {
  const tf = new TextField();
  const logs = captureConsole(() => tf.render());
  if (logs[0] !== "Rendering component") throw new Error("wrong output");
});

test("TextField.onClick throws", () => {
  const tf = new TextField();
  let thrown = false;
  try {
    tf.onClick();
  } catch (e: any) {
    thrown = true;
    if (e.message !== "TextField cannot be clicked") throw new Error("wrong error message");
  }
  if (!thrown) throw new Error("should throw error");
});

test("TextField.onHover", () => {
  const tf = new TextField();
  const logs = captureConsole(() => tf.onHover());
  if (logs[0] !== "Hovered") throw new Error("wrong output");
});

test("TextField.enable/disable", () => {
  const tf = new TextField();
  const logs = captureConsole(() => {
    tf.enable();
    tf.disable();
  });
  if (logs[0] !== "Enabled" || logs[1] !== "Disabled") throw new Error("wrong output");
});
