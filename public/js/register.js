const form = document.getElementById("memberForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      message.innerHTML = `
                <p style="color:#dc2626;">
                    ${result.error}
                </p>
            `;
      return;
    }

    message.innerHTML = `
            <div style="
                background:#dcfce7;
                color:#166534;
                padding:15px;
                border-radius:7px;
                margin-bottom:15px;
            ">
                <strong>Member registered successfully!</strong>
                <br>
                Member ID:
                <strong>${result.memberId}</strong>
            </div>
        `;

    form.reset();
  } catch (error) {
    console.error("Registration error:", error);

    message.innerHTML = `
            <div style="
                background:#fee2e2;
                color:#991b1b;
                padding:15px;
                border-radius:7px;
            ">
                Something went wrong. Make sure the server is running.
            </div>
        `;
  }
});
