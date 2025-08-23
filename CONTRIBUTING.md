# Contributing to FlowSync

Thank you for your interest in contributing to FlowSync! We welcome contributions from the community and are excited to see what you'll bring to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@flowsync.app](mailto:conduct@flowsync.app).

## Getting Started

### Ways to Contribute

- **Bug Reports**: Found a bug? Let us know!
- **Feature Requests**: Have an idea for a new feature?
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Documentation**: Help improve our docs
- **Testing**: Help us test new features and find edge cases
- **Design**: Contribute to UI/UX improvements

### Before You Start

1. Check existing [issues](https://github.com/yourusername/flowsync/issues) to see if your bug/feature is already reported
2. For large changes, please open an issue first to discuss the approach
3. Read through this contributing guide

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowsync.git
   cd flowsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

4. **Set up database**
   ```bash
   # Create database
   createdb flowsync_dev
   
   # Run migrations
   npm run db:migrate
   
   # Optional: Add demo data
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run server:dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

6. **Verify setup**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/health

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-calendar-integration`
- `fix/timer-pause-bug`
- `docs/update-readme`
- `refactor/simplify-auth-flow`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(timer): add adaptive interval calculation
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(database): simplify session queries
test(timer): add flow detection tests
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run tests
   npm test
   
   # Run linting
   npm run lint
   
   # Run type checking
   npm run typecheck
   
   # Test in browser
   npm run dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(timer): add adaptive interval calculation"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No merge conflicts with main branch
- [ ] Self-review completed

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Edge cases considered

## Screenshots
If applicable, add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review the code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, the PR will be merged

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promises when possible

### React Components

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Follow the existing component structure

### CSS/Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Use semantic class names
- Responsive design is required
- Dark mode support when applicable

### Database

- Use migrations for schema changes
- Write efficient queries
- Use proper indexing
- Follow PostgreSQL best practices
- Test queries with sample data

## Testing

### Test Types

1. **Unit Tests**: Test individual functions/components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **API Tests**: Test backend endpoints

### Writing Tests

```typescript
// Example unit test
import { formatTime } from '@/utils/helpers'

describe('formatTime', () => {
  it('formats seconds correctly', () => {
    expect(formatTime(125)).toBe('02:05')
  })
  
  it('handles zero correctly', () => {
    expect(formatTime(0)).toBe('00:00')
  })
})
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include examples in documentation
- Document complex algorithms
- Keep comments up to date

### User Documentation

- Update README.md for new features
- Add to API documentation
- Include screenshots for UI changes
- Write clear setup instructions

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Notes

Each release includes:
- Summary of changes
- New features
- Bug fixes
- Breaking changes
- Migration guide (if needed)

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: [dev@flowsync.app](mailto:dev@flowsync.app)

### Development Questions

For development-related questions:

1. Check existing issues and discussions
2. Search the codebase for similar implementations
3. Ask in GitHub Discussions
4. Create an issue with the `question` label

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page
- Special recognition for significant contributions

## License

By contributing to FlowSync, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FlowSync! Your efforts help make productivity tools better for everyone. 🙏