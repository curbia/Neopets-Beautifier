// ==UserScript==
// @name         Neopets SDB Enhancer
// @namespace    https://www.neopets.com/
// @version      0.01
// @description  Enhances the Neopets Safety Deposit Box with improved quantity controls, floating pagination
// @match        https://www.neopets.com/safetydeposit.phtml*
// @grant        none
// @run-at       document-idle
// @icon         https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/icon.gif
// @downloadURL  https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/sdb-enhancer.user.js
// @updateURL    https://raw.githubusercontent.com/curbia/Neopets-Beautifier/main/sdb-enhancer.user.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_BUTTON = 'sdb-set-max-qty';

    // ============================================================
    // CSS
    // ============================================================

    const style = document.createElement('style');

    style.textContent = `
        #sdb-vue-app * { box-sizing: border-box !important; }
        .sdb-item-img { background: #FFF !important; padding: 5px !important; border-radius: 5px !important; width: 75px !important; height: 75px !important; }
        .sdb-header-description, .sdb-pin-active-footer, .sdb-pagination-label, .sdb-pagination-jump-label { display: none !important; }
        .sdb-pagination { display: block !important; margin-bottom: 0 !important; }
        .sdb-pagination-prev, .sdb-pagination-next { border-radius: 5px !important; font-size: 20px !important; height: auto !important; }
        .sdb-pagination-prev { margin-right: auto !important; }
        .sdb-pagination-next { margin-left: auto !important; }
        .sdb-pagination-jump { justify-content: center !important; }
        .sdb-pagination-jump .np-stepper { width: 50px !important; }
        .sdb-pagination-jump-total { margin-left: 5px !important; }

        .sdb-drawer-content { display: flex !important; flex-direction: row !important; align-items: center !important; width: 100% !important; gap: 10px !important; }
        .sdb-drawer-content .sdb-header-selected { order: 1 !important; flex: 1 1 auto !important; align-self: center !important; display: block !important; width: auto !important; margin: 0 !important; padding: 0 !important; white-space: nowrap !important; line-height: normal !important; }
        .sdb-drawer-content .sdb-drawer-action-row { order: 2 !important; flex: 0 0 300px !important; align-self: center !important; display: block !important; width: 300px !important; min-width: 300px !important; max-width: 300px !important; margin: 0 !important; padding: 0 !important; }
        .sdb-drawer-content .sdb-as { display: block !important; width: 100% !important; margin: 0 !important; }
        .sdb-drawer-content .sdb-action-select { display: block !important; width: 100% !important; height: auto !important; min-height: 0 !important; box-sizing: border-box !important; margin: 0 !important; padding: 12px 15px !important; border: #000 solid 2px !important; border-radius: 15px !important; font-family: "Cafeteria", "Arial Bold", sans-serif !important; font-size: 14pt !important; cursor: pointer !important; outline: none !important; }
        .sdb-drawer-content .sdb-drawer-buttons { order: 3 !important; flex: 0 0 auto !important; align-self: center !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-end !important; width: auto !important; margin: 0 !important; padding: 0 !important; gap: 10px !important; }

        #sdb-floating-prev, #sdb-floating-next { position: fixed !important; top: 50% !important; transform: translateY(-50%) !important; width: 44px !important; height: 44px !important; min-width: 44px !important; min-height: 44px !important; margin: 0 !important; padding: 0 !important; border: 0 !important; border-radius: 5px !important; background: #faa819 !important; color: #ffffff !important; opacity: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; cursor: pointer !important; z-index: 2147483647 !important; appearance: none !important; -webkit-appearance: none !important; }
        .sdb-arrow { display: block !important; width: 12px !important; height: 12px !important; border-top: 3px solid #fff !important; border-right: 3px solid #fff !important; box-sizing: border-box !important; }
        .sdb-arrow-prev { transform: rotate(-135deg) !important; margin-left: 5px !important; }
        .sdb-arrow-next { transform: rotate(45deg) !important; margin-right: 5px !important; }
        #sdb-floating-prev:hover, #sdb-floating-next:hover { background: #faa819 !important; background-color: #faa819 !important; color: #ffffff !important; opacity: 1 !important; }
        #sdb-floating-prev:disabled, #sdb-floating-next:disabled { background: #bbb !important; background-color: #bbb !important; color: #ffffff !important; opacity: 1 !important; cursor: not-allowed !important; }

        .sdb-item-img-wrap { position: relative !important; }
        .sdb-item-view-details-magnifier { position: absolute; right: 0; bottom: 0; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; padding: 3px; margin: 0; border: 1px solid rgba(0, 0, 0, 0.25); border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: #333; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); cursor: pointer; z-index: 10; }
        .sdb-item-view-details-magnifier svg { width: 100%; height: 100%; }
        .sdb-item-view-details-magnifier:hover { background: #fff; color: #1877c9; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); transform: scale(1.08); }
        .sdb-item-view-details-magnifier:focus-visible { outline: 2px solid #1877c9; outline-offset: 2px; }
        .sdb-item-view-details-magnifier:active { transform: scale(0.95); }

        .sdb-enhanced-stepper { display: grid !important; grid-template-columns: 30px 1fr 30px; grid-template-rows: 23px 23px 23px; width: 118px !important; height: 71px !important; margin-inline: auto; background: #e0e0e0 !important; border-radius: 6px !important; overflow: hidden !important; gap: 1px; box-sizing: border-box; }
        .sdb-enhanced-stepper .np-stepper-btn { box-sizing: border-box; width: 30px; height: 23px; margin: 0; padding: 0; border: none; border-radius: 0px !important; color: #fff; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; line-height: 1; transition: background 0.1s; }
        .sdb-original-minus { grid-column: 1; grid-row: 1; }
        .sdb-original-plus { grid-column: 3; grid-row: 1; }
        .sdb-qty-minus-10 { grid-column: 1; grid-row: 2; }
        .sdb-enhanced-stepper .np-stepper-input { grid-column: 2; grid-row: 2; width: 100%; height: 23px; margin: 0; padding: 0; box-sizing: border-box; text-align: center; }
        .sdb-qty-plus-10 { grid-column: 3; grid-row: 2; }
        .sdb-qty-zero { grid-column: 1; grid-row: 3; }
        .sdb-set-max-qty { grid-column: 3; grid-row: 3; }
        .sdb-enhanced-stepper .np-stepper-btn:not(:disabled):hover { filter: brightness(1.1); }
        .sdb-enhanced-stepper .np-stepper-btn:not(:disabled):active { filter: brightness(0.9); }
        .sdb-enhanced-stepper .np-stepper-btn:disabled { cursor: not-allowed; }
        .sdb-enhanced-stepper .np-stepper-input::-webkit-inner-spin-button, .sdb-enhanced-stepper .np-stepper-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .sdb-enhanced-stepper .np-stepper-input { -moz-appearance: textfield; }
    `;

    document.head.appendChild(style);

    // ============================================================
    // Item Details Magnifying Glass
    // ============================================================

    const ICON = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M15 15l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;

    function processItem(itemCell) {
        if (itemCell.dataset.sdbMagnifierAdded === 'true') {
            return;
        }

        const imageWrap = itemCell.querySelector('.sdb-item-img-wrap');
        const detailsButton = itemCell.querySelector('.sdb-item-view-details');

        if (!imageWrap || !detailsButton) {
            return;
        }

        const magnifier = document.createElement('button');

        magnifier.type = 'button';
        magnifier.className = 'sdb-item-view-details-magnifier';
        magnifier.title = 'View Details';
        magnifier.setAttribute('aria-label', 'View Details');
        magnifier.innerHTML = ICON;

        magnifier.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            detailsButton.click();
        });

        imageWrap.appendChild(magnifier);
        detailsButton.style.display = 'none';
        itemCell.dataset.sdbMagnifierAdded = 'true';
    }

    function processAddedNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (node.matches('.sdb-item-cell')) {
            processItem(node);
        }

        node.querySelectorAll?.('.sdb-item-cell').forEach(processItem);

        const itemCell = node.closest?.('.sdb-item-cell');

        if (itemCell) {
            processItem(itemCell);
        }
    }

    // ============================================================
    // Quantity Controls
    // ============================================================

    function getQuantity(row) {
        const input = row.querySelector('.np-stepper-input');
        return input ? parseInt(input.value, 10) || 0 : 0;
    }

    function getMaxQuantity(row) {
        const qtyCell = row.querySelector('.sdb-qty-cell');
        return qtyCell ? parseInt(qtyCell.textContent.trim(), 10) || 0 : 0;
    }

    function getSelectionCheckbox(row) {
        return row.querySelector('.sdb-col-select .sdb-item-checkbox');
    }

    function selectRow(row) {
        const checkbox = getSelectionCheckbox(row);

        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    }

    function unselectRow(row) {
        const checkbox = getSelectionCheckbox(row);

        if (!checkbox) {
            return;
        }

        row.dataset.sdbSettingZero = 'true';
        row.dataset.sdbIntentionalDeselect = 'true';

        if (checkbox.checked) {
            checkbox.click();
        }

        checkbox.checked = false;
        row.classList.remove('sdb-row-selected');

        setTimeout(function () {
            delete row.dataset.sdbIntentionalDeselect;
        }, 100);
    }

    function setQuantity(row, quantity) {
        const input = row.querySelector('.np-stepper-input');

        if (!input) {
            return;
        }

        const max = getMaxQuantity(row);

        quantity = Math.max(0, Math.min(quantity, max));

        if (quantity === 0) {
            row.dataset.sdbSettingZero = 'true';

            unselectRow(row);

            input.min = '0';
            input.value = '0';

            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            input.value = '0';

            const checkbox = getSelectionCheckbox(row);

            if (checkbox) {
                checkbox.checked = false;
            }

            row.classList.remove('sdb-row-selected');
            updateButtons(row);

            setTimeout(function () {
                const currentInput = row.querySelector('.np-stepper-input');
                const currentCheckbox = getSelectionCheckbox(row);

                if (currentInput) {
                    currentInput.min = '0';
                    currentInput.value = '0';
                }

                if (currentCheckbox) {
                    currentCheckbox.checked = false;
                }

                row.classList.remove('sdb-row-selected');
                delete row.dataset.sdbSettingZero;
            }, 100);

            return;
        }

        input.min = '0';
        input.value = String(quantity);

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        selectRow(row);
        updateButtons(row);
    }

    function updateButtons(row) {
        const quantity = getQuantity(row);
        const max = getMaxQuantity(row);

        const originalMinus = row.querySelector('.sdb-original-minus');
        const originalPlus = row.querySelector('.sdb-original-plus');
        const minus10 = row.querySelector('.sdb-qty-minus-10');
        const plus10 = row.querySelector('.sdb-qty-plus-10');
        const zeroButton = row.querySelector('.sdb-qty-zero');
        const maxButton = row.querySelector('.' + MAX_BUTTON);

        if (originalMinus) {
            originalMinus.disabled = quantity <= 0;
        }

        if (originalPlus) {
            originalPlus.disabled = quantity >= max;
        }

        if (minus10) {
            minus10.disabled = quantity <= 0;
        }

        if (plus10) {
            plus10.disabled = quantity >= max;
        }

        if (zeroButton) {
            zeroButton.disabled = quantity <= 0;
        }

        if (maxButton) {
            maxButton.disabled = quantity >= max;
        }
    }

    document.addEventListener('click', function (event) {
        const row = event.target.closest('tr.sdb-row-odd, tr.sdb-row-even');

        if (!row || row.dataset.sdbIntentionalDeselect !== 'true') {
            return;
        }

        event.stopPropagation();
    }, true);

    document.addEventListener('click', function (event) {
        const button = event.target.closest('.sdb-enhanced-stepper button');

        if (!button) {
            return;
        }

        const row = button.closest('tr.sdb-row-odd, tr.sdb-row-even');

        if (!row) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        const quantity = getQuantity(row);

        if (button.classList.contains('sdb-original-minus')) {
            setQuantity(row, quantity - 1);
            return;
        }

        if (button.classList.contains('sdb-original-plus')) {
            setQuantity(row, quantity + 1);
            return;
        }

        if (button.classList.contains('sdb-qty-minus-10')) {
            setQuantity(row, quantity - 10);
            return;
        }

        if (button.classList.contains('sdb-qty-plus-10')) {
            setQuantity(row, quantity + 10);
            return;
        }

        if (button.classList.contains('sdb-qty-zero')) {
            setQuantity(row, 0);
            return;
        }

        if (button.classList.contains(MAX_BUTTON)) {
            setQuantity(row, getMaxQuantity(row));
        }
    }, true);

    function addButtons() {
        document.querySelectorAll('tr.sdb-row-odd, tr.sdb-row-even').forEach(function (row) {
            const stepper = row.querySelector('.np-stepper');
            const input = row.querySelector('.np-stepper-input');

            if (!stepper || !input) {
                return;
            }

            if (stepper.classList.contains('sdb-enhanced-stepper')) {
                input.min = '0';
                updateButtons(row);
                return;
            }

            stepper.classList.add('sdb-enhanced-stepper');
            input.min = '0';

            const originalButtons = stepper.querySelectorAll(':scope > .np-stepper-btn');

            if (originalButtons.length < 2) {
                return;
            }

            const minusButton = originalButtons[0];
            const plusButton = originalButtons[1];

            minusButton.classList.add('np-stepper-btn', 'np-stepper-btn-minus', 'sdb-original-minus');
            plusButton.classList.add('np-stepper-btn', 'np-stepper-btn-plus', 'sdb-original-plus');

            const minus10 = document.createElement('button');
            minus10.type = 'button';
            minus10.className = 'np-stepper-btn np-stepper-btn-minus sdb-qty-minus-10';
            minus10.textContent = '−10';
            minus10.title = 'Subtract 10';

            const plus10 = document.createElement('button');
            plus10.type = 'button';
            plus10.className = 'np-stepper-btn np-stepper-btn-plus sdb-qty-plus-10';
            plus10.textContent = '+10';
            plus10.title = 'Add 10';

            const zeroButton = document.createElement('button');
            zeroButton.type = 'button';
            zeroButton.className = 'np-stepper-btn np-stepper-btn-minus sdb-qty-zero';
            zeroButton.textContent = '⏮';
            zeroButton.title = 'Set quantity to 0';
            zeroButton.setAttribute('aria-label', 'Set quantity to 0');

            const maxButton = document.createElement('button');
            maxButton.type = 'button';
            maxButton.className = 'np-stepper-btn np-stepper-btn-plus ' + MAX_BUTTON;
            maxButton.textContent = '⏭';
            maxButton.title = 'Set quantity to maximum';
            maxButton.setAttribute('aria-label', 'Set quantity to maximum');

            stepper.appendChild(minus10);
            stepper.appendChild(plus10);
            stepper.appendChild(zeroButton);
            stepper.appendChild(maxButton);

            input.addEventListener('input', function () {
                input.min = '0';
                updateButtons(row);

                if (getQuantity(row) >= 1) {
                    selectRow(row);
                } else {
                    unselectRow(row);
                }
            });

            input.addEventListener('change', function () {
                input.min = '0';
                updateButtons(row);

                if (getQuantity(row) >= 1) {
                    selectRow(row);
                } else {
                    unselectRow(row);
                }
            });

            updateButtons(row);
        });
    }

    // ============================================================
    // Drawer
    // ============================================================

    function moveSelectedQuantity() {
        const quantity = document.querySelector('.sdb-header-selected');
        const drawer = document.querySelector('.sdb-drawer-content');

        if (!quantity || !drawer || drawer.contains(quantity)) {
            return;
        }

        drawer.appendChild(quantity);
    }

    // ============================================================
    // Floating Pagination
    // ============================================================

    function createFloatingButtons() {
        if (document.querySelector('#sdb-floating-prev')) {
            return true;
        }

        const container = document.querySelector('#container__2020');
        const pagination = document.querySelector('.sdb-pagination');

        if (!container || !pagination) {
            return false;
        }

        const originalPrev = pagination.querySelector('.sdb-pagination-prev');
        const originalNext = pagination.querySelector('.sdb-pagination-next');

        if (!originalPrev || !originalNext) {
            return false;
        }

        const prev = document.createElement('button');
        prev.id = 'sdb-floating-prev';
        prev.type = 'button';
        prev.innerHTML = '<span class="sdb-arrow sdb-arrow-prev"></span>';

        const next = document.createElement('button');
        next.id = 'sdb-floating-next';
        next.type = 'button';
        next.innerHTML = '<span class="sdb-arrow sdb-arrow-next"></span>';

        prev.addEventListener('click', function () {
            const currentPrev = document.querySelector('.sdb-pagination-prev');

            if (currentPrev && !currentPrev.disabled) {
                currentPrev.click();
            }

            setTimeout(updateButtonStates, 0);
        });

        next.addEventListener('click', function () {
            const currentNext = document.querySelector('.sdb-pagination-next');

            if (currentNext && !currentNext.disabled) {
                currentNext.click();
            }

            setTimeout(updateButtonStates, 0);
        });

        document.body.appendChild(prev);
        document.body.appendChild(next);

        updateButtonPositions();
        updateButtonStates();

        return true;
    }

    function updateButtonPositions() {
        const container = document.querySelector('#container__2020');
        const prev = document.querySelector('#sdb-floating-prev');
        const next = document.querySelector('#sdb-floating-next');

        if (!container || !prev || !next) {
            return;
        }

        const rect = container.getBoundingClientRect();
        const gap = 20;

        prev.style.left = `${rect.left - prev.offsetWidth - gap}px`;
        next.style.left = `${rect.right + gap}px`;
    }

    function updateButtonStates() {
        const pagination = document.querySelector('.sdb-pagination');
        const prev = document.querySelector('#sdb-floating-prev');
        const next = document.querySelector('#sdb-floating-next');

        if (!pagination || !prev || !next) {
            return;
        }

        // Neopets may replace these buttons when changing pages,
        // so always query the current elements.
        const originalPrev = pagination.querySelector('.sdb-pagination-prev');
        const originalNext = pagination.querySelector('.sdb-pagination-next');

        if (!originalPrev || !originalNext) {
            return;
        }

        prev.disabled = originalPrev.disabled;
        next.disabled = originalNext.disabled;
    }

    function waitForPagination() {
        let attempts = 0;
        const maxAttempts = 300;

        const timer = setInterval(function () {
            attempts++;

            if (createFloatingButtons()) {
                clearInterval(timer);
                return;
            }

            if (attempts >= maxAttempts) {
                clearInterval(timer);
            }
        }, 100);
    }

    // ============================================================
    // Initialization
    // ============================================================

    addButtons();
    moveSelectedQuantity();
    waitForPagination();

    window.addEventListener('resize', updateButtonPositions);

    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                processAddedNode(node);
            }

            if (mutation.target) {
                const itemCell = mutation.target.closest?.('.sdb-item-cell');

                if (itemCell) {
                    processItem(itemCell);
                }
            }
        }

        addButtons();
        moveSelectedQuantity();
        updateButtonStates();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
