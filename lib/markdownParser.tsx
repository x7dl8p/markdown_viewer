import React, { useEffect, useRef } from "react";
import { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import mermaid from "mermaid";

const MermaidDiagram: React.FC<{ chart: string; theme: "light" | "dark" }> = ({
  chart,
  theme,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: theme === "dark" ? "dark" : "default",
      });
      mermaid.contentLoaded();
    }
  }, [chart, theme]);

  return <div ref={ref} className="mermaid">{chart}</div>;
};

const COLOR_MAP: Record<string, string> = {
  red: "#f38ba8",
  green: "#a6e3a1",
  blue: "#89b4fa",
  yellow: "#f9e2af",
  orange: "#fab387",
  purple: "#cba6f7",
  pink: "#f5c2e7",
  violet: "#cba6f7",
  cyan: "#89dceb",
  magenta: "#f5c2e7",
  lime: "#a6e3a1",
  indigo: "#89b4fa",
  teal: "#94e2d5",
  brown: "#eba0ac",
  gray: "#9399b2",
  grey: "#9399b2",
  black: "#11111b",
  white: "#cdd6f4",
  lavender: "#b4befe",
  peach: "#fab387",
  maroon: "#eba0ac",
  sky: "#89dceb",
  sapphire: "#74c7ec",
  rosewater: "#f5e0dc",
  flamingo: "#f2cdcd",
  mauve: "#cba6f7",
};

/**
 * Preprocesses markdown text to handle custom syntax
 */
export function preprocessMarkdown(markdown: string): string {
  let processed = markdown;

  processed = processed.replace(
    /^!>(.+?)$/gm,
    '<span class="spoiler">$1</span>'
  );

  processed = processed.replace(
    /%([a-zA-Z]+|#[0-9A-Fa-f]{6})%\s*(.+?)\s*%%/g,
    (match, color, text) => {
      const colorValue = color.startsWith("#")
        ? color
        : COLOR_MAP[color.toLowerCase()] || color;
      return `<span style="color: ${colorValue}">${text}</span>`;
    }
  );

  processed = processed.replace(/==(.+?)==/g, "<mark>$1</mark>");

  processed = processed.replace(/!~([^~]+?)~!/g, (match, content) => {
    const parts = content.split(";").map((p: string) => p.trim());

    if (parts.length === 1) {
      return `<span style="text-decoration: underline;">${parts[0]}</span>`;
    }

    const text = parts[parts.length - 1];
    const color = parts[0] || "currentColor";
    const style = parts[1] || "solid";
    const type = parts[2] || "underline";
    const thickness = parts[3] || "1";

    const colorValue =
      color && color !== "default"
        ? color.startsWith("#")
          ? color
          : COLOR_MAP[color.toLowerCase()] || "currentColor"
        : "currentColor";
    const underlineStyle = style && style !== "default" ? style : "solid";
    const decorationType = type && type !== "default" ? type : "underline";
    const lineThickness =
      thickness && thickness !== "default" ? `${thickness}px` : "1px";

    let textDecoration = "";
    if (decorationType === "both") {
      textDecoration = "underline overline";
    } else {
      textDecoration = decorationType;
    }

    return `<span style="text-decoration: ${textDecoration} ${underlineStyle} ${colorValue}; text-decoration-thickness: ${lineThickness};">${text}</span>`;
  });

  processed = processed.replace(
    /^->\s*(.+?)\s*<-$/gm,
    '<div style="text-align: center;">$1</div>'
  );

  processed = processed.replace(
    /^->\s*(.+?)\s*->$/gm,
    '<div style="text-align: right;">$1</div>'
  );

  processed = processed.replace(
    /^!!!\s*(note|info|warning|danger|greentext)\s*(.*?)\n((?:    .+\n?)*)/gm,
    (match, type, title, content) => {
      const cleanContent = content.replace(/^    /gm, "");
      const displayTitle =
        title.trim() || type.charAt(0).toUpperCase() + type.slice(1);
      return `<div class="admonition admonition-${type}"><div class="admonition-title">${displayTitle}</div><div class="admonition-content">${cleanContent}</div></div>`;
    }
  );

  processed = processed.replace(/^\[TOC(\d?)\]$/gm, (match, level) => {
    const startLevel = level ? parseInt(level) : 1;
    return `<div class="toc" data-start-level="${startLevel}"></div>`;
  });

  processed = processed.replace(/\\n/g, "<br/>");

  return processed;
}

/**
 * Generates custom React Markdown components
 */
export function getMarkdownComponents(theme: "light" | "dark"): Components {
  return {
    code: (props: any) => {
      const { node, inline, className, children, ...restProps } = props;
      const match = /language-(\w+)/.exec(className || "");

      if (!inline && match) {
        if (match[1] === "mermaid") {
          return (
            <MermaidDiagram
              chart={String(children).replace(/\n$/, "")}
              theme={theme}
            />
          );
        }

        return (
          <SyntaxHighlighter
            style={theme === "dark" ? vscDarkPlus : vs}
            language={match[1]}
            PreTag="div"
            customStyle={{
              backgroundColor: "transparent",
              margin: 0,
              padding: "16px",
              borderRadius: "4px",
            }}
            codeTagProps={{
              style: {
                fontFamily: "monospace",
                fontSize: "90%",
              },
            }}
            {...restProps}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className={className} {...restProps}>
          {children}
        </code>
      );
    },

    h1: ({ children, ...props }) => {
      const text = String(children);
      if (text.includes("->") && text.includes("<-")) {
        return (
          <h1 style={{ textAlign: "center" }} {...props}>
            {text.replace(/->/g, "").replace(/<-/g, "")}
          </h1>
        );
      }
      return <h1 {...props}>{children}</h1>;
    },

    h2: ({ children, ...props }) => {
      const text = String(children);
      if (text.includes("->") && text.includes("<-")) {
        return (
          <h2 style={{ textAlign: "center" }} {...props}>
            {text.replace(/->/g, "").replace(/<-/g, "")}
          </h2>
        );
      }
      return <h2 {...props}>{children}</h2>;
    },

    h3: ({ children, ...props }) => {
      const text = String(children);
      if (text.includes("->") && text.includes("<-")) {
        return (
          <h3 style={{ textAlign: "center" }} {...props}>
            {text.replace(/->/g, "").replace(/<-/g, "")}
          </h3>
        );
      }
      return <h3 {...props}>{children}</h3>;
    },

    p: ({ children, ...props }) => {
      const childText = String(children);
      if (childText.startsWith('<div style="text-align:')) {
        return <>{children}</>;
      }
      return <p {...props}>{children}</p>;
    },

    img: ({ src, alt, title, ...props }) => {
      if (!src || typeof src !== "string") return null;

      const sizeMatch = src.match(/^(.+?)\{(.+?)\}$/);
      let actualSrc: string = src;
      let width: string | undefined;
      let height: string | undefined;
      let float: string | undefined;

      if (sizeMatch) {
        actualSrc = sizeMatch[1];
        const sizeStr = sizeMatch[2];

        if (sizeStr.includes(":")) {
          const [w, h] = sizeStr.split(":");
          width = parseSizeUnit(w);
          height = parseSizeUnit(h);
        } else {
          width = parseSizeUnit(sizeStr);
        }
      }

      if (actualSrc.includes("#left")) {
        actualSrc = actualSrc.replace("#left", "");
        float = "left";
      } else if (actualSrc.includes("#right")) {
        actualSrc = actualSrc.replace("#right", "");
        float = "right";
      }

      const style: React.CSSProperties = {};
      if (width) style.width = width;
      if (height) style.height = height;
      if (float) {
        style.float = float as any;
        style.margin = float === "left" ? "0 1rem 1rem 0" : "0 0 1rem 1rem";
      }

      return (
        <img
          src={actualSrc}
          alt={alt || ""}
          title={title}
          style={style}
          {...props}
        />
      );
    },

    li: ({ children, ...props }: any) => {
      const childText = String(children);

      if (childText.startsWith("[ ] ")) {
        return (
          <li style={{ listStyle: "none" }} {...props}>
            <input type="checkbox" disabled style={{ marginRight: "0.5rem" }} />
            {childText.substring(4)}
          </li>
        );
      } else if (childText.startsWith("[x] ") || childText.startsWith("[X] ")) {
        return (
          <li style={{ listStyle: "none" }} {...props}>
            <input
              type="checkbox"
              disabled
              checked
              style={{ marginRight: "0.5rem" }}
            />
            {childText.substring(4)}
          </li>
        );
      }

      return <li {...props}>{children}</li>;
    },

    blockquote: ({ children, ...props }) => {
      return (
        <blockquote
          style={{
            borderLeft: "4px solid #ddd",
            paddingLeft: "1rem",
            margin: "1rem 0",
            color: theme === "dark" ? "#b3b3b3" : "#666",
          }}
          {...props}
        >
          {children}
        </blockquote>
      );
    },

    table: ({ children, ...props }) => {
      return (
        <div style={{ overflowX: "auto", margin: "1rem 0" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
            {...props}
          >
            {children}
          </table>
        </div>
      );
    },

    th: ({ children, ...props }) => {
      return (
        <th
          style={{
            border: "1px solid #ddd",
            padding: "8px",
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#f9f9f9",
            textAlign: "left",
          }}
          {...props}
        >
          {children}
        </th>
      );
    },

    td: ({ children, ...props }) => {
      return (
        <td
          style={{
            border: "1px solid #ddd",
            padding: "8px",
          }}
          {...props}
        >
          {children}
        </td>
      );
    },

    hr: ({ ...props }) => {
      return (
        <hr
          style={{
            border: "none",
            borderTop: `1px solid ${theme === "dark" ? "#444" : "#ddd"}`,
            margin: "2rem 0",
          }}
          {...props}
        />
      );
    },

    a: ({ children, href, ...props }) => {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme === "dark" ? "#58a6ff" : "#0066cc",
            textDecoration: "none",
          }}
          {...props}
        >
          {children}
        </a>
      );
    },
  };
}

/**
 * Parse size units (px, %, vw, hw, or no unit defaults to px)
 */
function parseSizeUnit(size: string): string {
  const trimmed = size.trim();

  if (/^\d+px$/.test(trimmed)) {
    const value = parseInt(trimmed);
    return value >= 0 && value <= 4000 ? trimmed : "auto";
  } else if (/^\d+%$/.test(trimmed)) {
    const value = parseInt(trimmed);
    return value >= 0 && value <= 500 ? trimmed : "auto";
  } else if (/^\d+vw$/.test(trimmed)) {
    const value = parseInt(trimmed);
    return value >= 0 && value <= 500 ? trimmed : "auto";
  } else if (/^\d+hw$/.test(trimmed)) {
    const value = parseInt(trimmed);
    return value >= 0 && value <= 500 ? `${value}vh` : "auto";
  } else if (/^\d+$/.test(trimmed)) {
    const value = parseInt(trimmed);
    return value >= 0 && value <= 4000 ? `${value}px` : "auto";
  }

  return "auto";
}

/**
 * Generate Table of Contents from markdown
 */
export function generateTOC(markdown: string, startLevel: number = 1): string {
  const lines = markdown.split("\n");
  const headings: { level: number; text: string; id: string }[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      if (level >= startLevel) {
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        headings.push({ level, text, id });
      }
    }
  });

  if (headings.length === 0) return "";

  let toc = '<ul class="toc-list">\n';
  let currentLevel = startLevel;

  headings.forEach((heading, index) => {
    while (currentLevel < heading.level) {
      toc += "<ul>\n";
      currentLevel++;
    }
    while (currentLevel > heading.level) {
      toc += "</ul>\n";
      currentLevel--;
    }
    toc += `<li><a href="#${heading.id}">${heading.text}</a></li>\n`;
  });

  while (currentLevel > startLevel) {
    toc += "</ul>\n";
    currentLevel--;
  }

  toc += "</ul>";

  return toc;
}

/**
 * Post-process rendered HTML to add IDs to headings for TOC
 */
export function addHeadingIds(html: string): string {
  return html.replace(/<h([1-6])>(.+?)<\/h\1>/g, (match, level, text) => {
    const cleanText = text.replace(/<[^>]*>/g, "");
    const id = cleanText.toLowerCase().replace(/[^\w]+/g, "-");
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}
