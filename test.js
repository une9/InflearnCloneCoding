const lists = require('./lists.json')

let l1_content = "";

for (const l1_key in lists) {
    let l2_content = "";

    const l2 = lists[l1_key];
    for (const l2_key in l2) {
        let l3_content = "";

        const l3 = l2[l2_key];
        for (const l3_key of l3) {
            l3_content += `<li>${l3_key}</li>\n`;
        }
        l2_content += `<li><span>${l2_key}</span>\n`;
        l2_content += `<ul class="class-menu-depth-3">${l3_content}</ul>\n`;
        l2_content += `</li>`;
    }

    l1_content += `<li><span>${l1_key}</span>\n`;
    l1_content += `<ul class="class-menu-depth-2">${l2_content}</ul>\n`;
    l1_content += `</li>`;
}

let content = ""

content += `<li><span>강의</span><i class="fas fa-chevron-down">\n`;
content += `<ul class="class-menu-depth-2">${l1_content}</ul>\n`;
content += `</li>`;

const fs = require('fs');
fs.writeFileSync("lists.html", content);