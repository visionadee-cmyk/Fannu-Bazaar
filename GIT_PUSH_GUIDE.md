# Git Push + Vercel Auto-Deploy Guide (Windows)

This project auto-deploys on Vercel when **GitHub `main` gets a new commit**.

If you commit locally but don’t push to GitHub, Vercel will keep deploying the **old commit**.

## Quick checklist

- You must **commit** your changes.
- You must **push to `origin main`**.
- If Git asks for authentication, complete it in the browser, then run the push again.

## Recommended (PowerShell-safe) commands

Run these as **separate lines** (avoid chaining with `&&`).

```powershell
# Show what changed
git -C "C:\Users\maushaz.MADIHAA\Desktop\Rettey\fannu_bazaar" status

# Stage everything
git -C "C:\Users\maushaz.MADIHAA\Desktop\Rettey\fannu_bazaar" add -A

# Commit
git -C "C:\Users\maushaz.MADIHAA\Desktop\Rettey\fannu_bazaar" commit -m "your message"

# Push to GitHub main (triggers Vercel)
git -C "C:\Users\maushaz.MADIHAA\Desktop\Rettey\fannu_bazaar" push origin main
```

## Confirm Vercel is building the latest commit

1. Open Vercel project → **Deployments**
2. Click the latest deployment
3. In the logs, confirm it says:
   - `Cloning ... (Branch: main, Commit: <YOUR_LATEST_COMMIT>)`

## Common issues

### 1) “info: please complete authentication in your browser…”
- Complete the browser login/approval.
- Then run:

```powershell
git -C "C:\Users\maushaz.MADIHAA\Desktop\Rettey\fannu_bazaar" push origin main
```

### 2) Vercel keeps building an old commit
- Your `push` did not update GitHub.
- Confirm your GitHub `main` has your latest commit.

### 3) PowerShell command chaining errors
- In some terminals, `&&` causes parse errors.
- Use **one command per line** (as above).
