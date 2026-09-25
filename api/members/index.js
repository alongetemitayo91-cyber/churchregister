const { query } = require("../_database");

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const result = await query("SELECT * FROM members ORDER BY id DESC");
      return res.status(200).json(result.rows);
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed." });
    }

    const { full_name, date_of_birth, gender, phone, email, address, date_joined, emergency_contact } = req.body || {};
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }

    const result = await query(
      `WITH next_id AS (SELECT nextval(pg_get_serial_sequence('members', 'id')) AS id)
       INSERT INTO members (id, member_id, full_name, date_of_birth, gender, phone, email, address, date_joined, emergency_contact)
       SELECT id, 'M' || LPAD(id::text, 3, '0'), $1, $2, $3, $4, $5, $6, $7, $8 FROM next_id
       RETURNING member_id`,
      [full_name.trim(), date_of_birth || null, gender || null, phone || null, email || null, address || null, date_joined || null, emergency_contact || null],
    );

    return res.status(201).json({
      success: true,
      message: "Member registered successfully.",
      memberId: result.rows[0].member_id,
    });
  } catch (error) {
    console.error("Members API error:", error);
    return res.status(500).json({ error: "Could not process members request." });
  }
};
