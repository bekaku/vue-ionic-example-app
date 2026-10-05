# Vue Ionic mobile

# Backend Rest Api

1 Java Springboot [java-spring-boot-starter](https://github.com/bekaku/java-spring-boot-starter)

## Setup

Make sure to install the dependencies (this repo uses **pnpm**):

```bash
# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3004

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build:vite
```

or (needs the global Ionic CLI):

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Sync code to Android studio and Xcode:

```bash
npx cap sync
```

Sync code to Android studio:

```bash
npx cap sync android
```

Sync code to xCode:

```bash
npx cap sync ios
```
