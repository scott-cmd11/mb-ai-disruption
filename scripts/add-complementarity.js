const fs = require("fs");
const path = require("path");

const LOW = new Set([
  "14200","13100","12200","11102","13102","64410","64409","11110",
  "51120","51110","14301","13312","32120","12104","64100","44100",
  "63101","13110","52110","21221","13201","75203","43204","10022"
]);

const filePath = path.join(__dirname, "..", "public", "data", "occupations.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

let highCount = 0, lowCount = 0;
for (const occ of data) {
  if (LOW.has(occ.nocCode)) {
    occ.aiComplementarity = "low";
    lowCount++;
  } else {
    occ.aiComplementarity = "high";
    highCount++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
console.log(`Done: ${highCount} high, ${lowCount} low, ${data.length} total`);
