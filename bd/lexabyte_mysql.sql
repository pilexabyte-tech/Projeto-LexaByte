-- ============================================================
-- LexaByte — MySQL Schema
-- Adaptado de MariaDB/XAMPP para MySQL
-- Charset: utf8mb4 (suporte completo a Unicode/PT-BR)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- Criação do banco (execute separado se necessário)
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `lexabyte`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `lexabyte`;

-- ------------------------------------------------------------
-- Tabela: usuario
-- ------------------------------------------------------------
CREATE TABLE `usuario` (
  `ID_Usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `Nome`       VARCHAR(100) NOT NULL,
  `Login`      VARCHAR(100) NOT NULL,
  `Senha`      VARCHAR(255) NOT NULL,        -- hash bcrypt
  `Email`      VARCHAR(150) DEFAULT NULL,
  `Criado_em`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Usuario`),
  UNIQUE KEY `uq_login` (`Login`),
  UNIQUE KEY `uq_email` (`Email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: conteudo
-- ------------------------------------------------------------
CREATE TABLE `conteudo` (
  `ID_Conteudo`  INT(11)      NOT NULL AUTO_INCREMENT,
  `Tipo`         ENUM('livro','filme','serie') NOT NULL,
  `Titulo`       VARCHAR(255) NOT NULL,
  `Descricao`    TEXT         DEFAULT NULL,
  `Capa_URL`     VARCHAR(500) DEFAULT NULL,
  `Ano`          YEAR         DEFAULT NULL,
  `Criado_em`    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Conteudo`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: recomendacao
-- ------------------------------------------------------------
CREATE TABLE `recomendacao` (
  `idRecomendacao` INT(11)      NOT NULL AUTO_INCREMENT,
  `idConteudo`     INT(11)      NOT NULL,
  `idUsuario`      INT(11)      NOT NULL,
  `Link`           VARCHAR(500) DEFAULT NULL,
  `Criado_em`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idRecomendacao`),
  KEY `fk_rec_conteudo` (`idConteudo`),
  KEY `fk_rec_usuario`  (`idUsuario`),
  CONSTRAINT `recomendacao_ibfk_1`
    FOREIGN KEY (`idConteudo`) REFERENCES `conteudo` (`ID_Conteudo`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recomendacao_ibfk_2`
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`ID_Usuario`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: usuario_conteudo  (histórico / lista do usuário)
-- ------------------------------------------------------------
CREATE TABLE `usuario_conteudo` (
  `ID_Conteudo`  INT(11)  NOT NULL,
  `ID_Usuario`   INT(11)  NOT NULL,
  `Salvo_em`     DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Conteudo`, `ID_Usuario`),
  KEY `fk_uc_usuario` (`ID_Usuario`),
  CONSTRAINT `usuario_conteudo_ibfk_1`
    FOREIGN KEY (`ID_Conteudo`) REFERENCES `conteudo` (`ID_Conteudo`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuario_conteudo_ibfk_2`
    FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Reativa FK checks e fecha transação
-- ------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
