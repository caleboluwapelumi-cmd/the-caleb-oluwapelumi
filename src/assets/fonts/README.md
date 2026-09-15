# OG render fonts

Static WOFF cuts of the two brand faces, used only by `src/pages/og/[...route].png.ts`
at build time. They are **not** served to browsers — the site loads the variable
WOFF2 faces from `@fontsource-variable/*` via `global.css`.

They exist as files because satori cannot read WOFF2, which is the only format the
`@fontsource-variable` packages ship.

Source: `@fontsource/fraunces@5` and `@fontsource/inter@5` on jsDelivr.
Licence: SIL Open Font License 1.1 (Fraunces — Undercase Type; Inter — The Inter Project Authors).
