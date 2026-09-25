let members = [];

async function loadMembers() {
  try {
    const response = await fetch("/api/members");

    members = await response.json();

    displayMembers(members);
  } catch (error) {
    console.error("Could not load members:", error);
  }
}

function displayMembers(data) {
  const table = document.getElementById("membersTable");

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `
            <tr>
                <td colspan="7" class="no-members">
                    No members registered yet.
                </td>
            </tr>
        `;

    return;
  }

  data.forEach((member) => {
    const row = document.createElement("tr");

    row.innerHTML = `

            <td>
                <strong>${member.member_id}</strong>
            </td>

            <td>
                ${member.full_name}
            </td>

            <td>
                ${member.gender || "-"}
            </td>

            <td>
                ${member.phone || "-"}
            </td>

            <td>
                ${member.department || "-"}
            </td>

            <td>
                ${member.date_joined || "-"}
            </td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewMember(${member.id})"
                >
                    View
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteMember(${member.id})"
                >
                    Delete
                </button>

            </td>

        `;

    table.appendChild(row);
  });
}

function viewMember(id) {
  const member = members.find((m) => m.id === id);

  if (!member) return;

  alert(`
DFICC MEMBER

Member ID: ${member.member_id}

Name: ${member.full_name}

Date of Birth: ${member.date_of_birth || "-"}

Gender: ${member.gender || "-"}

Phone: ${member.phone || "-"}

Email: ${member.email || "-"}

Address: ${member.address || "-"}

Date Joined: ${member.date_joined || "-"}

Previous Church: ${member.previous_church || "-"}

Department: ${member.department || "-"}

Emergency Contact: ${member.emergency_contact || "-"}
    `);
}

async function deleteMember(id) {
  const member = members.find((m) => m.id === id);

  if (!member) return;

  const confirmed = confirm(
    `Are you sure you want to delete ${member.full_name}'s record?`,
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`/api/members/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);

      return;
    }

    loadMembers();
  } catch (error) {
    console.error(error);

    alert("Could not delete member.");
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const search = this.value.toLowerCase();

  const filtered = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(search) ||
      member.member_id.toLowerCase().includes(search) ||
      (member.phone || "").toLowerCase().includes(search),
  );

  displayMembers(filtered);
});

loadMembers();
