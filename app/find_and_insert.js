const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');
let content = fs.readFileSync(scriptPath, 'utf8');
const lines = content.split('\n');

// Find the line with eventFestivalDesc in pa dictionary, then the } and };
let festivalLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('eventFestivalDesc:') && lines[i].includes('\u0D2E\u0D3F\u0D20\u0D3E\u0D08')) {
        festivalLine = i;
        break;
    }
}

if (festivalLine === -1) {
    console.log('Could not find eventFestivalDesc in pa dictionary');
    process.exit(1);
}

console.log('Found festivalLine at:', festivalLine + 1);
console.log('Line:', lines[festivalLine].substring(0, 60));

// The next line should be "    }" and then "};"
const closingBrace = festivalLine + 1;
const i18nClosing = festivalLine + 2;
console.log('Closing brace at line:', closingBrace + 1, '=', lines[closingBrace]);
console.log('i18n closing at line:', i18nClosing + 1, '=', lines[i18nClosing]);

// Insert after the closing brace of pa, before i18n closing
// Replace: "    }\n};" with "    },\n" + newLangs + "\n};"
const insertAfter = lines[closingBrace]; // "    }"

// Build the new languages string
const newLangs = fs.readFileSync(path.join(__dirname, 'new_langs.txt'), 'utf8');

// Reconstruct: change line closingBrace from "    }" to "    },"
// Then insert newLangs before line i18nClosing
lines[closingBrace] = '    },';
lines.splice(i18nClosing, 0, newLangs);

content = lines.join('\n');
fs.writeFileSync(scriptPath, content, 'utf8');
console.log('Successfully inserted new languages!');
