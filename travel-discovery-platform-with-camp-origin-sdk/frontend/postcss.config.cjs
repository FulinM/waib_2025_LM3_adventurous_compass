// Defensive PostCSS config: enable tailwindcss and autoprefixer only if installed.
// This prevents Vite from failing when tailwind/postcss aren't installed (e.g., using CDN dev).
module.exports = (() => {
  const plugins = {};
  try {
    // Only include tailwindcss if it's resolvable
    require.resolve('tailwindcss');
    plugins.tailwindcss = {};
  } catch (e) {
    // tailwindcss not installed — skip it
  }

  try {
    require.resolve('autoprefixer');
    plugins.autoprefixer = {};
  } catch (e) {
    // autoprefixer not installed — skip it
  }

  return { plugins };
})();