const filterButtons = [...document.querySelectorAll(".filter-button")];
const entries = [...document.querySelectorAll(".timeline-entry")];
const yearGroups = [...document.querySelectorAll(".year-group")];
const emptyMessage = document.querySelector(".filter-empty");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    entries.forEach((entry) => {
      entry.hidden = category !== "all" && entry.dataset.category !== category;
    });
    yearGroups.forEach((group) => {
      group.hidden = !group.querySelector(".timeline-entry:not([hidden])");
    });
    if (emptyMessage) {
      emptyMessage.hidden = entries.some((entry) => !entry.hidden);
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
