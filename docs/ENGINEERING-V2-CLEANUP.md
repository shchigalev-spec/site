# Engineering V2 cleanup record

## Removed in this branch

- Accidental browser/terminal artefacts at repository root are removed before the final commit.
- The legacy retrospective review generator is retained only as the guarded `reviews:legacy:build` command and exits before writing when V2 evidence exists.

## Retained intentionally

- PNG masters in `apps/engineering/static/generated/` are source assets; `.webp` and `-960.webp` files are reproducible delivery derivatives, not duplicate browser downloads.
- Existing root `app/`, `components/`, `lib/`, Next.js configuration, build output folders, and historical review material predate this branch. Repository rules forbid using that legacy runtime for either SvelteKit product, but deletion is not included because shared/root scripts and ownership have not been proven safe enough for a broad removal.
- `apps/tech` is frozen and unchanged. No Engineering runtime component, CSS, token, or primary asset is imported from it.

## Proposed later cleanup

After an owner confirms the deployment target and root consumers, remove tracked legacy root runtime sources in a dedicated change, regenerate ignored build output, and prune obsolete historical review artifacts. That change must demonstrate both app builds and all root scripts before deletion.
