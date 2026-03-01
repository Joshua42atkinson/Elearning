# Local AI Architect - E-Learning Platform

## Overview

This is a comprehensive e-learning platform designed to teach educators how to use local AI for gamifying their lesson plans. The platform demonstrates advanced React development, WASM integration, and modern educational pedagogy.

## Architecture

### Core Technologies
- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with custom glass morphism design
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **WASM Engine**: Bevy/Rust sandbox game
- **Build Tools**: Vite, ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ErrorBoundary.jsx # Error handling wrapper
├── pages/              # Main application pages
│   ├── HomePage.jsx       # Landing page with learning objectives
│   ├── ModuleOne.jsx     # Privacy and setup module
│   ├── ModuleTwo.jsx     # IDE integration module
│   ├── ModuleThree.jsx   # Implementation module
│   ├── SandboxEmbed.jsx  # Interactive WASM assessment
│   ├── MuseumOfMechanics.jsx # Gallery of educational engines
│   ├── KnowledgeCheck.jsx # Final quiz assessment
│   └── Documentation.jsx # Technical reference
├── data/               # Static data and content
│   ├── moduleData.jsx   # Module content and videos
│   └── sandboxRegistry.json # Museum engine catalog
└── App.jsx             # Main application with routing
```

## Key Features

### 1. Progressive Learning Structure
- **8-page learning journey** from introduction to assessment
- **Color-coded modules** with visual progress tracking
- **Interactive elements** demonstrating educational theories

### 2. WASM Integration
- **Bevy/Rust sandbox game** running entirely in browser
- **23MB WASM module** with proper MIME type handling
- **Enhanced debugging** and error reporting
- **Loading states** and user feedback

### 3. Educational Design
- **Gagné's 9 Events of Instruction** framework
- **Constructionist learning** approach
- **Isomorphic design** where interface teaches the theory
- **Safe Failure Space** for experimentation

### 4. Error Handling
- **React Error Boundaries** for crash recovery
- **Development debugging** with detailed error info
- **Graceful fallbacks** and user-friendly error messages

## Development Guidelines

### Code Standards
- **ESLint configuration** for code quality
- **Comprehensive comments** for future maintenance
- **Component documentation** with purpose and usage
- **Error boundaries** around major components

### File Naming Conventions
- **PascalCase** for React components (`HomePage.jsx`)
- **camelCase** for utilities and hooks
- **kebab-case** for assets and static files

### Styling Guidelines
- **TailwindCSS utility classes** for consistency
- **Custom CSS variables** in `index.css`
- **Glass morphism design system** with consistent colors
- **Responsive design** with mobile-first approach

## Troubleshooting Guide

### Common Issues

#### Sandbox Page Not Rendering
**Symptoms**: Blank page, pretty color background
**Causes**: JavaScript runtime error, missing imports
**Solutions**:
1. Check browser console for errors
2. Verify all imports are present
3. Ensure ErrorBoundary is working
4. Check WASM file paths and MIME types

#### WASM Game Not Loading
**Symptoms**: Loading spinner never disappears
**Causes**: Incorrect MIME type, file path errors
**Solutions**:
1. Verify `application/wasm` MIME type
2. Check file names match (hyphens vs underscores)
3. Ensure Vite configuration includes WASM support
4. Check browser console for WASM errors

#### Navigation Issues
**Symptoms**: Routes not working, broken links
**Causes**: Router configuration, component imports
**Solutions**:
1. Verify all route components are imported
2. Check Route paths match navigation links
3. Ensure ErrorBoundary wraps Routes

### Debugging Tools

#### Browser Console
- Check for JavaScript errors
- Monitor network requests for WASM files
- Verify component mount/unmount cycles

#### ESLint
```bash
npm run lint
```
- Catches unused imports and variables
- Identifies potential React issues
- Enforces code consistency

#### Development Server
```bash
npm run dev
```
- Hot module replacement
- Source maps for debugging
- Error overlay in browser

## Deployment

### Build Process
```bash
npm run build
```
- Optimized production build
- Asset minification and bundling
- WASM files properly served

### Environment Variables
- `NODE_ENV=development` - Debug mode with detailed errors
- `NODE_ENV=production` - Optimized, minimal error details

## Future Improvements

### Code Quality
- [ ] Fix remaining ESLint warnings (escaped quotes)
- [ ] Add TypeScript for better type safety
- [ ] Implement unit tests for components
- [ ] Add end-to-end testing for sandbox

### Performance
- [ ] Implement code splitting for large modules
- [ ] Optimize WASM loading with streaming
- [ ] Add service worker for offline capability
- [ ] Implement lazy loading for videos

### Accessibility
- [ ] Add ARIA labels throughout
- [ ] Implement keyboard navigation
- [ ] Add screen reader support
- [ ] Ensure color contrast compliance

### Features
- [ ] Progress persistence in localStorage
- [ ] User analytics and learning tracking
- [ ] Community sharing of sandbox templates
- [ ] Multi-language support

## Contributing

1. **Follow existing code patterns** and naming conventions
2. **Add comprehensive comments** for new features
3. **Test with ErrorBoundary** to ensure crash resistance
4. **Verify responsive design** on mobile devices
5. **Update documentation** for any API changes

## License

This project represents advanced educational technology development and serves as a reference for modern React applications with WASM integration.

---

**Last Updated**: March 2026  
**Maintainer**: Joshua Atkinson  
**Framework**: React 18 + Vite + TailwindCSS
