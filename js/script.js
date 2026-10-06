const SUPABASE_URL = "https://wlaytkwkflygzgyekmoh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_m7dPEfqtawZyonZUOPqCGA_Xw4PlAJt";

const supabaseClient =
    window.supabase &&
    typeof window.supabase.createClient === "function"
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        )
        : null;


/* =====================================================
   ELEMENTS
===================================================== */

const cardsContainer = document.getElementById("cards");
const resultText = document.getElementById("resultText");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

const themeButton = document.getElementById("themeButton");
const languageToggle = document.getElementById("languageToggle");
const languageOptions = document.getElementById("languageOptions");


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;
}


/* =====================================================
   LANGUAGE DATA
===================================================== */

const translations = {

    en: {
        language: "Language",
        templates: "Templates",
        about: "About",
        contact: "Contact",

        search: "Search templates...",
        clear: "Clear",

        freeTemplates: "Free templates.",
        loading: "Loading templates...",
        showingAll: "Showing all templates",

        noResults: "No matching templates found.",
        tryAnother: "Try another keyword.",

        aboutTitle: "YASHU FX",
        aboutText:
            "YASHU FX is a simple place for creators to discover useful free editing templates and start creating faster.",
        aboutText2:
            "The goal is to make useful editing resources easy to find, simple to access, and completely free for creators.",

        contactTitle: "Get in touch.",
        contactText:
            "For template suggestions, collaborations or other enquiries, contact YASHU FX.",

        footer: "Free templates for creators.",
        madeFor: "Made for editors",

        useTemplate: "Use Template →",
        aiPrompt: "AI Prompt",
        copyPrompt: "Copy Prompt",
        copied: "Copied!",
        close: "Close",
        freeLabel: "FREE",
        resultFound: "result found",
        resultsFound: "results found",
        loadError: "Unable to load templates."
    },

    kn: {
        language: "ಭಾಷೆ",
        templates: "ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
        about: "ನಮ್ಮ ಬಗ್ಗೆ",
        contact: "ಸಂಪರ್ಕ",

        search: "ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
        clear: "ತೆರವುಗೊಳಿಸಿ",

        freeTemplates: "ಉಚಿತ ಟೆಂಪ್ಲೇಟ್‌ಗಳು.",
        loading: "ಟೆಂಪ್ಲೇಟ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
        showingAll: "ಎಲ್ಲಾ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ",

        noResults: "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಟೆಂಪ್ಲೇಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
        tryAnother: "ಬೇರೆ ಕೀವರ್ಡ್ ಪ್ರಯತ್ನಿಸಿ.",

        aboutTitle: "YASHU FX",
        aboutText:
            "YASHU FX ಕ್ರಿಯೇಟರ್‌ಗಳಿಗೆ ಉಪಯುಕ್ತ ಉಚಿತ ಎಡಿಟಿಂಗ್ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಿ ವೇಗವಾಗಿ ಕ್ರಿಯೇಟ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುವ ಸರಳ ವೇದಿಕೆಯಾಗಿದೆ.",
        aboutText2:
            "ಉಪಯುಕ್ತ ಎಡಿಟಿಂಗ್ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಲು, ಪ್ರವೇಶಿಸಲು ಮತ್ತು ಕ್ರಿಯೇಟರ್‌ಗಳಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿಡುವುದು ನಮ್ಮ ಗುರಿಯಾಗಿದೆ.",

        contactTitle: "ಸಂಪರ್ಕಿಸಿ.",
        contactText:
            "ಟೆಂಪ್ಲೇಟ್ ಸಲಹೆಗಳು, ಸಹಯೋಗಗಳು ಅಥವಾ ಇತರ ವಿಚಾರಗಳಿಗಾಗಿ YASHU FX ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.",

        footer: "ಕ್ರಿಯೇಟರ್‌ಗಳಿಗಾಗಿ ಉಚಿತ ಟೆಂಪ್ಲೇಟ್‌ಗಳು.",
        madeFor: "ಎಡಿಟರ್‌ಗಳಿಗಾಗಿ",

        useTemplate: "ಟೆಂಪ್ಲೇಟ್ ಬಳಸಿ →",
        aiPrompt: "AI ಪ್ರಾಂಪ್ಟ್",
        copyPrompt: "ಪ್ರಾಂಪ್ಟ್ ನಕಲಿಸಿ",
        copied: "ನಕಲಿಸಲಾಗಿದೆ!",
        close: "ಮುಚ್ಚಿ",
        freeLabel: "ಉಚಿತ",
        resultFound: "ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿದೆ",
        resultsFound: "ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿವೆ",
        loadError: "ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
    },

    ta: {
        language: "மொழி",
        templates: "டெம்ப்ளேட்கள்",
        about: "எங்களைப் பற்றி",
        contact: "தொடர்பு",

        search: "டெம்ப்ளேட்களை தேடுங்கள்...",
        clear: "அழி",

        freeTemplates: "இலவச டெம்ப்ளேட்கள்.",
        loading: "டெம்ப்ளேட்கள் ஏற்றப்படுகின்றன...",
        showingAll: "அனைத்து டெம்ப்ளேட்களும் காட்டப்படுகின்றன",

        noResults: "பொருத்தமான டெம்ப்ளேட்கள் எதுவும் கிடைக்கவில்லை.",
        tryAnother: "வேறு முக்கிய சொல்லை முயற்சிக்கவும்.",

        aboutTitle: "YASHU FX",
        aboutText:
            "YASHU FX என்பது கிரியேட்டர்கள் பயனுள்ள இலவச எடிட்டிங் டெம்ப்ளேட்களை எளிதாகக் கண்டுபிடித்து வேகமாக உருவாக்க உதவும் எளிய தளமாகும்.",
        aboutText2:
            "பயனுள்ள எடிட்டிங் வளங்களை எளிதாகக் கண்டுபிடித்து அணுகவும், கிரியேட்டர்களுக்கு முற்றிலும் இலவசமாகவும் வழங்குவதே எங்கள் நோக்கம்.",

        contactTitle: "தொடர்பு கொள்ளுங்கள்.",
        contactText:
            "டெம்ப்ளேட் பரிந்துரைகள், ஒத்துழைப்புகள் அல்லது பிற கேள்விகளுக்கு YASHU FX-ஐ தொடர்பு கொள்ளுங்கள்.",

        footer: "கிரியேட்டர்களுக்கான இலவச டெம்ப்ளேட்கள்.",
        madeFor: "எடிட்டர்களுக்காக",

        useTemplate: "டெம்ப்ளேட்டை பயன்படுத்தவும் →",
        aiPrompt: "AI ப்ராம்ப்ட்",
        copyPrompt: "ப்ராம்ப்டை நகலெடு",
        copied: "நகலெடுக்கப்பட்டது!",
        close: "மூடு",
        freeLabel: "இலவசம்",
        resultFound: "முடிவு கிடைத்தது",
        resultsFound: "முடிவுகள் கிடைத்தன",
        loadError: "டெம்ப்ளேட்களை ஏற்ற முடியவில்லை."
    },

    te: {
        language: "భాష",
        templates: "టెంప్లేట్లు",
        about: "మా గురించి",
        contact: "సంప్రదించండి",

        search: "టెంప్లేట్లను వెతకండి...",
        clear: "క్లియర్",

        freeTemplates: "ఉచిత టెంప్లేట్లు.",
        loading: "టెంప్లేట్లు లోడ్ అవుతున్నాయి...",
        showingAll: "అన్ని టెంప్లేట్లు చూపించబడుతున్నాయి",

        noResults: "సరిపోలే టెంప్లేట్లు ఏవీ కనుగొనబడలేదు.",
        tryAnother: "మరొక కీవర్డ్ ప్రయత్నించండి.",

        aboutTitle: "YASHU FX",
        aboutText:
            "YASHU FX క్రియేటర్లు ఉపయోగకరమైన ఉచిత ఎడిటింగ్ టెంప్లేట్లను సులభంగా కనుగొని వేగంగా క్రియేట్ చేయడానికి సహాయపడే సులభమైన ప్లాట్‌ఫారమ్.",
        aboutText2:
            "ఉపయోగకరమైన ఎడిటింగ్ వనరులను సులభంగా కనుగొని, యాక్సెస్ చేసి, క్రియేటర్లకు పూర్తిగా ఉచితంగా అందించడం మా లక్ష్యం.",

        contactTitle: "సంప్రదించండి.",
        contactText:
            "టెంప్లేట్ సూచనలు, సహకారాలు లేదా ఇతర ప్రశ్నల కోసం YASHU FX ను సంప్రదించండి.",

        footer: "క్రియేటర్ల కోసం ఉచిత టెంప్లేట్లు.",
        madeFor: "ఎడిటర్ల కోసం",

        useTemplate: "టెంప్లేట్ ఉపయోగించండి →",
        aiPrompt: "AI ప్రాంప్ట్",
        copyPrompt: "ప్రాంప్ట్ కాపీ చేయండి",
        copied: "కాపీ అయింది!",
        close: "మూసివేయి",
        freeLabel: "ఉచితం",
        resultFound: "ఫలితం కనుగొనబడింది",
        resultsFound: "ఫలితాలు కనుగొనబడ్డాయి",
        loadError: "టెంప్లేట్లను లోడ్ చేయలేకపోయాము."
    },

    hi: {
        language: "भाषा",
        templates: "टेम्पलेट्स",
        about: "हमारे बारे में",
        contact: "संपर्क",

        search: "टेम्पलेट्स खोजें...",
        clear: "साफ़ करें",

        freeTemplates: "मुफ़्त टेम्पलेट्स.",
        loading: "टेम्पलेट्स लोड हो रहे हैं...",
        showingAll: "सभी टेम्पलेट्स दिखाए जा रहे हैं",

        noResults: "कोई मिलान वाला टेम्पलेट नहीं मिला।",
        tryAnother: "कोई दूसरा कीवर्ड आज़माएँ।",

        aboutTitle: "YASHU FX",
        aboutText:
            "YASHU FX क्रिएटर्स के लिए उपयोगी मुफ्त एडिटिंग टेम्पलेट्स खोजने और तेजी से क्रिएट करने का एक सरल प्लेटफॉर्म है।",
        aboutText2:
            "हमारा लक्ष्य उपयोगी एडिटिंग संसाधनों को ढूँढना और इस्तेमाल करना आसान बनाना तथा उन्हें क्रिएटर्स के लिए पूरी तरह मुफ्त रखना है।",

        contactTitle: "संपर्क करें।",
        contactText:
            "टेम्पलेट सुझाव, सहयोग या अन्य जानकारी के लिए YASHU FX से संपर्क करें।",

        footer: "क्रिएटर्स के लिए मुफ्त टेम्पलेट्स।",
        madeFor: "एडिटर्स के लिए",

        useTemplate: "टेम्पलेट इस्तेमाल करें →",
        aiPrompt: "AI प्रॉम्प्ट",
        copyPrompt: "प्रॉम्प्ट कॉपी करें",
        copied: "कॉपी हो गया!",
        close: "बंद करें",
        freeLabel: "मुफ़्त",
        resultFound: "परिणाम मिला",
        resultsFound: "परिणाम मिले",
        loadError: "टेम्पलेट्स लोड नहीं हो सके।"
    }

};


/* =====================================================
   LANGUAGE NAMES
===================================================== */

const languageNames = {

    en: "English",
    kn: "ಕನ್ನಡ",
    ta: "தமிழ்",
    te: "తెలుగు",
    hi: "हिन्दी"

};


/* =====================================================
   CURRENT LANGUAGE
===================================================== */

let currentLanguage =
    localStorage.getItem("yashuFXLanguage") || "en";


/* =====================================================
   LANGUAGE MENU
===================================================== */

function createLanguageMenu() {

    if (!languageOptions) {
        return;
    }

    if (languageToggle) {
        languageToggle.textContent =
            `${currentLanguage.toUpperCase()}⌄`;
        languageToggle.setAttribute(
            "aria-label",
            translations[currentLanguage].language
        );
    }

    languageOptions.innerHTML = Object.entries(languageNames)
        .map(([code, name]) => `
            <button
                type="button"
                class="language-option ${
                    code === currentLanguage ? "active" : ""
                }"
                data-language="${code}"
            >
                ${escapeHTML(name)}
            </button>
        `)
        .join("");

    languageOptions
        .querySelectorAll(".language-option")
        .forEach(button => {

            button.addEventListener("click", () => {

                const language =
                    button.dataset.language;

                setLanguage(language);
                closeLanguageMenu();

            });

        });
}


function closeLanguageMenu() {

    if (!languageOptions || !languageToggle) {
        return;
    }

    languageOptions.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
}


if (languageToggle && languageOptions) {

    languageToggle.addEventListener("click", event => {

        event.stopPropagation();

        const isOpen = !languageOptions.hidden;

        languageOptions.hidden = isOpen;
        languageToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );
    });

    document.addEventListener("click", event => {

        if (!event.target.closest(".language-control")) {
            closeLanguageMenu();
        }
    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeLanguageMenu();
        }
    });
}


/* =====================================================
   APPLY LANGUAGE
===================================================== */

function applyLanguage() {

    const t = translations[currentLanguage];

    document.documentElement.lang =
        currentLanguage;

    /* Menu */

    const menuLinks =
        document.querySelectorAll(".menu-links a");

    if (menuLinks[0]) {
        menuLinks[0].textContent = t.templates;
    }

    if (menuLinks[1]) {
        menuLinks[1].textContent = t.about;
    }

    if (menuLinks[2]) {
        menuLinks[2].textContent = t.contact;
    }


    /* Search */

    if (searchInput) {
        searchInput.placeholder = t.search;
    }

    if (clearSearch) {
        clearSearch.textContent = t.clear;
    }


    /* Templates heading */

    const sectionLabel =
        document.querySelector("#templates .section-label");

    if (sectionLabel) {
        sectionLabel.textContent = t.templates;
    }

    const templatesHeading =
        document.querySelector("#templates h1, #templates h2");

    if (templatesHeading) {
        templatesHeading.textContent =
            t.freeTemplates;
    }


    /* About */

    const aboutSection =
        document.getElementById("about");

    if (aboutSection) {

        const label =
            aboutSection.querySelector(".section-label");

        const heading =
            aboutSection.querySelector("h1, h2");

        const paragraph =
            aboutSection.querySelector("[data-about-primary]") ||
            aboutSection.querySelector("p");

        const secondaryParagraph =
            aboutSection.querySelector("[data-about-secondary]");

        if (label) {
            label.textContent = t.about.toUpperCase();
        }

        if (heading) {
            heading.textContent = t.aboutTitle;
        }

        if (paragraph) {
            paragraph.textContent = t.aboutText;
        }

        if (secondaryParagraph) {
            secondaryParagraph.textContent = t.aboutText2;
        }
    }


    /* Contact */

    const contactSection =
        document.getElementById("contact");

    if (contactSection) {

        const label =
            contactSection.querySelector(".section-label");

        const heading =
            contactSection.querySelector("h1, h2");

        const paragraph =
            contactSection.querySelector("[data-contact-text]") ||
            contactSection.querySelector("p");

        if (label) {
            label.textContent =
                t.contact.toUpperCase();
        }

        if (heading) {
            heading.textContent =
                t.contactTitle;
        }

        if (paragraph) {
            paragraph.textContent =
                t.contactText;
        }
    }


    /* Footer */

    const footer =
        document.querySelector("footer");

    if (footer) {

        const footerItems =
            footer.querySelectorAll(".footer > div");

        if (footerItems[0]) {

            footerItems[0].innerHTML = `
                <strong>YASHU FX</strong>
                — ${escapeHTML(t.footer)}
            `;
        }

        if (footerItems[1]) {

            footerItems[1].textContent =
                `${t.madeFor} • 2026`;
        }
    }


    /* Language menu */

    createLanguageMenu();

    /* Refresh result text */

if (resultText) {

    if (
        searchInput &&
        searchInput.value.trim()
    ) {

        performSearch();

    } else {

        resultText.textContent =
            t.showingAll;

    }

}

    /* Refresh empty/loading text */

    if (
        cardsContainer &&
        cardsContainer.querySelector(".loading-message")
    ) {

        cardsContainer.querySelector(
            ".loading-message"
        ).textContent = t.loading;
    }

    if (noResults) {

        noResults.innerHTML = `
            ${escapeHTML(t.noResults)}
            <br>
            ${escapeHTML(t.tryAnother)}
        `;
    }

    /* Update visible template buttons */

    document
        .querySelectorAll(".card-button")
        .forEach((button, index) => {

            if (button.dataset.templateMain === "true") {

                button.textContent =
                    t.useTemplate;
            }

        });

    document
        .querySelectorAll(".free")
        .forEach(label => {
            label.textContent = t.freeLabel;
        });

}


/* =====================================================
   SET LANGUAGE
===================================================== */

function setLanguage(language) {

    if (!translations[language]) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        "yashuFXLanguage",
        language
    );

    applyLanguage();
}


/* =====================================================
   CREATE TEMPLATE CARD
===================================================== */

function createTemplateCard(template) {

    const article =
        document.createElement("article");

    article.className =
        "card searchable";


    const linkSearchText =
        Array.isArray(template.links)
            ? template.links
                .map(link => link.label || "")
                .join(" ")
            : "";


    if (template.ai_prompt) {
        article.dataset.aiPrompt = template.ai_prompt;
    }

    article.dataset.search = [

        template.title || "",
        template.category || "",
        template.description || "",
        linkSearchText

    ]
        .join(" ")
        .toLowerCase();


    const links =
        Array.isArray(template.links)
            ? template.links
            : [];


    let linksHTML = "";


    links.forEach((link, index) => {

        if (
            !link ||
            !link.label ||
            !link.url
        ) {
            return;
        }

        linksHTML += `

            <a
                href="${escapeHTML(link.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="card-button"
                ${index === 0
                    ? 'data-template-main="true"'
                    : ""}
            >
                ${escapeHTML(
                    index === 0
                        ? translations[currentLanguage].useTemplate
                        : link.label
                )}
            </a>
        `;
    });


    article.innerHTML = `

        <div class="thumbnail">

            ${
                template.thumbnail_url
                    ? `
                        <img
                            src="${escapeHTML(
                                template.thumbnail_url
                            )}"
                            alt="${escapeHTML(
                                template.title
                            )}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="thumbnail-placeholder">
                            YASHU FX
                        </div>
                    `
            }

        </div>

        <div class="card-body">

            <div class="card-top">

                <span class="category">
                    ${escapeHTML(
                        template.category || ""
                    )}
                </span>

                <span class="free">
                    ${escapeHTML(translations[currentLanguage].freeLabel)}
                </span>

            </div>

            <h3>
                ${escapeHTML(
                    template.title || ""
                )}
            </h3>

            <p>
                ${escapeHTML(
                    template.description || ""
                )}
            </p>

            <div class="card-links">
                ${linksHTML}
            </div>
            ${template.ai_prompt
                ? `
                    <button
                        type="button"
                        class="ai-prompt-button"
                    >
                        ${escapeHTML(translations[currentLanguage].aiPrompt)}
                    </button>
                `
                : ""
            }

        </div>
    `;


    return article;
}


/* =====================================================
   AI PROMPT VIEWER
===================================================== */

function showAIPrompt(prompt) {
    const t = translations[currentLanguage];
    const overlay = document.createElement("div");
    overlay.className = "ai-prompt-overlay";

    const dialog = document.createElement("section");
    dialog.className = "ai-prompt-modal";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "aiPromptTitle");

    const heading = document.createElement("h2");
    heading.id = "aiPromptTitle";
    heading.textContent = t.aiPrompt;

    const promptText = document.createElement("pre");
    promptText.className = "ai-prompt-text";
    promptText.textContent = prompt;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "ai-prompt-copy";
    copyButton.textContent = t.copyPrompt;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "ai-prompt-close";
    closeButton.textContent = t.close;

    const actions = document.createElement("div");
    actions.className = "ai-prompt-actions";
    actions.append(copyButton, closeButton);
    dialog.append(heading, promptText, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const close = () => {
        document.removeEventListener("keydown", onKeydown);
        overlay.remove();
    };
    const onKeydown = event => {
        if (event.key === "Escape") close();
    };

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", event => {
        if (event.target === overlay) close();
    });
    document.addEventListener("keydown", onKeydown);

    copyButton.addEventListener("click", async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(prompt);
            } else {
                const copyArea = document.createElement("textarea");
                copyArea.value = prompt;
                copyArea.style.position = "fixed";
                copyArea.style.opacity = "0";
                document.body.appendChild(copyArea);
                copyArea.select();
                const copied = document.execCommand("copy");
                copyArea.remove();
                if (!copied) throw new Error("Copy failed");
            }
            copyButton.textContent = t.copied;
            window.setTimeout(() => {
                if (copyButton.isConnected) {
                    copyButton.textContent = t.copyPrompt;
                }
            }, 1800);
        } catch (error) {
            console.error("AI prompt copy error:", error);
        }
    });

    closeButton.focus();
}

if (cardsContainer) {
    cardsContainer.addEventListener("click", event => {
        const button = event.target.closest(".ai-prompt-button");
        if (!button || !cardsContainer.contains(button)) return;
        const card = button.closest(".card");
        const prompt = card && card.dataset.aiPrompt;
        if (prompt) showAIPrompt(prompt);
    });
}
/* =====================================================
   LOAD TEMPLATES
===================================================== */

async function loadTemplates() {

    if (!cardsContainer || !supabaseClient) {
        return;
    }

    cardsContainer.innerHTML = `

        <div class="loading-message">
            ${escapeHTML(
                translations[currentLanguage].loading
            )}
        </div>
    `;


    const { data, error } =
        await supabaseClient
            .from("templates")
            .select("*")
            .order("pinned", {
    ascending: false
})
.order("created_at", {
    ascending: false
});


    if (error) {

        console.error(
            "Template loading error:",
            error
        );

        cardsContainer.innerHTML = `

            <div class="loading-message">
                ${escapeHTML(translations[currentLanguage].loadError)}
            </div>
        `;

        return;
    }


    cardsContainer.innerHTML = "";


    if (!data || data.length === 0) {

        if (resultText) {

            resultText.textContent =
                translations[currentLanguage]
                    .showingAll;
        }

        if (noResults) {

            noResults.style.display =
                "block";

            noResults.innerHTML = `
                ${escapeHTML(
                    translations[currentLanguage]
                        .noResults
                )}
                <br>
                ${escapeHTML(
                    translations[currentLanguage]
                        .tryAnother
                )}
            `;
        }

        return;
    }


    data.forEach(template => {

        cardsContainer.appendChild(
            createTemplateCard(template)
        );

    });


    if (resultText) {

        resultText.textContent =
            translations[currentLanguage]
                .showingAll;
    }


    if (noResults) {
        noResults.style.display = "none";
    }


    performSearch();
}


/* =====================================================
   SEARCH
===================================================== */

function performSearch() {

    if (!searchInput || !cardsContainer) {
        return;
    }

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    const cards =
        Array.from(
            cardsContainer.querySelectorAll(
                ".searchable"
            )
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const searchableText = (

            card.dataset.search || ""

        ) + " " + (

            card.innerText || ""

        );


        const words =
            query
                ? query.split(/\s+/)
                : [];


        const matches =
            words.every(word =>
                searchableText
                    .toLowerCase()
                    .includes(word)
            );


        if (matches) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";
        }

    });


    if (resultText) {

        if (query) {

            resultText.textContent =
                `${visibleCount} ${
                    visibleCount === 1
                        ? translations[currentLanguage].resultFound
                        : translations[currentLanguage].resultsFound
                }`;

        } else {

            resultText.textContent =
                translations[currentLanguage]
                    .showingAll;
        }
    }


    if (clearSearch) {

        clearSearch.style.display =
            query ? "block" : "none";
    }


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

        noResults.innerHTML = `
            ${escapeHTML(
                translations[currentLanguage]
                    .noResults
            )}
            <br>
            ${escapeHTML(
                translations[currentLanguage]
                    .tryAnother
            )}
        `;
    }
}


/* =====================================================
   MENU
===================================================== */

function openMenu() {

    if (sideMenu) {
        sideMenu.classList.add("active");
        sideMenu.classList.add("open");
    }

    if (menuOverlay) {
        menuOverlay.classList.add("active");
        menuOverlay.classList.add("open");
    }
}


function closeSideMenu() {

    if (sideMenu) {
        sideMenu.classList.remove("active");
        sideMenu.classList.remove("open");
    }

    if (menuOverlay) {
        menuOverlay.classList.remove("active");
        menuOverlay.classList.remove("open");
    }
}


if (menuButton) {
    menuButton.addEventListener(
        "click",
        openMenu
    );
}


if (closeMenu) {
    closeMenu.addEventListener(
        "click",
        closeSideMenu
    );
}


if (menuOverlay) {
    menuOverlay.addEventListener(
        "click",
        closeSideMenu
    );
}


document
    .querySelectorAll(".menu-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeSideMenu
        );

    });


/* =====================================================
   SEARCH EVENTS
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        performSearch
    );

    searchInput.addEventListener(
        "search",
        performSearch
    );

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
    event.preventDefault();
    performSearch();
    searchInput.blur();
}

        }
    );
}

/* =====================================================
   CLEAR SEARCH
===================================================== */

if (clearSearch) {

    clearSearch.addEventListener("click", () => {

        searchInput.value = "";

        performSearch();

        searchInput.focus();

    });

}

/* =====================================================
   DARK / LIGHT MODE
===================================================== */

function updateThemeIcon() {

    if (!themeButton) {
        return;
    }

    if (
        document.body.classList.contains("dark")
    ) {

        themeButton.textContent = "☾";

        themeButton.title =
            "Switch to light mode";

    } else {

        themeButton.textContent = "☀";

        themeButton.title =
            "Switch to dark mode";
    }
}


function setTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

    } else {

        document.body.classList.remove("dark");
    }


    localStorage.setItem(
        "yashuFXTheme",
        theme
    );


    updateThemeIcon();
}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            const currentTheme =
                document.body.classList.contains(
                    "dark"
                )
                    ? "dark"
                    : "light";


            setTheme(
                currentTheme === "dark"
                    ? "light"
                    : "dark"
            );
        }
    );
}


const savedTheme =
    localStorage.getItem(
        "yashuFXTheme"
    ) || localStorage.getItem(
        "yashuTheme"
    ) || "light";


setTheme(savedTheme);


/* =====================================================
   START
===================================================== */

createLanguageMenu();

applyLanguage();

loadTemplates();
