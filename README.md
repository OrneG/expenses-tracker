# Expenses Tracker

A mobile-first Next.js app for tracking personal expenses.

## Requirements

- Node.js 18.18 or newer
- npm

## Start locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Test From A Phone

Create a local-only `.env.local` file and add the computer IP you will use from
your phone:

```bash
NEXT_ALLOWED_DEV_ORIGINS=YOUR_COMPUTER_IP
```

Start the dev server on your network:

```bash
npm run dev -- --hostname 0.0.0.0
```

Open `http://YOUR_COMPUTER_IP:3000` from your phone while both devices are on
the same Wi-Fi network. Do not commit `.env.local`; it is already ignored.

## Windows PowerShell note

If PowerShell blocks `npm` scripts because of the local execution policy, use the
Windows command shim instead:

```bash
npm.cmd install
npm.cmd run dev
```

## Production check

Run a production build before deploying or sharing changes:

```bash
npm run build
```

## App data

Expenses and currency preferences are saved in the browser with `localStorage`.
