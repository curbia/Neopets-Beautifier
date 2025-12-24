// ==UserScript==
// @name         Neopets Beautifier
// @namespace    https://github.com/curbia/Neopets-Beautifier/
// @description  Replace specific Neopets images with fan-corrected versions
// @match        https://www.neopets.com/neoboards/*
// @match        https://www.neopets.com/guilds/guild_board.phtml?id=*
// @match        https://www.neopets.com/userlookup.phtml?user=*
// @icon         https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/icon.gif
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        "altador.gif",
        "ava_stampalbum_other_faeries.gif",
        "coins.gif",
        "collectorshenkuu.gif",
        "kingkelp.gif",
        "meridellvsarigan.gif",
        "neoquest.gif",
        "neoquestii.gif",
        "stampcollectorneopiacentral.gif",
        "stampsDesert0013.gif",
        "stampsHaunted3192.gif",
        "stampsMystery2352.gif",
        "stampsSnowy2312.gif",
        "stampsTyrannia3421.gif",
        "stampsVirtupets9764.gif",
        "stampsbattledome1337.gif",
        "stampsfaerieland87393.gif",
        "stampsothers.gif",
        "pet_rock.gif",
        "goldy.gif",
        "mutantjubjub.gif",
        "slorg.gif",
        "freakedkorbat.gif",
        "meridellknight.gif",
        "grundo_snowthrow.gif",
        "soup_faerie_kind.gif",
        "fyora.gif",
        "meowclops_close.gif",
        "magax.gif",
        "wheelofexcitement.gif",
        "avatarcollector.gif",
        "dice_escape.gif",
        "scarblade.gif",
        "clay_day.gif",
        "moach.gif",
        "purplepeo.gif",
        "robertabrightvale.gif",
        "kau.gif",
        "eyrie.gif",
        "elephante.gif",
        "blumaroo.gif",
        "neodaqtick.gif",
        "nimmospond.gif",
        "10thbday.gif",
        "aota.gif",
        "mutantgravedoom.gif",
        "ddstaff.gif",
        "faeriexweetok.gif",
        "tarla.gif",
        "tdmbgpop.gif",
        "carnival_terror.gif",
        "wishingwell.gif",
        "tfr2010_d92f4b98fa.gif",
        "darklurker.gif",
        "imposterapple.gif",
        "neggfest2010_95e8ebf8a4.gif",
        "altadorcup_staff.gif",
        "doglefox_mud.gif",
        "aim_babygrundo_boo.gif",
        "ac_christmas_aisha.gif",
        "robotvandagyre.gif",
        "braintree.gif",
        "landlba.gif",
        "trudyavatar.gif",
        "kissthemortog.gif",
        "royalboylutari.gif",
        "thatsnotrubbish.gif",
        "ava_dizzyyooyu.gif",
        "ava_rules.gif",
        "easterbunnyy17.gif",
        "godori.gif",
        "rubbish.gif",
        "monsterhunting.gif",
        "aim_jhudora_fire.gif",
        "bankdepositavatar.gif",
        "charitycorner.gif",
        "forgshore.gif",
        "krawkenattack.gif",
        "extravagance.gif",
        "snowroller.gif",
        "ddstaff_tourney.gif",
        "aaasrevenge.gif",
        "comiccon2018.gif",
        "foreverloading.gif",
        "foreverloading.gif",
        "ava_coltzan_shrine.gif",
        "techomaster.gif",
        "chokato.gif",
        "mootix.gif",
        "letitsnow.gif",
        "elephantesurprise.gif",
        "rods_champion.gif",
        "yarrble.gif",
        "darigandarkling.gif",
        "smiley.gif",
        "clap.gif",
        "complain.gif",
        "cough.gif",
        "dark.gif",
        "oh.gif",
        "rainbow.gif",
        "sad.gif",
        "sunglasses.gif",
        "vampire.gif",
        "yarr.gif",
        "ava_brain_freeze.gif"
    ];

    const replacementBase = "https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/";

    function findAvatarNeoboards(bgImage) {
        const match = bgImage.match(/avatars\/([^")]+\.gif)/i);
        return match ? match[1] : null;
    }

    function findAvatarElsewhere(src) {
        const match = src.match(/avatars\/([^/]+\.gif)/i);
        return match ? match[1] : null;
    }

    function findSmilies(src) {
        const match = src.match(/smilies\/([^/]+\.gif)/i);
        return match ? match[1] : null;
    }

    function replaceAvatarNeoboards() {
        document.querySelectorAll('.authorIcon').forEach(icon => {
            const bg = icon.style.backgroundImage;
            const filename = findAvatarNeoboards(bg);
            if (filename && replacements.includes(filename)) {
                icon.style.backgroundImage = `url("${replacementBase}avatars/${filename}")`;
            }
        });
    }

    function replaceAvatarElsewhere() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.getAttribute('src');
            if (!src) return;
            const filename = findAvatarElsewhere(src);
            if (filename && replacements.includes(filename)) {
                img.src = `${replacementBase}avatars/${filename}`;
            }
        });
    }

    function replaceSmilies() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.getAttribute('src');
            if (!src) return;
            const filename = findSmilies(src);
            if (filename && replacements.includes(filename)) {
                img.src = `${replacementBase}smilies/${filename}`;
            }
        });
    }


    function run() {
        replaceAvatarNeoboards();
        replaceAvatarElsewhere();
        replaceSmilies();
    }

    run();

})();
