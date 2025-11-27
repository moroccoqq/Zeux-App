# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zeux-App is a React Native mobile application built with Expo that helps users track their food intake and create workout plans. The app features AI-powered food tracking and training generation capabilities.

**Tech Stack:**
- React Native 0.81.5 with React 19.1.0
- Expo SDK ~54.0.0
- Expo Router 6.x for file-based navigation
- TypeScript with strict mode enabled
- React Native Reanimated 4.x for animations
- React Native Chart Kit for data visualization

## Development Commands

**Start development server:**
```bash
npm start
```

**Platform-specific builds:**
```bash
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

**Code quality:**
```bash
npm run lint       # Run ESLint
```

**Reset project:**
```bash
npm run reset-project    # Reset project to initial state
```

## Architecture

### Routing & Navigation

The app uses **Expo Router** with file-based routing. The navigation structure is:

- `app/_layout.tsx` - Root layout wrapping the entire app
- `app/(tabs)/_layout.tsx` - Tab navigation layout with 4 tabs: Home, Analytics, Settings, Add
- `app/(tabs)/[TabName].tsx` - Tab screen components
- `app/[screen].tsx` - Modal/stack screens (login, addFood, addTraining, addTrainingAI, profile, AllWeekTrainings)

Navigation between screens uses `expo-router`'s `navigate()` function from `expo-router/build/global-state/routing`.

### Theming System

The app implements a custom theming system with light/dark mode support:

- **Theme configuration:** `data/colors.json` contains all color definitions
- Theme structure: `dark`, `light`, and `calorietypes` (for macronutrient colors)
- Theme colors include: `background`, `text`, `cards`, `buttons`, `subtitles`, `chart`, `inactivechart`, `trainingrows`, `borders`
- **Implementation pattern:**
  ```typescript
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? colors.dark : colors.light;
  ```
- Use `useMemo` to optimize theme selection in components

### Path Aliases

TypeScript is configured with path alias `@/*` mapping to the root directory. However, most imports currently use relative paths.

### Component Patterns

**Styling:**
- All components use `StyleSheet.create()` for styles
- Dynamic theming applied via style arrays: `[styles.static, { backgroundColor: theme.background }]`
- SafeAreaView from `react-native-safe-area-context` used with edge configuration to handle notches/safe areas

**State Management:**
- Currently using local component state (no global state management library)
- Data structures defined inline (see `app/(tabs)/Home.tsx` for example)

**Common UI Patterns:**
- Circular progress indicators using `react-native-circular-progress-indicator`
- Icon usage via `@expo/vector-icons` (Ionicons)
- Image assets loaded with `require()` from `assets/images/`

### Data Management

- Configuration data stored in `data/` directory as JSON files
- `data/colors.json` - Theme colors
- `data/components.json` - Component configuration (partially implemented)

## Key Features Implementation

**Food Tracking (addFood.tsx):**
- Camera/gallery/manual input for food entry
- Custom image frame with corner borders for visual feedback

**Training Management:**
- Weekly training plans with body part categorization (Upper Body, Lower Body, Full Body)
- Training duration and exercise count tracking
- AI-powered training generation feature

**Analytics:**
- Calorie tracking (eaten vs. burned)
- Macronutrient breakdown (Protein, Carbs, Fats) with color-coded circular progress indicators

## Project Naming Note

The project has references to both "Fit-AI" (legacy) and "Zeux-App" (current). You may see "fit-ai" in package.json and app.json. The current project name is Zeux-App.
- use agents