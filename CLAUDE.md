# CLAUDE.md - AI Assistant Guide

## Repository Overview

**Repository**: BrandenPConnolly/ClaudeTest
**Purpose**: Test repository for AI-assisted development workflows
**Current Status**: Initial setup

## Table of Contents

1. [Codebase Structure](#codebase-structure)
2. [Development Workflows](#development-workflows)
3. [AI Assistant Conventions](#ai-assistant-conventions)
4. [Git Workflow](#git-workflow)
5. [Common Tasks](#common-tasks)
6. [Best Practices](#best-practices)

---

## Codebase Structure

### Current Structure

```
ClaudeTest/
├── .git/              # Git version control
└── CLAUDE.md          # This file
```

### Expected Structure (as project grows)

```
ClaudeTest/
├── src/               # Source code
├── tests/             # Test files
├── docs/              # Documentation
├── .github/           # GitHub workflows and configurations
├── config/            # Configuration files
├── scripts/           # Utility scripts
├── package.json       # Node.js dependencies (if applicable)
├── README.md          # Project documentation
└── CLAUDE.md          # AI assistant guide
```

---

## Development Workflows

### Branch Strategy

- **Feature branches**: Use descriptive names prefixed with category
  - `feature/`: New features
  - `fix/`: Bug fixes
  - `docs/`: Documentation updates
  - `refactor/`: Code refactoring
  - `test/`: Test additions/modifications

- **Claude branches**: AI assistant work branches
  - Format: `claude/claude-md-mk1abd4ouexytx2k-tHzf3`
  - Always develop on the designated Claude branch
  - Push to this branch when work is complete

### Commit Message Conventions

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add user authentication system

Implement JWT-based authentication with login and signup endpoints.
Includes middleware for protected routes.

Closes #123
```

```
fix(api): resolve null pointer exception in user endpoint

Add proper null checking before accessing user properties.
```

---

## AI Assistant Conventions

### Code Analysis Protocol

When analyzing code, AI assistants should:

1. **Read Before Modifying**: Always read files before suggesting changes
2. **Understand Context**: Use Grep/Glob to understand related code
3. **Check Dependencies**: Review imports and dependencies
4. **Verify Tests**: Check for existing tests before modifying functionality
5. **Follow Existing Patterns**: Match the project's existing code style

### Task Planning

For complex tasks:

1. Use TodoWrite tool to create task breakdown
2. Mark tasks as `in_progress` before starting
3. Mark tasks as `completed` immediately after finishing
4. Update todo list as new requirements emerge

### Code Modification Guidelines

1. **Minimal Changes**: Only modify what's necessary
2. **No Over-Engineering**: Avoid adding unnecessary features
3. **Security First**: Check for vulnerabilities (XSS, SQL injection, etc.)
4. **Preserve Functionality**: Don't break existing features
5. **Clean Up**: Remove unused code completely (no commented-out code)

### Communication Style

- Be concise and direct
- Use code references with `file_path:line_number` format
- Avoid emojis unless requested
- Focus on facts over validation
- Provide objective technical guidance

---

## Git Workflow

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd ClaudeTest

# Check current branch
git branch
```

### Working on Features

```bash
# Create/switch to feature branch
git checkout -b claude/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "feat: descriptive message"

# Push to remote
git push -u origin claude/feature-name
```

### Pull Request Process

1. Ensure all changes are committed and pushed
2. Create PR with descriptive title and body
3. Include:
   - Summary of changes (bullet points)
   - Test plan (checklist)
   - Related issues (if applicable)

**PR Template**:
```markdown
## Summary
- Added feature X
- Fixed bug Y
- Updated documentation for Z

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated
```

---

## Common Tasks

### Adding New Features

1. **Plan**: Break down the feature into tasks
2. **Research**: Check existing code for similar patterns
3. **Implement**: Write code following project conventions
4. **Test**: Ensure tests exist and pass
5. **Document**: Update relevant documentation
6. **Commit**: Create clear, conventional commits
7. **Push**: Push to feature branch

### Fixing Bugs

1. **Reproduce**: Understand the bug behavior
2. **Locate**: Find the root cause
3. **Fix**: Implement minimal fix
4. **Test**: Verify the fix works
5. **Regression**: Ensure no new bugs introduced
6. **Document**: Add comments if logic is complex

### Refactoring Code

1. **Understand**: Read and comprehend existing code
2. **Plan**: Identify what needs refactoring
3. **Test Coverage**: Ensure tests exist before refactoring
4. **Refactor**: Make incremental changes
5. **Verify**: Run tests after each change
6. **Document**: Update comments/docs if needed

### Code Review Guidelines

When reviewing code:
- Check for security vulnerabilities
- Verify tests exist and are meaningful
- Ensure code follows project conventions
- Look for potential bugs or edge cases
- Validate documentation is updated

---

## Best Practices

### Security

- Never commit secrets, API keys, or credentials
- Validate user input at system boundaries
- Use parameterized queries to prevent SQL injection
- Sanitize output to prevent XSS
- Follow OWASP Top 10 guidelines

### Testing

- Write tests for new functionality
- Maintain existing tests when refactoring
- Use descriptive test names
- Test edge cases and error conditions
- Keep tests fast and isolated

### Performance

- Only optimize when necessary
- Profile before optimizing
- Consider readability over premature optimization
- Use appropriate data structures
- Be mindful of time/space complexity

### Code Quality

- Use meaningful variable names
- Keep functions small and focused
- Avoid deep nesting
- Comment complex logic (not obvious code)
- Follow DRY (Don't Repeat Yourself) principle
- Prefer composition over inheritance

### Documentation

- Keep README.md updated
- Document public APIs
- Include examples for complex features
- Update this CLAUDE.md as project evolves
- Document architectural decisions

---

## Project-Specific Notes

### Technology Stack

*To be determined as project develops*

### Key Dependencies

*To be added as dependencies are introduced*

### Environment Setup

*To be documented as project requirements emerge*

### Testing Strategy

*To be defined as testing framework is chosen*

---

## Updating This Document

This document should be updated whenever:

- Project structure changes significantly
- New conventions are established
- Development workflows are modified
- New tools or dependencies are added
- Best practices are refined

AI assistants should suggest updates to this document when they notice it's out of date or missing important information.

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)

---

**Last Updated**: 2026-01-05
**Version**: 1.0.0
**Maintained by**: AI Assistant (Claude)
