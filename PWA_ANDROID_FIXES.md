# PWA Android Compatibility Fixes

## Changes Made

### 1. **manifest.json** - Android-Specific Enhancements

- ✅ Added `prefer_related_applications: false` to prevent Android from suggesting native apps
- ✅ Separated icon purposes (`maskable` vs `any`) for better Android rendering
- ✅ Added duplicate icon entries with different purposes for optimal Android compatibility

### 2. **layout.tsx** - Enhanced Meta Tags

- ✅ Added theme-color meta tags with media queries for light/dark mode
- ✅ Verified all Android-required meta tags are present:
  - `mobile-web-app-capable`
  - `application-name`
  - `theme-color` (with prefers-color-scheme support)

### 3. **sw.js** - Service Worker Improvements

- ✅ Added `skipWaiting()` during install to immediately activate new service worker
- ✅ Added `clients.claim()` during activation for instant control of all clients
- ✅ Implemented Network First strategy for API calls (better for dynamic content)
- ✅ Implemented Cache First strategy for static assets (better offline support)
- ✅ Added proper response cloning before caching
- ✅ Added origin check to skip cross-origin requests
- ✅ Enhanced logging for debugging

### 4. **use-pwa.ts** - Enhanced PWA Hook

- ✅ Improved Android detection logic
- ✅ Added comprehensive logging for debugging install flow:
  - Detection events
  - Install prompt availability
  - User choices
- ✅ Added `e.preventDefault()` to properly capture beforeinstallprompt event on Android
- ✅ Better standalone mode detection (checks both display-mode and navigator.standalone)
- ✅ Enhanced error handling with try-catch blocks

### 5. **next.config.ts** - PWA Configuration

- ✅ Added `scope: '/'` for proper PWA scope
- ✅ Added `reloadOnOnline: true` for automatic reload when connection restored
- ✅ Added `swMinify: true` for production optimization
- ✅ Added `fallbacks.document` for offline page support
- ✅ Enhanced runtime caching with:
  - `maxAgeSeconds: 86400` (24 hours)
  - `cacheableResponse` for status codes 0 and 200
- ✅ Added `buildExcludes` to prevent middleware issues

### 6. **New Files Created**

- ✅ Created `/app/offline/page.tsx` - Fallback page when user is offline

---

## Testing Instructions

### Android Testing Checklist

1. **Deploy to HTTPS** (Required!)
   - PWAs only work on HTTPS in production
   - Localhost is exempt for development
   - Verify your production URL uses HTTPS

2. **Test Install Prompt on Android Chrome:**

   ```
   a. Clear site data: Settings → Site settings → Clear & reset
   b. Visit your site in Chrome (not incognito)
   c. Navigate around for ~30 seconds (triggers engagement)
   d. Look for "Add to Home Screen" banner or prompt
   e. Check Chrome menu → "Install app" option
   ```

3. **Verify Installation:**

   ```
   a. Install the app
   b. Check home screen for icon
   c. Open app from home screen
   d. Verify it opens in standalone mode (no browser UI)
   e. Check that address bar is hidden
   ```

4. **Check Console Logs:**

   ```
   Open Chrome DevTools and look for:
   - [PWA] Detection: { ... }
   - [PWA] Install prompt event captured
   - [SW] Installing service worker...
   - [SW] Activating service worker...
   ```

5. **Test Offline Functionality:**

   ```
   a. Install the app
   b. Open DevTools → Network tab
   c. Select "Offline" throttling
   d. Navigate the app
   e. Should show cached content
   f. Navigate to uncached page → see offline fallback
   ```

6. **Verify Manifest:**
   ```
   Open DevTools → Application tab → Manifest
   Check that all fields are parsed correctly
   Verify icons are loading
   ```

---

## Common Android PWA Issues & Solutions

### Issue: "Add to Home Screen" doesn't appear

**Solutions:**

- Ensure HTTPS is enabled
- Wait for user engagement (~30 seconds of interaction)
- Check that manifest is valid (DevTools → Application → Manifest)
- Clear Chrome cache and try again
- Verify service worker is registered (DevTools → Application → Service Workers)

### Issue: App opens in browser instead of standalone

**Causes:**

- `start_url` mismatch
- Service worker not active
- User cleared data
  **Solution:**
- Reinstall the app
- Check service worker is "Activated and running"
- Verify `display: "standalone"` in manifest

### Issue: Icons not showing correctly

**Solution:**

- Verify icon paths in manifest.json
- Check icons exist in `/public/icons/`
- Use both `maskable` and `any` purposes
- Test with different icon sizes (192x192, 512x512)

---

## Debugging Tools

### Chrome DevTools

```
Application Tab:
- Manifest: Check manifest parsing
- Service Workers: Verify registration
- Cache Storage: Check cached resources
- Clear Storage: Reset PWA state for testing
```

### Console Logging

All PWA events now log to console with `[PWA]` or `[SW]` prefix:

```
[PWA] Detection: {...}          - Device/browser detection
[PWA] Install prompt captured   - Prompt event received
[PWA] Install attempt: {...}    - User triggered install
[PWA] User choice: accepted     - Install accepted/rejected
[SW] Installing...              - Service worker lifecycle
[SW] Activating...              - Service worker active
```

---

## What Changed vs iOS

| Feature               | iOS                    | Android                    | Notes                                       |
| --------------------- | ---------------------- | -------------------------- | ------------------------------------------- |
| Install Prompt        | Manual (Share → Add)   | Automatic prompt           | Android shows native banner                 |
| `beforeinstallprompt` | ❌ Not supported       | ✅ Supported               | Must preventDefault()                       |
| Service Worker        | ✅ Supported           | ✅ Supported               | Same implementation                         |
| Manifest              | ✅ Used                | ✅ Used                    | Android needs `prefer_related_applications` |
| Standalone Detection  | `navigator.standalone` | `display-mode` media query | Both checked now                            |
| Icon Purpose          | `any`                  | `maskable` + `any`         | Android uses both                           |

---

## Next Steps

1. **Build and deploy** to production (HTTPS required)
2. **Test on Android device** using Chrome
3. **Monitor console logs** for any issues
4. **Test offline functionality** thoroughly
5. **Verify install flow** works smoothly

---

## Rollback Instructions

If issues occur, you can rollback by:

```bash
git revert HEAD
```

All changes are isolated to PWA configuration files and won't affect core app functionality.
