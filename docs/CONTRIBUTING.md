# Contributing to Thryve

Thank you for your interest in contributing to Thryve! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code Review Guidelines](#code-review-guidelines)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Node.js** (v18.0.0 or higher)
2. **npm** (v8.0.0 or higher)
3. **Git**
4. **MongoDB** (local or Atlas)
5. **Code Editor** (VS Code recommended)

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/thryve-ui.git
   cd thryve-ui
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies for all components
   npm run install:all
   
   # Set up environment variables
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp admin-frontend/.env.example admin-frontend/.env
   ```

3. **Start Development Servers**
   ```bash
   # Run all services
   npm run dev
   ```

4. **Verify Setup**
   - Frontend: http://localhost:5173
   - Admin Panel: http://localhost:5174
   - Backend API: http://localhost:5000

## Development Workflow

### Branch Strategy

We follow a **Git Flow** approach:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes
- `release/*` - Release preparation branches

### Creating a Feature Branch

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Example: feature/user-authentication
# Example: feature/leadership-assessment
# Example: feature/admin-dashboard
```

### Commit Message Convention

We follow the **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add JWT token refresh functionality
fix(api): resolve CORS issue with frontend
docs(readme): update installation instructions
test(backend): add unit tests for user controller
refactor(frontend): optimize component re-rendering
```

### Development Process

1. **Create Issue**: Start with a GitHub issue describing the feature/bug
2. **Create Branch**: Create a feature branch from `develop`
3. **Develop**: Write code following our standards
4. **Test**: Ensure all tests pass
5. **Commit**: Use conventional commit messages
6. **Push**: Push to your fork
7. **Create PR**: Create a pull request to `develop`

## Code Standards

### JavaScript/TypeScript Standards

#### General Guidelines

- Use **ES6+** features
- Prefer **const** and **let** over **var**
- Use **arrow functions** for callbacks
- Use **template literals** for string concatenation
- Use **destructuring** for object/array access

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'john';
const getUserData = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.thryve.com';
const MAX_RETRY_ATTEMPTS = 3;

// Classes: PascalCase
class UserService {}

// Files: kebab-case
// user-service.js
// leadership-assessment.js
```

#### Code Organization

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// 2. Constants
const API_ENDPOINTS = {
  USERS: '/users',
  ASSESSMENTS: '/assessments'
};

// 3. Component/Function
const UserComponent = ({ userId }) => {
  // 4. State declarations
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 5. Hooks
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  
  // 6. Event handlers
  const handleUserUpdate = async (userData) => {
    // Implementation
  };
  
  // 7. Render/Return
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default UserComponent;
```

### React Standards

#### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render helpers
  const renderHelper = () => {
    return <div>Helper content</div>;
  };
  
  // Main render
  return (
    <div className="component-name">
      {renderHelper()}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

#### Hooks Guidelines

- Use custom hooks for reusable logic
- Keep hooks simple and focused
- Use dependency arrays correctly
- Avoid infinite loops

```javascript
// Good: Custom hook
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);
  
  return { user, loading };
};

// Usage
const UserProfile = ({ userId }) => {
  const { user, loading } = useUserData(userId);
  // Component logic
};
```

### Backend Standards

#### Express.js Structure

```javascript
// Controller structure
const userController = {
  // GET handler
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // POST handler
  async createUser(req, res) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;
```

#### Error Handling

```javascript
// Centralized error handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error'
  });
};
```

### CSS/Styling Standards

#### Tailwind CSS Guidelines

- Use utility classes for styling
- Create custom components for repeated patterns
- Use consistent spacing and color scales
- Follow responsive design principles

```jsx
// Good: Using Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">
    {title}
  </h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
    {buttonText}
  </button>
</div>

// Good: Custom component for repeated patterns
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);
```

## Testing Guidelines

### Frontend Testing

#### Component Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    email: 'john@example.com'
  };
  
  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('handles edit button click', () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Hook Testing

```javascript
import { renderHook, act } from '@testing-library/react';
import { useUserData } from './useUserData';

describe('useUserData', () => {
  it('fetches user data on mount', async () => {
    const { result } = renderHook(() => useUserData('123'));
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeDefined();
  });
});
```

### Backend Testing

#### API Testing

```javascript
import request from 'supertest';
import app from '../server';
import { connect, disconnect } from '../config/db';

describe('User API', () => {
  beforeAll(async () => {
    await connect();
  });
  
  afterAll(async () => {
    await disconnect();
  });
  
  describe('POST /users', () => {
    it('creates a new user', async () => {
      const userData = {
        firstName: 'John',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
    });
    
    it('validates required fields', async () => {
      const response = await request(app)
        .post('/users')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });
});
```

#### Unit Testing

```javascript
import { validateUser } from '../utils/validation';

describe('User Validation', () => {
  it('validates correct user data', () => {
    const userData = {
      firstName: 'John',
      email: 'john@example.com',
      password: 'password123'
    };
    
    const result = validateUser(userData);
    expect(result.isValid).toBe(true);
  });
  
  it('rejects invalid email', () => {
    const userData = {
      firstName: 'John',
      email: 'invalid-email',
      password: 'password123'
    };
    
    const result = validateUser(userData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });
});
```

### Test Coverage Requirements

- **Frontend**: Minimum 80% coverage
- **Backend**: Minimum 85% coverage
- **Critical paths**: 100% coverage

## Pull Request Process

### Before Creating a PR

1. **Ensure Tests Pass**
   ```bash
   # Frontend
   cd frontend && npm test
   
   # Backend
   cd backend && npm test
   ```

2. **Check Code Quality**
   ```bash
   # Lint code
   npm run lint
   
   # Format code
   npm run format
   ```

3. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update API documentation

### Creating a Pull Request

1. **Title**: Use conventional commit format
   ```
   feat: add user authentication system
   fix: resolve CORS issue in development
   ```

2. **Description**: Use the PR template
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No console errors
   ```

3. **Link Issues**: Reference related issues
   ```
   Closes #123
   Related to #456
   ```

### PR Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code coverage is checked
   - Linting and formatting verified

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Update PR based on feedback

3. **Merge Requirements**
   - All tests pass
   - Code review approved
   - No merge conflicts
   - Documentation updated

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 90]
- Version: [e.g. 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## Code Review Guidelines

### Review Checklist

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Performance**: Are there any performance issues?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Maintainability**: Is the code easy to understand and maintain?
- [ ] **Testing**: Are there adequate tests?
- [ ] **Documentation**: Is the code well-documented?

### Review Comments

- **Be constructive**: Focus on the code, not the person
- **Be specific**: Point out exact issues and suggest solutions
- **Be respectful**: Use polite and professional language
- **Ask questions**: If something is unclear, ask for clarification

### Example Review Comments

```markdown
// Good: Specific and constructive
This function could be simplified by using array destructuring:
```javascript
const { firstName, lastName } = user;
```

// Good: Asking for clarification
Could you explain why this timeout is set to 5000ms? Is this value configurable?

// Good: Suggesting improvements
Consider adding error handling for the API call to handle network failures gracefully.
```

## Release Process

### Version Management

We use **Semantic Versioning** (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Create Release Branch**
   ```bash
   git checkout develop
   git checkout -b release/v1.2.0
   ```

2. **Update Version**
   ```bash
   # Update package.json versions
   npm version patch  # or minor/major
   ```

3. **Final Testing**
   ```bash
   # Run all tests
   npm test
   
   # Manual testing
   npm run dev
   ```

4. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

5. **Deploy**
   - Deploy to staging environment
   - Run integration tests
   - Deploy to production

6. **Cleanup**
   ```bash
   git checkout develop
   git merge release/v1.2.0
   git branch -d release/v1.2.0
   ```

## Getting Help

### Resources

- **Documentation**: Check the `/docs` folder
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Slack**: Join our development Slack channel

### Contact

- **Technical Questions**: Create a GitHub issue
- **Feature Requests**: Use the feature request template
- **Bug Reports**: Use the bug report template
- **General Questions**: Use GitHub Discussions

## Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release Notes**: Individual contributions
- **GitHub**: Contributor statistics
- **Documentation**: Code comments and commit history

Thank you for contributing to Thryve! Your contributions help make the platform better for everyone. 