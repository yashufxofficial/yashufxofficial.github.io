const SUPABASE_URL = "https://wlaytkwkflygzgyekmoh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_m7dPEfqtawZyonZUOPqCGA_Xw4PlAJt";

const supabaseClient =
  window.supabase &&
  typeof window.supabase.createClient === "function"
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      )
    : null;


// ========================================
// ELEMENTS
// ========================================

const loginSection =
  document.getElementById("loginSection");

const adminSection =
  document.getElementById("adminSection");

const loginForm =
  document.getElementById("loginForm");

const loginMessage =
  document.getElementById("loginMessage");

const logoutButton =
  document.getElementById("logoutButton");

const templateForm =
  document.getElementById("templateForm");

const templateMessage =
  document.getElementById("templateMessage");

const thumbnailInput =
  document.getElementById("thumbnail");

const thumbnailPreview =
  document.getElementById("thumbnailPreview");

const previewImage =
  document.getElementById("previewImage");

const uploadText =
  document.getElementById("uploadText");

const uploadIcon =
  document.getElementById("uploadIcon");

const linksContainer =
  document.getElementById("linksContainer");

const addLinkButton =
  document.getElementById("addLinkButton");

const templateList =
  document.getElementById("templateList");

const titleInput =
  document.getElementById("title");

const categoryInput =
  document.getElementById("category");

const descriptionInput =
  document.getElementById("description");

const aiPromptInput =
  document.getElementById("aiPrompt");


// ========================================
// EDIT STATE
// ========================================

let editingTemplateId = null;
let editingTemplateData = null;


// ========================================
// SHOW / HIDE DASHBOARD
// ========================================

function showDashboard() {

  loginSection.hidden = true;

  adminSection.hidden = false;

}


function showLogin() {

  loginSection.hidden = false;

  adminSection.hidden = true;

}


// ========================================
// CHECK SESSION
// ========================================

async function checkSession() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();


  if (session) {

    showDashboard();

    loadTemplates();

  } else {

    showLogin();

  }

}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const email =
      document.getElementById("email")
        .value
        .trim();

    const password =
      document.getElementById("password")
        .value;


    loginMessage.textContent =
      "Signing in...";

    loginMessage.style.color =
      "#77777f";


    const { error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });


    if (error) {

      loginMessage.textContent =
        "Incorrect email or password.";

      loginMessage.style.color =
        "#d14343";

      return;

    }


    loginMessage.textContent = "";

    showDashboard();

    loadTemplates();

  }
);


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
  "click",
  async () => {

    await supabaseClient.auth.signOut();

    cancelEdit();

    showLogin();

  }
);


// ========================================
// THUMBNAIL PREVIEW
// ========================================

thumbnailInput.addEventListener(
  "change",
  () => {

    const file =
      thumbnailInput.files[0];


    if (!file) {

      return;

    }


    if (!file.type.startsWith("image/")) {

      thumbnailInput.value = "";

      if (!editingTemplateId) {

        thumbnailPreview.hidden = true;

        uploadText.textContent =
          "Choose thumbnail";

        uploadIcon.textContent =
          "+";

      }

      return;

    }


    const imageURL =
      URL.createObjectURL(file);

    previewImage.src =
      imageURL;

    thumbnailPreview.hidden =
      false;

    uploadText.textContent =
      file.name;

    uploadIcon.textContent =
      "✓";

  }
);


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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ========================================
// CREATE LINK ROW
// ========================================

function createLinkRow(
  label = "",
  url = "",
  removable = true
) {

  const row =
    document.createElement("div");

  row.className =
    "link-row";


  row.innerHTML = `
    <div class="link-inputs">

      <input
        type="text"
        class="link-label"
        placeholder="Link name"
        value="${escapeHTML(label)}"
        required
      >

      <input
        type="url"
        class="link-url"
        placeholder="https://..."
        value="${escapeHTML(url)}"
        required
      >

    </div>

    ${
      removable
        ? `
          <button
            type="button"
            class="remove-link-button"
          >
            Remove
          </button>
        `
        : ""
    }
  `;


  if (removable) {

    const removeButton =
      row.querySelector(
        ".remove-link-button"
      );


    removeButton.addEventListener(
      "click",
      () => {

        row.remove();

      }
    );

  }


  linksContainer.appendChild(row);

}


// ========================================
// RESET LINKS
// ========================================

function resetLinks() {

  linksContainer.innerHTML = "";

  createLinkRow(
    "Template",
    "",
    false
  );

}


// ========================================
// ADD ANOTHER LINK
// ========================================

addLinkButton.addEventListener(
  "click",
  () => {

    createLinkRow();

  }
);


// ========================================
// COLLECT LINKS
// ========================================

function collectLinks() {

  const linkRows =
    document.querySelectorAll(
      ".link-row"
    );

  const links = [];


  linkRows.forEach((row) => {

    const labelInput =
      row.querySelector(
        ".link-label"
      );

    const urlInput =
      row.querySelector(
        ".link-url"
      );


    if (!labelInput || !urlInput) {

      return;

    }


    const label =
      labelInput.value.trim();

    const url =
      urlInput.value.trim();


    if (label && url) {

      links.push({
        label: label,
        url: url
      });

    }

  });


  return links;

}


// ========================================
// RESET FORM
// ========================================

function resetTemplateForm() {

  editingTemplateId = null;

  editingTemplateData = null;


  templateForm.reset();

  if (aiPromptInput) {
    aiPromptInput.value = "";
  }

  thumbnailInput.required = true;


  thumbnailPreview.hidden = true;

  previewImage.src = "";

  uploadText.textContent =
    "Choose thumbnail";

  uploadIcon.textContent =
    "+";


  resetLinks();


  const submitButton =
    templateForm.querySelector(
      'button[type="submit"]'
    );


  if (submitButton) {

    submitButton.textContent =
      "Add Template";

  }


  removeCancelButton();

}


// ========================================
// CANCEL EDIT BUTTON
// ========================================

function createCancelButton() {

  removeCancelButton();


  const submitButton =
    templateForm.querySelector(
      'button[type="submit"]'
    );


  if (!submitButton) {

    return;

  }


  const cancelButton =
    document.createElement("button");


  cancelButton.type =
    "button";

  cancelButton.id =
    "cancelEditButton";

  cancelButton.className =
    "logout-button";

  cancelButton.textContent =
    "Cancel Edit";


  cancelButton.style.marginTop =
    "10px";

  cancelButton.style.width =
    "100%";


  cancelButton.addEventListener(
    "click",
    () => {

      cancelEdit();

    }
  );


  submitButton.insertAdjacentElement(
    "afterend",
    cancelButton
  );

}


function removeCancelButton() {

  const existing =
    document.getElementById(
      "cancelEditButton"
    );


  if (existing) {

    existing.remove();

  }

}


// ========================================
// CANCEL EDIT
// ========================================

function cancelEdit() {

  resetTemplateForm();

  templateMessage.textContent = "";

}


// ========================================
// EDIT TEMPLATE
// ========================================

function editTemplate(template) {

  editingTemplateId =
    template.id;

  editingTemplateData =
    template;


  titleInput.value =
    template.title || "";

  categoryInput.value =
    template.category || "";

  descriptionInput.value =
    template.description || "";

  if (aiPromptInput) {
    aiPromptInput.value =
      template.ai_prompt || "";
  }


  // --------------------------------
  // EXISTING THUMBNAIL
  // --------------------------------

  thumbnailInput.value = "";

  thumbnailInput.required =
    false;


  if (template.thumbnail_url) {

    previewImage.src =
      template.thumbnail_url;

    thumbnailPreview.hidden =
      false;

    uploadText.textContent =
      "Change thumbnail";

    uploadIcon.textContent =
      "✓";

  } else {

    thumbnailPreview.hidden =
      true;

    previewImage.src =
      "";

    uploadText.textContent =
      "Choose thumbnail";

    uploadIcon.textContent =
      "+";

  }


  // --------------------------------
  // EXISTING LINKS
  // --------------------------------

  linksContainer.innerHTML = "";


  const links =
    Array.isArray(template.links)
      ? template.links
      : [];


  if (links.length === 0) {

    createLinkRow(
      "Template",
      "",
      false
    );

  } else {

    links.forEach(
      (link, index) => {

        createLinkRow(
          link.label || "",
          link.url || "",
          index > 0
        );

      }
    );

  }


  // --------------------------------
  // SAVE BUTTON
  // --------------------------------

  const submitButton =
    templateForm.querySelector(
      'button[type="submit"]'
    );


  if (submitButton) {

    submitButton.textContent =
      "Save Changes";

  }


  createCancelButton();


  templateMessage.textContent =
    `Editing "${template.title}"`;

  templateMessage.style.color =
    "#77777f";


  templateForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


// ========================================
// LOAD TEMPLATES
// ========================================

async function loadTemplates() {

  if (!templateList) {

    return;

  }


  templateList.innerHTML = `
    <div class="template-list-message">
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
      "LOAD TEMPLATES ERROR:",
      error
    );


    templateList.innerHTML = `
      <div class="template-list-message">
        Unable to load templates.
      </div>
    `;

    return;

  }


  if (!data || data.length === 0) {

    templateList.innerHTML = `
      <div class="template-list-message">
        No templates published yet.
      </div>
    `;

    return;

  }


  templateList.innerHTML = "";


  data.forEach(
    (template) => {

      const item =
        document.createElement("div");


      item.className =
        "admin-template-item";


      item.innerHTML = `
        <div class="admin-template-thumbnail">

          ${
            template.thumbnail_url
              ? `
                <img
                  src="${escapeHTML(template.thumbnail_url)}"
                  alt="${escapeHTML(template.title)}"
                >
              `
              : `
                <div>
                  No image
                </div>
              `
          }

        </div>


        <div class="admin-template-info">

          <div class="admin-template-title">
            ${escapeHTML(template.title)}
          </div>

          <div class="admin-template-category">
            ${escapeHTML(template.category)}
          </div>

        </div>


        <div class="admin-template-actions">

  <button
    type="button"
    class="pin-template-button"
  >
    ${template.pinned ? "📌 Unpin" : "📌 Pin"}
  </button>

  <button
    type="button"
    class="edit-template-button"
  >
    Edit
  </button>

  <button
    type="button"
    class="delete-template-button"
  >
    Delete
  </button>

</div>


      // --------------------------------
      // EDIT
      // --------------------------------

      const editButton =
        item.querySelector(
          ".edit-template-button"
        );


      editButton.addEventListener(
        "click",
        () => {

          editTemplate(template);

        }
      );

// --------------------------------
// PIN / UNPIN
// --------------------------------

const pinButton =
  item.querySelector(
    ".pin-template-button"
  );

pinButton.addEventListener(
  "click",
  async () => {

    pinButton.disabled = true;

    const newPinnedState =
      !template.pinned;

    const { error } =
      await supabaseClient
        .from("templates")
        .update({
          pinned: newPinnedState,
          updated_at:
            new Date().toISOString()
        })
        .eq(
          "id",
          template.id
        );

    if (error) {

      console.error(
        "PIN TEMPLATE ERROR:",
        error
      );

      alert(
        "Unable to update pin status."
      );

      pinButton.disabled = false;

      return;
    }

    await loadTemplates();

  }
);


      // --------------------------------
      // DELETE
      // --------------------------------

      const deleteButton =
        item.querySelector(
          ".delete-template-button"
        );


      deleteButton.addEventListener(
        "click",
        () => {

          deleteTemplate(template);

        }
      );


      templateList.appendChild(item);

    }
  );

}


// ========================================
// DELETE TEMPLATE
// ========================================

async function deleteTemplate(template) {

  // --------------------------------
  // CONFIRMATION
  // --------------------------------

  const confirmed =
    confirm(
      `Delete "${template.title}"?\n\nThis will permanently remove the template.`
    );


  if (!confirmed) {

    return;

  }


  // --------------------------------
  // SHOW STATUS
  // --------------------------------

  templateMessage.textContent =
    "Deleting template...";

  templateMessage.style.color =
    "#77777f";


  try {

    // --------------------------------
    // CHECK SESSION
    // --------------------------------

    const {
      data: sessionData,
      error: sessionError
    } =
      await supabaseClient.auth.getSession();


    if (sessionError) {

      throw sessionError;

    }


    if (!sessionData.session) {

      throw new Error(
        "Your admin session has expired. Please login again."
      );

    }


    // --------------------------------
    // DELETE DATABASE ROW
    // --------------------------------

    const {
      error: databaseError
    } =
      await supabaseClient
        .from("templates")
        .delete()
        .eq(
          "id",
          template.id
        );


    if (databaseError) {

      throw new Error(
        `Template delete failed: ${databaseError.message}`
      );

    }


    // --------------------------------
    // DELETE THUMBNAIL
    // --------------------------------

    if (template.thumbnail_path) {

      const {
        error: storageError
      } =
        await supabaseClient.storage
          .from("template-thumbnails")
          .remove([
            template.thumbnail_path
          ]);


      if (storageError) {

        console.warn(
          "Template deleted but thumbnail cleanup failed:",
          storageError
        );

      }

    }


    // --------------------------------
    // IF CURRENTLY EDITING
    // --------------------------------

    if (
      editingTemplateId ===
      template.id
    ) {

      resetTemplateForm();

    }


    // --------------------------------
    // SUCCESS
    // --------------------------------

    templateMessage.textContent =
      "Template deleted successfully!";

    templateMessage.style.color =
      "#16803c";


    // --------------------------------
    // REFRESH LIST
    // --------------------------------

    await loadTemplates();


    setTimeout(
      () => {

        templateMessage.textContent =
          "";

      },
      4000
    );

  }

  catch (error) {

    console.error(
      "YASHU FX DELETE ERROR:",
      error
    );


    templateMessage.textContent =
      error.message ||
      "Something went wrong while deleting.";

    templateMessage.style.color =
      "#d14343";

  }

}


// ========================================
// SUBMIT TEMPLATE
// ADD OR EDIT
// ========================================

templateForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const file =
      thumbnailInput.files[0];


    const title =
      titleInput.value.trim();


    const category =
      categoryInput.value;


    const description =
      descriptionInput.value.trim();

    const aiPrompt =
      aiPromptInput ? aiPromptInput.value.trim() : "";


    const links =
      collectLinks();


    // --------------------------------
    // VALIDATION
    // --------------------------------

    if (!title) {

      templateMessage.textContent =
        "Please enter a title.";

      templateMessage.style.color =
        "#d14343";

      return;

    }


    if (!category) {

      templateMessage.textContent =
        "Please select a category.";

      templateMessage.style.color =
        "#d14343";

      return;

    }


    if (!description) {

      templateMessage.textContent =
        "Please enter a description.";

      templateMessage.style.color =
        "#d14343";

      return;

    }


    if (!editingTemplateId && !file) {

      templateMessage.textContent =
        "Please choose a thumbnail.";

      templateMessage.style.color =
        "#d14343";

      return;

    }


    if (links.length === 0) {

      templateMessage.textContent =
        "Please add at least one link.";

      templateMessage.style.color =
        "#d14343";

      return;

    }


    try {

      // --------------------------------
      // CHECK SESSION
      // --------------------------------

      const {
        data: sessionData,
        error: sessionError
      } =
        await supabaseClient.auth.getSession();


      if (sessionError) {

        throw sessionError;

      }


      if (!sessionData.session) {

        throw new Error(
          "Your admin session has expired. Please login again."
        );

      }


      // ==================================
      // EDIT TEMPLATE
      // ==================================

      if (editingTemplateId) {

        templateMessage.textContent =
          file
            ? "Uploading new thumbnail..."
            : "Saving changes...";

        templateMessage.style.color =
          "#77777f";


        let newThumbnailURL =
          editingTemplateData.thumbnail_url;

        let newThumbnailPath =
          editingTemplateData.thumbnail_path;

        let uploadedNewPath =
          null;


        // --------------------------------
        // UPLOAD NEW THUMBNAIL
        // --------------------------------

        if (file) {

          const fileExtension =
            file.name
              .split(".")
              .pop()
              .toLowerCase();


          const filePath =
            `${crypto.randomUUID()}.${fileExtension}`;


          const {
            error: uploadError
          } =
            await supabaseClient.storage
              .from("template-thumbnails")
              .upload(
                filePath,
                file,
                {
                  cacheControl: "3600",
                  upsert: false,
                  contentType: file.type
                }
              );


          if (uploadError) {

            throw new Error(
              `Thumbnail upload failed: ${uploadError.message}`
            );

          }


          uploadedNewPath =
            filePath;


          const {
            data: publicURLData
          } =
            supabaseClient.storage
              .from("template-thumbnails")
              .getPublicUrl(
                filePath
              );


          newThumbnailURL =
            publicURLData.publicUrl;

          newThumbnailPath =
            filePath;

        }


        // --------------------------------
        // UPDATE DATABASE
        // --------------------------------

        templateMessage.textContent =
          "Saving changes...";


        const {
          error: databaseError
        } =
          await supabaseClient
            .from("templates")
            .update({
              title: title,
              category: category,
              description: description,
              ai_prompt: aiPrompt,
              thumbnail_url: newThumbnailURL,
              thumbnail_path: newThumbnailPath,
              links: links,
              updated_at:
                new Date().toISOString()
            })
            .eq(
              "id",
              editingTemplateId
            );


        if (databaseError) {

          if (uploadedNewPath) {

            await supabaseClient.storage
              .from("template-thumbnails")
              .remove([
                uploadedNewPath
              ]);

          }


          throw new Error(
            `Database update failed: ${databaseError.message}`
          );

        }


        // --------------------------------
        // REMOVE OLD THUMBNAIL
        // --------------------------------

        if (
          uploadedNewPath &&
          editingTemplateData.thumbnail_path &&
          editingTemplateData.thumbnail_path !==
            uploadedNewPath
        ) {

          await supabaseClient.storage
            .from("template-thumbnails")
            .remove([
              editingTemplateData.thumbnail_path
            ]);

        }


        // --------------------------------
        // SUCCESS
        // --------------------------------

        templateMessage.textContent =
          "Template updated successfully!";

        templateMessage.style.color =
          "#16803c";


        resetTemplateForm();

        await loadTemplates();


        setTimeout(
          () => {

            templateMessage.textContent =
              "";

          },
          4000
        );


        return;

      }


      // ==================================
      // ADD NEW TEMPLATE
      // ==================================

      templateMessage.textContent =
        "Uploading thumbnail...";

      templateMessage.style.color =
        "#77777f";


      const fileExtension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();


      const filePath =
        `${crypto.randomUUID()}.${fileExtension}`;


      // --------------------------------
      // UPLOAD THUMBNAIL
      // --------------------------------

      const {
        error: uploadError
      } =
        await supabaseClient.storage
          .from("template-thumbnails")
          .upload(
            filePath,
            file,
            {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type
            }
          );


      if (uploadError) {

        throw new Error(
          `Thumbnail upload failed: ${uploadError.message}`
        );

      }


      // --------------------------------
      // PUBLIC URL
      // --------------------------------

      const {
        data: publicURLData
      } =
        supabaseClient.storage
          .from("template-thumbnails")
          .getPublicUrl(
            filePath
          );


      const thumbnailURL =
        publicURLData.publicUrl;


      // --------------------------------
      // SAVE DATABASE
      // --------------------------------

      templateMessage.textContent =
        "Saving template...";


      const {
        error: databaseError
      } =
        await supabaseClient
          .from("templates")
          .insert({
            title: title,
            category: category,
            description: description,
            ai_prompt: aiPrompt,
            thumbnail_url: thumbnailURL,
            thumbnail_path: filePath,
            links: links
          });


      if (databaseError) {

        await supabaseClient.storage
          .from("template-thumbnails")
          .remove([
            filePath
          ]);


        throw new Error(
          `Database save failed: ${databaseError.message}`
        );

      }


      // --------------------------------
      // SUCCESS
      // --------------------------------

      templateMessage.textContent =
        "Template added successfully!";

      templateMessage.style.color =
        "#16803c";


      resetTemplateForm();

      await loadTemplates();


      setTimeout(
        () => {

          templateMessage.textContent =
            "";

        },
        4000
      );

    }

    catch (error) {

      console.error(
        "YASHU FX TEMPLATE ERROR:",
        error
      );


      templateMessage.textContent =
        error.message ||
        "Something went wrong.";

      templateMessage.style.color =
        "#d14343";

    }

  }
);


// ========================================
// START
// ========================================

resetLinks();

checkSession();
