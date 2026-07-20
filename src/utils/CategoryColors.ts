const CATEGORY_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-slate-600",
  "bg-teal-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-lime-600",
  "bg-rose-500",
  "bg-fuchsia-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-yellow-600",
  "bg-red-700",
  "bg-blue-700",
];

/**
 * Builds a name -> color map from the FULL list of category names.
 * Sorting alphabetically first guarantees the same category always
 * lands on the same index, on any page, as long as every page passes
 * in the complete category list (not just the ones it happens to use).
 */
export function buildCategoryColorMap(categoryNames: string[]): Record<string, string> {
  const uniqueSorted = Array.from(
    new Set(categoryNames.map((n) => n.trim()))
  ).sort((a, b) => a.localeCompare(b));

  const map: Record<string, string> = {};
  uniqueSorted.forEach((name, index) => {
    map[name] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  });

  return map;
}