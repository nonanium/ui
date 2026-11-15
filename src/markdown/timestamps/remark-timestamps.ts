import type { Parent, Root } from "mdast";
import { SKIP, visit } from "unist-util-visit";
import { timestampPattern, validUnix } from "./format";

export function remarkTimestamps() {
  return (tree: Root) => {
    visit(tree, (node, index, parent: Parent | undefined) => {
      if (node.type === "link" || node.type === "linkReference") return SKIP;
      if (
        (node.type !== "text" && node.type !== "html") ||
        !("value" in node) ||
        index === undefined ||
        !parent
      )
        return;
      const matches = [...node.value.matchAll(timestampPattern)].filter(
        (match) => validUnix(Number(match[1])),
      );
      if (!matches.length) return;
      const children: Parent["children"] = [];
      let cursor = 0;
      for (const match of matches) {
        if (match.index > cursor)
          children.push({
            type: node.type,
            value: node.value.slice(cursor, match.index),
          });
        children.push({
          type: "inlineCode",
          value: match[0],
          data: {
            hName: "time",
            hProperties: { dataUnix: match[1], dataStyle: match[2] ?? "f" },
          },
        });
        cursor = match.index + match[0].length;
      }
      if (cursor < node.value.length)
        children.push({ type: node.type, value: node.value.slice(cursor) });
      parent.children.splice(index, 1, ...children);
      return [SKIP, index + children.length];
    });
  };
}
