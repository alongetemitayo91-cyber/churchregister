const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const dbPath = path.join(__dirname, "database", "church.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database error:", err.message);
  } else {
    console.log("Connected to DFICC database.");
  }
});

db.run(
  `
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        date_of_birth TEXT,
        gender TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        date_joined TEXT,
        emergency_contact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`,
  (err) => {
    if (err) {
      console.error("Table error:", err.message);
    } else {
      console.log("Members table ready.");
    }
  },
);

function generateMemberId(callback) {
  db.get("SELECT COUNT(*) AS count FROM members", [], (err, row) => {
    if (err) {
      callback(err);
      return;
    }

    const nextNumber = row.count + 1;
    const memberId = `M${String(nextNumber).padStart(3, "0")}`;

    callback(null, memberId);
  });
}

// REGISTER MEMBER
app.post("/api/members", (req, res) => {
  const {
    full_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    date_joined,
    emergency_contact,
  } = req.body;

  if (!full_name || !full_name.trim()) {
    return res.status(400).json({
      error: "Full name is required.",
    });
  }

  generateMemberId((err, memberId) => {
    if (err) {
      return res.status(500).json({
        error: "Could not generate member ID.",
      });
    }

    const sql = `
            INSERT INTO members (
                member_id,
                full_name,
                date_of_birth,
                gender,
                phone,
                email,
                address,
                date_joined,
                emergency_contact
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      memberId,
      full_name.trim(),
      date_of_birth,
      gender,
      phone,
      email,
      address,
      date_joined,
      emergency_contact,
    ];

    db.run(sql, values, function (err) {
      if (err) {
        console.error("Registration error:", err.message);

        return res.status(500).json({
          error: "Could not register member.",
        });
      }

      res.json({
        success: true,
        message: "Member registered successfully.",
        memberId: memberId,
      });
    });
  });
});

// GET ALL MEMBERS
app.get("/api/members", (req, res) => {
  db.all("SELECT * FROM members ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Could not retrieve members.",
      });
    }

    res.json(rows);
  });
});

// GET SINGLE MEMBER
app.get("/api/members/:id", (req, res) => {
  db.get("SELECT * FROM members WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Database error.",
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Member not found.",
      });
    }

    res.json(row);
  });
});

// UPDATE MEMBER
app.put("/api/members/:id", (req, res) => {
  const {
    full_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    date_joined,
    emergency_contact,
  } = req.body;

  const sql = `
        UPDATE members
        SET
            full_name = ?,
            date_of_birth = ?,
            gender = ?,
            phone = ?,
            email = ?,
            address = ?,
            date_joined = ?,
            emergency_contact = ?
        WHERE id = ?
    `;

  const values = [
    full_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    date_joined,
    emergency_contact,
    req.params.id,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({
        error: "Could not update member.",
      });
    }

    res.json({
      success: true,
      message: "Member updated successfully.",
    });
  });
});

// DELETE MEMBER
app.delete("/api/members/:id", (req, res) => {
  db.run("DELETE FROM members WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Could not delete member.",
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully.",
    });
  });
});

// DASHBOARD STATISTICS
app.get("/api/stats", (req, res) => {
  db.get("SELECT COUNT(*) AS total FROM members", [], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: "Could not retrieve statistics.",
      });
    }

    res.json({
      totalMembers: row.total,
    });
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`DFICC Registrar running at http://localhost:${PORT}`);
});
