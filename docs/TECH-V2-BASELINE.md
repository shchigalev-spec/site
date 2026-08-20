# Tech V2 baseline

Captured on 2026-08-19 from the running Tech application at `http://127.0.0.1:5173` before any Tech product-source change.

## Repository state

- Repository: `shchigalev-spec/site`
- Expected baseline: `37004f6e6460203215ed6e57dd396b9421f83eba`
- Fetched `origin/main`: `37004f6e6460203215ed6e57dd396b9421f83eba`
- Actual base: `37004f6e6460203215ed6e57dd396b9421f83eba`
- Working branch: `revamp/tech-production-v2`
- The pre-existing worktree was on `revamp/engineering-production-v2` with uncommitted Engineering work. Tech V2 therefore uses a separate worktree so that work remains untouched.

## Frozen Engineering declaration

`apps/engineering` is frozen for this task. Tech V2 does not import its components, CSS, assets, or tokens. No visual or runtime Engineering file is part of the Tech V2 implementation target.

## Live baseline evidence

Current evidence is stored in `reviews/tech-v2/slice-00/`:

- `desktop-1440.png` — actual full-page desktop render;
- `mobile-390.png` — actual full-page touch-emulated mobile render;
- `start.png`, `quarter.png`, `mid.png`, `three-quarter.png`, `end.png` — actual hero scroll states;
- `motion.webm` — actual scroll recording;
- `reduced-motion.png` — actual reduced-motion render;
- `browser-evidence.json` — route, console, image, overflow, touch, and reduced-motion results.

All required routes returned HTTP 200. The baseline pass recorded no console errors, broken images, or document-level horizontal overflow. The production Bitrix path was not exercised at this baseline stage.

## Observed baseline defects

- The hero swaps four headings and uses stepped `Math.floor()` state selection, so the motion reads as slide changes rather than one diagnosis.
- The mobile hero removes the scroll story and becomes manual state buttons.
- The header progress width is fixed at 28%.
- The hero scroll hint, noise wave bars, route pulses, and case bars contain endless motion.
- `NoiseDeck` and `ApartmentXray` repeat one idea in separate long chapters.
- The x-ray raster contains baked signal paths and waveforms; live overlays duplicate that language.
- The homepage has long passive gaps and three oversized case chapters.
- The renovation section swaps active image sources instead of revealing aligned layers.
- Service routes share one universal visual template.
- The mobile page is extremely long and several horizontal controls extend beyond the visible viewport even though the document clips the overflow.

## Preserved baseline capability

The baseline includes all required routes, server-rendered pages, diagnostic context, file validation, a development-only lead mock, a production Bitrix guard, Yandex Metrica integration, UTM/context handling, sitemap, robots, privacy routes, and case/service content. These are replacement constraints for Tech V2, not cleanup targets.
