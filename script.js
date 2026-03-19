// ---------------- ELEMENTS ----------------
const input = document.getElementById("searchInput");
const cardsContainer = document.getElementById("cardsContainer");
let cards = Array.from(document.querySelectorAll(".card"));
let currentFilter = "all";
let editingCard = null;

// ---------------- FILTER BUTTONS ----------------
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterCards();
  });
});

// ---------------- SEARCH ----------------
if (input) {
  input.addEventListener("input", filterCards);
}

// ---------------- SORT ----------------
const sortBtn = document.getElementById("sortAZ");
if (sortBtn && cardsContainer) {
  sortBtn.addEventListener("click", () => {
    cards.sort((a, b) =>
      (a.dataset.fname || "").localeCompare(b.dataset.fname || "")
    );
    cards.forEach((card) => cardsContainer.appendChild(card));
  });
}

// ---------------- DROPDOWN ----------------
const dropdown = document.querySelector(".dropdown");
const dropdownBtn = document.getElementById("dropdownBtn");

if (dropdown && dropdownBtn) {
  dropdownBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
}

// ---------------- CHECKBOX LIMIT ----------------
const strengthCheckboxes = document.querySelectorAll('input[name="strength1"]');
const errorMsg = document.getElementById("strengthError");

strengthCheckboxes.forEach((box) => {
  box.addEventListener("change", () => {
    const checked = document.querySelectorAll(
      'input[name="strength1"]:checked'
    );

    if (checked.length > 4) {
      box.checked = false;
      if (errorMsg) errorMsg.style.display = "block";
    } else {
      if (errorMsg) errorMsg.style.display = "none";
    }
  });
});

// ---------------- RADIO FILTER ----------------
const strengthRadios = document.querySelectorAll('input[name="strength2"]');

strengthRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (dropdownBtn) {
      dropdownBtn.innerText = radio.value || "Alla";
    }
    filterCards();
    if (dropdown) dropdown.classList.remove("show");
  });
});

// ---------------- FILTER FUNCTION ----------------
function filterCards() {
  const value = input ? input.value.toLowerCase() : "";

  const selectedRadio = document.querySelector(
    'input[name="strength2"]:checked'
  );

  const selectedStrength = selectedRadio
    ? selectedRadio.value.toLowerCase().trim()
    : "";

  cards.forEach((card) => {
    const user = (card.dataset.fname || "").toLowerCase();
    const text = card.innerText.toLowerCase();
    const category = card.dataset.category || "";

    const items = card.querySelectorAll("li");
    const strengths = Array.from(items).map((li) =>
      li.innerText.toLowerCase().trim()
    );

    const matchSearch =
      user.includes(value) ||
      text.includes(value) ||
      strengths.some((s) => s.includes(value));

    const matchStrength =
      selectedStrength === "" ||
      strengths.length === 0 ||
      strengths.some((s) => s.includes(selectedStrength));

    const matchFilter =
      currentFilter === "all" || category === currentFilter;

    if (matchSearch && matchFilter && matchStrength) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}

// ---------------- IMAGE ----------------
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

let imageData = "";

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      imageData = e.target.result;
      if (preview) {
        preview.src = imageData;
        preview.style.display = "block";
      }
    };

    reader.readAsDataURL(file);
  });
}

// ---------------- FORM ----------------
const form = document.getElementById("storyForm");
const toggleBtn = document.getElementById("toggleForm");
const storyDialog = document.getElementById("storyDialog");
const closeBtn = document.getElementById("closeModal");

if (toggleBtn && storyDialog) {
  toggleBtn.addEventListener("click", () => storyDialog.showModal());
}

if (closeBtn && storyDialog) {
  closeBtn.addEventListener("click", () => storyDialog.close());
}

// ---------------- EDIT BUTTON CLICK ----------------
document.querySelectorAll(".update-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    editingCard = e.target.closest(".card");

    if (!editingCard) return;

    const fname = editingCard.dataset.fname || "";
    const lname = editingCard.dataset.lname || "";
    const rubrik = editingCard.dataset.rubrik || "";
    const story = editingCard.dataset.story || "";
    const strengths = editingCard.dataset.strengths
      ? editingCard.dataset.strengths.split(",")
      : [];

    // fill form
    document.getElementById("fname").value = fname;
    document.getElementById("lname").value = lname;
    document.getElementById("rubrik").value = rubrik;
    document.getElementById("story").value = story;

    // reset checkboxes
    document.querySelectorAll('input[name="strength1"]').forEach((cb) => {
      cb.checked = strengths.includes(cb.value);
    });

    if (storyDialog) storyDialog.showModal();
  });
});

// ---------------- SUBMIT FORM ----------------
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const rubrik = document.getElementById("rubrik").value;
    const story = document.getElementById("story").value;

    const selectedBoxes = document.querySelectorAll(
      'input[name="strength1"]:checked'
    );
    const strengths = Array.from(selectedBoxes).map((cb) => cb.value);

    if (editingCard) {
      // UPDATE DATA
      editingCard.dataset.fname = fname;
      editingCard.dataset.lname = lname;
      editingCard.dataset.rubrik = rubrik;
      editingCard.dataset.story = story;
      editingCard.dataset.strengths = strengths.join(",");

      // UPDATE UI
      editingCard.querySelector(".card-name").innerText =
        fname + " " + lname;

      editingCard.querySelector(".card-title").innerText = rubrik;
      editingCard.querySelector(".card-desc").innerText = story;

      const list = editingCard.querySelector(".card-strengths");
      list.innerHTML = "";

      strengths.forEach((s) => {
        const li = document.createElement("li");
        li.innerText = s;
        list.appendChild(li);
      });

      editingCard = null;
    }

    form.reset();
    if (storyDialog) storyDialog.close();
  });
}
