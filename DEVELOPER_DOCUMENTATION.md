# DayGrid Developer Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Component Guide](#component-guide)
7. [State Management](#state-management)
8. [Business Logic](#business-logic)
9. [Security Features](#security-features)
10. [Development Workflow](#development-workflow)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Project Overview

DayGrid is a robust daily time and task management system built with modern web technologies. It provides comprehensive task scheduling, priority management, and anti-cheating mechanisms for reliable daily planning.

### Key Features
- **Task Management**: Create, schedule, and track tasks with different types
- **Priority System**: 1-10 priority scale with exclusive high-priority tasks
- **Daily Scheduling**: Visual 24-hour time grid with business hour enforcement
- **State Management**: Planning → Active → Completed workflow
- **Drag & Drop**: Intuitive task scheduling interface
- **Animations**: Smooth GSAP-powered interactions
- **Security**: Immutable logging and anti-cheating mechanisms

### Technology Stack
- **Frontend**: Next.js 16.1.1, TypeScript 5, Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI based)
- **Animations**: GSAP (GreenSock) with React 19 integration
- **State Management**: React Context + Zustand
- **Drag & Drop**: @dnd-kit core + sortable + utilities
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Form Handling**: React Hook Form + Zod schemas
- **Date Handling**: date-fns library
- **Notifications**: Sonner toast system
- **Icons**: Lucide React

---

## 🏗️ Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Premium public landing page
│   ├── dashboard/page.tsx  # Authenticated dashboard
│   ├── waitlist/page.tsx   # Waitlist application form
│   ├── manifesto/page.tsx  # Product vision page
│   ├── auth/               # Authentication pages
│   │   ├── login/page.tsx  # Login form
│   │   └── signup/page.tsx # Signup form
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── main-application/   # Dashboard application components
│   │   ├── task-inbox/     # Task creation and management
│   │   ├── daily-grid/     # 24-hour scheduling with d&d
│   │   ├── day-management/ # Day state controls
│   │   ├── animations/     # Dashboard animations
│   │   └── waitlist/       # Waitlist form
│   ├── public-side/        # Landing page components
│   │   ├── hero/           # Hero section with animations
│   │   ├── features/       # Feature showcase
│   │   ├── how-it-works/   # Process explanation
│   │   ├── cta/            # Call-to-action sections
│   │   ├── footer/         # Footer component
│   │   └── layout/         # Background effects
│   └── shared/             # Shared application components
│       ├── navigation/     # Public and dashboard nav
│       ├── ui/             # shadcn/ui base components
│       └── animations/     # Shared animation utilities
├── context/               # React Context providers
│   ├── task-context.tsx    # Task state management
│   ├── day-context.tsx     # Day state management
│   ├── auth-context.tsx    # Authentication context
│   └── animation-context.tsx # GSAP animation context
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts         # Authentication logic
│   ├── use-tasks.ts        # Task CRUD operations
│   ├── use-day-state.ts    # Day management logic
│   ├── use-drag-and-drop.ts # DnD functionality
│   ├── use-gsap-animation.ts # Animation utilities
│   ├── use-local-storage.ts # Storage management
│   └── use-security-monitoring.ts # Security logging
├── lib/                   # Utility libraries
│   ├── validations/        # Zod form validation schemas
│   ├── animations/         # GSAP utilities
│   ├── security/           # Security, crypto, logging
│   ├── supabase/          # Database client and types
│   └── utils.ts            # General utilities
├── store/                 # Zustand stores
│   ├── task-store.ts       # Persistent task storage
│   └── day-store.ts        # Day state persistence
├── types/                 # TypeScript definitions
│   ├── index.ts            # Barrel exports
│   ├── task.ts             # Task interfaces and enums
│   ├── day.ts              # Day state interfaces
│   ├── user.ts             # User interfaces
│   ├── api.ts              # API interfaces
│   ├── database.ts         # Database schemas
│   └── public-side.ts      # Landing page types
└── public/                # Static assets
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

### Data Flow

```
User Actions → Context → Store → Components
    ↓
    ↓
Immutable Logger ← State Changes → Security Validation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- pnpm package manager
- Modern browser with ES6+ support
- Git for version control

### Installation

```bash
# Clone repository
git clone <repository-url>
cd daygrid

# Install dependencies
pnpm install

# Set up environment (optional for development - works with mock data)
cp .env.example .env.local
# Fill in your Supabase credentials for production

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🧠 Core Concepts

### Task System

#### Task Types
```typescript
enum TaskType {
  REGULAR = 'regular',      // Normal work tasks
  MEETING = 'meeting',        // Can be rescheduled
  CLASS = 'class',            // Can be rescheduled
  APPOINTMENT = 'appointment',   // Can be rescheduled
  DEADLINE = 'deadline',       // Fixed, cannot move
  COMMITMENT = 'commitment',    // Fixed, cannot move
}
```

#### Priority System
- **Low Priority (1-6)**: Unlimited tasks allowed
- **High Priority (7-10)**: Exclusive - only ONE task can have 7-10 priority
- **Priority Validation**: Automatic enforcement via context

#### Task Lifecycle
```
Created → Scheduled → Active → [Completed | Failed | Abandoned]
```

### Day States

```typescript
enum DayStatus {
  PLANNING = 'planning',    // Full flexibility
  ACTIVE = 'active',          // Schedule locked
  COMPLETED = 'completed',      // View-only
}
```

### Business Hours
- **Allowed**: 6:00 - 22:00
- **Blocked**: 22:00 - 6:00
- **Validation**: Automatic enforcement

---

## 📚 API Reference

### Task Hooks

#### useTasks()
Main task management hook with CRUD operations.

```typescript
const {
  tasks,                    // Array of all tasks
  addTask,                 // Create new task
  updateTask,               // Update existing task
  deleteTask,               // Remove task
  scheduleTask,              // Schedule task at time
  completeTask,             // Mark task complete
  failTask,                 // Mark task failed
  abandonTask,              // Mark task abandoned
  getTasksByType,          // Filter by type
  getHighPriorityTasks,      // Get high priority tasks
  getScheduledTasks,          // Get scheduled tasks
  getUnscheduledTasks,        // Get unscheduled tasks
} = useTasks()
```

#### Task Creation
```typescript
addTask({
  title: 'Complete project documentation',
  priority: 8,              // 1-10 scale
  duration: 2,               // Hours
  type: TaskType.REGULAR,
  completed: false,
  failed: false,
  abandoned: false
})
```

### Day State Hooks

#### useDayState()
Day management and validation hook.

```typescript
const {
  state: { currentDay, isLoading, error },
  startNewDay,              // Initialize new day
  activateDay,              // Start active mode
  completeDay,              // Complete day
  canModifySchedule,         // Check if changes allowed
  canRescheduleTask,        // Check reschedule permission
  validateTimeSlot           // Check time slot availability
} = useDayState()
```

#### Time Slot Validation
```typescript
const isValid = validateTimeSlot(
  startTime: 14,             // Hour (0-23)
  duration: 2,               // Hours
  excludeTaskId?: 'task_123'   // Optional exclusion
)
```

### Authentication

#### useAuth()
Authentication and user management.

```typescript
const {
  user,                     // Current user object
  isAuthenticated,           // Boolean
  login,                    // Sign in function
  signup,                   // Register function
  logout,                   // Sign out function
  isLoading                 // Loading state
} = useAuth()
```

---

## 🧩 Component Guide

### Task Components

#### TaskCard
Display single task with actions and priority indicators.

```typescript
<TaskCard
  task={task}
  onEdit={(task) => handleEdit(task)}
  onDelete={(id) => handleDelete(id)}
  className="custom-class"
/>
```

#### TaskForm
Create/edit task form with validation.

```typescript
<TaskForm
  trigger={<Button>Add Task</Button>}
  onSuccess={() => console.log('Task created')}
  initialTask={existingTask}  // Optional for edit mode
/>
```

#### PrioritySlider
Interactive priority selection slider.

```typescript
<PrioritySlider
  value={priority}
  onChange={setPriority}
  disabled={isLocked}
/>
```

#### TaskTypeSelector
Visual task type selection.

```typescript
<TaskTypeSelector
  value={taskType}
  onChange={setTaskType}
  disabled={isLocked}
/>
```

### Grid Components

#### TimeSlot
Individual hour slot in daily grid.

```typescript
<TimeSlot
  hour={14}
  tasks={[task1, task2]}
  onTaskDrop={(taskId, hour) => handleDrop(taskId, hour)}
/>
```

#### DailyGrid
Complete 24-hour scheduling grid.

```typescript
<DailyGrid
  date="2024-01-15"
  tasks={scheduledTasks}
  className="custom-grid"
/>
```

### Management Components

#### DayStatusComponent
Display current day state and statistics.

```typescript
<DayStatusComponent
  dayState={currentDay}
  onStartDay={handleStart}
  onCompleteDay={handleComplete}
/>
```

#### StartDayButton
Button to transition from planning to active mode.

```typescript
<StartDayButton
  onDayStart={handleStart}
  disabled={!allTasksScheduled}
/>
```

---

## 🔄 State Management

### React Context Architecture

#### TaskContext
Global task state and operations.

```typescript
interface TaskContextType {
  state: TaskState              // { tasks, isLoading, error }
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  // ... other operations
}
```

#### DayContext
Day state management and validation.

```typescript
interface DayContextType {
  state: DayContextState         // { currentDay, isLoading, error }
  startNewDay: (date: string) => void
  activateDay: () => void
  canModifySchedule: () => boolean
  validateTimeSlot: (start: number, duration: number) => boolean
  // ... other operations
}
```

#### AnimationContext
GSAP animation utilities.

```typescript
interface AnimationContextType {
  animateTaskEntrance: (element: HTMLElement) => gsap.core.Tween
  animateTaskDrag: (element: HTMLElement) => gsap.core.Tween
  animateTaskDrop: (element: HTMLElement) => gsap.core.Timeline
  animateTaskCompletion: (element: HTMLElement) => gsap.core.Tween
  animateError: (element: HTMLElement) => gsap.core.Tween
}
```

### Zustand Stores

#### TaskStore
Persistent task storage with localStorage.

```typescript
interface TaskStore {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  // ... persistence handled automatically
}
```

#### DayStore
Day state persistence.

```typescript
interface DayStore {
  currentDay: DayState | null
  setDayState: (dayState: DayState) => void
  updateDayStatus: (status: DayStatus) => void
}
```

---

## 📊 Business Logic

### Priority Enforcement

#### High Priority Exclusivity
```typescript
// Automatic validation in TaskContext
const addTask = (taskData) => {
  const hasHighPriority = tasks.some(t => t.priority >= 7)
  
  if (taskData.priority >= 7 && hasHighPriority) {
    throw new Error('Only one Task can have high priority (7-10)')
  }
  
  // Continue with Task creation
}
```

#### Priority Visualization
- **Low (1-3)**: Gray background
- **Medium (4-6)**: Yellow background
- **High (7-10)**: Red background with warning icon

### Scheduling Validation

#### Time Slot Conflicts
```typescript
const validateTimeSlot = (startTime, duration, excludeTaskId) => {
  const businessHoursStart = 6
  const businessHoursEnd = 22
  
  // Check business hours
  if (startTime < businessHoursStart || startTime + duration > businessHoursEnd) {
    return false
  }
  
  // Check for overlaps
  for (const Task of tasks) {
    if (Task.id === excludeTaskId || Task.scheduledTime === undefined) continue
    
    const TaskStart = Task.scheduledTime
    const TaskEnd = TaskStart + Task.duration
    const newEnd = startTime + duration
    
    if (startTime < TaskEnd && newEnd > TaskStart) {
      return false // Overlap detected
    }
  }
  
  return true // Valid slot
}
```

### Day State Transitions

#### Planning Mode
- Full task CRUD operations
- Schedule modifications allowed
- Drag & drop enabled
- Time slot validation active

#### Active Mode
- Immutable schedule
- Only task completion status changes
- No schedule modifications
- Anti-cheating mechanisms active

#### Completed Mode
- Read-only view
- All actions disabled
- Full audit trail available

---

## 🔒 Security Features

### Immutable Logging

#### Task Log Creation
```typescript
const createTaskLog = (taskId, action, timestamp, previousState, newState) => {
  const logData = { taskId, action, timestamp, previousState, newState }
  const hash = generateHash(JSON.stringify(logData))
  
  return {
    id: generateId(),
    taskId,
    action,
    timestamp,
    previousState,
    newState,
    hash  // Cryptographic verification
  }
}
```

#### Log Integrity Verification
```typescript
const verifyLogIntegrity = (log: TaskLog): boolean => {
  const dataToHash = JSON.stringify({
    taskId: log.taskId,
    action: log.action,
    timestamp: log.timestamp.toISOString(),
    previousState: log.previousState,
    newState: log.newState,
  })
  
  const computedHash = generateHash(dataToHash)
  return computedHash === log.hash
}
```

### Anomaly Detection

#### Rapid State Changes
```typescript
const detectRapidChanges = (logs: TaskLog[]): string[] => {
  const anomalies = []
  
  for (let i = 1; i < logs.length; i++) {
    const currentLog = logs[i]
    const previousLog = logs[i - 1]
    
    const timeDiff = currentLog.timestamp.getTime() - previousLog.timestamp.getTime()
    
    // Less than 1 second between logs is suspicious
    if (timeDiff < 1000) {
      anomalies.push(`Rapid state change for task ${currentLog.taskId}`)
    }
  }
  
  return anomalies
}
```

#### Impossible State Transitions
```typescript
const validateStateTransition = (task, action): boolean => {
  switch (action) {
    case 'completed':
      return !task.completed && !task.failed && !task.abandoned
    case 'failed':
      return !task.failed && !task.completed
    case 'abandoned':
      return !task.abandoned && !task.completed
    default:
      return true
  }
}
```

---

## 🛠️ Development Workflow

### Adding New Features

#### 1. Create Component
```typescript
// src/components/main-application/new-feature/component.tsx
'use client'

import React from 'react'
import { Card, CardContent } from '@/components/shared/ui/card'

export function NewFeatureComponent() {
  return (
    <Card>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  )
}
```

#### 2. Add TypeScript Types
```typescript
// src/types/new-feature.ts
export interface NewFeatureType {
  id: string
  name: string
  createdAt: Date
}
```

#### 3. Create Hook
```typescript
// src/hooks/use-new-feature.ts
'use client'

import { useState, useCallback } from 'react'
import { NewFeatureType } from '@/types'

export function useNewFeature() {
  const [data, setData] = useState<NewFeatureType[]>([])
  
  const addItem = useCallback((item: Omit<NewFeatureType, 'id' | 'createdAt'>) => {
    const newItem: NewFeatureType = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    setData(prev => [...prev, newItem])
  }, [])
  
  const removeItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
  }, [])
  
  return { data, addItem, removeItem, setData }
}
```

#### 4. Update Index Files
```typescript
// src/components/main-application/new-feature/index.ts
export { NewFeatureComponent } from './component'

// src/hooks/index.ts
export { useNewFeature } from './use-new-feature'
```

### Testing Components

#### Unit Testing
```typescript
// __tests__/components/NewFeatureComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { NewFeatureComponent } from '@/components/main-application/new-feature'

describe('NewFeatureComponent', () => {
  it('renders correctly', () => {
    render(<NewFeatureComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })
})
```

#### Integration Testing
```typescript
// __tests__/hooks/useNewFeature.test.ts
import { renderHook, act } from '@testing-library/react'
import { useNewFeature } from '@/hooks/use-new-feature'

describe('useNewFeature', () => {
  it('manages state correctly', () => {
    const { result } = renderHook(() => useNewFeature())
    
    act(() => {
      result.current.addData({ id: '1', name: 'Test' })
    })
    
    expect(result.current.data).toHaveLength(1)
  })
})
```

### Code Style Guidelines

#### TypeScript
- Use strict mode
- Prefer interfaces over types
- Use proper generic constraints
- Avoid `any` type when possible

#### React
- Use functional components with hooks
- Follow React 18+ patterns
- Use `'use client'` directive for client components
- Implement proper error boundaries

#### Styling
- Use Tailwind CSS classes
- Follow shadcn/ui patterns
- Implement responsive design
- Use consistent spacing and colors

#### File Organization
- Keep components in feature directories
- Separate concerns (UI, logic, types)
- Use barrel exports (`index.ts`)
- Follow established naming conventions

---

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# TypeScript compilation issues
pnpm build

# Lint issues
pnpm lint

# Development debugging
pnpm dev
```

#### State Management Issues
```typescript
// Debug state changes
console.log('State change:', { previous, current })

// Check context values
const context = useTask()
console.log('Task context:', context.state.tasks)

// Verify store updates
const store = useTaskStore()
console.log('Store state:', store.tasks)
```

#### Animation Issues
```typescript
// GSAP animation debugging
const animation = animateTaskEntrance(element)
console.log('Animation created:', animation)

// Check element existence
useEffect(() => {
  if (!elementRef.current) {
    console.error('Animation element not found')
    return
  }
}, [])
```

#### Performance Issues
```typescript
// Component optimization
const MemoizedComponent = React.memo(({ data }) => {
  // Expensive render logic
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})

// Hook optimization
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data.id, data.type]) // Only recompute when dependencies change
```

### Debug Tools

#### React Developer Tools
- Install React Developer Tools browser extension
- Inspect component hierarchy
- Monitor state changes
- Profile component performance

#### Network Debugging
```typescript
// API call debugging
const fetchData = async () => {
  try {
    const response = await fetch('/api/tasks')
    console.log('API response:', response)
    return response.json()
  } catch (error) {
    console.error('API error:', error)
    throw error
  }
}
```

### Environment Issues

#### Development vs Production
```typescript
// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  // Development-only code
  console.log('Debug info:', data)
}
```

#### Configuration Issues
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify TypeScript config
cat tsconfig.json

# Check Next.js config
cat next.config.js
```

---

## 🔧 Advanced Customization

### Custom Task Types
```typescript
// src/types/task.ts
export enum TaskType {
  REGULAR = 'regular',
  MEETING = 'meeting',
  // Add new types
  CUSTOM_TYPE = 'custom_type',
}

// Update task type selector
const taskTypeOptions = [
  // ... existing options
  {
    value: TaskType.CUSTOM_TYPE,
    label: 'Custom Type',
    icon: CustomIcon,
    description: 'Custom task type'
  }
]
```

### Custom Animations
```typescript
// src/context/animation-context.tsx
export function AnimationProvider({ children }) {
  const customAnimation = (element: HTMLElement) => {
    return gsap.to(element, {
      scale: 1.2,
      rotation: 180,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    })
  }
  
  return (
    <AnimationContext.Provider
      value={{
        // ... existing animations
        customAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}
```

### Custom Business Rules
```typescript
// src/hooks/use-business-rules.ts
export function useBusinessRules() {
  const validateCustomRule = (task: Task): boolean => {
    // Custom validation logic
    return task.priority <= 5 || task.type === TaskType.DEADLINE
  }
  
  return { validateCustomRule }
}
```

---

This documentation provides a comprehensive guide to understanding, developing, and extending the DayGrid codebase. 

### Additional Resources
- **Context File**: `/context.txt` - Quick reference for current project state
- **Project Plans**: `/daygrid-plan.txt` and `/daygrid-ai-launch-plan.txt` - Development roadmap
- **Component Examples**: Refer to existing components in `/src/components/main-application/` and `/src/components/public-side/`
- **Security Implementation**: See `/src/lib/security/` for anti-cheating mechanisms
- **Animation Examples**: Check `/src/lib/animations/` and component files for GSAP usage

For specific implementation details, refer to the source code and inline comments throughout the project.