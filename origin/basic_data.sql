-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: mysql3107.db.sakura.ne.jp
-- 生成日時: 2026 年 1 月 26 日 22:38
-- サーバのバージョン： 8.0.40
-- PHP のバージョン: 8.2.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `hnimgr_chitonitose`
--

-- --------------------------------------------------------

--
-- ビュー用の構造 `basic_data`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`hnimgr`@`%` SQL SECURITY DEFINER VIEW `basic_data`  AS SELECT `info`.`cd` AS `cd`, `info`.`short_name` AS `short_name`, `info`.`capital` AS `capital`, `info`.`suzerain_state` AS `suzerain_state`, `info`.`official_lang` AS `official_lang`, `info`.`religion` AS `religion`, `area`.`area` AS `area`, `area`.`data_year` AS `area_year`, `popu`.`population` AS `population`, `popu`.`data_year` AS `popu_year`, round((`popu`.`population` / `area`.`area`),1) AS `density`, `gni`.`dollar` AS `dollar`, `gni`.`data_year` AS `gni_year` FROM (((`nation_info` `info` join `nation_area` `area` on(((`info`.`cd` = `area`.`nation_cd`) and (`area`.`data_year` = (select max(`nation_area`.`data_year`) from `nation_area`))))) join `nation_population` `popu` on(((`info`.`cd` = `popu`.`nation_cd`) and (`popu`.`data_year` = (select max(`nation_population`.`data_year`) from `nation_population`))))) join `per_unit_of_gdp` `gni` on(((`info`.`cd` = `gni`.`nation_cd`) and (`gni`.`data_year` = (select max(`per_unit_of_gdp`.`data_year`) from `per_unit_of_gdp`))))) ;

--
-- VIEW `basic_data`
-- データ: なし
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
