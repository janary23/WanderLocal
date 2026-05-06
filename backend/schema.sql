-- ============================================================
--  WandereLocal – Full Database Schema
--  Run in phpMyAdmin or MySQL CLI:
--    mysql -u root wanderelocal_db < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS wanderelocal_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wanderelocal_db;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('traveler','business','admin') NOT NULL DEFAULT 'traveler',
  avatar_url  VARCHAR(512)  DEFAULT NULL,
  bio         TEXT          DEFAULT NULL,
  phone       VARCHAR(50)   DEFAULT NULL,
  address     VARCHAR(512)  DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Listings (businesses in the directory) ───────────────────
CREATE TABLE IF NOT EXISTS listings (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id      INT UNSIGNED DEFAULT NULL,         -- NULL = unverified/fallback
  name          VARCHAR(255) NOT NULL,
  type          VARCHAR(100) NOT NULL,
  tier          ENUM('verified','community','fallback') NOT NULL DEFAULT 'fallback',
  category      VARCHAR(100) DEFAULT NULL,
  city          VARCHAR(150) DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  hours         VARCHAR(255) DEFAULT NULL,
  cover_img     VARCHAR(512) DEFAULT NULL,
  address       VARCHAR(512) DEFAULT NULL,
  latitude      DECIMAL(10,7) DEFAULT NULL,
  longitude     DECIMAL(10,7) DEFAULT NULL,
  booking_type  ENUM('manual','instant') DEFAULT 'manual',
  weekday_price DECIMAL(10,2) DEFAULT 0,
  weekend_price DECIMAL(10,2) DEFAULT 0,
  status        ENUM('active','pending','rejected','draft') NOT NULL DEFAULT 'pending',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Listing Tags ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_tags (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id INT UNSIGNED NOT NULL,
  tag        VARCHAR(100) NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Listing Photos ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_photos (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id INT UNSIGNED NOT NULL,
  url        VARCHAR(512) NOT NULL,
  is_cover   TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Wishlists (saved / shortlisted listings) ─────────────────
CREATE TABLE IF NOT EXISTS wishlists (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  listing_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wishlist (user_id, listing_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Itineraries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itineraries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL DEFAULT 'My Trip',
  destination VARCHAR(255) DEFAULT NULL,
  visibility  ENUM('private','public','link') NOT NULL DEFAULT 'private',
  status      ENUM('draft','active','completed') NOT NULL DEFAULT 'draft',
  cloned_by   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Itinerary Days ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itinerary_days (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  itinerary_id INT UNSIGNED NOT NULL,
  day_label    VARCHAR(50) NOT NULL DEFAULT 'Day 1',
  day_index    INT NOT NULL DEFAULT 1,
  FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Itinerary Stops ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itinerary_stops (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  day_id         INT UNSIGNED NOT NULL,
  listing_id     INT UNSIGNED DEFAULT NULL,
  custom_name    VARCHAR(255) DEFAULT NULL,
  stop_time      VARCHAR(20)  DEFAULT NULL,
  duration       VARCHAR(100) DEFAULT NULL,
  stop_type      VARCHAR(100) DEFAULT NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  FOREIGN KEY (day_id)     REFERENCES itinerary_days(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Nominations ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nominations (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nominator_id INT UNSIGNED DEFAULT NULL,
  business_name VARCHAR(255) NOT NULL,
  city        VARCHAR(150) DEFAULT NULL,
  category    VARCHAR(100) DEFAULT NULL,
  reason      TEXT         DEFAULT NULL,
  photo_url   VARCHAR(512) DEFAULT NULL,
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nominator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Business Claim Requests ───────────────────────────────────
CREATE TABLE IF NOT EXISTS claim_requests (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED DEFAULT NULL,
  listing_id   INT UNSIGNED DEFAULT NULL,
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  role_at_biz  VARCHAR(100) DEFAULT NULL,
  doc_url      VARCHAR(512) DEFAULT NULL,
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  type       VARCHAR(50)  DEFAULT 'info',
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Announcements (business posts) ───────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id INT UNSIGNED NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Reviews ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED DEFAULT NULL,
  listing_id INT UNSIGNED NOT NULL,
  rating     TINYINT NOT NULL DEFAULT 5,
  body       TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Seed: Sample Listings ──────────────────────────────────────
INSERT IGNORE INTO listings (id, name, type, tier, category, city, description, hours, cover_img, status) VALUES
  (1, 'Cafe Amore', 'Food & Beverage', 'verified', 'Food', 'Baguio City', 'Cozy cafe with locally-sourced highland beans and homemade pastries. Family-run since 2012.', 'Mon–Sat: 8AM–8PM', 'https://picsum.photos/seed/15541188/800/600', 'active'),
  (2, 'Vigan Heritage Walk', 'Attraction', 'verified', 'Heritage', 'Vigan, Ilocos Sur', 'Guided walking tour around the preserved Spanish colonial cobblestone streets.', 'Daily: 7AM–6PM', 'https://picsum.photos/seed/15967078/800/600', 'active'),
  (3, 'Baguio Craft Market', 'Shopping', 'community', 'Shopping', 'Baguio City', 'Handcrafted local goods from Cordillera artisans — woodwork, weavings, and more.', 'Unknown', 'https://picsum.photos/seed/15197101/800/600', 'active'),
  (4, 'Joe''s Diner', 'Restaurant', 'fallback', 'Food', 'Manila', 'Local eatery.', NULL, NULL, 'active'),
  (5, 'Batanes Homestead Inn', 'Accommodation', 'verified', 'Nature', 'Basco, Batanes', 'Charming stone house inn with breathtaking views of the rolling hills and ocean.', 'Open 24/7', 'https://picsum.photos/seed/15660737/800/600', 'active'),
  (6, 'Lola Ines'' Kare-Kare House', 'Restaurant', 'community', 'Food', 'Pampanga', 'Home-cooked kare-kare passed down through three generations. Community favorite.', 'Unknown', 'https://picsum.photos/seed/14730932/800/600', 'active'),
  (7, 'Sundown Guesthouse', 'Accommodation', 'fallback', 'Nature', 'Palawan', 'Budget guesthouse near the port.', NULL, NULL, 'active');

INSERT IGNORE INTO listing_tags (listing_id, tag) VALUES
  (1,'Eco-friendly'),(1,'Family-owned'),
  (2,'Culture'),(2,'UNESCO'),
  (3,'Artisan'),(3,'Handmade'),
  (5,'Family-owned'),(5,'Scenic View'),
  (6,'Local'),(6,'Authentic');
