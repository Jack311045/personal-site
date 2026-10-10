const filterButtons = [...document.querySelectorAll(".filter-button")];
const entries = [...document.querySelectorAll(".timeline-entry")];
const timelineImages = [...document.querySelectorAll(".timeline-image")];
const yearGroups = [...document.querySelectorAll(".year-group")];
const emptyMessage = document.querySelector(".filter-empty");
let activeCategory = null;

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter === "all"
      ? null
      : activeCategory === button.dataset.filter
        ? null
        : button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = activeCategory === null
        ? item.dataset.filter === "all"
        : item.dataset.filter === activeCategory;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    timelineImages.forEach((image) => {
      image.hidden = activeCategory !== null && image.dataset.category !== activeCategory;
    });
    entries.forEach((entry) => {
      const images = [...entry.querySelectorAll(".timeline-image")];
      entry.hidden = activeCategory !== null && (images.length === 0 || images.every((image) => image.hidden));
    });
    yearGroups.forEach((group) => {
      group.hidden = !group.querySelector(".timeline-entry:not([hidden])");
    });
    if (emptyMessage) {
      emptyMessage.hidden = activeCategory === null || entries.some((entry) => !entry.hidden);
    }
  });
});

const dialog = document.querySelector(".lightbox");
const dialogImage = dialog.querySelector(".lightbox-image");
const dialogTime = dialog.querySelector("time");
const dialogCaption = dialog.querySelector(".lightbox-caption p");

document.querySelectorAll(".image-open").forEach((button) => {
  button.addEventListener("click", () => {
    dialogImage.src = button.dataset.src;
    dialogImage.alt = button.dataset.alt;
    dialogTime.dateTime = button.dataset.date;
    dialogTime.textContent = button.dataset.date;
    dialogCaption.textContent = button.dataset.caption;
    dialog.showModal();
  });
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
