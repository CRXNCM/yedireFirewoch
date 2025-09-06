-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 06, 2025 at 11:46 AM
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
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','super_admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$CSrfgmgvuwkFvJ6TmVsGNOopKaNwwXz3vmx1yboUMNL9/gQSaHhRC', 'admin', 1, '2025-09-06 08:19:00', '2025-09-05 06:47:22', '2025-09-06 08:19:00');

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
  `last_updated` datetime DEFAULT NULL,
  `payment_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_info`
--

INSERT INTO `bank_info` (`id`, `bank_name`, `account_name`, `account_number`, `routing_number`, `swift_code`, `bank_address`, `bank_image`, `is_active`, `last_updated`, `payment_link`) VALUES
(12, 'ebirr', 'Ye Dire Firewoch Charity Organization (YDFCO)', '0912345678', NULL, NULL, NULL, 'banks\\bank-1757143219634-c884af3a.png', 1, '2025-09-06 07:20:19', NULL),
(13, 'Berhan Bank', 'Ye Dire Firewoch Charity Organization (YDFCO)', '1000346915420', NULL, NULL, NULL, 'banks\\bank-1757143259661-27d183bc.png', 1, '2025-09-06 07:20:59', NULL),
(14, 'CBE', 'Ye Dire Firewoch Charity Organization (YDFCO)', '1000300098553', NULL, NULL, NULL, 'banks\\bank-1757143317709-69052812.png', 1, '2025-09-06 07:21:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE `communities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`id`, `name`, `region`, `description`, `created_at`) VALUES
(4, 'Somali Community', 'Dire Dawa', 'The Somali community places growing importance on education in Dire Dawa, especially in recent years. Many Somali families prioritize sending their children to private Islamic schools as well as public institutions. Somali students are visible in secondary schools, universities, and technical colleges across the city. There is also a strong network of community-led tutoring centers and madrassas that focus on both religious and academic education.', '2025-04-12 05:06:02'),
(5, 'Oromo Community ', 'dire dawa', 'Oromo students in Dire Dawa are active across all levels of the education system—from elementary schools to universities. The community has been advocating for Afaan Oromo to be used more widely in schools, supporting the preservation of language and culture. Many Oromo families encourage their children to pursue education as a path to leadership and public service, and it\'s common to see Oromo youth excelling in both academic and athletic programs.', '2025-04-12 05:06:26'),
(6, 'Amhara Community', 'Dire Dawa', 'The Amhara community has a long-standing tradition of valuing formal education. In Dire Dawa, many Amhara parents are involved in their children\'s schooling, with strong representation in both public and private schools. A good number of school administrators, teachers, and university lecturers in Dire Dawa are from the Amhara community, contributing significantly to the region\'s academic development.', '2025-04-12 05:06:56'),
(7, 'Harari Community', 'Dire Dawa', 'Education is a central value in the Harari community. Despite being smaller in population, Harari families often prioritize quality education, especially in subjects like history, culture, and religious studies. Harari youth are active in higher education, often focusing on law, business, and social sciences. The community also supports heritage preservation through schools that teach the Harari language and history', '2025-04-12 05:07:32'),
(4, 'Somali Community', 'Dire Dawa', 'The Somali community places growing importance on education in Dire Dawa, especially in recent years. Many Somali families prioritize sending their children to private Islamic schools as well as public institutions. Somali students are visible in secondary schools, universities, and technical colleges across the city. There is also a strong network of community-led tutoring centers and madrassas that focus on both religious and academic education.', '2025-04-12 05:06:02'),
(5, 'Oromo Community ', 'dire dawa', 'Oromo students in Dire Dawa are active across all levels of the education system—from elementary schools to universities. The community has been advocating for Afaan Oromo to be used more widely in schools, supporting the preservation of language and culture. Many Oromo families encourage their children to pursue education as a path to leadership and public service, and it\'s common to see Oromo youth excelling in both academic and athletic programs.', '2025-04-12 05:06:26'),
(6, 'Amhara Community', 'Dire Dawa', 'The Amhara community has a long-standing tradition of valuing formal education. In Dire Dawa, many Amhara parents are involved in their children\'s schooling, with strong representation in both public and private schools. A good number of school administrators, teachers, and university lecturers in Dire Dawa are from the Amhara community, contributing significantly to the region\'s academic development.', '2025-04-12 05:06:56'),
(7, 'Harari Community', 'Dire Dawa', 'Education is a central value in the Harari community. Despite being smaller in population, Harari families often prioritize quality education, especially in subjects like history, culture, and religious studies. Harari youth are active in higher education, often focusing on law, business, and social sciences. The community also supports heritage preservation through schools that teach the Harari language and history', '2025-04-12 05:07:32');

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
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`school_id`, `name`, `description`, `region`, `children_served`, `created_at`) VALUES
('Aba_Yohanes', 'Aba Yohanes', '', 'Dira Dawa', 100, '2025-04-11 17:36:36'),
('aftesa', 'aftesa', 'small village school', 'dire dawa', 100, '2025-03-28 22:07:37'),
('brhan', 'Brhan', '', '', 100, '2025-04-11 17:37:34'),
('dechatu_hedase', 'Dechatu hedase', 'dechatu', 'dire dawa', 100, '2025-03-28 22:09:14'),
('Gende_Ada', 'Gende Ada', '', 'dire dawa', 100, '2025-04-11 18:28:42'),
('goro', 'goro', '', 'dire dawa', 100, '2025-04-11 18:29:18'),
('high_school', 'high school', '', 'dire dawa', 100, '2025-04-11 17:45:57'),
('kezira', 'kezira', '', 'dire dawa', 100, '2025-04-11 17:46:19'),
('legraher_school', 'Legehare School', '', 'dire dawa', 100, '2025-04-11 17:46:49'),
('mariyam_sefer', 'mariyam sefer', '', 'dire dawa', 100, '2025-04-11 18:27:21'),
('medhanialem', 'medhanialem', '', 'dire dawa', 100, '2025-04-11 17:47:28'),
('Melka_jebdu__school', 'Melka jebdu elementary school', '', 'dire dawa', 100, '2025-04-11 18:24:50'),
('mesala_enate', 'mesala enate', '', 'Dire dawa', 100, '2025-04-11 17:48:27'),
('misrak_jegnoch', 'Misrak Jegnoch', '', 'dire dawa', 100, '2025-04-11 17:48:56'),
('oxaday_school', 'oxaday school', '', 'dire dawa', 100, '2025-04-11 17:50:26'),
('sabiyab_no_3', 'sabiyab no 3', '', 'dire dawa', 100, '2025-04-11 18:28:03'),
('sabiyan_no_1', 'sabiyan no 1', 'small villaeg school', 'dire dawa', 100, '2025-03-29 09:04:34'),
('SCH1756113718805', 'kezira', 'new school', 'dire dawa', 97, '2025-08-25 09:21:58'),
('ye_hetsanat_ken', 'ye hetsanat ken', '', 'dire dawa', 100, '2025-04-11 17:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `school_images`
--

CREATE TABLE `school_images` (
  `id` int(11) NOT NULL,
  `school_id` varchar(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `upload_date` datetime NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_images`
--

INSERT INTO `school_images` (`id`, `school_id`, `title`, `description`, `is_featured`, `upload_date`, `image_url`, `image_path`) VALUES
(3, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(4, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(5, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(6, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(7, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(8, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(9, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(10, 'dechatu_hedase', 'morning meal', 'dsdnmdn', 0, '2025-03-28 22:10:22', '', NULL),
(13, 'sabiyan_no_1', 'kurse', 'bread', 0, '2025-03-29 09:05:46', '', NULL),
(14, 'sabiyan_no_1', 'kurse', 'bread', 0, '2025-03-29 09:05:46', '', NULL),
(15, 'sabiyan_no_1', 'kurse', 'bread', 0, '2025-03-29 09:05:46', '', NULL),
(17, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064782736-9a09831e.jpg', 'schools\\school-1757064782736-9a09831e.jpg'),
(18, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064782826-bbf56029.jpg', 'schools\\school-1757064782826-bbf56029.jpg'),
(19, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064782911-2c559526.jpg', 'schools\\school-1757064782911-2c559526.jpg'),
(20, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783007-be77788e.jpg', 'schools\\school-1757064783007-be77788e.jpg'),
(21, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783081-f03c1467.jpg', 'schools\\school-1757064783081-f03c1467.jpg'),
(22, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783177-53faf5d0.jpg', 'schools\\school-1757064783177-53faf5d0.jpg'),
(23, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783275-414d1465.jpg', 'schools\\school-1757064783275-414d1465.jpg'),
(24, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783348-443d6a9a.jpg', 'schools\\school-1757064783348-443d6a9a.jpg'),
(25, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783445-8b8f031e.jpg', 'schools\\school-1757064783445-8b8f031e.jpg'),
(26, 'goro', 'meal', 'good food', 0, '2025-09-05 09:33:03', '/uploads/schools\\school-1757064783517-e26a545f.jpg', 'schools\\school-1757064783517-e26a545f.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `platform` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon_class` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `date_added` datetime NOT NULL,
  `last_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `platform`, `url`, `icon_class`, `display_order`, `is_active`, `date_added`, `last_updated`) VALUES
(3, 'Telegram', 'https://t.me/Wesenbiratu', 'fa-telegram', 2, 1, '2025-04-11 21:02:47', '2025-04-11 21:02:47'),
(4, 'Tiktok', 'https://www.tiktok.com/@wesen.biratu?', 'fa-tiktok', 3, 1, '2025-04-11 21:04:18', '2025-04-11 21:04:18'),
(6, 'facebook', 'https://web.facebook.com/Yedirefrewoch', 'fab fa-facebook', 1, 1, '2025-03-29 09:11:21', '2025-08-26 08:26:54'),
(8, 'youtube', 'https://www.youtube.com/@%E1%8B%A8%E1%8B%B5%E1%88%AC%E1%8D%8D%E1%88%AC%E1%8B%8E%E1%89%BD%E1%89%A0%E1%8C%8E%E1%8A%A0%E1%8B%B5%E1%88%AB%E1%89%B5', 'fab fa-youtube', 4, 1, '2025-04-03 09:01:26', '2025-08-26 08:27:03');

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
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sponsors`
--

INSERT INTO `sponsors` (`id`, `name`, `description`, `logo_path`, `website_url`, `is_active`, `created_at`) VALUES
(7, 'mm hotel', 'good help', 'images/sponsors/sponsor_67ee5401073eb.png', 'https://www.mmhoteldire.com/', 1, '2025-04-03 09:25:21'),
(8, 'stranger', 'good', 'http://localhost:5000/uploads/image-1756194857209-103885817.png', 'http://www.justbusiness.com', 1, '2025-08-26 07:54:17');

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
  `created_at` datetime NOT NULL
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
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
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
  `join_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `join_date`) VALUES
(2, 'MM Hotel', 'mmhoteldiredawa@gmail.com', '025-411-44-44', '2025-04-12 05:10:02'),
(3, 'Watch & Pray', 'Watchandpray@gmail.com', '+251123456789', '2025-04-12 05:10:53'),
(4, 'yemariyam worke Hospital', 'yemariyamworkeHospital@gmail.com', '0912345678', '2025-04-12 05:11:39'),
(0, 'Nahom Haileselassie', 'comradencm@gmail.com', '0925254765', '2025-08-26 08:19:25');

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
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `username_23` (`username`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username_24` (`username`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `username_25` (`username`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `username_26` (`username`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `username_27` (`username`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `username_28` (`username`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `username_29` (`username`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `username_30` (`username`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `username_31` (`username`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `username_32` (`username`);

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
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bank_info`
--
ALTER TABLE `bank_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sponsors`
--
ALTER TABLE `sponsors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
