# Accessibility and Performance review

PASS

Desktop uses a complete tab pattern with `aria-selected`, roving tabindex, shared `aria-controls`, a labelled focusable panel, visible focus, and full keyboard navigation. Mobile replaces hidden tabs with visible previous/next controls and a native direct selector. Active route meaning is repeated textually and is not color-only.

Reduced motion exposes the complete state immediately. Six states and responsive assets load without console errors, broken images, document overflow, or route failures. Exact Core Web Vitals remain scheduled for Slice 08.
