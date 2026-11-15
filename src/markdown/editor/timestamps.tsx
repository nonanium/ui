import { syntaxTree } from "@codemirror/language";
import { type EditorState, type Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  WidgetType,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import { createRoot, type Root } from "react-dom/client";
import { Hint, HintContent } from "../../cmp/hint";
import { Popover, PopoverContent } from "../../cmp/popover";
import { Kbd } from "../../cmp/kbd";
import type { NonaniumSettings } from "../../settings";
import { detectTimestamps } from "../timestamps/detect";
import {
  timestampPattern,
  timestampToken,
  validUnix,
  type TimestampStyle,
} from "../timestamps/format";
import { Timestamp, TimestampEditor } from "../timestamps/timestamp";
import {
  codeRanges,
  destroyWidgetRoot,
  registerWidgetRoot,
  renderWidgetRoot,
} from "./shared";

export const TIMESTAMP_HINT_ID = "markdown-timestamp-conversion";
type TimestampRange = {
  from: number;
  to: number;
  unix: number;
  style: TimestampStyle;
};

function findRanges(state: EditorState, settings: NonaniumSettings) {
  const text = state.doc.toString();
  const excluded = codeRanges(state);
  syntaxTree(state).iterate({
    enter(node) {
      if (
        ["Link", "Autolink", "URL", "Image", "LinkReference"].includes(
          node.name,
        )
      ) {
        excluded.push({ from: node.from, to: node.to });
        return false;
      }
    },
  });
  const outside = (range: { from: number; to: number }) =>
    !excluded.some((other) => range.from < other.to && range.to > other.from);
  const tokens: TimestampRange[] = [...text.matchAll(timestampPattern)]
    .filter((match) => validUnix(Number(match[1])))
    .map((match) => ({
      from: match.index,
      to: match.index + match[0].length,
      unix: Number(match[1]),
      style: (match[2] ?? "f") as TimestampStyle,
    }))
    .filter(outside);
  const candidates =
    settings.timestamps?.detect === false
      ? []
      : detectTimestamps(
          text,
          settings.timeZone,
          settings.timestamps?.defaultModes,
        ).filter(
          (range) =>
            outside(range) &&
            !tokens.some(
              (token) => range.from < token.to && range.to > token.from,
            ),
        );
  return { tokens, candidates };
}

function replaceRange(
  view: EditorView,
  range: TimestampRange,
  original: string,
  unix: number,
  style: TimestampStyle,
) {
  if (view.state.doc.sliceString(range.from, range.to) !== original) return;
  const insert = timestampToken(unix, style);
  view.dispatch({
    changes: { from: range.from, to: range.to, insert },
    selection: { anchor: range.from + insert.length },
    userEvent: "input",
  });
}

class TimestampWidget extends WidgetType {
  readonly range: TimestampRange;
  readonly source: string;
  readonly settings: NonaniumSettings;
  constructor(
    range: TimestampRange,
    source: string,
    settings: NonaniumSettings,
  ) {
    super();
    this.range = range;
    this.source = source;
    this.settings = settings;
  }
  eq(other: TimestampWidget) {
    return (
      this.range.from === other.range.from &&
      this.source === other.source &&
      this.settings === other.settings
    );
  }
  toDOM(view: EditorView) {
    const dom = document.createElement("span");
    dom.contentEditable = "false";
    const root = createRoot(dom);
    registerWidgetRoot(dom, root);
    this.updateDOM(dom, view);
    return dom;
  }
  updateDOM(dom: HTMLElement, view: EditorView) {
    return renderWidgetRoot(
      dom,
      <Timestamp
        unix={this.range.unix}
        style={this.range.style}
        settings={this.settings}
        onChange={(unix, style) =>
          replaceRange(view, this.range, this.source, unix, style)
        }
      />,
    );
  }
  destroy(dom: HTMLElement) {
    destroyWidgetRoot(dom);
  }
  ignoreEvent() {
    return true;
  }
}

export function createTimestampExtensions(
  settings: NonaniumSettings,
  acknowledge: () => void,
): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet = Decoration.none;
      ranges: ReturnType<typeof findRanges>;
      root: Root;
      host: HTMLElement;
      overlay: {
        kind: "hint" | "edit";
        range: TimestampRange;
        source: string;
      } | null = null;
      hintDismissed = false;
      saving = false;
      touch: {
        x: number;
        y: number;
        timer: ReturnType<typeof setTimeout>;
      } | null = null;
      longPressed = false;
      readonly view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.host = document.createElement("div");
        this.host.contentEditable = "false";
        view.dom.append(this.host);
        this.root = createRoot(this.host);
        this.ranges = findRanges(view.state, settings);
        this.build();
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          syntaxTree(update.startState) !== syntaxTree(update.state)
        ) {
          this.ranges = findRanges(update.state, settings);
          this.build();
          if (this.overlay && update.docChanged && !this.saving) {
            this.overlay = null;
            this.renderOverlay();
          }
        }
        if (
          update.docChanged &&
          this.view.hasFocus &&
          !this.hintDismissed &&
          settings.timestamps?.hints !== false &&
          !settings.acknowledgedHints?.includes(TIMESTAMP_HINT_ID)
        ) {
          const caret = update.state.selection.main.head;
          const range = this.ranges.candidates.find(
            (range) => range.from <= caret && range.to >= caret - 1,
          );
          if (range) this.show("hint", range);
        }
      }

      build() {
        this.decorations = Decoration.set(
          [
            ...this.ranges.tokens.map((range) =>
              Decoration.replace({
                widget: new TimestampWidget(
                  range,
                  this.view.state.doc.sliceString(range.from, range.to),
                  settings,
                ),
              }).range(range.from, range.to),
            ),
            ...this.ranges.candidates.map((range) =>
              Decoration.mark({
                attributes: { "data-timestamp-from": String(range.from) },
                class:
                  "underline decoration-dotted decoration-primary/40 underline-offset-4",
              }).range(range.from, range.to),
            ),
          ],
          true,
        );
      }

      show(kind: "hint" | "edit", range: TimestampRange) {
        this.overlay = {
          kind,
          range,
          source: this.view.state.doc.sliceString(range.from, range.to),
        };
        if (kind === "edit") this.save(range.unix, range.style);
        this.renderOverlay();
      }

      save(unix: number, style: TimestampStyle) {
        const overlay = this.overlay;
        if (!overlay || overlay.kind !== "edit") return;
        if (
          this.view.state.doc.sliceString(
            overlay.range.from,
            overlay.range.to,
          ) !== overlay.source
        )
          return;
        const source = timestampToken(unix, style);
        if (source === overlay.source) return;
        this.saving = true;
        try {
          replaceRange(this.view, overlay.range, overlay.source, unix, style);
          overlay.source = source;
          overlay.range = {
            ...overlay.range,
            to: overlay.range.from + source.length,
            unix,
            style,
          };
        } finally {
          this.saving = false;
        }
      }

      renderOverlay() {
        const overlay = this.overlay;
        if (!overlay) {
          this.root.render(null);
          return;
        }
        const anchor = {
          getBoundingClientRect: () => {
            const start = this.view.coordsAtPos(overlay.range.from);
            const end = this.view.coordsAtPos(overlay.range.to);
            return start
              ? new DOMRect(
                  start.left,
                  start.top,
                  Math.max(0, (end?.right ?? start.right) - start.left),
                  start.bottom - start.top,
                )
              : this.view.dom.getBoundingClientRect();
          },
        };
        const close = () => {
          this.overlay = null;
          this.renderOverlay();
          this.view.focus();
        };
        if (overlay.kind === "hint") {
          this.root.render(
            <Hint
              open
              onOpenChange={(open) => {
                if (!open) {
                  this.hintDismissed = true;
                  close();
                }
              }}
            >
              <HintContent
                anchor={anchor}
                initialFocus={false}
                finalFocus={false}
                aria-label="Convert to timestamp"
                onAcknowledge={() => {
                  this.hintDismissed = true;
                  acknowledge();
                }}
              >
                <p>
                  <Kbd>Ctrl + Click</Kbd> or long-press on mobile to convert to
                  timestamp
                </p>
              </HintContent>
            </Hint>,
          );
        } else {
          this.root.render(
            <Popover
              open
              onOpenChange={(open) => {
                if (!open) close();
              }}
            >
              <PopoverContent
                aria-label="Timestamp settings"
                anchor={anchor}
                className="max-h-(--available-height) w-80 max-w-[calc(100vw-2rem)] overflow-y-auto"
                finalFocus={false}
              >
                <TimestampEditor
                  key={overlay.range.from}
                  unix={overlay.range.unix}
                  style={overlay.range.style}
                  settings={settings}
                  onChange={(unix, style) => this.save(unix, style)}
                />
              </PopoverContent>
            </Popover>,
          );
        }
      }

      candidateAt(event: MouseEvent | PointerEvent) {
        const target =
          event.target instanceof Element
            ? event.target.closest("[data-timestamp-from]")
            : null;
        if (!target || !this.view.contentDOM.contains(target)) return;
        return this.ranges.candidates.find(
          (range) =>
            range.from === Number(target.getAttribute("data-timestamp-from")),
        );
      }
      clearTouch() {
        if (this.touch) clearTimeout(this.touch.timer);
        this.touch = null;
      }
      destroy() {
        this.clearTouch();
        const root = this.root;
        setTimeout(() => root.unmount(), 0);
        this.host.remove();
      }
    },
    {
      decorations: (plugin) => plugin.decorations,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          const instance = view.plugin(plugin);
          return instance
            ? Decoration.set(
                instance.ranges.tokens.map((range) =>
                  Decoration.mark({}).range(range.from, range.to),
                ),
                true,
              )
            : Decoration.none;
        }),
      eventHandlers: {
        mousedown(event) {
          if (!event.ctrlKey || event.button !== 0) return false;
          const range = this.candidateAt(event);
          if (!range) return false;
          event.preventDefault();
          return true;
        },
        pointerdown(event) {
          if (event.pointerType !== "touch") return false;
          this.clearTouch();
          this.longPressed = false;
          const range = this.candidateAt(event);
          if (range)
            this.touch = {
              x: event.clientX,
              y: event.clientY,
              timer: setTimeout(() => {
                this.longPressed = true;
                this.hintDismissed = true;
                this.show("edit", range);
                this.clearTouch();
              }, 500),
            };
          return false;
        },
        pointermove(event) {
          if (
            this.touch &&
            Math.hypot(
              event.clientX - this.touch.x,
              event.clientY - this.touch.y,
            ) > 8
          )
            this.clearTouch();
          return false;
        },
        pointerup() {
          this.clearTouch();
          return this.longPressed;
        },
        pointercancel() {
          this.clearTouch();
          this.longPressed = false;
          return false;
        },
        contextmenu(event) {
          const range = this.touch ? this.candidateAt(event) : undefined;
          if (range) {
            this.clearTouch();
            this.hintDismissed = true;
            this.show("edit", range);
            this.longPressed = true;
          }
          if (this.longPressed) {
            event.preventDefault();
            this.longPressed = false;
            return true;
          }
          return false;
        },
        click(event) {
          if (this.longPressed) {
            this.longPressed = false;
            return true;
          }
          if (!event.ctrlKey || event.button !== 0) return false;
          const range = this.candidateAt(event);
          if (!range) return false;
          this.hintDismissed = true;
          this.show("edit", range);
          return true;
        },
      },
    },
  );
}
