# WebGL Graphics Engine

A proof-of-concept graphics engine built with WebGL 2 and TypeScript to understand the fundamentals of 3D graphics programming.

![WebGL Graphics Engine](https://via.placeholder.com/800x400?text=WebGL+Graphics+Engine)

## Overview

This project is designed to explore how modern graphics engines work by building a minimal implementation from scratch. It focuses on understanding the core concepts of 3D rendering, shader programming, matrix transformations, and basic mesh creation.

## Features

- **WebGL 2 Rendering**: Utilizes modern WebGL 2 features for improved performance
- **3D Primitives**: Built-in support for basic shapes like cubes and planes
- **Matrix Math**: Custom implementation of matrix operations for transformations
- **Camera Controls**: Perspective camera with look-at functionality
- **Shader Management**: Simple shader compilation and program creation
- **Interactive Controls**: Slider UI for manipulating scene parameters
- **BRDF Shading Models**: Examples of physically-based rendering techniques

## Project Structure

```
webgl-graphics-engine/
├── src/
│   ├── classes/           # Core engine classes
│   ├── examples/          # Example implementations
│   ├── shaders/           # GLSL shader files
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── index.html         # Main HTML entry point
│   └── index.ts           # TypeScript entry point
├── webpack.config.js      # Webpack configuration
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webgl-graphics-engine.git
cd webgl-graphics-engine

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

This will start a development server at http://localhost:8080 with hot reload enabled.

### Building for Production

```bash
# Build the project for production
npm run build
```

The compiled project will be available in the `dist` directory.

## Examples

The project includes several examples to demonstrate different graphics concepts:

1. **Hello Triangle**: Basic triangle rendering
2. **Movement and Colors**: Dynamic object positioning and coloring
3. **3D Cube**: 3D rendering with matrices and rotations
4. **Lighting**: Basic lighting models
5. **BRDF Models**: Physically-based rendering with Phong shading

## Core Components

### GraphicsEngine

The central class that handles WebGL context creation, shader compilation, and rendering.

```typescript
const engine = new GraphicsEngine("glCanvas", vertexCode, fragmentCode);
```

### Mesh

Represents 3D objects with vertices, triangles, and transformation properties.

```typescript
const cube = Mesh.CreateCubePrimitive(1, new Vector3(0, 0.5, 0), new Vector3(0, 45, 0));
```

### Matrix4x4

Handles matrix operations essential for 3D transformations.

```typescript
const viewMatrix = Matrix4x4.lookAt(cameraPosition, targetPosition);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
