# DayGrid

A robust daily time and task management system built with Next.js 14, TypeScript, and modern web technologies.

## Features

### Core Functionality
- **Task Management**: Create, schedule, and track tasks with different types (regular, meetings, deadlines, etc.)
- **Priority System**: 1-10 priority scale with exclusive high-priority tasks (7-10)
- **Daily Scheduling**: Visual time grid for scheduling tasks with business hours enforcement
- **Day States**: Planning → Active → Completed workflow with locked schedules

### Advanced Features
- **Drag & Drop**: Intuitive task scheduling with drag-and-drop interface
- **GSAP Animations**: Smooth, professional animations for all interactions
- **Immutable Logging**: Comprehensive audit trail with cryptographic verification
- **Anti-Cheating**: Multi-source time verification and anomaly detection
- **Real-time Updates**: Instant UI updates with React Context and state management

### Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom styling
- **Animations**: GSAP (GreenSock) for smooth interactions
- **State Management**: React Context + useReducer + Zustand
- **Drag & Drop**: @dnd-kit for modern drag operations
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Validation**: Zod schemas for type-safe validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd daygrid
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

4. Run development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
│       ├── task-inbox/     # Task management
│       ├── daily-grid/     # Time scheduling grid
│       ├── day-management/ # Day state controls
│       └── animations/     # Animation components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── validations/        # Form validation schemas
│   ├── animations/         # GSAP animation utilities
│   ├── security/           # Security and logging
│   └── supabase/          # Supabase client setup
├── store/                 # Zustand stores
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## Business Logic Rules

### Priority System
- Scale: 1-10 with visual slider
- Low Priority (1-6): Unlimited tasks
- High Priority (7-10): Exclusive - only ONE task can have 7-10 priority
- Exclusivity Rule: If one task has priority 7-10, no other task can be assigned 7-10

### Scheduling Rules
- No overlapping tasks allowed
- Business hours only: 6:00-22:00
- Tasks must fit in available time slots
- Snap to hour grid for consistency
- Tasks must be scheduled to be part of day

### Day States
- **Planning Mode**: Full flexibility, can add/edit/schedule tasks
- **Active Mode**: Immutable schedule, only mark tasks complete/failed/abandoned  
- **Completed Mode**: Day is finished, view-only

### Rescheduling Rules
- Only meetings, classes, and appointments can be rescheduled
- Deadlines and commitments are fixed
- Limited reschedule attempts (varies by task type)

## Security Features

### Immutable Logging
- Every action logged with timestamp
- Cannot modify logs once day starts
- Cryptographic hash verification
- Comprehensive audit trail

### Anti-Cheating Mechanisms
- Multi-source time verification
- State encryption for tamper protection
- Action logging with session tracking
- Anomaly detection for suspicious patterns

## Development Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## Contributing

1. Fork repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built following the comprehensive DayGrid implementation plan
- Uses modern React patterns and best practices
- Implements robust security and logging features
- Provides an intuitive and professional user experience
