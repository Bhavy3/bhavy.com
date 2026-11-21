const fs = require('fs');
const target = 'assets/index-CoQKB6gy.js';
fs.copyFileSync(target, '.freebuff/index-CoQKB6gy.js.email-v1');
let code = fs.readFileSync(target, 'utf8');
const replacements = new Map([
  ["What's actually hurting, and what winning looks like.", "Clarify the question, the people it affects, and what a useful result looks like."],
  ["Goals, KPIs and audience", "Define the question and intended outcome"],
  ["Audit of the current store and stack", "Understand the available data and current workflow"],
  ["Scope, timeline and estimate", "Agree on practical scope and success measures"],
  ["Figma screens with your real products and real copy.", "Prepare and explore the data before choosing an approach."],
  ["Wireframes and user flows", "Collect and validate data sources"],
  ["Figma screens with real content", "Clean data and create useful features"],
  ["A design system ready to build", "Document assumptions and data limitations"],
  ["What talks to what, mapped before any code.", "Build models against a clear baseline."],
  ["Data and integration map", "Select an approach suited to the question"],
  ["App, API and hosting choices", "Compare models with a reproducible evaluation"],
  ["A plan for scale and performance", "Track assumptions, metrics, and failure cases"],
  ["Liquid and JavaScript, handed over with notes people read.", "Explain results and turn useful models into tools."],
  ["Theme, components and checkout", "Evaluate model behavior with SHAP and LIME"],
  ["APIs, middleware and serverless functions", "Build an app with Streamlit, React, or Django"],
  ["Testing across devices", "Validate performance and document usage"],
  ["A go-live so quiet your customers never notice.", "Launch only what the evidence supports."],
  ["Speed and SEO checks", "Check results against the agreed measures"],
  ["Analytics and tracking", "Make assumptions and limitations clear"],
  ["A calm go-live", "Share a clear handover"],
  ["When something breaks, I fix it. Then we keep improving.", "Review results, address failures, and refine the system."],
  ["Fixes and improvements", "Review results and data quality"],
  ["New features as you grow", "Update models when the evidence calls for it"],
  ["Retainer support", "Keep the tool useful as needs change"]
]);
for (const [from, to] of replacements) {
  const occurrences = code.split(from).length - 1;
  if (occurrences !== 1) throw new Error(`Expected one occurrence for: ${from}; found ${occurrences}`);
  code = code.replace(from, to);
}
fs.writeFileSync(target, code);
console.log(`Updated ${replacements.size} process descriptions and checklist items.`);
