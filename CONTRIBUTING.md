# Contributing to MyWellness

Thank you for your interest in contributing to MyWellness, the FUTA Student Mental Well-being Platform!

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/mywellness.git
   cd mywellness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed  # Optional: seed with test data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Avoid `any` types - use proper type definitions
- Use interfaces for object shapes, types for unions/aliases

### React/Next.js

- Use functional components with hooks
- Prefer `use client` directive only when necessary
- Keep components small and focused
- Use proper TypeScript types for props

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Use shadcn/ui components when available
- Maintain consistency with existing UI patterns

### File Organization

```
app/
  api/           # API routes
  dashboard/     # Student dashboard
  admin/         # Admin dashboard
  login/         # Authentication pages
  ...
lib/            # Utility functions and shared logic
components/     # Reusable UI components
```

## Development Workflow

### Branching

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent production fixes

### Commit Messages

Follow conventional commits:

```
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify assessment scoring logic
test: add unit tests for auth utilities
chore: update dependencies
```

### Pull Request Process

1. Create a new branch from `develop`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request to `develop`
7. Request review from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Accessibility considered
- [ ] Security implications reviewed

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Use Vitest for unit tests
- Test utilities in `lib/` directory
- Test API routes
- Test form validation logic
- Aim for >80% code coverage

## Documentation

### Code Comments

- Comment complex logic
- Document public API functions
- Explain non-obvious decisions
- Keep comments up-to-date

### README Updates

- Update README for new features
- Update installation instructions if changed
- Add new environment variables to documentation
- Update screenshots for UI changes

## Reporting Issues

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, browser)
- Relevant error messages/logs

## Feature Requests

Before proposing new features:

1. Check existing issues to avoid duplicates
2. Consider the project scope and goals
3. Provide a clear use case
4. Suggest implementation approach if possible
5. Consider impact on existing users

## Security

- Never commit secrets or API keys
- Report security vulnerabilities privately (see SECURITY.md)
- Follow security best practices
- Review dependencies for known vulnerabilities

## Code Review

### For Reviewers

- Check for security issues
- Verify code follows style guidelines
- Ensure tests are adequate
- Check for edge cases
- Verify documentation is updated

### For Authors

- Be open to feedback
- Respond to review comments
- Make requested changes promptly
- Ask questions if anything is unclear

## Getting Help

- Check existing documentation
- Search existing issues
- Ask questions in GitHub Discussions
- Contact maintainers for critical issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's contributors list. Thank you for making MyWellness better!
