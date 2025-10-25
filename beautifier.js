// ==UserScript==
// @name         Neopets Beautifier
// @namespace    https://github.com/curbia/Neopets-Beautifier/
// @version      0.01
// @description  Replace specific Neopets images with fan-corrected versions
// @match        https://www.neopets.com/neoboards/topic.phtml?topic=*
// @match        https://www.neopets.com/guilds/guild_board.phtml?id=*
// @match        https://www.neopets.com/userlookup.phtml?user=*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        "collectorshenkuu.gif"
    ];

    const replacementBase = "https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/avatars/";

    function findAvatarNeoboards(bgImage) {
        const match = bgImage.match(/avatars\/([^")]+\.gif)/i);
        return match ? match[1] : null;
    }

    function findAvatarElsewhere(src) {
        const match = src.match(/avatars\/([^/]+\.gif)/i);
        return match ? match[1] : null;
    }

    function replaceAvatarNeoboards() {
        document.querySelectorAll('.authorIcon').forEach(icon => {
            const bg = icon.style.backgroundImage;
            const filename = findAvatarNeoboards(bg);
            if (filename && replacements.includes(filename)) {
                icon.style.backgroundImage = `url("${replacementBase}${filename}")`;
            }
        });
    }

    function replaceAvatarElsewhere() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.getAttribute('src');
            if (!src) return;
            const filename = findAvatarElsewhere(src);
            if (filename && replacements.includes(filename)) {
                img.src = `${replacementBase}${filename}`;
            }
        });
    }

    function run() {
        replaceAvatarNeoboards();
        replaceAvatarElsewhere();
    }

    run();

})();
