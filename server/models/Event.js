const db = require("../config/dbConnection");

const createEvent = (data, callback) => {
  const {
    title,
    description,
    date,
    location,
    capacity,
    banner_image_url,
    thumbnail_url,
    start_time,
    end_time,
    category,
    organizer_name,
    organizer_email,
    venue_details,
    is_online,
    meeting_link,
    price,
    tags,
    status,
    created_by,
  } = data;

  const query = `
    INSERT INTO events (
      title, description, date, location, capacity,
      banner_image_url, thumbnail_url, start_time, end_time,
      category, organizer_name, organizer_email, venue_details,
      is_online, meeting_link, price, tags, status, created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title || null,
    description || null,
    date || null,
    location || null,
    capacity || null,
    banner_image_url || null,
    thumbnail_url || null,
    start_time || null,
    end_time || null,
    category || null,
    organizer_name || null,
    organizer_email || null,
    venue_details || null,
    typeof is_online === "boolean" ? is_online : null,
    meeting_link || null,
    price ?? null,
    tags || null,
    status || null,
    created_by || 1,
  ];

  db.query(query, values, callback);
};

const getAllEvents = (userId, role, limit, offset, filters, callback) => {
  const conditions = [];
  const params = [];

  if (role !== "user") {
    conditions.push("created_by = ?");
    params.push(userId);
  }

  if (filters.location) {
    conditions.push("location LIKE ?");
    params.push(`%${filters.location}%`);
  }

  if (filters.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }

  if (filters.priceRange === "free") {
    conditions.push("price = 0");
  } else if (filters.priceRange === "low") {
    conditions.push("price > 0 AND price <= 500");
  } else if (filters.priceRange === "high") {
    conditions.push("price > 500");
  }

  if (filters.search) {
    const keywords = filters.search.trim().split(/\s+/).filter(Boolean);

    keywords.forEach((keyword) => {
      conditions.push("title LIKE ?");
      params.push(`%${keyword}%`);
    });
  }

  if (filters.date) {
    conditions.push("DATE(date) = ?");
    params.push(filters.date);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const query = `
    SELECT * FROM events
    ${whereClause}
    ORDER BY date ${role === "user" ? "DESC" : "ASC"}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM events
    ${whereClause}
  `;

  db.query(countQuery, params, (countError, countResult) => {
    if (countError) return callback(countError);

    db.query(query, [...params, limit, offset], (error, events) => {
      if (error) return callback(error);

      callback(null, {
        events,
        total: countResult[0].total,
      });
    });
  });
};

const getEventById = (id, callback) => {
  const query = "SELECT * FROM events WHERE id = ?";
  db.query(query, [id], callback);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
};
