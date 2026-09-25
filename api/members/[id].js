const { query } = require("../_database");

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: "Invalid member ID." });
  }

  try {
    if (req.method === "GET") {
      const result = await query("SELECT * FROM members WHERE id = $1", [id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Member not found." });
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === "PUT") {
      const { full_name, date_of_birth, gender, phone, email, address, date_joined, emergency_contact } = req.body || {};
      if (!full_name || !full_name.trim()) return res.status(400).json({ error: "Full name is required." });
      const result = await query(
        `UPDATE members SET full_name=$1, date_of_birth=$2, gender=$3, phone=$4, email=$5, address=$6, date_joined=$7, emergency_contact=$8 WHERE id=$9 RETURNING id`,
        [full_name.trim(), date_of_birth || null, gender || null, phone || null, email || null, address || null, date_joined || null, emergency_contact || null, id],
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Member not found." });
      return res.status(200).json({ success: true, message: "Member updated successfully." });
    }

    if (req.method === "DELETE") {
      const result = await query("DELETE FROM members WHERE id = $1 RETURNING id", [id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Member not found." });
      return res.status(200).json({ success: true, message: "Member deleted successfully." });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Member API error:", error);
    return res.status(500).json({ error: "Could not process member request." });
  }
};
