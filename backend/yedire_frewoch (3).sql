-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2025 at 11:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yedire_frewoch`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'yoni', '$2a$12$9NL.X6dq9zEdI4.MWeOVFu9.dtw0mustXOBJUvA8xh29dnrg/YSom', '2025-08-24 17:26:03');

-- --------------------------------------------------------

--
-- Table structure for table `bank_info`
--

CREATE TABLE `bank_info` (
  `id` int(11) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `routing_number` varchar(50) DEFAULT NULL,
  `swift_code` varchar(50) DEFAULT NULL,
  `bank_address` text DEFAULT NULL,
  `bank_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_info`
--

INSERT INTO `bank_info` (`id`, `bank_name`, `account_name`, `account_number`, `routing_number`, `swift_code`, `bank_address`, `bank_image`, `is_active`, `last_updated`, `payment_link`) VALUES
(1, 'cbe', 'YeDire Firewoch Charity Organization (YDFCO)', '1000300098553', '', 'CBETETAA', 'dire dawa Branch', 'uploads/bank_images/1743204164_cbe-logo.png', 1, '2025-04-03 12:22:13', NULL),
(5, 'Berhan Bank', 'Ye Dire Firewoch Charity Organization (YDFCO)', '1000346915420', '', 'BERHETAA', 'Dire Dawa Branch', 'uploads/bank_images/1743672113_birhan-logo.png', 1, '2025-04-03 12:21:53', '');

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE `communities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`id`, `name`, `region`, `description`, `created_at`) VALUES
(1, 'Government', 'dire dawa', 'helping', '2025-03-28 19:03:35');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `donation_id` varchar(50) NOT NULL,
  `donor_name` varchar(100) NOT NULL,
  `donor_email` varchar(100) NOT NULL,
  `donor_phone` varchar(20) DEFAULT NULL,
  `donor_address` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `donation_date` datetime NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `donor_message` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_links`
--

INSERT INTO `footer_links` (`id`, `title`, `url`, `display_order`, `is_active`, `date_added`, `last_updated`) VALUES
(1, 'Home', 'http://localhost/yedire_frewoch/index.php', 1, 1, '2025-03-29 00:15:24', '2025-04-03 04:37:20'),
(2, 'Contacts', 'http://localhost/yedire_frewoch/contacts.php', 1, 1, '2025-03-29 00:27:36', '2025-04-03 04:38:18'),
(3, 'about', 'http://localhost/yedire_frewoch/about-us.php', 1, 1, '2025-03-29 00:28:42', '2025-04-03 04:37:57'),
(4, 'Gallery', 'http://localhost/yedire_frewoch/gallery.php', 1, 1, '2025-04-03 04:38:42', '2025-04-03 04:38:42'),
(5, 'Donate', 'http://localhost/yedire_frewoch/donate.php', 1, 1, '2025-04-03 04:39:11', '2025-04-03 04:39:11');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `school_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `children_served` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`school_id`, `name`, `description`, `region`, `children_served`, `created_at`) VALUES
('aftesa', 'aftesa', 'small village school', '', 100, '2025-03-28 22:07:37'),
('dechatu_hedase', 'Dechatu hedase', 'dechatu', '', 200, '2025-03-28 22:09:14'),
('legraher_school', 'legraher school', 'elementery', '', 100, '2025-04-03 08:15:33'),
('sabiyan_no_1', 'sabiyan no 1', 'small villaeg school', '', 120, '2025-03-29 09:04:34');

-- --------------------------------------------------------

--
-- Table structure for table `school_images`
--

CREATE TABLE `school_images` (
  `id` int(11) NOT NULL,
  `school_id` varchar(20) NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_images`
--

INSERT INTO `school_images` (`id`, `school_id`, `image_name`, `title`, `description`, `is_featured`, `upload_date`) VALUES
(3, 'dechatu_hedase', 'img_67e71e4e2c60f.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(4, 'dechatu_hedase', 'img_67e71e4e2cbbe.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(5, 'dechatu_hedase', 'img_67e71e4e2d274.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(6, 'dechatu_hedase', 'img_67e71e4e2d64e.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(7, 'dechatu_hedase', 'img_67e71e4e2db34.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(8, 'dechatu_hedase', 'img_67e71e4e2df1e.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(9, 'dechatu_hedase', 'img_67e71e4e2e385.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(10, 'dechatu_hedase', 'img_67e71e4e2e751.jpg', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22'),
(11, 'sabiyan_no_1', 'img_67e7b7eab786d.jpg', 'kurse', 'bread', 0, '2025-03-29 09:05:46'),
(12, 'sabiyan_no_1', 'img_67e7b7eab86c5.jpg', 'kurse', 'bread', 0, '2025-03-29 09:05:46'),
(13, 'sabiyan_no_1', 'img_67e7b7eab8f98.jpg', 'kurse', 'bread', 0, '2025-03-29 09:05:46'),
(14, 'sabiyan_no_1', 'img_67e7b7eab9a87.jpg', 'kurse', 'bread', 0, '2025-03-29 09:05:46'),
(15, 'sabiyan_no_1', 'img_67e7b7eabaa3b.jpg', 'kurse', 'bread', 0, '2025-03-29 09:05:46');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon_class` varchar(50) NOT NULL,
  `display_order` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `platform`, `url`, `icon_class`, `display_order`, `is_active`, `date_added`, `last_updated`) VALUES
(6, 'facebook', 'https://web.facebook.com/Yedirefrewoch', 'fab fa-facebook', 1, 1, '2025-03-29 09:11:21', '2025-04-03 08:58:09'),
(8, 'youtube', 'https://www.youtube.com/@%E1%8B%A8%E1%8B%B5%E1%88%AC%E1%8D%8D%E1%88%AC%E1%8B%8E%E1%89%BD%E1%89%A0%E1%8C%8E%E1%8A%A0%E1%8B%B5%E1%88%AB%E1%89%B5', 'fab fa-youtube', 1, 1, '2025-04-03 09:01:26', '2025-04-03 09:01:26'),
(9, 'Telegram', 'https://t.me/Wesenbiratu', 'fab fa-telegram', 1, 1, '2025-04-03 09:02:13', '2025-04-03 09:02:13'),
(10, 'Tiktok', 'https://www.tiktok.com/@wesen.biratu?', 'fab fa-tiktok', 1, 1, '2025-04-03 09:07:25', '2025-04-03 09:07:25');

-- --------------------------------------------------------

--
-- Table structure for table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_path` varchar(255) NOT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sponsors`
--

INSERT INTO `sponsors` (`id`, `name`, `description`, `logo_path`, `website_url`, `is_active`, `created_at`) VALUES
(7, 'MM Hotel', '', 'images/sponsors/sponsor_67ee5401073eb.png', 'https://www.mmhoteldire.com/', 1, '2025-04-03 09:25:21');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `rating` int(1) DEFAULT 5,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `role`, `message`, `image_path`, `rating`, `is_active`, `created_at`) VALUES
(0, 'yoni', 'studentq', 'help is on the way', 'images/testimonials/1743656674_ba84abc138edfb30f11c00b88952c9af.png', 3, 1, '2025-04-03 05:04:34'),
(0, 'moss', 'student', 'so inspiring', 'images/testimonials/1743658235_default-staff.png', 5, 1, '2025-04-03 05:30:35'),
(0, 'kedir ', 'kentiba', 'we support you', 'images/testimonials/1743668311_kedir.png', 5, 1, '2025-04-03 08:18:31');

-- --------------------------------------------------------

--
-- Table structure for table `test_crud`
--

CREATE TABLE `test_crud` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `urgent_messages`
--

CREATE TABLE `urgent_messages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `urgency_level` enum('Urgent','Important','Normal') NOT NULL DEFAULT 'Normal',
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `action_link` varchar(255) DEFAULT NULL,
  `action_text` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urgent_messages`
--

INSERT INTO `urgent_messages` (`id`, `title`, `message`, `image_path`, `urgency_level`, `status`, `action_link`, `action_text`, `created_at`, `updated_at`) VALUES
(1, 'we need help', 'please', 'images/urgent/1743209230_bg-bunner-2.png', 'Urgent', 'inactive', 'https://www.instagram.com/yon_ii_/', 'Help Now', '2025-03-29 00:47:10', '2025-03-29 00:47:10'),
(2, 'need', 'we need help on supplies', 'images/urgent/1743239568_img_67e719331e26c.png', 'Urgent', 'inactive', '', 'Help Now', '2025-03-29 09:12:48', '2025-03-29 09:12:48'),
(3, 'support', 'we need support with food materials', 'images/urgent/1743668802_39c3efa54815b4fb1eef66d7ec8309c7.jpg', 'Urgent', 'inactive', '', 'Help Now', '2025-04-03 08:26:42', '2025-04-03 08:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `join_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `join_date`) VALUES
(1, 'M&M', 'mosisaboneya4@gmail.com', '0928984993', '2025-03-28 18:57:31'),
(0, 'nahom', 'comradencm@gmail.com', '0925254765', '2025-03-28 22:23:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `bank_info`
--
ALTER TABLE `bank_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `donation_id` (`donation_id`);

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `school_images`
--
ALTER TABLE `school_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_crud`
--
ALTER TABLE `test_crud`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `urgent_messages`
--
ALTER TABLE `urgent_messages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bank_info`
--
ALTER TABLE `bank_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `school_images`
--
ALTER TABLE `school_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sponsors`
--
ALTER TABLE `sponsors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `test_crud`
--
ALTER TABLE `test_crud`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `urgent_messages`
--
ALTER TABLE `urgent_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `school_images`
--
ALTER TABLE `school_images`
  ADD CONSTRAINT `school_images_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
