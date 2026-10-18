const db = require("../config/dbConnection");
const createBooking = (
  { user_id, event_id, number_of_people = 1 },
  callback,
) => {
  const query =
    "INSERT INTO bookings (user_id, event_id, number_of_people) VALUES (?, ?, ?)";
  db.query(query, [user_id, event_id, number_of_people], (err, result) => {
    if (err) {
      console.error("Error inserting booking:", err.message);
      console.error("Full error object:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getBookingsByUser = (user_id, callback) => {
  const query = `
        SELECT b.id AS booking_id, e.title, e.date, e.location
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = ?
        ORDER BY e.date DESC
    `;
  db.query(query, [user_id], callback);
};

const getAllBookings = (creatorId, limit, offset, filters, callback) => {
  const conditions = ["e.created_by = ?"];
  const params = [creatorId];

  if (filters.search) {
    const keywords = filters.search.split(/\s+/).filter(Boolean);

    keywords.forEach((keyword) => {
      conditions.push("e.title LIKE ?");
      params.push(`%${keyword}%`);
    });
  }

  if (filters.location) {
    conditions.push("e.location LIKE ?");
    params.push(`%${filters.location}%`);
  }

  if (filters.date) {
    conditions.push("DATE(e.date) = ?");
    params.push(filters.date);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const baseQuery = `
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN events e ON b.event_id = e.id
    ${whereClause}
  `;

  const query = `
    SELECT
      b.id AS booking_id,
      u.name AS user_name,
      e.title AS event_title,
      e.location AS event_location,
      e.date
    ${baseQuery}
    ORDER BY e.date DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    ${baseQuery}
  `;

  db.query(countQuery, params, (countError, countResult) => {
    if (countError) return callback(countError);

    db.query(query, [...params, limit, offset], (error, bookings) => {
      if (error) return callback(error);

      callback(null, {
        bookings,
        total: Number(countResult[0].total),
      });
    });
  });
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
};
