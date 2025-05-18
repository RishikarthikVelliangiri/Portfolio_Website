# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/57fa3c2d-8d4e-4445-831f-e908e1232cf3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/57fa3c2d-8d4e-4445-831f-e908e1232cf3) and start prompting.

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

Simply open [Lovable](https://lovable.dev/projects/57fa3c2d-8d4e-4445-831f-e908e1232cf3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Portfolio Website: Aura Display Evolve

This repository contains the source code for a modern, interactive portfolio website designed to showcase projects, skills, and experience with a focus on sophisticated design and smooth user experience.

## Key Design & Technical Features:

- **Immersive 3D Backgrounds**: Utilizes Three.js for dynamic and engaging 3D background animations, providing a visually rich experience.
- **Advanced Animations & Transitions**:
  - Leverages Framer Motion for fluid page transitions, component animations, and micro-interactions.
  - Features Apple-inspired smooth spring animations for text and UI elements.
  - Scroll-triggered animations for sections and elements, enhancing storytelling as the user navigates.
- **Parallax Effects**: Subtle parallax scrolling effects on elements like the hero section text to create a sense of depth and engagement.
- **Responsive Design**:
  - Built with Tailwind CSS, ensuring full responsiveness across desktops, tablets, and mobile devices.
  - Includes custom hooks like `use-mobile` for adapting behavior based on screen size.
- **Modern UI Components**:
  - Integrates a comprehensive suite of `shadcn/ui` components, providing a consistent, accessible, and aesthetically pleasing user interface.
  - Custom-styled components to match the overall design language.
- **Interactive Custom Cursor**: A custom cursor enhances the user interaction and adds a unique touch to the browsing experience.
- **Thematic Sections**: Clearly defined sections for Hero, About, Skills, Experience, Education, Awards, Products/Projects, Vision, and Contact, each with tailored animations and layouts.
- **Visually Appealing Typography & Gradients**:
  - Use of display fonts and careful typographic hierarchy.
  - Gradient text effects and subtle gradient overlays to enhance readability and visual appeal.
- **Optimized Performance**:
  - Techniques like `requestAnimationFrame` for smooth scroll-based animations.
  - Lazy loading and code splitting (inherent with Vite) for faster initial load times.
- **Clean Codebase**:
  - Built with React, TypeScript, and Vite for a modern development workflow.
  - Organized project structure with clear separation of components, hooks, contexts, and pages.
- **Accessibility Considerations**: While continuously improving, the use of semantic HTML, ARIA attributes (often provided by `shadcn/ui`), and keyboard navigation considerations are part of the design philosophy.

## Technology Stack:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion, Three.js (for 3D aspects)
- **UI Components**: shadcn/ui
- **Linting/Formatting**: ESLint, Prettier (implied by standard setups)
- **Deployment**: Configured for Vercel (as per `vercel.json`)

This portfolio aims to deliver a memorable and professional presentation through cutting-edge web technologies and a keen eye for design detail.
