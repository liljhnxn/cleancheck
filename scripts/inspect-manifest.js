async function main() {
  const res = await fetch("https://scan.bohr.life/_next/static/Gi2j_mAxcfS4QHqWzlPrf/_buildManifest.js");
  const text = await res.text();
  const routes = [];
  const regex = /"(\/[^"]+)":/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    routes.push(match[1]);
  }
  console.log("All matching routes:", routes.filter(r => r.includes("contract") || r.includes("verify") || r.includes("address")));
}
main();
