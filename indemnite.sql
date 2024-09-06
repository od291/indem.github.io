-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 12 juil. 2024 à 00:03
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `indemnite`
--

-- --------------------------------------------------------

--
-- Structure de la table `indemnite`
--

CREATE TABLE `indemnite` (
  `id_ind` int(11) NOT NULL,
  `id_pers` int(11) DEFAULT NULL,
  `id_resp` int(11) DEFAULT NULL,
  `type` text DEFAULT NULL,
  `montant` text DEFAULT NULL,
  `date_attr` text DEFAULT NULL,
  `cause` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personnel`
--

CREATE TABLE `personnel` (
  `id_pers` int(11) NOT NULL,
  `nom_pers` text NOT NULL,
  `pren_pers` text NOT NULL,
  `IM_pers` text NOT NULL,
  `poste_pers` text NOT NULL,
  `indice_pers` text NOT NULL,
  `email_pers` text NOT NULL,
  `tel_pers` text NOT NULL,
  `date_embauche` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `responsable`
--

CREATE TABLE `responsable` (
  `id_resp` int(11) NOT NULL,
  `nom_resp` text NOT NULL,
  `nom_user` text NOT NULL,
  `email_resp` text NOT NULL,
  `tel_resp` text NOT NULL,
  `mdp` text NOT NULL,
  `code_conf` text NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `indemnite`
--
ALTER TABLE `indemnite`
  ADD PRIMARY KEY (`id_ind`),
  ADD KEY `id_pers` (`id_pers`),
  ADD KEY `id_resp` (`id_resp`);

--
-- Index pour la table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`id_pers`);

--
-- Index pour la table `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`id_resp`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `indemnite`
--
ALTER TABLE `indemnite`
  MODIFY `id_ind` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `id_pers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `responsable`
--
ALTER TABLE `responsable`
  MODIFY `id_resp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `indemnite`
--
ALTER TABLE `indemnite`
  ADD CONSTRAINT `indemnite_ibfk_1` FOREIGN KEY (`id_pers`) REFERENCES `personnel` (`id_pers`),
  ADD CONSTRAINT `indemnite_ibfk_2` FOREIGN KEY (`id_resp`) REFERENCES `responsable` (`id_resp`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
