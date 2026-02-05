# Contributing to git-page-link-create

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🎨 Contributing New Themes

The easiest way to contribute is by creating new visual themes. See the [README - Contributing New Themes](README.md#-contributing-new-themes) section for detailed instructions.

### Quick Theme Contribution Guide

1. **Fork the repository**
2. **Create a new theme JSON** in `public/layouts/your-theme.json`
3. **Register it** in `public/layouts/layouts.json`
4. **Test locally** with `npm run dev`
5. **Submit a Pull Request** with screenshots

### Theme Requirements

- ✅ Valid JSON format
- ✅ All required fields filled (id, name, author, version)
- ✅ WCAG AA color contrast compliance
- ✅ Tested on mobile and desktop
- ✅ Unique theme ID
- ✅ Screenshot included in PR

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

## 💡 Feature Requests

We welcome feature suggestions! Please open an issue with:

- **Feature Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you envision it working
- **Alternatives**: Any alternative solutions you've considered

## 🔧 Code Contributions

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/git-page-link-create.git
cd git-page-link-create

# Install dependencies
npm install

# Run development server
npm run dev
```

### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code style
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

### Commit Messages

Follow conventional commits format:

```
feat: add new theme selector component
fix: resolve compression issue with special characters
docs: update README with deployment instructions
style: format code with prettier
refactor: reorganize theme loading logic
test: add unit tests for crypto utility
```

### Pull Request Process

1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Implement your feature or fix
3. **Test**: Ensure everything works locally
4. **Commit**: Use conventional commit messages
5. **Push**: `git push origin feature/your-feature-name`
6. **Open PR**: Create a pull request with description

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, and Safari
- [ ] Tested on mobile and desktop
- [ ] README updated if needed
- [ ] No breaking changes (or clearly documented)

## 📝 Documentation Contributions

Documentation improvements are always welcome:

- Fix typos or grammatical errors
- Improve clarity of explanations
- Add examples or use cases
- Translate documentation to other languages

## 🌍 Translation Contributions

To add a new language:

1. Create `public/locales/{lang-code}.json`
2. Translate all strings from `en.json`
3. Update `getAvailableLocales()` in `src/shared/lib/i18n.ts`
4. Test the translation in the UI

## 🚫 What We Don't Accept

- Code that breaks existing functionality
- Features that require a backend server
- Themes that don't meet accessibility standards
- Contributions without proper attribution
- Code that violates the MIT license

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that could be considered inappropriate

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- CHANGELOG.md for significant contributions
- README.md for major features or themes

## 📞 Questions?

If you have questions about contributing:

- Open a GitHub Discussion
- Comment on an existing issue
- Reach out to [@Vidigal-code](https://github.com/Vidigal-code)

---

Thank you for contributing to git-page-link-create! 💚
