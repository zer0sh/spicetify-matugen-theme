// NAME: Topbar Actions
// AUTHOR: zero
// DESCRIPTION: Restores Marketplace button and positions Spicetify utility buttons on the right side of the Topbar.

(function topbarActions() {
    if (window.__spicetifyTopbarActionsLoaded) return;

    if (!Spicetify?.Topbar?.Button || !Spicetify?.Platform?.History) {
        setTimeout(topbarActions, 100);
        return;
    }

    window.__spicetifyTopbarActionsLoaded = true;

    // 1. Intercept Topbar.Button to ensure Spicetify buttons are placed on the right
    const OriginalTopbarButton = Spicetify.Topbar.Button;
    Spicetify.Topbar.Button = class extends OriginalTopbarButton {
        constructor(label, icon, onClick, disabled = false, isRight = false) {
            if (typeof label === "string" && label.toLowerCase().includes("spicetify")) {
                isRight = true;
            }
            super(label, icon, onClick, disabled, isRight);
        }
    };

    // 2. Add Marketplace Topbar Button (positioned on the right side)
    const MARKETPLACE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 76.465 68.262" fill="currentColor"><path d="M151.909 72.923v6.5h10.097l8.663 44.567h48.968v-6.5h-43.61l-1.2-6.172h42.974l10.35-33.91h-59.915l-.872-4.485H151.91zm17.59 10.984h49.867l-6.393 20.91h-39.409l-4.064-20.91zm5.626 44.11a6.5 6.5 0 0 0-6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5zm38.274 0a6.5 6.5 0 0 0-6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5z" transform="translate(-151.909 -72.923)"/></svg>`;

    const marketplaceButton = new Spicetify.Topbar.Button(
        "Marketplace",
        MARKETPLACE_SVG,
        () => {
            const currentPath = Spicetify.Platform.History.location.pathname;
            if (currentPath === "/marketplace") {
                Spicetify.Platform.History.goBack();
            } else {
                Spicetify.Platform.History.push({ pathname: "/marketplace" });
            }
        },
        false,
        true
    );

    // Update active visual state for Marketplace button
    function updateMarketplaceState() {
        const isMarketplace = Spicetify.Platform.History.location.pathname === "/marketplace";
        if (marketplaceButton.element) {
            marketplaceButton.element.classList.toggle("main-topBar-button-active", isMarketplace);
            const btn = marketplaceButton.element.querySelector("button");
            if (btn) {
                btn.classList.toggle("main-topBar-button-active", isMarketplace);
                if (isMarketplace) {
                    btn.style.color = "var(--spice-button, #1db954)";
                } else {
                    btn.style.removeProperty("color");
                }
            }
        }
    }

    Spicetify.Platform.History.listen(updateMarketplaceState);
    updateMarketplaceState();

    // 3. Fallback persistent Spicetify button if update button is absent
    setTimeout(() => {
        const existingSpicetifyButton = document.querySelector("button[aria-label*='Spicetify'], [aria-label*='Spicetify']");
        if (!existingSpicetifyButton) {
            const SPICETIFY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="18px" height="18px" viewBox="0 0 320.000000 400.000000"><g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)" fill="currentColor"><path d="M2213 3833 c3 -10 18 -52 34 -93 25 -67 28 -88 28 -200 0 -113 -3 -131 -27 -188 -87 -207 -222 -340 -613 -602 -206 -139 -308 -223 -442 -364 -117 -124 -133 -129 -146 -51 -28 173 -52 229 -130 307 -69 69 -133 101 -214 106 -80 5 -113 -3 -113 -28 0 -13 14 -25 43 -38 63 -28 113 -76 144 -140 25 -51 28 -68 28 -152 -1 -141 -27 -221 -193 -600 -133 -305 -164 -459 -138 -685 20 -168 46 -268 101 -382 127 -262 351 -451 642 -540 81 -24 102 -27 268 -27 159 -1 190 2 265 22 172 47 315 129 447 255 164 157 251 322 304 572 26 124 31 308 15 585 -7 130 -6 168 8 240 42 211 148 335 316 371 38 8 50 15 50 29 0 23 -27 30 -120 30 -101 0 -183 -22 -250 -68 -52 -36 -71 -58 -163 -203 -46 -73 -90 -96 -141 -75 -41 17 -51 43 -44 118 4 39 29 97 106 248 198 388 264 606 264 880 0 200 -37 347 -123 492 -53 91 -156 198 -188 198 -18 0 -22 -4 -18 -17z m-591 -2208 c277 -37 576 -148 608 -226 25 -59 -20 -129 -82 -129 -15 0 -61 16 -101 36 -133 67 -288 111 -480 135 -131 16 -447 7 -542 -16 -38 -10 -95 -19 -125 -22 -46 -4 -59 -1 -77 16 -41 38 -42 102 -4 140 33 33 270 78 441 84 109 4 249 -4 362 -18z m-40 -354 c142 -25 276 -68 397 -129 76 -38 97 -53 107 -79 23 -53 -8 -103 -63 -103 -19 0 -67 17 -111 39 -92 46 -203 84 -315 108 -128 28 -450 25 -573 -5 -68 -17 -97 -20 -117 -13 -47 18 -62 80 -29 120 55 69 457 104 704 62z m-48 -326 c183 -28 418 -126 432 -181 7 -29 -16 -69 -45 -77 -12 -3 -62 15 -123 43 -175 82 -240 95 -468 95 -149 0 -214 -4 -274 -18 -43 -9 -87 -17 -97 -17 -27 0 -59 35 -59 64 0 50 47 67 280 100 67 9 266 4 354 -9z"/></g></svg>`;

            const infoModalContent = document.createElement("div");
            infoModalContent.id = "spicetify-info-modal";
            infoModalContent.innerHTML = `
                <style>
                    #spicetify-info-modal {
                        padding: 1rem 0;
                        color: var(--spice-text);
                    }
                    #spicetify-info-modal p {
                        margin-bottom: 0.75rem;
                        font-size: 1rem;
                    }
                    #spicetify-info-modal code {
                        background-color: var(--spice-card);
                        color: var(--spice-button);
                        padding: 0.2rem 0.5rem;
                        border-radius: 4px;
                        font-family: monospace;
                    }
                    #spicetify-info-modal hr {
                        border-color: var(--spice-main-secondary);
                        margin: 1rem 0;
                    }
                </style>
                <p><strong>Spicetify CLI:</strong> <code>${Spicetify.Config?.version || "Active"}</code></p>
                <p><strong>Theme:</strong> <code>${Spicetify.Config?.current_theme || "matugen"}</code></p>
                <p><strong>Color Scheme:</strong> <code>${Spicetify.Config?.color_scheme || "matugen"}</code></p>
                <hr>
                <p>Dynamic palette synchronized with Matugen Material You system colors.</p>
            `;

            new Spicetify.Topbar.Button(
                "Spicetify",
                SPICETIFY_SVG,
                () => Spicetify.PopupModal.display({
                    title: "Spicetify Environment",
                    content: infoModalContent,
                    isLarge: false
                }),
                false,
                true
            );
        }
    }, 1500);

    // 4. MutationObserver guard: relocate any Spicetify button found on the left to the right
    function relocateLeftButtons() {
        const leftContainer = document.querySelector(".main-topBar-historyButtons, .main-globalNav-historyButtons");
        const rightContainer = document.querySelector(".main-actionButtons");
        if (!leftContainer || !rightContainer) return;

        const leftButtons = leftContainer.querySelectorAll("button[aria-label*='Spicetify'], div:has(> button[aria-label*='Spicetify'])");
        leftButtons.forEach(node => {
            const el = node.parentElement && node.parentElement !== leftContainer ? node.parentElement : node;
            if (el.parentElement === leftContainer) {
                rightContainer.prepend(el);
            }
        });
    }

    const observer = new MutationObserver(relocateLeftButtons);
    const topBarElement = document.querySelector(".Root__top-bar, .main-topBar-container, header") || document.body;
    observer.observe(topBarElement, { childList: true, subtree: true });
    relocateLeftButtons();
})();
