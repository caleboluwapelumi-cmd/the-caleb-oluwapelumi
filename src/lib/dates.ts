// UTC so a frontmatter date like 2026-01-15 never renders as the 14th on a
// build machine west of Greenwich.
const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => formatter.format(date);
