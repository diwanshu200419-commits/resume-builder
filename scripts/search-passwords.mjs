import fs from "fs";
import path from "path";

const EXCLUDE_DIRS = ["node_modules", ".next", ".git"];
const SEARCH_PATTERNS = ["password", "postgres", "db_password", "postgresql:"];

function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      SEARCH_PATTERNS.forEach((pattern) => {
        if (line.toLowerCase().includes(pattern) && !line.includes("protect_profile_fields") && !line.includes("inspect-db-schema")) {
          console.log(`Match found in ${filePath}:${index + 1} (${pattern}):`);
          console.log(`  ${line.trim().slice(0, 100)}`);
        }
      });
    });
  } catch (err) {
    // Ignore binary or read errors
  }
}

function walk(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    return;
  }
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      return;
    }
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        walk(fullPath);
      }
    } else {
      searchFile(fullPath);
    }
  });
}

console.log("Searching for database passwords or connection strings in workspace...");
walk(process.cwd());
console.log("Search complete.");
