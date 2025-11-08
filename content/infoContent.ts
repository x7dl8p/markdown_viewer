// Info dialog content organized by section
export const infoContent = {
  about: `# About Awsm MD

Awsm MD is a powerful, feature-rich markdown editor and viewer built with modern web technologies.

## Features

- **Catppuccin-inspired pastel colors**
- **Advanced markdown syntax**
- **Dark/Light theme support**
- **Local storage saving**
- **Export to PDF, HTML, and MD**
- **Real-time preview**
- **Fast and responsive**

## Built With

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown parsing
- **Shadcn/ui** - UI components`,

  syntax: `# Markdown Syntax Guide

## Basic Formatting

**Bold text** - Use \`**text**\` or \`__text__\`

*Italic text* - Use \`*text*\` or \`_text_\`

~~Strikethrough~~ - Use \`~~text~~\`

==Marked/Highlighted text== - Use \`==text==\`

## Colored Text

%red% Colored text %% - Use \`%color% text %%\`

%#FF6B6B% Hex colors %% - Use \`%#HEX% text %%\`

Available colors: red, green, blue, yellow, orange, purple, pink, violet, cyan, teal, lavender, peach, sky, sapphire, maroon, mauve, and more!

## Underlined Text

!~Simple underlined text~! - Use \`!~text~!\`

!~red; Colored underline~! - Use \`!~color; text~!\`

!~blue;double; Double line~! - Use \`!~color;style; text~!\`

Options: \`!~color;style;type;thickness; text~!\`
- **color**: red, blue, #HEX, etc.
- **style**: solid, double, dotted, dashed, wavy
- **type**: underline, line-through, overline, both
- **thickness**: 1-10 (in pixels)

## Spoilers

!>This is a spoiler - Use \`!>text\`

Hover to reveal!

## Text Alignment

-> Centered text <- - Use \`-> text <-\`

-> Right-aligned -> - Use \`-> text ->\`

## Lists

**Unordered:**
\`\`\`
- Item 1
- Item 2
  - Nested item
\`\`\`

**Ordered:**
\`\`\`
1. First
2. Second
   1. Nested
\`\`\`

**Task Lists:**
\`\`\`
- [ ] Unchecked
- [x] Checked
\`\`\`

## Links & Images

\`[Link text](https://url.com)\`

\`![Alt text](image-url.jpg)\`

\`![Sized](image.jpg){200px:150px}\`

## Code

Inline: \`\`code\`\`

Block:
\`\`\`\`
\`\`\`language
code here
\`\`\`
\`\`\`\`

## Tables

\`\`\`
| Header | Header |
| ------ | ------ |
| Cell   | Cell   |
\`\`\`

Alignment:
\`\`\`
| Left | Center | Right |
| :--- | :----: | ----: |
\`\`\`

## Admonitions

\`\`\`
!!! note Title
    Content here
\`\`\`

Types: note, info, warning, danger, greentext

## Other

**Blockquote:** \`> text\`

**Horizontal Rule:** \`---\`

**Escape:** Use backslash \`\\\` before special characters`,

  shortcuts: `# Keyboard Shortcuts

## Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+S\` | Save content |
| \`Ctrl+R\` | Reset to default |
| \`Ctrl+I\` | Toggle info dialog |
| \`Ctrl+T\` | Toggle theme |
| \`Ctrl+Shift+P\` | Command palette |

## Markdown Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+B\` | Bold text |
| \`Ctrl+I\` | Italic text |
| \`Ctrl+Shift+X\` | Strikethrough |
| \`Ctrl+K\` | Insert link |
| \`Ctrl+Shift+K\` | Insert image |
| \`Ctrl+Shift+7\` | Ordered list |
| \`Ctrl+Shift+8\` | Unordered list |
| \`Ctrl+Shift+>\` | Blockquote |
| \`Ctrl+Shift+C\` | Code block |
| \`Ctrl+Shift+M\` | Inline code |

## Toolbar Buttons

- **Save**: Save current content to local storage
- **Reset**: Restore default markdown content
- **Info**: Open documentation dialog
- **Theme**: Toggle between light/dark themes

## Tips

- Content is automatically saved when you click Save
- Your theme preference is remembered
- Use the toolbar buttons for quick formatting
- Hover over toolbar buttons for tooltips
- All shortcuts work in the editor area

## Advanced Features

- **Colored Text**: Use \`%color% text %%\` syntax
- **Underlined Text**: Use \`!~text~!\` for underlines
- **Spoilers**: Use \`!>text\` for hidden content
- **Admonitions**: Use \`!!! type Title\` for callouts
- **Alignment**: Use \`-> text <-\` for centering

## Accessibility

- All keyboard shortcuts are customizable
- High contrast themes available
- Screen reader friendly markup
- Focus indicators on interactive elements`,

  privacy: `# Privacy Policy

## Data Collection

Awsm MD respects your privacy. We collect minimal data necessary for functionality:

### Local Storage
- **Content**: Your markdown content is stored locally in your browser
- **Preferences**: Theme settings and UI preferences
- **Settings**: Editor configuration and shortcuts

### No External Data
- No data is sent to external servers
- No analytics or tracking
- No user accounts or profiles
- No personal information collected

## Data Usage

### Local Only
- All data stays on your device
- Content is processed locally
- No cloud synchronization
- No data sharing

### Temporary Processing
- Content is processed in memory only
- No permanent server-side storage
- Files are not uploaded anywhere

## Security

### Browser Security
- Uses browser's built-in localStorage
- Data encrypted by browser security
- Protected by same-origin policy
- No external dependencies for storage

### Content Security
- Markdown content sanitized
- No script execution in preview
- Safe HTML rendering
- XSS protection enabled

## Data Retention

### Automatic Cleanup
- Data persists until manually cleared
- Browser data management applies
- Incognito mode: data cleared on close
- Regular browsers: data persists

### Manual Deletion
- Use Reset button to clear content
- Browser settings to clear localStorage
- Uninstall removes all data

## Third Parties

### No Third Parties
- No advertising networks
- No analytics services
- No social media integrations
- No external APIs used

### Dependencies
- Open source libraries only
- No tracking in dependencies
- All code auditable
- Minimal dependency footprint

## Updates

### Policy Changes
- Changes posted in app updates
- No retroactive changes
- User notification of changes
- Opt-out available if needed

### Version History
- Privacy policy versioned with app
- Changes documented in changelog
- Transparent update process

## Contact

Questions about privacy? See the Contact section for ways to reach us.

## Compliance

This app complies with:
- GDPR (data minimization)
- CCPA (no sale of data)
- General privacy best practices
- Open source transparency`,

  contact: `# Contact & Support

## Get Help

### Documentation
- **Syntax Guide**: Complete markdown reference
- **Shortcuts**: Keyboard shortcuts and tips
- **About**: Feature overview and tech stack

### Common Issues
- **Content not saving**: Check browser storage settings
- **Preview not updating**: Refresh the page
- **Theme not changing**: Clear browser cache
- **Performance issues**: Close other tabs

## Report Issues

### Bug Reports
Found a bug? Help us improve!

**GitHub Issues**: [Create an issue](https://github.com/your-repo/awsm-md/issues)
- Include browser and OS version
- Describe steps to reproduce
- Attach screenshots if relevant
- Check existing issues first

### Feature Requests
Have an idea for improvement?

**GitHub Discussions**: [Start a discussion](https://github.com/your-repo/awsm-md/discussions)
- Describe your use case
- Explain the benefit
- Consider implementation complexity

## Contribute

### Code Contributions
Want to contribute code?

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Development Setup
\`\`\`bash
git clone https://github.com/your-repo/awsm-md.git
cd awsm-md
npm install
npm run dev
\`\`\`

### Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Use conventional commits

## Community

### Discussion Forums
- **GitHub Discussions**: General chat and Q&A
- **Discord**: Real-time community support (coming soon)

### Social Media
- **Twitter**: [@awsm_md](https://twitter.com/awsm_md)
- **Mastodon**: [@awsm_md@fosstodon.org](https://fosstodon.org/@awsm_md)

## Support Us

### Ways to Help
- **Star** the repository
- **Report** bugs
- **Suggest** features
- **Improve** documentation
- **Contribute** code

### Sponsorship
Support ongoing development:
- **GitHub Sponsors**: [Sponsor us](https://github.com/sponsors/your-repo)
- **Ko-fi**: [Buy us a coffee](https://ko-fi.com/awsm_md)
- **Patreon**: [Become a patron](https://patreon.com/awsm_md)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/your-repo/awsm-md/blob/main/LICENSE) file for details.

## Credits

### Core Team
- **Developer**: Your Name
- **Designer**: UI/UX Contributor
- **Documentation**: Tech Writer

### Contributors
Thanks to all our contributors! See [contributors](https://github.com/your-repo/awsm-md/graphs/contributors) for the full list.

### Acknowledgments
- Built with Next.js and React
- Styled with Tailwind CSS
- Components from shadcn/ui
- Icons from various open source projects`,
};
