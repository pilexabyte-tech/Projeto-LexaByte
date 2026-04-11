-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 11/04/2026 às 01:56
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `lexabyte`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `conteudo`
--

CREATE TABLE `conteudo` (
  `ID_Conteudo` int(11) NOT NULL,
  `Tipo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `recomendacao`
--

CREATE TABLE `recomendacao` (
  `idRecomendacao` int(11) NOT NULL,
  `idConteudo` int(11) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `Link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nome` varchar(100) DEFAULT NULL,
  `Login` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_conteudo`
--

CREATE TABLE `usuario_conteudo` (
  `ID_Conteudo` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `conteudo`
--
ALTER TABLE `conteudo`
  ADD PRIMARY KEY (`ID_Conteudo`);

--
-- Índices de tabela `recomendacao`
--
ALTER TABLE `recomendacao`
  ADD PRIMARY KEY (`idRecomendacao`),
  ADD KEY `idConteudo` (`idConteudo`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`);

--
-- Índices de tabela `usuario_conteudo`
--
ALTER TABLE `usuario_conteudo`
  ADD PRIMARY KEY (`ID_Conteudo`,`ID_Usuario`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `recomendacao`
--
ALTER TABLE `recomendacao`
  ADD CONSTRAINT `recomendacao_ibfk_1` FOREIGN KEY (`idConteudo`) REFERENCES `conteudo` (`ID_Conteudo`),
  ADD CONSTRAINT `recomendacao_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Restrições para tabelas `usuario_conteudo`
--
ALTER TABLE `usuario_conteudo`
  ADD CONSTRAINT `usuario_conteudo_ibfk_1` FOREIGN KEY (`ID_Conteudo`) REFERENCES `conteudo` (`ID_Conteudo`),
  ADD CONSTRAINT `usuario_conteudo_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
