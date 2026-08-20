# Tech V2 cleanup

Cleanup was performed only after the visual work and final Slice 09 gate passed.

## Removed as confirmed unused

- Legacy Tech runtime components: `ApartmentXray`, `EngineeringAssembly`, `HeroScan`, `MeasurementCases`, `NoiseDeck`, `ProcessBridge`, `RenovationStages`, `ScenarioLab`, and universal `ServicePage`.
- Obsolete accidental review directory `reviews/tech-v2/slice-true`; it was a malformed capture target and is not valid evidence.
- Untracked debug screenshots, temporary browser video, and local server logs outside the accepted slice evidence folders.
- No Engineering file, asset, component, CSS, token or output was removed or modified.

## Reproducibility

All `latest` ranges in `apps/tech/package.json` were replaced with the exact versions already resolved in the lockfile. No framework upgrade was performed.

## Retained intentionally

- PNG generation/edit masters remain beside delivery formats so the documented asset-processing script is reproducible.
- Historical Slice 00–08 evidence remains because it records real gate history, including FAIL/revision cycles.
- Root legacy review/capture scripts remain outside the exclusive implementation target. The retrospective generator is explicitly renamed `reviews:legacy:build` and is not used by Tech V2.
- Shared facts and analytics documents remain in `docs/`; no shared runtime UI package was introduced.

## Deferred cleanup

No unreferenced root application source was deleted because it falls outside `apps/tech` and its ownership is not established by this task. Asset masters that are not requested in the final network traversal are retained as reproducible source material rather than treated as accidental production requests.
