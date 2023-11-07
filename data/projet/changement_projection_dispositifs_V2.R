#Telecharger les librairie
library(sf)
library(rgdal)
library(tidyverse)
library(readxl)
library(writexl)
library(RSQLite)
library(here)


geom_com_ctr <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/centroide-fr-drom-3395-gen.gpkg",
                                    layer = "com")

geom_com_polygon <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/fr-drom-3395-gen.gpkg",
                                    layer = "com")

#LIRE LES DONNEES -------------------------------------------------------------

#ACV
acv_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville/liste-acv-com2023-20230802.csv", fileEncoding ="utf-8" )

#ACV2
acv2_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville-2/liste-acv2-com2023-20230922.csv", fileEncoding ="utf-8" )

#PVD
pvd_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/petites-villes-de-demain/liste-pvd-com2023-20231005.csv", fileEncoding ="utf-8")


#TI
ti_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/territoires-industrie/liste-ti-com2023-20230802.csv", fileEncoding ="utf-8")

#France service
fs_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/france_services/liste-fs-com2023-20230816.csv", fileEncoding ="utf-8")


#Cité educatives
cite_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-com2023-20230817.csv", fileEncoding ="utf-8")

#FABRIQUE PROSPECTIVES
fabp_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-com2023-20231005.csv", fileEncoding ="utf-8")
fabp_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-20231005.csv", fileEncoding ="utf-8")



#Avenir montagne mobilité
amm_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-com2023-20230810.csv", fileEncoding ="utf-8")
amm_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-20230810.csv", fileEncoding ="utf-8")

#Avenir montagne ingénierie
ami_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-com2023-20230830.csv", fileEncoding ="utf-8")
ami_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-20230830.csv", fileEncoding ="utf-8")

#CRTE
crte_init<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/contrats-de-relance-et-de-transition-ecologique/liste-crte-com2023-20230823.csv", fileEncoding ="utf-8")
crte_init_list<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/contrats-de-relance-et-de-transition-ecologique/liste-crte-20230823.csv", fileEncoding ="utf-8")


#Cité de l'emploi
#A METTRE AU COG23
#cde_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-emploi/liste-cde-20220916.csv", fileEncoding ="utf-8")


#Fabriques prospectives
fabriques_pros_init<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-com2023-20231005.csv", fileEncoding ="utf-8")


#Cité étuducatives

#Territoires d'industrie Vague 2 
ti_init<-read_excel("N:/DST/Carto/APPROCHE SECTORIELLE/INDUSTRIE/TERRITOIRES_INDUSTRIES/SUIVI_PERIMETRE/V10/DATA_INIT/suivi-ti-cog2023-20231102-modif.xlsx")



#TRANSFORMER LES DONNEES - creation d'une fonction-------------------------------------------------------
ma_fonction<- function(data_init, type){
  fichier_init <- deparse(substitute(data_init))
  if (type == "ctr") {
    geom_com <- geom_com_ctr
  } else if (type == "polygon") {
    geom_com <- geom_com_polygon
  } else {
    stop("Le paramètre 'type' doit être soit 'ctr' ou 'polygon'")
  }
  fichier<- data_init%>%
    left_join(geom_com, by ="insee_com") %>%
    st_as_sf()
  fichier_4326<- st_transform(fichier, crs= 4326)
  return(fichier_4326)
}


#LANCEMENT FONCTION ET EXPORT DES DONNEES-------------------------------------------------------
acv_geom<-ma_fonction(acv_init, type="ctr")
st_write(obj = acv_geom,
         dsn = here(paste0("geom/geojson/acv_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

acv2_geom<-ma_fonction(acv2_init, type="ctr")
st_write(obj = acv2_geom,
         dsn = here(paste0("geom/geojson/acv2_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

pvd_geom<-ma_fonction(pvd_init, type="ctr")
st_write(obj = pvd_geom,
         dsn = here(paste0("geom/geojson/pvd_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

fs_geom<-ma_fonction(fs_init, type="ctr")
st_write(obj = fs_geom,
         dsn = here(paste0("geom/geojson/fs_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)



ti_geom<-ma_fonction(ti_init, type="polygon")%>%
  group_by(id_ti, lib_ti) %>% 
  summarise()
st_write(obj = ti_geom,
         dsn = here(paste0("geom/geojson/ti_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


amm_geom<-ma_fonction(amm_init, type="polygon")%>% 
  separate_rows(id_amm, sep = " ; ") %>%
  group_by(id_amm) %>% 
  summarise()
amm_geom <- left_join(amm_geom, amm_init_list, by = "id_amm")
st_write(obj = amm_geom,
         dsn = here(paste0("geom/geojson/amm_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


ami_geom<-ma_fonction(ami_init, type="polygon")%>% 
  separate_rows(id_ami, sep = " ; ") %>%
  group_by(id_ami) %>% 
  summarise()
ami_geom <- left_join(ami_geom, ami_init_list, by = "id_ami")
st_write(obj = ami_geom,
         dsn = here(paste0("geom/geojson/ami_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


crte_geom<-ma_fonction(crte_init, type="polygon")%>% 
  separate_rows(id_crte, sep = " ; ") %>%
  group_by(id_crte) %>% 
  summarise()
crte_geom <- left_join(crte_geom, crte_init_list, by = "id_crte")
st_write(obj = crte_geom,
         dsn = here(paste0("geom/geojson/crte_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


fabriques_pros_geom<-ma_fonction(fabriques_pros_init, type="polygon")%>% 
  separate_rows(id_fabp, sep = " ; ") %>%
  group_by(id_fabp) %>% 
  summarise()
fabriques_pros_geom <- left_join(fabriques_pros_geom, fabriques_pros_init, by = "id_fabp")
st_write(obj = fabriques_pros_geom,
         dsn = here(paste0("geom/geojson/fabp_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

# ti_geom<-ma_fonction(ti_init, type="ctr")
# st_write(obj = ti_geom,
#          dsn = here(paste0("geom/geojson/ti_geom.geojson")),
#          driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


#A COMPLETER








