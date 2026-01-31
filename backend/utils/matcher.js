/**
 * matcher.js
 * Simple heuristic-based matching function that compares a lost item
 * and a found item and returns a score (0-100). It's not ML — it's
 * understandable and extendable. You can enhance later with fuzzy matching
 * or embedding-based similarity.
 */

function scoreText(a = '', b = '') {
  a = a.toLowerCase(); b = b.toLowerCase();
  if (!a || !b) return 0;
  // exact token overlap score
  const ta = new Set(a.split(/\W+/));
  const tb = new Set(b.split(/\W+/));
  let overlap = 0;
  ta.forEach(t => { if (t && tb.has(t)) overlap++; });
  const denom = Math.max(ta.size + tb.size - overlap, 1);
  return Math.round((2 * overlap / denom) * 100);
}

function computeMatchScore(lost, found) {
  // weights
  const wTitle = 0.35, wDesc = 0.25, wCategory = 0.2, wColor = 0.1, wLocation = 0.1;

  let score = 0;
  score += wTitle * scoreText(lost.title, found.title);
  score += wDesc * scoreText(lost.description, found.description);
  score += wCategory * (lost.category && found.category && lost.category.toLowerCase() === found.category.toLowerCase() ? 100 : 0);
  score += wColor * (lost.color && found.color && lost.color.toLowerCase() === found.color.toLowerCase() ? 100 : 0);
  score += wLocation * scoreText(lost.location, found.location);

  return Math.round(score); // 0..100
}

module.exports = { computeMatchScore };
