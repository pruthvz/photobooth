# Photobooth Web App

## Overview

The Photobooth Web App is a modern web application that recreates the classic photobooth experience in your browser. Users can capture photos using their device's camera, enhance them with effects, and create memorable photobooth strips.

## Core Features

- Real-time camera integration
- Countdown timer for photo capture
- Multiple photo captures with preview
- Background effects and filters
- Photobooth strip layout generation
- Local image download capability

## User Flow

### 1. Landing Page
- Initial "Get Started" screen
- Camera permission request
- Seamless transition to capture mode

### 2. Photo Capture
- Interactive countdown timer
- Sequential capture of three photos
- Real-time preview panel
- Individual photo retake option
- Progress tracking

### 3. Customization
- Multiple background effect options
  - Vintage filter
  - Sepia tone
  - Black & white
  - Modern filters
- Real-time effect preview
- Easy reset functionality

### 4. Final Output
- Automatic strip layout generation
- Preview before download
- High-quality image export
- Local storage saving

## Technical Stack

### Frontend
- HTML5/CSS3
- React with TypeScript
- Tailwind CSS for styling
- Headless UI for accessible components
- Responsive design principles

### State Management
- Zustand for global state
- React hooks for local state

### Build & Development
- Vite as build tool
- TypeScript for type safety
- ESLint & Prettier for code quality

### Core APIs & Libraries
- Camera Access: `navigator.mediaDevices.getUserMedia()`
- Image Processing: Canvas API
- Effects: `fabric.js` library
- Export: `canvas.toDataURL()`

### Testing
- Vitest for unit testing
- React Testing Library for component testing

### Project Structure
```markdown
- Camera interface module
- Timer system
- Image processing pipeline
- Layout generator
- Export handler
```

## Roadmap

### Planned Features
1. Animated GIF support
2. Social media integration
3. Custom layout options
4. AI-powered background removal

### Future Considerations
- Mobile optimization
- Offline capability
- Cloud storage integration
- Multi-device synchronization

## Development Guidelines

### Best Practices
- Modular component structure
- Responsive design principles
- Performance optimization
- Error handling
- User permission management

### Performance Targets
- Initial load < 3s
- Camera initialization < 1s
- Image processing < 500ms
- Export generation < 2s

---

📝 This documentation is maintained as part of the Photobooth Web App project.