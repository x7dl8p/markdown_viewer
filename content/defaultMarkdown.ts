export const DEFAULT_MARKDOWN = `# Welcome to Awsm MD - A really Advanced Markdown tool

This interactive viewer supports all standard markdown features and many advanced ones, dont believe me? Check it out :)

## Basic Formatting

**Bold text**, *italic text*, and ***bold and italic*** are all supported.

~~Strikethrough text~~ is also available.

==Marked/Highlighted text== stands out!

## Colored Text

%red% Red colored text %%

%green% Green colored text %%

%blue% Blue colored text %%

%#FF6B6B% Hex color #FF6B6B %%

%violet% Combined with !~green; underlined green ~! text %%

## Underlined Text

!~Simple underlined text~!

!~red; Underlined text with red color~!

!~blue;double; Underlined with double line~!

!~orange;default;line-through; Strike-through style~!

!~purple;solid;underline;5; Thick purple underline~!

## Spoilers

!>This is a spoiler - hover to reveal!

!>Another secret message here

## Headers

# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

### -> Centered Header <-

## Text Alignment

-> This text is centered <-

-> This text is right-aligned ->

## Lists

### Ordered Lists
1. First item
2. Second item
   1. Nested item
   2. Another nested item

### Unordered Lists
- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

### Task Lists
- [ ] Unchecked task
- [x] Checked task
- [ ] Another unchecked task


## Diagrams

\`\`\`mermaid
graph TD
    A[Node Label] --> B[Another Node]
    B --> C{Decision Node}
    C -->|Yes| D[Result 1]
    C -->|No| E[Result 2]
\`\`\`

## Links and Images

[Visit GitHub](https://github.com/x7dl8p)

![Sample Image](https://raw.githubusercontent.com/x7dl8p/dump/refs/heads/main/cat.webp)
dont foget to visite me often ;]
## Code

Inline \`code\` looks like this.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// comment in code
\`\`\`

\`\`\`python
s = "Python code example"
print(s)
\`\`\`

## Blockquotes

> Simple blockquote

> How to use quotes in Markdown?
>
> > Just prepend text with >
> >
> > Nested blockquote with multiple paragraphs

## Tables

| Header | Header | Header |
| ------ | ------ | ------ |
| Cell   | Cell   | Cell   |
| Cell   | Cell   | Cell   |

### Aligned Table

| Left | Center | Right |
| :--- | :----: | ----: |
| Cell | Cell   | Cell  |
| Cell | Cell   | Cell  |

## Horizontal Rule

---

## Admonitions

!!! note Important Note
    This is an admonition block with some important information.
    You can use multiple lines here.

!!! info
    This is an info admonition without a custom title.

!!! warning Watch Out
    This is a warning admonition to highlight caution areas.

!!! danger Critical
    This indicates something dangerous or critical!

!!! greentext Story Time
    This is a greentext style admonition.

`;
