# Contributing to Ultra-Fast CSV Parser

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites
- Rust 1.75+ with wasm-pack
- Node.js 18+
- pnpm or npm

### Getting Started
```bash
# Fork and clone the repository
git clone https://github.com/your-username/CSVParser.git
cd CSVParser

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Development Workflow

1. **Choose an issue** from the [GitHub Issues](https://github.com/manpreetsingh90/CSVParser/issues) or create one
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the coding standards
4. **Add tests** for new functionality
5. **Run the full test suite**: `npm test`
6. **Update documentation** if needed
7. **Commit your changes** with descriptive messages
8. **Push and create a Pull Request**

## Coding Standards

### Rust Code
- Follow the official [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/style/index.html)
- Use `rustfmt` for code formatting
- Add comprehensive documentation comments
- Write unit tests for all public functions

### TypeScript/JavaScript Code
- Use TypeScript for all new code
- Follow the [TypeScript Style Guide](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)
- Use ESLint and Prettier for code quality
- Add JSDoc comments for public APIs

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, etc.)
- Reference issue numbers when applicable: `Fix #123: Handle edge case in parser`

## Testing

### Running Tests
```bash
# All tests
npm test

# Rust tests only
npm run test:rust

# JavaScript tests only
npm run test:js

# Watch mode for development
npm run test:watch
```

### Writing Tests
- Add unit tests for all new functionality
- Include edge cases and error conditions
- Test both success and failure scenarios
- Use descriptive test names

### Test Coverage
- Aim for high test coverage (>90%)
- Include integration tests for complex workflows
- Test browser compatibility

## Documentation

### Code Documentation
- Add doc comments to all public functions
- Include parameter descriptions and examples
- Document error conditions and edge cases

### README Updates
- Update README.md for new features
- Add usage examples
- Update API documentation

## Pull Request Process

1. **Ensure tests pass** and add new tests if needed
2. **Update documentation** for any API changes
3. **Add changelog entry** in CHANGELOG.md
4. **Request review** from maintainers
5. **Address feedback** and make requested changes
6. **Merge** once approved

## Issue Reporting

When reporting bugs or requesting features:

- **Use issue templates** when available
- **Provide clear reproduction steps**
- **Include environment details** (OS, Node version, browser)
- **Attach sample files** if applicable
- **Describe expected vs actual behavior**

## Performance Considerations

- Profile performance impact of changes
- Consider memory usage for large files
- Test with various CSV sizes and structures
- Update benchmarks if performance characteristics change

## Security

- Be aware of potential security implications
- Validate all inputs
- Consider DoS attack vectors
- Follow secure coding practices

## Community

- Be respectful and inclusive
- Help other contributors
- Participate in code reviews
- Share knowledge and best practices

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

Thank you for contributing to Ultra-Fast CSV Parser! 🚀