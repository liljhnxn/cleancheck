async function main() {
  const res = await fetch("https://scan.botchain.ai/_next/static/manifest.js");
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
