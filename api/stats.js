const { query } = require("./_database");

module.exports = async (_req, res) => {
  try {
    const result = await query("SELECT COUNT(*)::int AS total FROM members");
    return res.status(200).json({ totalMembers: result.rows[0].total });
  } catch (error) {
    console.error("Stats API error:", error);
    return res.status(500).json({ error: "Could not retrieve statistics." });
  }
};
