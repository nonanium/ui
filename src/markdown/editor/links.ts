import { syntaxTree } from "@codemirror/language";
import type { EditorState, Range } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  WidgetType,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import type { ReactNode } from "react";

export type RenderLink = (url: string) => ReactNode;

export function linkDecorations(
  render: RenderLink,
  mount: (element: HTMLElement, content: ReactNode) => void,
  unmount: (element: HTMLElement) => void,
) {
  class LinkWidget extends WidgetType {
    readonly url: string;
    readonly content: ReactNode;

    constructor(url: string, content: ReactNode) {
      super();
      this.url = url;
      this.content = content;
    }

    eq(other: LinkWidget) {
      return this.url === other.url;
    }

    toDOM() {
      const element = document.createElement("span");
      element.className = "inline-flex align-middle";
      element.contentEditable = "false";
      mount(element, this.content);
      return element;
    }

    destroy(element: HTMLElement) {
      unmount(element);
    }
  }

  function decorate(state: EditorState) {
    const ranges: Range<Decoration>[] = [];
    syntaxTree(state).iterate({
      enter(node) {
        if (node.name !== "Link") return;
        const target = node.node.getChild("URL");
        if (
          !target ||
          state.doc.lineAt(node.from).number !==
            state.doc.lineAt(node.to).number
        )
          return;
        const url = state.sliceDoc(target.from, target.to);
        const content = render(url);
        if (content === undefined || content === null || content === false)
          return;
        ranges.push(
          Decoration.replace({
            widget: new LinkWidget(url, content),
            inclusive: false,
          }).range(node.from, node.to),
        );
        return false;
      },
    });
    return Decoration.set(ranges, true);
  }

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = decorate(view.state);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          syntaxTree(update.startState) !== syntaxTree(update.state)
        )
          this.decorations = decorate(update.state);
      }
    },
    {
      decorations: (instance) => instance.decorations,
      provide: (plugin) =>
        EditorView.atomicRanges.of(
          (view) => view.plugin(plugin)?.decorations ?? Decoration.none,
        ),
    },
  );
}
