-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Jeu 12 Janvier 2017 à 08:13
-- Version du serveur :  5.7.16-0ubuntu0.16.04.1
-- Version de PHP :  7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bdd_sketcher`
--

-- --------------------------------------------------------

--
-- Structure de la table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `sketch` int(11) DEFAULT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sketch`
--

CREATE TABLE `sketch` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `date_upload` datetime NOT NULL,
  `width` int(11) NOT NULL DEFAULT '1000',
  `height` int(11) NOT NULL DEFAULT '800',
  `data` longtext COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sketch_tag`
--

CREATE TABLE `sketch_tag` (
  `sketch_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sketch_user`
--

CREATE TABLE `sketch_user` (
  `sketch_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tag_sketch`
--

CREATE TABLE `tag_sketch` (
  `tag_id` int(11) NOT NULL,
  `sketch_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci NOT NULL,
  `dateEmit` datetime NOT NULL,
  `status` enum('waiting','processed') COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `sketch` int(11) DEFAULT NULL,
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `last_login` datetime NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `edit_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_sketch`
--

CREATE TABLE `user_sketch` (
  `user_id` int(11) NOT NULL,
  `sketch_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9474526C8D93D649` (`user`),
  ADD KEY `IDX_9474526C802F8E23` (`sketch`);

--
-- Index pour la table `sketch`
--
ALTER TABLE `sketch`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_802F8E23B548B0F` (`path`);

--
-- Index pour la table `sketch_tag`
--
ALTER TABLE `sketch_tag`
  ADD PRIMARY KEY (`sketch_id`,`tag_id`),
  ADD KEY `IDX_E86A236E529BB595` (`sketch_id`),
  ADD KEY `IDX_E86A236EBAD26311` (`tag_id`);

--
-- Index pour la table `sketch_user`
--
ALTER TABLE `sketch_user`
  ADD PRIMARY KEY (`sketch_id`,`user_id`),
  ADD KEY `IDX_53C3AB18529BB595` (`sketch_id`),
  ADD KEY `IDX_53C3AB18A76ED395` (`user_id`);

--
-- Index pour la table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_389B7835E237E06` (`name`);

--
-- Index pour la table `tag_sketch`
--
ALTER TABLE `tag_sketch`
  ADD PRIMARY KEY (`tag_id`,`sketch_id`),
  ADD KEY `IDX_696EC70FBAD26311` (`tag_id`),
  ADD KEY `IDX_696EC70F529BB595` (`sketch_id`);

--
-- Index pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_97A0ADA38D93D649` (`user`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`),
  ADD KEY `IDX_8D93D649802F8E23` (`sketch`);

--
-- Index pour la table `user_sketch`
--
ALTER TABLE `user_sketch`
  ADD PRIMARY KEY (`user_id`,`sketch_id`),
  ADD KEY `IDX_E57D951EA76ED395` (`user_id`),
  ADD KEY `IDX_E57D951E529BB595` (`sketch_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT pour la table `sketch`
--
ALTER TABLE `sketch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT pour la table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT pour la table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_9474526C802F8E23` FOREIGN KEY (`sketch`) REFERENCES `sketch` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_9474526C8D93D649` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sketch_user`
--
ALTER TABLE `sketch_user`
  ADD CONSTRAINT `FK_53C3AB18529BB595` FOREIGN KEY (`sketch_id`) REFERENCES `sketch` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_53C3AB18A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tag_sketch`
--
ALTER TABLE `tag_sketch`
  ADD CONSTRAINT `FK_696EC70F529BB595` FOREIGN KEY (`sketch_id`) REFERENCES `sketch` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_696EC70FBAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_97A0ADA38D93D649` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_8D93D649802F8E23` FOREIGN KEY (`sketch`) REFERENCES `sketch` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `user_sketch`
--
ALTER TABLE `user_sketch`
  ADD CONSTRAINT `FK_E57D951E529BB595` FOREIGN KEY (`sketch_id`) REFERENCES `sketch` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E57D951EA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
