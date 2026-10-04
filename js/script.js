// ========================================
// YASHU FX PUBLIC WEBSITE
// SUPABASE + SEARCH + THEME + MENU
// ========================================


// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
  "https://wlaytkwkflygzgyekmoh.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_m7dPEfqtawZyonZUOPqCGA_Xw4PlAJt";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


// ========================================
// ELEMENTS
// ========================================

const menuButton =
  document.getElementById("menuButton");

const closeMenu =
  document.getElementById("closeMenu");

const sideMenu =
  document.getElementById("sideMenu");

const menuOverlay =
  document.getElementById("menuOverlay");


const searchInput =
  document.getElementById("searchInput");

const clearSearch =
  document.getElementById("clearSearch");

const resultText =
  document.getElementById("resultText");

const noResults =
  document.getElementById("noResults");

const cards =
  document.getElementById("cards");


const themeButton =
  document.getElementById("themeButton");


// ========================================
// MENU
// ========================================

function openMenu() {

  sideMenu.classList.add("active");

  menuOverlay.classList.add("active");

}


function closeSideMenu() {

  sideMenu.classList.remove("active");

  menuOverlay.classList.remove("active");

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
  .forEach((link) => {

    link.addEventListener(
      "click",
      closeSideMenu
    );

  });


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ========================================
// LOAD TEMPLATES
// ========================================

async function loadTemplates() {

  cards.innerHTML = `
    <div class="template-loading">
      Loading templates...
    </div>
  `;


  const {
    data,
    error
  } = await supabaseClient

    .from("templates")

    .select("*")

    .order(
      "created_at",
      {
        ascending: false
      }
    );


  if (error) {

    console.error(
      "YASHU FX LOAD ERROR:",
      error
    );


    cards.innerHTML = `
      <div class="template-loading">
        Unable to load templates.
      </div>
    `;

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    cards.innerHTML = `
      <div class="template-loading">
        No templates available yet.
      </div>
    `;

    resultText.textContent =
      "No templates available";

    return;

  }


  cards.innerHTML = "";


  data.forEach(
    (template) => {

      const card =
        createTemplateCard(
          template
        );


      cards.appendChild(card);

    }
  );


  updateSearchResults();

}


// ========================================
// CREATE TEMPLATE CARD
// ========================================

function createTemplateCard(
  template
) {

  const article =
    document.createElement(
      "article"
    );


  article.className =
    "card searchable";


  const links =
    Array.isArray(template.links)
      ? template.links
      : [];


  // --------------------------------
  // FIRST LINK = MAIN TEMPLATE
  // --------------------------------

  const templateLink =
    links.length > 0
      ? links[0].url
      : "#";


  const safeTitle =
    escapeHTML(
      template.title
    );


  const safeCategory =
    escapeHTML(
      template.category
    );


  const safeDescription =
    escapeHTML(
      template.description
    );


  const safeThumbnail =
    escapeHTML(
      template.thumbnail_url
    );


  // --------------------------------
  // THUMBNAIL
  // --------------------------------

  const thumbnailHTML =
    template.thumbnail_url

      ? `
        <img
          src="${safeThumbnail}"
          alt="${safeTitle}"
          loading="lazy"
        >
      `

      : `
        <div class="thumbnail-placeholder">
          ${safeCategory}
        </div>
      `;


  // --------------------------------
  // CARD
  // --------------------------------

  article.innerHTML = `

    <div class="thumbnail">

      ${thumbnailHTML}

    </div>


    <div class="card-body">


      <div class="card-top">

        <span class="category">
          ${safeCategory}
        </span>


        <span class="free">
          FREE
        </span>

      </div>


      <h3>
        ${safeTitle}
      </h3>


      <p>
        ${safeDescription}
      </p>


      ${
        templateLink !== "#"

          ? `
            <a
              href="${escapeHTML(templateLink)}"
              target="_blank"
              rel="noopener noreferrer"
              class="card-button"
            >
              Use Template →
            </a>
          `

          : `
            <span
              class="card-button"
              style="opacity:.5;"
            >
              Link unavailable
            </span>
          `
      }


    </div>

  `;


  return article;

}


// ========================================
// SEARCH
// ========================================

function updateSearchResults() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  const cardsList =
    Array.from(
      document.querySelectorAll(
        ".searchable"
      )
    );


  let visibleCount = 0;


  cardsList.forEach(
    (card) => {

      const searchableText =
        card.innerText
          .toLowerCase();


      const words =
        query
          ? query.split(/\s+/)
          : [];


      const matches =
        words.every(
          (word) =>
            searchableText.includes(
              word
            )
        );


      if (matches) {

        card.style.display =
          "";

        visibleCount++;

      } else {

        card.style.display =
          "none";

      }

    }
  );


  // --------------------------------
  // RESULT TEXT
  // --------------------------------

  if (!query) {

    resultText.textContent =
      `Showing all ${cardsList.length} templates`;

  } else {

    resultText.textContent =
      visibleCount +
      (
        visibleCount === 1
          ? " result found"
          : " results found"
      );

  }


  // --------------------------------
  // CLEAR BUTTON
  // --------------------------------

  clearSearch.style.display =
    query
      ? "block"
      : "none";


  // --------------------------------
  // NO RESULTS
  // --------------------------------

  noResults.style.display =
    (
      query &&
      visibleCount === 0
    )
      ? "block"
      : "none";

}


// ========================================
// SEARCH EVENTS
// ========================================

searchInput.addEventListener(
  "input",
  updateSearchResults
);


clearSearch.addEventListener(
  "click",
  () => {

    searchInput.value =
      "";

    updateSearchResults();

    searchInput.focus();

  }
);


// ========================================
// DARK / LIGHT MODE
// ========================================

function updateThemeIcon() {

  if (
    document.body.classList.contains(
      "dark"
    )
  ) {

    themeButton.textContent =
      "☾";

    themeButton.title =
      "Switch to light mode";

  } else {

    themeButton.textContent =
      "☀";

    themeButton.title =
      "Switch to dark mode";

  }

}


function setTheme(theme) {

  if (theme === "dark") {

    document.body.classList.add(
      "dark"
    );

  } else {

    document.body.classList.remove(
      "dark"
    );

  }


  localStorage.setItem(
    "yashuFXTheme",
    theme
  );


  updateThemeIcon();

}


// ========================================
// LOAD SAVED THEME
// ========================================

const savedTheme =
  localStorage.getItem(
    "yashuFXTheme"
  );


if (
  savedTheme === "dark"
) {

  document.body.classList.add(
    "dark"
  );

}


updateThemeIcon();


// ========================================
// THEME TOGGLE
// ========================================

themeButton.addEventListener(
  "click",
  () => {

    const isDark =
      document.body.classList.contains(
        "dark"
      );


    setTheme(
      isDark
        ? "light"
        : "dark"
    );

  }
);


// ========================================
// START
// ========================================

loadTemplates();