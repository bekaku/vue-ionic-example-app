# Vue Ionic mobile

# Backend Rest Api

1 Java Springboot [java-spring-boot-starter](https://github.com/bekaku/java-spring-boot-starter)

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

or

```bash
yarn dev
```

## Production

Build the application for production:

```bash
build:prod 
npm run build
```

Locally preview production build:

```bash
npm run preview
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
