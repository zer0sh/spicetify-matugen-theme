// NAME: Topbar Actions
// AUTHOR: zero
// DESCRIPTION: Positions Spicetify utility buttons on the right side of the Topbar with custom flame icon.

(function topbarActions() {
    if (window.__spicetifyTopbarActionsLoaded) return;

    if (!Spicetify?.Topbar?.Button || !Spicetify?.Platform?.History) {
        setTimeout(topbarActions, 100);
        return;
    }

    window.__spicetifyTopbarActionsLoaded = true;

    // Material Design / Spotify style flame icon (16x16, fill currentColor)
    const FLAME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>`;

    // 1. Intercept Topbar.Button to force Spicetify buttons to the right and use the flame icon
    const OriginalTopbarButton = Spicetify.Topbar.Button;
    Spicetify.Topbar.Button = class extends OriginalTopbarButton {
        constructor(label, icon, onClick, disabled = false, isRight = false) {
            if (typeof label === "string" && label.toLowerCase().includes("spicetify")) {
                isRight = true;
                icon = FLAME_SVG;
            }
            super(label, icon, onClick, disabled, isRight);
        }
    };

    // 2. Fallback persistent Spicetify button if update button is absent
    setTimeout(() => {
        const existingSpicetifyButton = document.querySelector("button[aria-label*='Spicetify'], [aria-label*='Spicetify']");
        if (!existingSpicetifyButton) {
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
                FLAME_SVG,
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

    // 3. MutationObserver guard: relocate any Spicetify button found on the left to the right and apply flame icon
    function syncSpicetifyButtons() {
        const leftContainer = document.querySelector(".main-topBar-historyButtons, .main-globalNav-historyButtons");
        const rightContainer = document.querySelector(".main-actionButtons");

        // Relocate if on left
        if (leftContainer && rightContainer) {
            const leftButtons = leftContainer.querySelectorAll("button[aria-label*='Spicetify'], div:has(> button[aria-label*='Spicetify'])");
            leftButtons.forEach(node => {
                const el = node.parentElement && node.parentElement !== leftContainer ? node.parentElement : node;
                if (el.parentElement === leftContainer) {
                    rightContainer.prepend(el);
                }
            });
        }

        // Apply flame icon if button exists with old SVG
        const allSpicetifyButtons = document.querySelectorAll("button[aria-label*='Spicetify']");
        allSpicetifyButtons.forEach(btn => {
            if (!btn.querySelector("path[d*='M13.5.67']")) {
                btn.innerHTML = FLAME_SVG;
            }
        });
    }

    const observer = new MutationObserver(syncSpicetifyButtons);
    const topBarElement = document.querySelector(".Root__top-bar, .main-topBar-container, header") || document.body;
    observer.observe(topBarElement, { childList: true, subtree: true });
    syncSpicetifyButtons();
})();
