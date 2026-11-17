import { test } from "node:test";
import assert from "node:assert/strict";

// Run after the package build: these standalone controls must resolve without
// a bundler rewriting extensionless imports (including their sound hooks).
for (const subpath of [
  "control-variants", "alert", "label", "separator", "table", "checkbox",
  "badge", "input", "textarea", "button", "skeleton",
]) {
  test(`built standalone export: ${subpath}`, async () => {
    const module = await import(`@nonanium/ui/${subpath}`);
    assert.ok(Object.keys(module).length > 0);
  });
}
