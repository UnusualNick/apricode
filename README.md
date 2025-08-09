# Apricode - Task Manager

A hierarchical task management application built with Next.js, MobX, and shadcn/ui following Feature-Sliced Design (FSD) architecture.

## 🚀 Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[MobX](https://mobx.js.org/)** - State management
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[next-i18next](https://github.com/i18next/next-i18next)** - Internationalization
- **[Turbopack](https://turbo.build/pack)** - Fast bundling
- **[pnpm](https://pnpm.io/)** - Package manager

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology:

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── tasks/[id]/        # Task detail pages
├── entities/              # Business entities
│   └── task/
│       ├── model/         # MobX stores and types
│       └── ui/            # Entity components
├── features/              # Application features
│   └── taskActions/
│       └── ui/            # Feature components
├── pages/                 # Complex page components
│   └── tasks/
├── shared/                # Shared resources
│   ├── ui/                # shadcn/ui components
│   ├── lib/               # Utility functions
│   └── hooks/             # Shared hooks
```

## ✨ Features

- 📋 **Hierarchical Tasks** - Create tasks with unlimited nesting levels
- ✅ **Task Management** - Add, edit, delete, and toggle task completion
- 💾 **Local Storage** - Persist tasks locally in the browser
- 🎨 **Modern UI** - Clean interface with shadcn/ui components
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌍 **Internationalization** - Multi-language support (EN, ES)
- ⚡ **Fast Development** - Turbopack for lightning-fast builds
- 🎯 **Type Safety** - Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server after build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

## 📂 Key Components

### Entities
- **TaskStore** - MobX store for task management
- **Task.types** - TypeScript interfaces
- **TaskItem** - Recursive task component
- **TaskTree** - Root task list

### Features
- **AddTaskButton** - Create new tasks
- **EditTaskModal** - Edit task details
- **DeleteTaskButton** - Remove tasks with confirmation

### Shared UI
All shadcn/ui components are located in `src/shared/ui/`:
- Button, Input, Checkbox
- Dialog, Label
- And more...

## 🔧 Configuration

### shadcn/ui Setup
The project is configured to use shadcn/ui components in the FSD structure:
```json
{
  "aliases": {
    "components": "@/shared/ui",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib"
  }
}
```

### Internationalization
Locale files are stored in `public/locales/`:
- `en/common.json` - English translations
- `es/common.json` - Spanish translations

## 🤝 Contributing

1. Follow the FSD architecture guidelines
2. Use TypeScript for all new code
3. Follow the existing code style
4. Add appropriate tests for new features

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and modern web technologies.
