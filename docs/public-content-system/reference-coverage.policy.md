# PR0 reference coverage policy

- This manifest is a planning contract for the Programs catalogue/detail
  vertical slice. Every listed frame remains `planned` until the page exists
  and a PNG is captured from the rendered runtime.
- Cover both route contexts independently: `/programs/` and
  `/programs/french-club-trial/`. A shared shell frame does not prove either
  page's content hierarchy.
- Cover desktop (`1440x1000`) and mobile (`390x844`) source-order
  recomposition. The represented viewport is the CSS viewport, not an
  annotation board.
- Pair the unfiltered Programs catalogue with the filter-applied result at the
  same viewport. The pair must show the trigger/result meaning change and a
  clear-filters path.
- Capture the ordered data lifecycle `loading → populated → empty → error`.
  Empty means a valid query has no records; error means the repository failed.
- Use repository-owned or explicitly approved media only. Reference screenshots
  are comparison evidence, never production content.
- Strict completion requires captured, structurally valid PNGs and a dated,
  named human visual review for every captured frame. This planning pass must
  not be described as visual approval.
- Browser acceptance also covers keyboard focus, semantic content order,
  reduced motion, localization boundaries, 200% zoom, and no horizontal
  overflow; screenshots alone cannot prove those behaviors.
