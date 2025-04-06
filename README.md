# Scholar Tenant System - Monorepo

This is a monorepo for the Scholar Tenant System, containing multiple applications and shared packages.

## Project Structure

```
scholar-tenant-system/
├── apps/
│   ├── core/                 # Core platform application
│   ├── attendance/           # Attendance management application
│   ├── grading/             # Grading management application
│   ├── behavior/            # Student behavior tracking application
│   ├── fee-management/      # Fee management application
│   └── finance/             # Finance related applications
│       ├── expenses/        # Expense management
│       ├── receivables/     # Accounts receivable
│       └── payables/        # Accounts payable
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── auth/                # Authentication utilities
│   ├── database/            # Database utilities and models
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Shared utilities
└── package.json            # Root package.json for workspace management
```

## Applications

- **Core**: Main platform application with user management, roles, and permissions
- **Attendance**: Student and staff attendance tracking
- **Grading**: Academic performance and assessment management
- **Behavior**: Student behavior and discipline tracking
- **Fee Management**: Student fee management and tracking
- **Finance**: Financial management suite
  - Expenses: School expense tracking
  - Receivables: Income and receivables management
  - Payables: Bills and payables management

## Shared Packages

- **UI**: Reusable UI components using shadcn/ui
- **Auth**: Authentication and authorization utilities
- **Database**: Database access and models
- **Types**: Shared TypeScript types and interfaces
- **Utils**: Common utility functions

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

3. Build all applications:
   ```bash
   pnpm build
   ```

## Development Workflow

1. Each application can be developed independently
2. Shared code should be placed in appropriate packages
3. Use changesets for version management
4. Follow the monorepo guidelines for best practices

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Turborepo
- Supabase
- pnpm (Package Manager)

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/904cff78-0618-4fe1-bbce-147582d1c5f8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/904cff78-0618-4fe1-bbce-147582d1c5f8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/904cff78-0618-4fe1-bbce-147582d1c5f8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
