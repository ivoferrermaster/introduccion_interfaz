const filter = document.getElementById("filter");
const rows = document.querySelectorAll("#table tbody tr");

filter.addEventListener("change", () => {
  const value = filter.value;

  rows.forEach(row => {
    if (value === "all") {
      row.style.display = "";
    } else {
      row.style.display = row.dataset.type === value ? "" : "none";
    }
  });
});