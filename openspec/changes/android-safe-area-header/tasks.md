## 1. Viewport

- [x] 1.1 Add `viewport-fit=cover` to the viewport meta tag in `index.html` (keep existing width and initial-scale)

## 2. Header top safe area

- [x] 2.1 Apply `padding-top: env(safe-area-inset-top, 0px)` to the header in `app-header.tsx` (on `<header>` or inner container so header content sits below status bar)

## 3. Main content bottom safe area

- [x] 3.1 Apply `padding-bottom: env(safe-area-inset-bottom, 0px)` to the main content container in layout (e.g. in `layout.tsx` or the scrollable content wrapper)

## 4. Verification

- [ ] 4.1 Verify on Android: header below status bar, content above nav/gesture bar
- [ ] 4.2 Verify on desktop (or browser without safe-area): no extra padding, layout unchanged
