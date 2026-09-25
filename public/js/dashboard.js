async function loadDashboard() {
  try {
    const response = await fetch("/api/stats");

    const data = await response.json();

    document.getElementById("totalMembers").textContent = data.totalMembers;
  } catch (error) {
    console.error("Dashboard error:", error);
  }

  const today = new Date();

  document.getElementById("todayDate").textContent = today.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

loadDashboard();
