-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3312
-- Tiempo de generación: 10-02-2026 a las 17:03:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ptar_data`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `csc`
--

CREATE TABLE `csc` (
  `reg` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `ddq` decimal(10,0) NOT NULL,
  `ph` decimal(10,0) NOT NULL,
  `t` decimal(10,0) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `csc`
--

INSERT INTO `csc` (`reg`, `fecha`, `hora`, `ddq`, `ph`, `t`, `id_usuario`) VALUES
(1, '2018-04-02', '13:00:00', 7, 7, 22, 0),
(2, '2018-04-02', '16:50:00', 7, 7, 23, 0),
(3, '2018-04-03', '12:40:00', 8, 8, 23, 0),
(4, '2018-04-03', '17:00:00', 8, 8, 22, 0),
(5, '2018-04-04', '12:30:00', 8, 8, 22, 0),
(6, '2018-04-04', '16:40:00', 188, 8, 22, 0),
(7, '2018-04-05', '13:30:00', 8, 8, 22, 0),
(8, '2018-04-05', '17:00:00', 8, 8, 22, 0),
(9, '2018-04-06', '13:00:00', 7, 7, 22, 0),
(10, '2018-04-06', '16:30:00', 206, 7, 22, 0),
(11, '2018-04-09', '12:20:00', 6, 6, 23, 0),
(12, '2018-04-09', '17:05:00', 170, 7, 22, 0),
(13, '2018-04-10', '13:10:00', 7, 7, 22, 0),
(14, '2018-04-11', '13:00:00', 7, 7, 21, 0),
(15, '2018-04-11', '16:45:00', 180, 7, 22, 0),
(16, '2018-04-12', '13:00:00', 7, 7, 22, 0),
(17, '2018-04-12', '17:00:00', 7, 7, 21, 0),
(18, '2018-04-13', '12:00:00', 7, 7, 21, 0),
(19, '2018-04-13', '17:00:00', 160, 7, 22, 0),
(20, '2018-04-16', '13:00:00', 7, 7, 22, 0),
(21, '2018-04-16', '16:45:00', 293, 7, 22, 0),
(22, '2018-04-17', '13:20:00', 8, 8, 23, 0),
(23, '2018-04-17', '16:45:00', 8, 8, 24, 0),
(24, '2018-04-18', '12:45:00', 8, 8, 24, 0),
(25, '2018-04-18', '17:05:00', 160, 8, 23, 0),
(26, '2018-04-19', '13:05:00', 7, 7, 23, 0),
(27, '2018-04-19', '16:45:00', 7, 7, 23, 0),
(28, '2018-04-20', '16:40:00', 187, 7, 23, 0),
(29, '2018-04-23', '13:10:00', 6, 6, 23, 0),
(30, '2018-04-23', '17:00:00', 217, 7, 23, 0),
(31, '2018-04-24', '13:00:00', 6, 6, 22, 0),
(32, '2018-04-24', '17:00:00', 7, 7, 22, 0),
(33, '2018-04-25', '16:20:00', 161, 7, 22, 0),
(34, '2018-04-26', '13:15:00', 7, 7, 23, 0),
(35, '2018-04-26', '16:50:00', 10, 10, 22, 0),
(36, '2018-04-27', '12:20:00', 10, 10, 22, 0),
(37, '2018-04-27', '16:35:00', 193, 10, 23, 0),
(38, '2018-04-30', '12:20:00', 5, 5, 22, 0),
(39, '2018-04-30', '16:40:00', 304, 6, 22, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `faq`
--

CREATE TABLE `faq` (
  `id_pregunta` int(10) UNSIGNED NOT NULL,
  `pregunta` text NOT NULL,
  `respuesta` text NOT NULL,
  `imagen` text DEFAULT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `faq`
--

INSERT INTO `faq` (`id_pregunta`, `pregunta`, `respuesta`, `imagen`, `estado`) VALUES
(1, '¿Para qué se usa el agua de la planta?', 'El agua de la planta se usa exclusivamente para regar las áreas de la facultad donde no hay salones (canchas, etc).', NULL, 1),
(2, '¿El agua de los bebederos tiene que ver con la planta?', 'No, para nada.', NULL, 1),
(3, '¿Qué normativas sigue la planta?', 'La PTAR se rige con la norma NOM-003-SEMARNAT-1997.', 'aviso1.png', 1),
(4, '¿Cuánto riega la planta?', 'De junio de 2024 al 28 de febrero de 2025, se regaron 1,888,470 litros de agua. Esto hace un total de aproximadamente 236,059 litros de agua al mes.', NULL, 1),
(5, '¿Qué otras actividades realiza la planta?', 'Aparte de tratar el agua y regar, la planta se encarga de realizar proyectos de investigación (que puedes encontrar en el apartado de proyectos). También participamos en muchas otras actividades. Si quieres saber más acerca de estas, contáctanos o revisa la pestaña de avisos.', NULL, 1),
(6, '¿Cómo puedo ayudar a la planta?', 'Como estudiante, puedes realizar tu servicio social en ella. Para más información, contáctanos.', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `flujos`
--

CREATE TABLE `flujos` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `Niv` float DEFAULT NULL,
  `Dif` float DEFAULT NULL,
  `F_NO_NF` float DEFAULT NULL,
  `Vol_G` float DEFAULT NULL,
  `t0` time DEFAULT NULL,
  `t_F` time DEFAULT NULL,
  `Dif_t0_tF_h` time DEFAULT NULL,
  `Dif_t0_tF_min` int(11) DEFAULT NULL,
  `Vol_Agregado_m3` float DEFAULT NULL,
  `V_total_m3` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `flujos`
--

INSERT INTO `flujos` (`id`, `fecha`, `Niv`, `Dif`, `F_NO_NF`, `Vol_G`, `t0`, `t_F`, `Dif_t0_tF_h`, `Dif_t0_tF_min`, `Vol_Agregado_m3`, `V_total_m3`) VALUES
(1, '2024-02-21', 3.8, 3.8, 0, 68.4, '11:40:00', '14:30:00', '02:50:00', 170, 22.95, 91.35),
(2, '2024-02-27', 3.5, 3.5, 0, 63, '11:20:00', '14:20:00', '03:00:00', 180, 24.3, 87.3),
(3, '2024-02-28', 2.6, 2.6, 0, 46.8, '10:00:00', '12:45:00', '02:45:00', 135, 18.225, 65.025),
(4, '2024-02-29', 3.65, 3.63, 0.02, 65.34, '12:05:00', '14:50:00', '02:45:00', 165, 22.275, 87.615),
(5, '2024-02-21', 3.8, 3.8, 0, 68.4, '11:40:00', '14:30:00', '02:50:00', 170, 22.95, 91.35),
(6, '2024-02-27', 3.5, 3.5, 0, 63, '11:20:00', '14:20:00', '03:00:00', 180, 24.3, 87.3),
(7, '2024-02-28', 2.6, 2.6, 0, 46.8, '10:00:00', '12:45:00', '02:45:00', 135, 18.225, 65.025),
(8, '2024-02-29', 3.65, 3.63, 0.02, 65.34, '12:05:00', '14:50:00', '02:45:00', 165, 22.275, 87.615),
(9, '2024-03-05', 4, 3.5, 0.5, 63, '12:30:00', '14:50:00', '02:20:00', 140, NULL, 63),
(10, '2024-03-06', 2.11, 1.94, 0.17, 34.92, '11:00:00', '12:30:00', '01:30:00', 90, 0, 34.92),
(11, '2024-03-07', 3.95, 3.92, 0.03, 70.56, '12:25:00', '15:00:00', '02:35:00', 155, 20.925, 91.485),
(12, '2024-03-11', 3.75, 3.72, 0.03, 66.96, '12:40:00', '14:50:00', '02:10:00', 130, NULL, 66.96),
(13, '2024-03-14', 3.08, 3.08, 0, 55.44, '10:40:00', '13:05:00', '02:25:00', 145, 19.575, 75.015),
(14, '2024-03-15', 3.05, 3.05, 0, 54.9, '11:45:00', '14:30:00', '02:45:00', 165, 22.275, 77.175),
(15, '2024-03-20', 3.22, 3, 0.22, 54, '12:10:00', '14:12:00', '02:02:00', 122, 16.47, 70.47),
(16, '2024-03-21', 1.72, 1.72, 0, 30.96, '12:37:00', '14:01:00', '01:24:00', 84, 11.34, 42.3),
(17, '2024-04-03', 3.99, 3.31, 0.68, 59.58, '14:22:00', '16:39:00', '02:17:00', 137, 18.495, 78.075),
(18, '2024-04-04', 4.05, 2.53, 1.52, 45.54, '16:20:00', '18:00:00', '01:40:00', 100, 13.5, 59.04),
(19, '2024-04-05', 2.51, 2.51, 0, 45.18, '13:24:00', '15:23:00', '01:59:00', 119, 0, 45.18),
(20, '2024-04-09', 3.4, 1.43, 1.97, 25.74, '11:58:00', '13:07:00', '01:09:00', 69, 9.315, 35.055),
(21, '2024-04-09', 2.94, 2.92, 0.02, 52.56, '14:43:00', '17:35:00', '02:52:00', 172, 0, 52.56),
(22, '2024-04-10', 2.88, 2.43, 0.45, 43.74, '14:19:00', '16:21:00', '02:02:00', 122, 16.47, 60.21),
(23, '2024-04-11', 4.06, 4.06, 0, 73.08, '14:11:00', '17:45:00', '03:34:00', 214, 28.89, 101.97),
(24, '2024-04-15', 1.17, 1.15, 0.02, 20.7, '15:50:00', '16:58:00', '01:08:00', 68, 9.18, 29.88),
(25, '2024-04-17', 3.66, 3.64, 0.02, 65.52, '14:00:00', '17:05:00', '03:05:00', 185, 24.975, 90.495),
(26, '2024-04-18', 3.06, 2.91, 0.15, 52.38, '15:08:00', '17:23:00', '02:15:00', 135, 18.225, 70.605),
(27, '2024-04-22', 4.02, 2.62, 1.4, 47.16, '12:48:00', '14:46:00', '01:58:00', 118, 15.93, 63.09),
(28, '2024-04-24', 4, 3.9, 0.1, 70.2, '10:50:00', '13:35:00', '02:45:00', 165, 22.275, 92.475),
(29, '2024-04-30', 4.01, 3.91, 0.1, 70.38, '12:15:00', '15:16:00', '03:01:00', 181, 24.435, 94.815),
(30, '2024-05-02', 2.66, 1.54, 1.12, 27.72, '14:20:00', '15:25:00', '01:05:00', 65, 8.775, 36.495),
(31, '2024-05-03', 3.85, 1.77, 2.08, 31.86, '12:50:00', '13:50:00', '01:00:00', 60, 8.1, 39.96),
(32, '2024-05-08', 4, 1.09, 2.91, 19.62, '13:34:00', '14:26:00', '00:52:00', 52, 7.02, 26.64),
(33, '2024-05-09', 3.97, 3.9, 0.07, 70.2, '11:45:00', '14:48:00', '03:03:00', 183, 24.705, 94.905),
(34, '2024-05-14', 4.01, 3.14, 0.87, 56.52, '15:26:00', '17:40:00', '02:14:00', 134, 18.09, 74.61),
(35, '2024-05-20', 4, 3.8, 0.2, 68.4, '13:26:00', '16:33:00', '03:07:00', 187, 25.245, 93.645),
(36, '2024-05-22', 4, 3.4, 0.6, 61.2, '13:10:00', '16:13:00', '03:03:00', 183, 24.705, 85.905),
(37, '2024-05-28', 4.06, 4.06, 0, 73.08, '15:10:00', '18:25:00', '03:15:00', 195, 26.325, 99.405),
(38, '2024-05-30', 4.06, 4.06, 0, 73.08, '14:20:00', '18:00:00', '03:40:00', 220, 29.7, 102.78),
(39, '2024-06-04', 4.01, 2.51, 1.5, 45.18, '14:57:00', '16:57:00', '02:00:00', 120, 21.6, 66.78),
(40, '2024-06-06', 4.06, 4.06, 0, 73.08, '15:13:00', '18:36:00', '03:23:00', 203, 36.54, 109.62),
(41, '2024-06-07', 4.06, 4.06, 0, 73.08, '15:27:00', '17:56:00', '02:29:00', 149, 0, 73.08),
(42, '2024-06-11', 3.82, 3.82, 0, 68.76, '14:24:00', '17:44:00', '03:20:00', 200, 36, 104.76),
(43, '2024-06-12', 3.36, 3.36, 0, 60.48, '15:55:00', '17:55:00', '02:00:00', 120, 21.6, 82.08),
(44, '2024-06-13', 2.94, 2.94, 0, 52.92, '14:46:00', '16:37:00', '01:51:00', 111, 19.98, 72.9),
(45, '2024-06-18', 3.96, 3.96, 0, 71.28, '14:05:00', '16:34:00', '02:29:00', 149, 26.82, 98.1),
(46, '2024-06-20', 3.94, 3.85, 0.09, 69.3, '10:30:00', '12:50:00', '02:20:00', 140, 25.2, 94.5),
(47, '2024-06-26', 3.97, 3.92, 0.05, 70.56, '11:30:00', '13:48:00', '02:18:00', 138, 24.84, 95.4),
(48, '2024-08-30', 4, 3.45, 0.55, 62.1, '12:55:00', '14:20:00', '01:25:00', 85, 15.3, 77.4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `fecha` date NOT NULL,
  `correo` text NOT NULL,
  `mensaje` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`id_mensaje`, `nombre`, `fecha`, `correo`, `mensaje`) VALUES
(1, 'Yo', '2025-05-21', 'lshdkjdfd@erwer.com', 'wqewqewqe'),
(2, 'Javs', '2025-05-21', 'sadasd@hsahdgs.com', 'sadasdasdasd'),
(3, 'ererdf', '2025-05-21', 'dfsfdfsd@hsfhf.net', 'dfsdfd'),
(4, 'Yo', '2025-05-31', 'lshdkjdfd@erwer.com', 'uyiyfhgfhf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `id_empleado` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `estudio` text DEFAULT NULL,
  `contacto` text DEFAULT NULL,
  `imagen` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id_empleado`, `nombre`, `estudio`, `contacto`, `imagen`) VALUES
(1, 'Javs', 'Licenciado en uwu', 'bruh', NULL),
(2, 'Max', 'Doctor en espantar viejas', 'maxvalver 333 en todo menos insta', NULL),
(3, 'Ricardo', 'Licenciado en gym', 'Sombras', NULL),
(4, 'hoila', 'a', 'a', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id_proyecto` int(10) UNSIGNED NOT NULL,
  `titulo_proyecto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `autor` varchar(255) NOT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL,
  `archivo_adjunto` varchar(255) DEFAULT NULL,
  `palabras_clave` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id_proyecto`, `titulo_proyecto`, `descripcion`, `fecha_publicacion`, `autor`, `imagen_principal`, `archivo_adjunto`, `palabras_clave`, `estado`) VALUES
(1, 'Prueba', 'Proyecto de prueba', '2025-05-12 06:08:02', 'Yo', 'images/proyectos/prueba.png', 'ptar/files/archivo.pdf', 'Hola', 1),
(3, 'Hola', '34234', '2013-02-21 18:00:00', '3434', '', '', '3243', 1),
(4, 'Proyecto', 'Te quiero uwu', '2025-06-01 00:28:00', 'Yo', NULL, NULL, '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rac`
--

CREATE TABLE `rac` (
  `reg` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `ddq` decimal(10,0) NOT NULL,
  `ph` decimal(10,0) NOT NULL,
  `t` decimal(10,0) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rac`
--

INSERT INTO `rac` (`reg`, `fecha`, `hora`, `ddq`, `ph`, `t`, `id_usuario`) VALUES
(1, '2018-04-02', '13:00:00', 7, 7, 22, 0),
(2, '2018-04-02', '16:50:00', 7, 7, 23, 0),
(3, '2018-04-03', '12:40:00', 8, 8, 23, 0),
(4, '2018-04-03', '17:00:00', 8, 8, 22, 0),
(5, '2018-04-04', '12:30:00', 8, 8, 22, 0),
(6, '2018-04-04', '16:40:00', 188, 8, 22, 0),
(7, '2018-04-05', '13:30:00', 8, 8, 22, 0),
(8, '2018-04-05', '17:00:00', 8, 8, 22, 0),
(9, '2018-04-06', '13:00:00', 7, 7, 22, 0),
(10, '2018-04-06', '16:30:00', 206, 7, 22, 0),
(11, '2018-04-09', '12:20:00', 6, 6, 23, 0),
(12, '2018-04-09', '17:05:00', 170, 7, 22, 0),
(13, '2018-04-10', '13:10:00', 7, 7, 22, 0),
(14, '2018-04-11', '13:00:00', 7, 7, 21, 0),
(15, '2018-04-11', '16:45:00', 180, 7, 22, 0),
(16, '2018-04-12', '13:00:00', 7, 7, 22, 0),
(17, '2018-04-12', '17:00:00', 7, 7, 21, 0),
(18, '2018-04-13', '12:00:00', 7, 7, 21, 0),
(19, '2018-04-13', '17:00:00', 160, 7, 22, 0),
(20, '2018-04-16', '13:00:00', 7, 7, 22, 0),
(21, '2018-04-16', '16:45:00', 293, 7, 22, 0),
(22, '2018-04-17', '13:20:00', 8, 8, 23, 0),
(23, '2018-04-17', '16:45:00', 8, 8, 24, 0),
(24, '2018-04-18', '12:45:00', 8, 8, 24, 0),
(25, '2018-04-18', '17:05:00', 160, 8, 23, 0),
(26, '2018-04-19', '13:05:00', 7, 7, 23, 0),
(27, '2018-04-19', '16:45:00', 7, 7, 23, 0),
(28, '2018-04-20', '16:40:00', 187, 7, 23, 0),
(29, '2018-04-23', '13:10:00', 6, 6, 23, 0),
(30, '2018-04-23', '17:00:00', 217, 7, 23, 0),
(31, '2018-04-24', '13:00:00', 6, 6, 22, 0),
(32, '2018-04-24', '17:00:00', 7, 7, 22, 0),
(33, '2018-04-25', '16:20:00', 161, 7, 22, 0),
(34, '2018-04-26', '13:15:00', 7, 7, 23, 0),
(35, '2018-04-26', '16:50:00', 10, 10, 22, 0),
(36, '2018-04-27', '12:20:00', 10, 10, 22, 0),
(37, '2018-04-27', '16:35:00', 193, 10, 23, 0),
(38, '2018-04-30', '12:20:00', 5, 5, 22, 0),
(39, '2018-04-30', '16:40:00', 304, 6, 22, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rec01`
--

CREATE TABLE `rec01` (
  `reg` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `ssed` decimal(10,0) NOT NULL,
  `od` decimal(10,0) NOT NULL,
  `ph` decimal(10,0) NOT NULL,
  `t` decimal(10,0) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rec01`
--

INSERT INTO `rec01` (`reg`, `fecha`, `hora`, `ssed`, `od`, `ph`, `t`, `id_usuario`) VALUES
(1, '2018-04-02', '13:00:00', 240, 9, 7, 22, 0),
(2, '2018-04-02', '16:50:00', 250, 8, 8, 22, 0),
(3, '2018-04-03', '12:40:00', 250, 8, 8, 22, 0),
(4, '2018-04-03', '17:00:00', 250, 8, 8, 22, 0),
(5, '2018-04-04', '12:30:00', 270, 9, 8, 22, 0),
(6, '2018-04-04', '16:40:00', 260, 8, 8, 22, 0),
(7, '2018-04-05', '13:30:00', 250, 6, 8, 22, 0),
(8, '2018-04-05', '17:00:00', 250, 6, 8, 22, 0),
(9, '2018-04-06', '13:00:00', 250, 5, 7, 22, 0),
(10, '2018-04-06', '16:30:00', 260, 5, 7, 22, 0),
(11, '2018-04-09', '12:20:00', 280, 7, 7, 22, 0),
(12, '2018-04-09', '17:05:00', 260, 10, 7, 22, 0),
(13, '2018-04-10', '13:10:00', 290, 7, 7, 22, 0),
(14, '2018-04-11', '13:00:00', 330, 5, 7, 21, 0),
(15, '2018-04-11', '16:45:00', 270, 5, 7, 21, 0),
(16, '2018-04-12', '13:00:00', 280, 6, 7, 21, 0),
(17, '2018-04-12', '17:00:00', 250, 7, 7, 21, 0),
(18, '2018-04-13', '12:00:00', 280, 7, 7, 21, 0),
(19, '2018-04-13', '17:00:00', 255, 4, 7, 22, 0),
(20, '2018-04-16', '13:00:00', 240, 9, 7, 22, 0),
(21, '2018-04-16', '16:45:00', 260, 8, 8, 22, 0),
(22, '2018-04-17', '13:20:00', 250, 7, 8, 22, 0),
(23, '2018-04-17', '16:45:00', 260, 7, 8, 22, 0),
(24, '2018-04-18', '12:45:00', 240, 7, 8, 22, 0),
(25, '2018-04-18', '17:05:00', 250, 6, 7, 23, 0),
(26, '2018-04-19', '13:05:00', 250, 5, 7, 22, 0),
(27, '2018-04-19', '16:45:00', 240, 4, 7, 22, 0),
(28, '2018-04-20', '16:40:00', 250, 5, 7, 22, 0),
(29, '2018-04-23', '13:10:00', 250, 11, 6, 23, 0),
(30, '2018-04-23', '17:00:00', 250, 10, 7, 22, 0),
(31, '2018-04-24', '13:00:00', 280, 6, 7, 23, 0),
(32, '2018-04-24', '17:00:00', 260, 4, 7, 23, 0),
(33, '2018-04-25', '16:20:00', 255, 3, 7, 22, 0),
(34, '2018-04-26', '13:15:00', 280, 3, 7, 22, 0),
(35, '2018-04-26', '16:50:00', 260, 3, 7, 22, 0),
(36, '2018-04-27', '12:20:00', 255, 4, 7, 23, 0),
(37, '2018-04-27', '16:35:00', 250, 5, 6, 23, 0),
(38, '2018-04-30', '12:20:00', 240, 11, 5, 22, 0),
(39, '2018-04-30', '16:40:00', 220, 6, 6, 22, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_operacion`
--

CREATE TABLE `registro_operacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_termino` time DEFAULT NULL,
  `id_zona` int(10) UNSIGNED NOT NULL,
  `bomba_presion_bcm_01a` text DEFAULT NULL,
  `bomba_presion_bcm_01b` text DEFAULT NULL,
  `bomba_presion_bcm_01r` text DEFAULT NULL,
  `nivel_tac_01_inicio` decimal(5,5) DEFAULT NULL,
  `nivel_tac_01_termino` decimal(5,5) DEFAULT NULL,
  `volumen_usado` float(10,5) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_responsable` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_operacion`
--

INSERT INTO `registro_operacion` (`id`, `fecha`, `hora_inicio`, `hora_termino`, `id_zona`, `bomba_presion_bcm_01a`, `bomba_presion_bcm_01b`, `bomba_presion_bcm_01r`, `nivel_tac_01_inicio`, `nivel_tac_01_termino`, `volumen_usado`, `observaciones`, `id_responsable`) VALUES
(1, '2024-02-21', '11:40:00', '14:30:00', 1, '2.5-3.0', '2.5-3.0', '', 0.99999, 0.99999, 91.35000, '2 aspersores', 4),
(2, '2024-02-27', '11:20:00', '14:20:00', 1, '3 y 5.5', '3 y 5.5', NULL, 0.99999, 0.99999, 87.30000, 'Se inició con 2 y a las 13:00 solo 1', 4),
(3, '2024-02-28', '10:00:00', '12:45:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 65.02500, '1 aspersor', 4),
(4, '2024-02-29', '12:05:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 87.61500, '1 aspersor', 4),
(5, '2024-02-21', '11:40:00', '14:30:00', 1, '2.5-3.0', '2.5-3.0', NULL, 0.99999, 0.99999, 91.35000, '2 aspersores', 4),
(6, '2024-02-27', '11:20:00', '14:20:00', 1, '3 y 5.5', '3 y 5.5', NULL, 0.99999, 0.99999, 87.30000, 'Se inició con 2 y a las 13:00 solo 1', 4),
(7, '2024-02-28', '10:00:00', '12:45:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 65.02500, '1 aspersor', 4),
(8, '2024-02-29', '12:05:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 87.61500, '1 aspersor', 4),
(17, '2024-02-21', '11:40:00', '14:30:00', 1, '2.5-3.0', '2.5-3.0', NULL, 0.99999, 0.99999, 91.35000, '2 aspersores', 4),
(18, '2024-02-27', '11:20:00', '14:20:00', 1, '3 y 5.5', '3 y 5.5', NULL, 0.99999, 0.99999, 87.30000, 'Se inició con 2 y a las 13:00 solo 1', 4),
(19, '2024-02-28', '10:00:00', '12:45:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 65.02500, '1 aspersor', 4),
(20, '2024-02-29', '12:05:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 87.61500, '1 aspersor', 4),
(21, '2024-03-05', '12:30:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 63.00000, 'Sin Alim por mtto de sitios', 4),
(22, '2024-03-06', '11:00:00', '12:30:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 34.92000, 'Alimentación Continua', 4),
(23, '2024-03-07', '12:25:00', '15:00:00', 2, '4.5', '4.5', NULL, 0.99999, 0.99999, 91.48500, 'Alimentación Continua', 4),
(24, '2024-03-11', '12:40:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 66.96000, 'Sin Alim por mtto de sitios', 4),
(25, '2024-03-14', '10:40:00', '13:05:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 75.01500, 'Alimentación Continua', 4),
(26, '2024-03-15', '11:45:00', '14:30:00', 2, '4', '4', NULL, 0.99999, 0.99999, 77.17500, 'Alimentación Continua', 4),
(27, '2024-03-20', '12:10:00', '14:12:00', 2, '2.5', '2.5', NULL, 0.99999, 0.99999, 70.47000, 'Alimentación Continua', 4),
(28, '2024-03-21', '12:37:00', '14:01:00', 2, '3', '3', NULL, 0.99999, 0.99999, 42.30000, NULL, 4),
(29, '2024-04-03', '14:22:00', '16:39:00', 1, '4.2', '4.2', NULL, 0.99999, 0.99999, 78.07500, 'Alimentacion continua', 4),
(30, '2024-04-04', '16:22:00', '18:00:00', 1, '4', '4', NULL, 0.99999, 0.99999, 59.04000, NULL, 5),
(31, '2024-04-05', '13:24:00', '15:23:00', 2, '4', '4', NULL, 0.99999, 0.99999, 45.18000, 'Sin Alimentación', 5),
(32, '2024-04-09', '11:58:00', '13:07:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 35.05500, 'Alimentacion continua', 4),
(33, '2024-04-09', '14:43:00', '17:35:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 52.56000, 'Alimentacion continua', 4),
(34, '2024-04-10', '14:19:00', '16:21:00', 1, '4/4', '4/4', NULL, 0.99999, 0.99999, 60.21000, 'Alimentacion continua', 5),
(35, '2024-04-11', '14:11:00', '17:45:00', 1, '4.5/5.5', '4.5/5.5', NULL, 0.99999, 0.00000, 101.97000, 'Alimentacion continua', 5),
(36, '2024-04-15', '14:50:00', '16:58:00', 1, '4.5', '4.5', NULL, 0.99999, 0.00000, 29.88000, NULL, 5),
(37, '2024-04-17', '14:00:00', '17:05:00', 2, '5.5/2', '5.5/2', NULL, 0.99999, 0.02000, 90.49500, 'Alimentacion continua', 5),
(38, '2024-04-18', '15:08:00', '17:23:00', 2, '05-feb', '05-feb', NULL, 0.99999, 0.15000, 70.60500, 'Alimentacion continua', 4),
(39, '2024-04-22', '12:48:00', '14:46:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 63.09000, 'Alimentacion continua', 4),
(40, '2024-04-24', '10:50:00', '13:35:00', 1, '5', '5', NULL, 0.99999, 0.10000, 92.47500, 'Alimentacion continua', 4),
(41, '2024-04-30', '12:15:00', '15:16:00', 1, '5', '5', NULL, 0.99999, 0.10000, 94.81500, 'Alimentacion continua', 4),
(51, '2024-02-21', '11:40:00', '14:30:00', 1, '2.5-3.0', '2.5-3.0', NULL, 0.99999, 0.99999, 91.35000, '2 aspersores', 4),
(52, '2024-02-27', '11:20:00', '14:20:00', 1, '3 y 5.5', '3 y 5.5', NULL, 0.99999, 0.99999, 87.30000, 'Se inició con 2 y a las 13:00 solo 1', 4),
(53, '2024-02-28', '10:00:00', '12:45:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 65.02500, '1 aspersor', 4),
(54, '2024-02-29', '12:05:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 87.61500, '1 aspersor', 4),
(55, '2024-03-05', '12:30:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 63.00000, 'Sin Alim por mtto de sitios', 4),
(56, '2024-03-06', '11:00:00', '12:30:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 34.92000, 'Alimentación Continua', 4),
(57, '2024-03-07', '12:25:00', '15:00:00', 2, '4.5', '4.5', NULL, 0.99999, 0.99999, 91.48500, 'Alimentación Continua', 4),
(58, '2024-03-11', '12:40:00', '14:50:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 66.96000, 'Sin Alim por mtto de sitios', 4),
(59, '2024-03-14', '10:40:00', '13:05:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 75.01500, 'Alimentación Continua', 4),
(60, '2024-03-15', '11:45:00', '14:30:00', 2, '4', '4', NULL, 0.99999, 0.99999, 77.17500, 'Alimentación Continua', 4),
(61, '2024-03-20', '12:10:00', '14:12:00', 2, '2.5', '2.5', NULL, 0.99999, 0.99999, 70.47000, 'Alimentación Continua', 4),
(62, '2024-03-21', '12:37:00', '14:01:00', 2, '3', '3', NULL, 0.99999, 0.99999, 42.30000, NULL, 4),
(63, '2024-04-03', '14:22:00', '16:39:00', 1, '4.2', '4.2', NULL, 0.99999, 0.99999, 78.07500, 'Alimentacion continua', 4),
(64, '2024-04-04', '16:22:00', '18:00:00', 1, '4', '4', NULL, 0.99999, 0.99999, 59.04000, NULL, 5),
(65, '2024-04-05', '13:24:00', '15:23:00', 2, '4', '4', NULL, 0.99999, 0.99999, 45.18000, 'Sin Alimentación', 5),
(66, '2024-04-09', '11:58:00', '13:07:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 35.05500, 'Alimentacion continua', 4),
(67, '2024-04-09', '14:43:00', '17:35:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 52.56000, 'Alimentacion continua', 4),
(68, '2024-04-10', '14:19:00', '16:21:00', 1, '4/4', '4/4', NULL, 0.99999, 0.99999, 60.21000, 'Alimentacion continua', 5),
(69, '2024-04-11', '14:11:00', '17:45:00', 1, '4.5/5.5', '4.5/5.5', NULL, 0.99999, 0.00000, 101.97000, 'Alimentacion continua', 5),
(70, '2024-04-15', '14:50:00', '16:58:00', 1, '4.5', '4.5', NULL, 0.99999, 0.00000, 29.88000, NULL, 5),
(71, '2024-04-17', '14:00:00', '17:05:00', 2, '5.5/2', '5.5/2', NULL, 0.99999, 0.02000, 90.49500, 'Alimentacion continua', 5),
(72, '2024-04-18', '15:08:00', '17:23:00', 2, '', '', NULL, 0.99999, 0.15000, 70.60500, 'Alimentacion continua', 4),
(73, '2024-04-22', '12:48:00', '14:46:00', 1, '5.5', '5.5', NULL, 0.99999, 0.99999, 63.09000, 'Alimentacion continua', 4),
(74, '2024-04-24', '10:50:00', '13:35:00', 1, '5', '5', NULL, 0.99999, 0.10000, 92.47500, 'Alimentacion continua', 4),
(75, '2024-04-30', '12:15:00', '15:16:00', 1, '5', '5', NULL, 0.99999, 0.10000, 94.81500, 'Alimentacion continua', 4),
(76, '2024-05-02', '14:20:00', '15:25:00', 2, '5', '5', NULL, 0.99999, 0.99999, 36.49500, 'Alimentacion continua', 5),
(77, '2024-05-03', '12:50:00', '13:50:00', 1, '5', '5', NULL, 0.99999, 0.99999, 39.96000, 'Alimentacion continua', 4),
(78, '2024-05-08', '13:34:00', '14:26:00', 1, '5', '5', NULL, 0.99999, 0.99999, 26.64000, 'Alimentacion continua', 4),
(79, '2024-05-09', '11:45:00', '14:48:00', 1, '5', '5', NULL, 0.99999, 0.07000, 94.90500, 'Alimentacion continua', 4),
(80, '2024-05-14', '15:26:00', '17:40:00', 1, '5', '5', NULL, 0.99999, 0.87000, 74.61000, 'Alimentacion continua', 5),
(81, '2024-05-20', '13:26:00', '16:33:00', 1, '4.5', '4.5', NULL, 0.99999, 0.20000, 93.64500, 'Alimentacion continua', 4),
(82, '2024-05-22', '13:10:00', '16:13:00', 1, '4.5', '4.5', NULL, 0.99999, 0.60000, 85.90500, 'Alimentacion continua', 4),
(83, '2024-05-28', '15:10:00', '18:25:00', 1, '5', '5', NULL, 0.99999, 0.00000, 99.40500, 'Alimentacion continua', 5),
(84, '2024-05-30', '14:20:00', '18:00:00', 1, '5', '5', NULL, 0.99999, 0.00000, 102.78000, 'Alimentacion continua', 5),
(85, '2024-06-04', '14:57:00', '16:57:00', 1, '5', '5', NULL, 0.99999, 0.99999, 66.78000, 'Alim Continua', 4),
(86, '2024-06-06', '15:13:00', '18:36:00', 1, '5', '5', NULL, 0.99999, 0.00000, 109.62000, 'Alim Continua', 4),
(87, '2024-06-07', '15:27:00', '17:56:00', 2, '5', '5', NULL, 0.99999, 0.00000, 73.08000, 'Alim Continua', 4),
(88, '2024-06-11', '14:24:00', '17:44:00', 1, '5.5', '5.5', NULL, 0.99999, 0.00000, 104.76000, 'Alim Continua', 5),
(89, '2024-06-12', '15:55:00', '17:55:00', 1, '5.5', '5.5', NULL, 0.99999, 0.00000, 82.08000, 'Alim Continua', 4),
(90, '2024-06-13', '14:46:00', '16:37:00', 1, '5.5', '5.5', NULL, 0.99999, 0.00000, 72.90000, 'Alim Continua', 5),
(91, '2024-06-18', '14:05:00', '16:34:00', 1, '5', '5', NULL, 0.99999, 0.00000, 98.10000, 'Alim Continua', 4),
(92, '2024-06-20', '10:30:00', '12:50:00', 2, '4.5', '4.5', NULL, 0.99999, 0.09000, 94.50000, 'Alim Continua', 5),
(93, '2024-06-26', '11:30:00', '13:48:00', 2, '4.5-5', '4.5-5', NULL, 0.99999, 0.05000, 95.40000, 'Alim Continua', 5),
(94, '2024-09-30', '11:10:00', '12:40:00', 1, '4.5', '4.5', '4.5', 0.99999, 0.55000, 77.40000, 'Riego con 3 bombas', 4),
(95, '2024-10-15', '12:50:00', '14:40:00', 1, '4.5', '4.5', NULL, 0.99999, 0.20000, 56.43000, NULL, 4),
(96, '2024-10-16', '17:00:00', '19:00:00', 1, '4.50', '4.50', NULL, 0.99999, 0.99999, 26.64000, NULL, 4),
(97, '2024-10-21', '13:10:00', '15:43:00', 1, '4.5', '4.5', NULL, 0.99999, 0.88000, 76.09500, NULL, 4),
(98, '2024-10-25', '12:25:00', '15:00:00', 1, '4.5', '4.5', NULL, 0.99999, 0.81000, 77.62500, NULL, 4),
(99, '2024-10-28', '14:11:00', '16:33:00', 1, '4.5', '4.5', NULL, 0.99999, 0.10000, 55.35000, NULL, 4),
(100, '2024-10-29', '16:54:00', '19:00:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 50.13000, NULL, 4),
(101, '2024-10-30', '16:52:00', '19:00:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 63.00000, NULL, 4),
(102, '2024-10-31', '17:11:00', '19:00:00', 1, '4.5', '4.5', NULL, 0.99999, 0.57000, 57.24000, NULL, 4),
(103, '2024-11-04', '17:02:00', '17:59:00', 1, '4.5', '4.5', NULL, 0.99999, 0.22000, 25.33500, NULL, 4),
(104, '2024-11-05', '12:45:00', '14:00:00', 1, '4.50', '4.50', NULL, 0.99999, 0.99999, 36.94500, NULL, 4),
(105, '2024-11-06', '16:46:00', '18:30:00', 1, '4.5', '4.5', NULL, 0.99999, 0.99999, 54.36000, NULL, 4),
(106, '2024-11-14', '14:00:00', '14:50:00', 1, '4.5', '4.5', NULL, 0.99999, 0.30000, 24.03000, NULL, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_riegos`
--

CREATE TABLE `registro_riegos` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `nivel_al_cambio` float DEFAULT NULL,
  `t0` time DEFAULT NULL,
  `t1` time DEFAULT NULL,
  `t_regado` time DEFAULT NULL,
  `t_min` int(11) DEFAULT NULL,
  `V_Agreg` float DEFAULT NULL,
  `V_gastado` float DEFAULT NULL,
  `V_total` float DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_riegos`
--

INSERT INTO `registro_riegos` (`id`, `fecha`, `nivel_al_cambio`, `t0`, `t1`, `t_regado`, `t_min`, `V_Agreg`, `V_gastado`, `V_total`, `descripcion`) VALUES
(1, '2024-01-01', 2.44, '00:00:00', '11:50:00', '00:07:10', 11, -43.92, 95.85, 51.93, NULL),
(2, '2024-01-01', 1.18, '00:00:00', '11:49:00', '00:07:09', 11, -21.24, 95.715, 74.475, NULL),
(3, '2024-02-01', 2.44, '00:00:00', '11:50:00', '00:07:10', 11, -43.92, 95.85, 51.93, NULL),
(4, '2024-02-01', 1.18, '00:00:00', '11:49:00', '00:07:09', 11, -21.24, 95.715, 74.475, NULL),
(5, '2024-03-01', 2.44, '11:45:00', '11:50:00', '00:00:05', 0, 10.98, 0.675, 11.655, NULL),
(6, '2024-03-01', 1.18, '12:10:00', '11:49:00', '00:14:19', NULL, 36.72, 191.565, 228.29, NULL),
(7, '2024-05-01', 2.44, '14:19:00', '11:50:00', '00:00:00', NULL, 7.92, 174.285, 182.21, NULL),
(8, '2024-05-01', 1.18, '14:11:00', '11:49:00', '00:00:00', NULL, 51.84, 175.23, 227.07, NULL),
(9, '2024-05-01', 2.44, '13:26:00', '11:50:00', '00:13:44', NULL, 28.08, 181.44, 209.52, NULL),
(10, '2024-05-01', 1.18, '13:10:00', '11:49:00', '00:13:59', NULL, 50.76, 183.465, 234.23, NULL),
(11, '2024-10-01', 2.2, '13:10:00', '15:00:00', '00:01:10', 1, 31.68, 14.85, 46.53, NULL),
(12, '2024-11-01', 2.01, '17:02:00', '13:00:00', '00:00:00', NULL, -14.58, 161.73, 147.15, NULL),
(13, '2025-11-01', 2.02, '00:00:00', '13:25:00', '00:08:05', 13, -36.36, 108.675, 72.315, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tec01`
--

CREATE TABLE `tec01` (
  `reg` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `nivel` decimal(10,0) NOT NULL,
  `ph` decimal(10,0) NOT NULL,
  `dqo` decimal(10,0) NOT NULL,
  `t` decimal(10,0) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tec01`
--

INSERT INTO `tec01` (`reg`, `fecha`, `hora`, `nivel`, `ph`, `dqo`, `t`, `id_usuario`) VALUES
(1, '2018-04-02', '13:00:00', 3, 8, 121, 21, 0),
(2, '2018-04-02', '16:50:00', 3, 8, 322, 22, 0),
(3, '2018-04-03', '12:40:00', 3, 9, 222, 22, 0),
(4, '2018-04-03', '17:00:00', 3, 9, 222, 22, 0),
(5, '2018-04-04', '12:30:00', 3, 9, 222, 22, 0),
(6, '2018-04-04', '16:40:00', 3, 9, 117, 22, 0),
(7, '2018-04-05', '13:30:00', 3, 9, 222, 22, 0),
(8, '2018-04-05', '17:00:00', 3, 9, 222, 22, 0),
(9, '2018-04-06', '13:00:00', 3, 9, 222, 22, 0),
(10, '2018-04-06', '16:30:00', 3, 8, 599, 21, 0),
(11, '2018-04-09', '12:20:00', 3, 9, 222, 22, 0),
(12, '2018-04-09', '17:05:00', 3, 9, 415, 23, 0),
(13, '2018-04-10', '13:10:00', 3, 9, 222, 22, 0),
(14, '2018-04-11', '13:00:00', 3, 9, 199, 19, 0),
(15, '2018-04-11', '16:45:00', 3, 9, 257, 21, 0),
(16, '2018-04-12', '13:00:00', 3, 9, 221, 21, 0),
(17, '2018-04-12', '17:00:00', 3, 9, 221, 21, 0),
(18, '2018-04-13', '12:00:00', 3, 9, 221, 21, 0),
(19, '2018-04-13', '17:00:00', 3, 9, 573, 22, 0),
(20, '2018-04-16', '13:00:00', 3, 9, 222, 22, 0),
(21, '2018-04-16', '16:45:00', 3, 9, 454, 22, 0),
(22, '2018-04-17', '13:20:00', 3, 9, 222, 22, 0),
(23, '2018-04-17', '16:45:00', 3, 9, 222, 22, 0),
(24, '2018-04-18', '12:45:00', 3, 9, 222, 22, 0),
(25, '2018-04-18', '17:05:00', 3, 9, 683, 23, 0),
(26, '2018-04-19', '13:05:00', 3, 9, 223, 23, 0),
(27, '2018-04-19', '16:45:00', 3, 9, 223, 23, 0),
(28, '2018-04-20', '16:40:00', 3, 9, 381, 23, 0),
(29, '2018-04-23', '13:10:00', 3, 9, 223, 23, 0),
(30, '2018-04-23', '17:00:00', 3, 9, 289, 22, 0),
(31, '2018-04-24', '13:00:00', 3, 9, 223, 23, 0),
(32, '2018-04-24', '17:00:00', 3, 9, 223, 23, 0),
(33, '2018-04-25', '16:20:00', 3, 9, 575, 22, 0),
(34, '2018-04-26', '13:15:00', 3, 9, 222, 22, 0),
(35, '2018-04-26', '16:50:00', 3, 9, 221, 21, 0),
(36, '2018-04-27', '12:20:00', 3, 9, 222, 22, 0),
(37, '2018-04-27', '16:35:00', 3, 9, 610, 23, 0),
(38, '2018-04-30', '12:20:00', 3, 8, 222, 22, 0),
(39, '2018-04-30', '16:40:00', 3, 9, 591, 22, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(127) NOT NULL,
  `rol` varchar(63) NOT NULL DEFAULT 'lector',
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `contrasena`, `email`, `rol`, `estado`) VALUES
(0, 'No hay responsable', '12345', '', 'lector', 1),
(3, 'tesista', '', 'alo@gmail.com', 'lector', 1),
(4, 'residente profesional', 'ptar123', '', 'moderador', 1),
(5, 'práctica profesional', 'ptar123', '', 'moderador', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona_riego`
--

CREATE TABLE `zona_riego` (
  `id_zona` int(10) UNSIGNED NOT NULL,
  `nombre_zona` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zona_riego`
--

INSERT INTO `zona_riego` (`id_zona`, `nombre_zona`) VALUES
(1, 'Estadio'),
(2, 'Prácticas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `csc`
--
ALTER TABLE `csc`
  ADD PRIMARY KEY (`reg`);

--
-- Indices de la tabla `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indices de la tabla `flujos`
--
ALTER TABLE `flujos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id_mensaje`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`id_empleado`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id_proyecto`);

--
-- Indices de la tabla `rac`
--
ALTER TABLE `rac`
  ADD PRIMARY KEY (`reg`);

--
-- Indices de la tabla `rec01`
--
ALTER TABLE `rec01`
  ADD PRIMARY KEY (`reg`);

--
-- Indices de la tabla `registro_operacion`
--
ALTER TABLE `registro_operacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_zona_registro` (`id_zona`),
  ADD KEY `fk_responsable_registro` (`id_responsable`);

--
-- Indices de la tabla `registro_riegos`
--
ALTER TABLE `registro_riegos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tec01`
--
ALTER TABLE `tec01`
  ADD PRIMARY KEY (`reg`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `zona_riego`
--
ALTER TABLE `zona_riego`
  ADD PRIMARY KEY (`id_zona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `csc`
--
ALTER TABLE `csc`
  MODIFY `reg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `faq`
--
ALTER TABLE `faq`
  MODIFY `id_pregunta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `flujos`
--
ALTER TABLE `flujos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id_proyecto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `rac`
--
ALTER TABLE `rac`
  MODIFY `reg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `rec01`
--
ALTER TABLE `rec01`
  MODIFY `reg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `registro_operacion`
--
ALTER TABLE `registro_operacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT de la tabla `registro_riegos`
--
ALTER TABLE `registro_riegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tec01`
--
ALTER TABLE `tec01`
  MODIFY `reg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `zona_riego`
--
ALTER TABLE `zona_riego`
  MODIFY `id_zona` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
