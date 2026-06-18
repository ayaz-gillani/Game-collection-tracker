# Game Collection Tracker

A full-featured Next.js application where users can browse a catalog of games, add them to a personal collection, track their progress, and rate completed games.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 15+ with App Router
- **Styling**: CSS Modules
- **UI Components**: Radix UI primitives
- **Internationalization**: next-intl (English + French)
- **Linting**: ESLint
- **Component Documentation**: Storybook 10+
- **Data Persistence**: localStorage with repository pattern abstraction

## Build and Run Instructions

### Prerequisites

- Node.js 18+ installed

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000). The app redirects to `/en/catalog` by default.

### Production Build

```bash
npm run build
npm start
```

### Storybook (Component Documentation)

```bash
npm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006) to view component stories and documentation.

### Linting

```bash
npm run lint
```

## Features

### Core Functionality

1. **Game Catalog** (`/[locale]/catalog`)
   - Browse ~15 games with covers, genres, release years, and platforms
   - Add games to your personal collection with a single click
   - Visual indicator showing "Added" for games already in collection
   - See collection status and ratings directly on catalog cards

2. **My Collection** (`/[locale]/collection`)
   - View all games you've added
   - Change game status: Not Started → In Progress → Completed
   - Rate completed games (1-5 stars)
   - Remove games from collection (with confirmation for "In Progress" games)
   - Filter by genre and sort by title, rating, or date added

3. **Locale Switching**
   - Toggle between English and French
   - Locale-aware routing (`/en/...` and `/fr/...`)
   - Navigation links update automatically

4. **Artificial Delay Simulation**
   - All repository operations include a 300ms delay to simulate network latency
   - Demonstrates meaningful loading and error states throughout the app

## Architectural Decisions

### 1. Repository Pattern with localStorage Abstraction

**Why**: Clean separation of concerns. UI code never directly touches `localStorage`; all persistence is abstracted behind `ICollectionRepository`.

**How**:

- `src/repositories/types.ts` defines the interface
- `src/repositories/localStorage.ts` implements it
- Easy to swap backend/API without touching UI code

### 2. React Context + useReducer for State Management

**Why**:

- No external dependencies (keeps bundle lean)
- Sufficient for this scale
- Native to React
- Works well with repository pattern

**How**:

- `CollectionContext` wraps children and provides collection state + actions
- `useCollection` custom hook for accessing state in components
- Reducer handles: ADD_GAME, REMOVE_GAME, UPDATE_GAME, SET_COLLECTION, SET_LOADING, SET_ERROR

### 3. CSS Modules Only (Per Requirement)

**Why**: Scoped styling with zero runtime overhead. No global CSS pollution.

**How**: Each component has its own `.module.css` file. Naming follows component hierarchy.

### 4. Radix UI for Accessible Primitives

**Why**: accessible-by-default components (Dialog, Select, etc.).

**How**: ConfirmationDialog and other interactive elements use Radix UI's low-level primitives.

## Cross-Tab Synchronization

### Approach: Native `storage` Event Listener

When a user has the app open in **multiple browser tabs**, changes in one tab automatically reflect in others **without page refresh**.

### How It Works

```
Tab A: User adds a game → localStorage updates
         ↓
Window storage event fires in Tab B (but NOT Tab A)
         ↓
Tab B: Listener receives event → updates React state → UI refreshes
```

### Implementation Details

- **File**: `src/repositories/localStorage.ts` → `subscribeToChanges()` method
- **Hook**: `src/hooks/useCollectionSync.ts` → listens to storage events
- **Setup**: Called in `src/app/[locale]/layout.tsx` via CollectionProvider

### Tradeoffs

| Aspect           | Benefit                          | Tradeoff                                    |
| ---------------- | -------------------------------- | ------------------------------------------- |
| **Zero Polling** | No CPU overhead; instant updates | Requires localStorage mutations             |
| **Event-Based**  | Fires instantly across tabs      | Only fires on _other_ tabs (not source tab) |
| **Full Reload**  | Simple, no merge logic needed    | Reloads entire collection                   |

### Testing Cross-Tab Sync

1. Open the app in two browser windows/tabs
2. In Tab A, navigate to `/en/catalog` and add a game
3. Switch to Tab B (at `/en/collection`)
4. **Result**: The game appears instantly without refreshing

## Component Hierarchy

```
Layout (CollectionProvider wraps all)
│
├── Navigation (locale switcher, page links)
│
├── Catalog Page
│   └── GameCard[] (display game; "Add to Collection" button)
│
└── Collection Page
    ├── FilterBar (filter by genre, sort by title/rating/date)
    └── CollectionCard[] (manage status, rating, remove)
        ├── StarRating (interactive 1-5 star input)
        ├── StatusBadge (visual status indicator)
        └── ConfirmationDialog (confirmation for "In Progress" removals)
```

### Primitive Components

- **StatusBadge**: Color-coded status indicator (NotStarted, InProgress, Completed)
- **StarRating**: Interactive 5-star rating input with hover preview
- **ConfirmationDialog**: Accessible confirmation modal (Radix UI Dialog)

### Compound Components

- **GameCard**: Game display + "Add to Collection" action
- **CollectionCard**: Full game management (status dropdown + rating + remove)
- **FilterBar**: Genre filter checkboxes + sort dropdown

## Storybook Documentation

Stories document 4 components at different levels:

1. **StatusBadge.stories.ts** (Primitive)
   - Shows all three status states
   - "AllStatuses" story demonstrates visual differences

2. **StarRating.stories.ts** (Primitive)
   - Empty, partial, and full ratings
   - Interactive example showing hover/click behavior
   - Disabled state

3. **GameCard.stories.ts** (Compound)
   - Not in collection (shows "Add" button)
   - In collection (shows "Added" + status)
   - Completed with rating (shows full state)
   - Loading state

4. **CollectionCard.stories.ts** (Compound)
   - Not Started, In Progress, Completed states
   - Shows rating input only when Completed

Run Storybook: `npm run storybook`

## Data Flow

### Adding a Game

```
1. User clicks "Add to Collection" on GameCard
2. GameCard calls useCollection.addGame(gameId)
3. useCollection dispatches ADD_GAME action
4. Reducer updates local state (optimistic)
5. collectionRepository.addGame() saves to localStorage (with 300ms delay)
6. collectionRepository emits subscribeToChanges() event
7. Other tabs receive storage event → sync state
```

### Updating Status/Rating

```
1. User changes status dropdown in CollectionCard
2. CollectionCard calls useCollection.updateGameStatus()
3. useCollection dispatches UPDATE_GAME action
4. Reducer updates local state
5. collectionRepository.updateGame() persists to localStorage
6. Other tabs see change via storage event
```

### Removing a Game

```
1. User clicks "Remove" on CollectionCard
2. If status is "In Progress", show ConfirmationDialog
3. On confirm, CollectionCard calls useCollection.removeGame()
4. useCollection dispatches REMOVE_GAME action
5. Reducer removes (soft delete) game from collection
6. collectionRepository.removeGame() deletes from localStorage
```

## What Would Improve This Given More Time

1. **Proper Error Handling & Toast Notifications**
   - Currently: Errors logged to console and stored in context
   - Better: Toast/snackbar UI for quota exceeded, corrupted data, etc.

2. **Progressive Enhancement**
   - Currently: "use client" on pages prevents server-side rendering
   - Better: Use server components where possible; only client on interactive parts

3. **Test Coverage**
   - Unit tests for reducer logic
   - Integration tests for repository + context
   - E2E tests for cross-tab sync

4. **Performance Optimizations**
   - Memoize GameCard/CollectionCard with React.memo to prevent unnecessary re-renders
   - Lazy load game images with next/image
   - Pagination for large collections

5. **Enhanced UI/UX**
   - Search functionality
   - Game details modal/page
   - Statistics dashboard (completion rate, average rating, etc.)
   - Dark mode toggle
   - Mobile-optimized layout (current layout is responsive but basic)

## AI Assistant Usage Approach

This project was developed with AI assistants (Copilot/Claude) in the following ways:

1. **Architecture & Planning**: AI helped design the repository pattern, context API structure, and cross-tab sync strategy.

2. **Component Scaffolding**: AI generated initial component templates, CSS styling, and Storybook stories.

3. **Type Definitions**: AI ensured TypeScript types were complete and strict.

4. **CSS Module Generation**: AI created cohesive, utility-friendly CSS using Tailwind-inspired patterns within CSS Modules.

5. **Error Handling**: AI suggested error boundaries, fallbacks, and graceful degradation strategies.

6. **Documentation**: AI drafted README and code comments; human reviewed and refined.

### Key Principle

AI was used for:

- ✓ Boilerplate scaffolding
- ✓ Pattern implementation
- ✓ Documentation generation

AI was NOT used for:

- ✗ Core architectural decisions (Context + Repository)
- ✗ Feature design (human designed cross-tab sync, filtering, etc.)
- ✗ Testing & validation (human manual testing required)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- ES2020+ JavaScript support required
