# FIXSPACE

### Spatial Engineering Copilot

**Understand the object. Follow the process. Keep your hands free.**

FIXSPACE is an augmented reality engineering assistant designed to guide users through electronics assembly using spatial instructions and hands-free interactions.

Built for **Snap Spectacles using Lens Studio**, FIXSPACE explores how spatial computing can make hardware assembly easier to understand and follow.

---

## The Problem

Working with electronics often requires switching between:
- Circuit diagrams
- Online tutorials
- Pinout documentation
- Physical components
- Wiring references

This makes assembly unnecessarily complicated, particularly for beginners who need to understand both where a connection goes and why it is necessary.

## The Solution

FIXSPACE brings engineering instructions into the workspace.

Instead of following a static circuit diagram, users receive contextual, step-by-step guidance designed for augmented reality.

### Core Features

- **Guided Assembly:** Follow individual wiring instructions instead of navigating complex diagrams.
- **Component Confirmation:** Confirm the components being used before starting an assembly.
- **Pin-to-Pin Guidance:** Planned visual guidance between component connection points.
- **Contextual Explanations:** Understand why each connection is required.
- **Interactive Controls:** Navigate instructions using hands-free interaction concepts.
- **Progress Tracking:** Follow the assembly process from beginning to completion.

## Initial Hardware Workflow

The initial prototype focuses on:

| Component | Purpose |
|---|---|
| ESP32 | Microcontroller |
| L298N | Dual H-bridge motor driver |
| DC Motors | Motor control demonstration |

The workflow guides users through the connections between the ESP32 and L298N.

## Technology Stack

- **Platform:** Snap Spectacles
- **Development Environment:** Lens Studio 5.24
- **Language:** TypeScript
- **Interaction Framework:** Spectacles Interaction Kit (SIK)
- **Development:** Lens Studio MCP / CLAD-assisted workflow

## Project Architecture

```text
FIXSPACE/
│
├── Assets/
│   ├── LEAF/
│   ├── Render/
│   └── Scripts/
│       └── FIXSPACE.ts
│
├── Packages/
│   └── SpectaclesInteractionKit/
│
├── devpost/
│   ├── design-brief.md
│   └── SESSION_HANDOFF.md
│
├── Project.esproj
└── README.md
```

*Directory contents may evolve during development.*

## Current Development Status

FIXSPACE is under active development.

Current focus:
- Scene and interface construction
- Script-to-scene integration
- Interactive setup workflow
- Step-by-step wiring instructions
- Interactive Preview testing

Some advanced capabilities, including automatic component recognition, physical pin alignment, and real-world connection verification, are part of the longer-term vision and should not be considered implemented features.

## Running the Project

### Requirements

- Windows or macOS
- Lens Studio 5.24 or compatible version
- FIXSPACE project files
- Spectacles Interaction Kit

### Setup

1. Clone or download this repository.
2. Open `Project.esproj` in Lens Studio.
3. Allow the project packages and assets to load.
4. Inspect the scene hierarchy.
5. Configure the required scene objects and script inputs.
6. Launch Interactive Preview to test the experience.

Spectacles hardware may be required for testing device-specific functionality.

## Vision

FIXSPACE aims to make practical engineering knowledge accessible at the point of action.

From understanding individual components to completing complex wiring workflows, the goal is to make hardware assembly more intuitive through spatial computing.

---

**FIXSPACE — Engineering guidance, right where you need it.**

*Developed as an exploration of augmented reality, spatial interaction, and hands-free engineering assistance.*
