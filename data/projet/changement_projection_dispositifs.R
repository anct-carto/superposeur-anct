#Telecharger les librairie
library(sf)
library(rgdal)
library(tidyverse)
library(readxl)
library(writexl)
library(RSQLite)
library(here)


geom_com <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/centroide-fr-drom-3395-gen.gpkg",
                                    layer = "com")

#LIRE LES DONNEES -------------------------------------------------------------

#ACV
acv_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville/liste-acv-com2023-20230802.csv", fileEncoding ="utf-8" )

#ACV2
#METTRE AU COG23
#acv2_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville-2/liste-acv2-com2023-20230922.csv")

#PVD
pvd_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/petites-villes-de-demain/liste-pvd-com2023-20231005.csv")


#TI
ti_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/territoires-industrie/liste-ti-20230802.csv")

#France service
fs_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/france_services/liste-fs-20230816.csv")

#Avenir montagne mobilité
amm_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-20230810.csv")

#Avenir montagne ingénierie
ami_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-20230830.csv")

#Cité educatives
cite_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-20230817.csv")

#Cité de l'emploi
#A METTRE AU COG23
#cde_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-emploi/liste-cde-20220916.csv")

#CRTE
#A FAIRE PLUS TARD

#FABRIQUE PROSPECTIVES
fabp_init <- st_read("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-20231005.csv")


#TRANSFORMER LES DONNEES -------------------------------------------------------

#ACV
acv <- acv_init%>%
  left_join(geom_com, by="insee_com")%>%
  st_as_sf()
acv_4326<- st_transform(acv, crs=4326)


#A COMPLETER

#EXPORTER LES DONNEES ----------------------------------------------------------

#ACV
st_write(obj = acv_4326,
         dsn = here("geom/geojson/acv_4326.geojson"),
         driver = "GeoJSON", delete_layer = T, append = F)


#A COMPLETER








