-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 29. Okt 2025 um 15:58
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `fuchsia rush`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `antworten`
--

CREATE TABLE `antworten` (
  `text` varchar(255) DEFAULT NULL,
  `TorF` tinyint(1) NOT NULL DEFAULT 0,
  `AntwortID` varchar(255) NOT NULL,
  `id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `antworten`
--

INSERT INTO `antworten` (`text`, `TorF`, `AntwortID`, `id`) VALUES
('60', 1, 'A1', 'F1'),
('2', 0, 'A11', 'F3'),
('3', 1, 'A12', 'F3'),
('8', 0, 'A13', 'F3'),
('alle', 0, 'A14', 'F3'),
('git switch', 1, 'A15', 'F4'),
('git move', 0, 'A16', 'F4'),
('git jump', 0, 'A17', 'F4'),
('git hop', 0, 'A18', 'F4'),
('Nein', 0, 'A19', 'F5'),
('55', 0, 'A2', 'F1'),
('Ja', 0, 'A20', 'F5'),
('Wir hatten ein Seminar?', 0, 'A21', 'F5'),
('Fuchsia', 1, 'A22', 'F5'),
('43', 0, 'A3', 'F1'),
('52', 0, 'A4', 'F1'),
('git -version', 1, 'A6', 'F2'),
('git help version', 0, 'A7', 'F2'),
('getGitVersion', 0, 'A8', 'F2'),
('gitVersion', 0, 'A9', 'F2');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fragen`
--

CREATE TABLE `fragen` (
  `text` varchar(255) DEFAULT NULL,
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `fragen`
--

INSERT INTO `fragen` (`text`, `id`) VALUES
('Wie alt ist Marcel Davis?', 'F1'),
('Wie lautet der Command um die installierte Version Gits zu erhalten?', 'F2'),
('Wie viele Kuchen muss Göki noch backen?', 'F3'),
('Wie kann man den branch in Git wechseln?', 'F4'),
('Hatten wir ein Git Seminar?', 'F5');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `antworten`
--
ALTER TABLE `antworten`
  ADD PRIMARY KEY (`AntwortID`),
  ADD KEY `FragenID` (`id`);

--
-- Indizes für die Tabelle `fragen`
--
ALTER TABLE `fragen`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
