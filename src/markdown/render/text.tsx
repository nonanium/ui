import type { CSSProperties } from "react";

import type { EmojiRegistry } from "../emoji/registry";
import { Markdown, type MarkdownProps } from "./markdown";

export type TextProps = {
  fontSize?: CSSProperties["fontSize"];
  registry?: EmojiRegistry;
  renderImage?: MarkdownProps["renderImage"];
  showEditedIndicator?: boolean;
  value: string;
};

export default function Text({
  fontSize,
  registry,
  renderImage,
  showEditedIndicator = false,
  value,
}: TextProps) {
  return (
    <Markdown
      className={
        showEditedIndicator
          ? "[&>p:nth-last-child(2)]:my-0 [&>p:nth-last-child(2)]:inline"
          : undefined
      }
      content={value}
      registry={registry}
      renderImage={renderImage}
      trailingContent={
        showEditedIndicator ? (
          <span className="ms-1 text-xs text-muted-foreground">(edited)</span>
        ) : undefined
      }
      variant="compact"
      style={{ fontSize: fontSize ?? "1rem" }}
    />
  );
}
