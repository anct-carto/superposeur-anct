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

# geom_epci_polygon <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/fr-drom-3395-gen.gpkg",
#                             layer = "epci")




#LIRE LES DONNEES -------------------------------------------------------------

#Villages d'avenir
va_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/villages-davenir/liste-va-com2024-20240905.csv", fileEncoding ="utf-8")


#ACV
acv_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville/liste-acv-com2024-20240905.csv", fileEncoding ="utf-8" )

#ACV2
acv2_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/action-coeur-de-ville-2/liste-acv2-com2023-20230922.csv", fileEncoding ="utf-8" )

#PVD
pvd_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/petites-villes-de-demain/liste-pvd-com2023-20240807.csv", fileEncoding ="utf-8")


#TI
ti_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/territoires-industrie/liste-ti-com2023-20240704.csv", fileEncoding ="utf-8")
ti_groupement <-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/territoires-industrie/liste-ti-grpt2023-20240704.csv", fileEncoding ="utf-8")
ti_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/territoires-industrie/liste-ti-20240704.csv", fileEncoding ="utf-8")


#France service
fs_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/france_services/liste-fs-20240910.csv", fileEncoding ="utf-8")
fs_com_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/france_services/liste-fs-com2024-20240910.csv", fileEncoding ="utf-8")



#Cité educatives
cite_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-com2023-20230817.csv", fileEncoding ="utf-8")



#FABRIQUE PROSPECTIVES
fabp_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-com2024-20240909.csv", fileEncoding ="utf-8", colClasses = c("insee_com"="character"))
glimpse(fabp_init)

fabp_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-20240909.csv", fileEncoding ="utf-8")
fabp_groupement <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/fabriques-prospectives/liste-fabp-grpt2024-20240909.csv", fileEncoding ="utf-8")


#Avenir montagne mobilité
amm_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-com2023-20230810.csv", fileEncoding ="utf-8")
amm_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-20230810.csv", fileEncoding ="utf-8")
amm_groupement <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-mobilites/liste-amm-grpt2023-20230810.csv", fileEncoding ="utf-8")

#Avenir montagne ingénierie
ami_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-com2023-20230830.csv", fileEncoding ="utf-8", sep=" , ")
ami_init_list <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-20230830.csv", fileEncoding ="utf-8", sep=",")
ami_groupement <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/avenir-montagnes-ingenierie/liste-ami-grpt2023-20230830.csv", fileEncoding ="utf-8", sep=",")


#CRTE
crte_init<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/contrats-de-relance-et-de-transition-ecologique/liste-crte-com2023-20230823.csv", fileEncoding ="utf-8")
crte_init_list<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/contrats-de-relance-et-de-transition-ecologique/liste-crte-20230823.csv", fileEncoding ="utf-8")
crte_groupement<-read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/contrats-de-relance-et-de-transition-ecologique/liste-crte-grpt2023-20230823.csv", fileEncoding ="utf-8")

  
#Cité de l'emploi
cde_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-emploi/old/liste-cde-com2023-20231108.csv", fileEncoding ="utf-8")
cde_list_init<- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-emploi/old/liste-cde-qp2023-20231108.csv", fileEncoding ="utf-8")

cde_data<- cde_init%>%
  mutate(insee_com = ifelse(nchar(insee_com) == 4, paste0("0", insee_com), insee_com))


#Cité éducative 
citeduc_init <- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-com2023-20230817.csv", fileEncoding ="utf-8")
citeduc_list_init<- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-20230817.csv", fileEncoding ="utf-8")
citeduc_groupement<- read.csv("N:/Transverse/Donnees_Obs/Donnees_Statistiques/ANCT/cites-educatives/liste-cite-grpt2023-20230817.csv", fileEncoding ="utf-8")


#Fabriques de territoire
fabt_init<- read_excel("N:/DST/Carto/APPROCHE SECTORIELLE/MUTECO_INNOVATION/FABRIQUE_TERRITOIRE/2E_VAGUE/DATA/tabs/data_fabrique_territoires_01_24.xlsx")

#Manufacture de proximité 
manuprox_init<- st_read("N:/DST/Carto/APPROCHE SECTORIELLE/MUTECO_INNOVATION/MANUFACTURES_PROXIMITE/CROISEMENTS/manufactures_TI/data/geom/manufacture_proximite_01_22.gpkg") %>% 
  st_drop_geometry() %>% 
  mutate(lib_com = ifelse(is.na(lib_com) | lib_com == "",gsub(" .*", "", as.character(lib_arm)),lib_com),
         insee_com = ifelse(is.na(insee_com) | insee_com == "",ifelse(lib_com == "Marseille", "13055",ifelse(lib_com == "Lyon", "69123", ifelse(lib_com == "Paris", "75056", insee_com))),insee_com))


#FRLA
# frla1_init <- st_read("N:/DST/Carto/APPROCHE SECTORIELLE/FONCIER/FRLA_commerces ruraux/DATA/geom/frla1.gpkg") %>% 
#   st_drop_geometry() %>% 
#   mutate(phase="1")
# 
# frla2_init <- st_read("N:/DST/Carto/APPROCHE SECTORIELLE/FONCIER/FRLA_commerces ruraux/DATA/geom/frla2.gpkg") %>% 
#   st_drop_geometry()%>% 
#   mutate(phase="2")
# frla_init <- bind_rows(frla1_init,frla2_init) %>%
# mutate(id_territoire= paste0("frla-",phase,"-",insee_dep, "-",as.character((seq(1:nrow(frla_init))))))

frla_init<-st_read("N:/DST/Carto/APPROCHE SECTORIELLE/FONCIER/FRLA_commerces ruraux/DATA/geom/frla_2024.gpkg")%>% 
  st_drop_geometry()%>%
  rename("numero"="N.") %>% 
  rename("id_territoire"="N.OP")

#Fonds commerce 
comru_init <- st_read("N:/DST/Carto/APPROCHE SECTORIELLE/FONCIER/FRLA_commerces ruraux/DATA/geom/com_ruraux.gpkg") %>% 
  st_drop_geometry()%>%
  rename("numero"="N.") %>% 
  mutate(type=str_split(service, "-", simplify = TRUE)[, 2]) %>% 
  mutate(id_territoire= paste0("comru-",numero,"-",type, "-",as.character((seq(1:nrow(comru_init))))))


#PAO
pao_init <- st_read("N:/DST/Carto/APPROCHE SECTORIELLE/FONCIER/PAO/DATA/geom/donnees_pao.gpkg") %>% 
  st_drop_geometry()%>%
  mutate(id_territoire= paste0("pao-",numero,"-",type,"-",as.character((seq(1:nrow(pao_init))))))



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



#LANCEMENT FONCTION NETTOAGE DATA ET EXPORT DES DONNEES-------------------------------------------------------

#VA
va_geom <- ma_fonction(va_init, type = "ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.x" ,"id_territoire"="id_va", "lib_territoire"="lib_com.y")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire, lib_territoire)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))

#ACV
acv_geom<-ma_fonction(acv_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_acv", "lib_territoire"="lib_acv")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire, date_signature)%>%
  group_by(id_territoire, lib_territoire, date_signature)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))

#ACV2
acv2_geom<-ma_fonction(acv2_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_acv2", "lib_territoire"="lib_acv2")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire, lib_territoire)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))

#PVD
pvd_geom<-ma_fonction(pvd_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_pvd", "lib_territoire"="lib_com_carto")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire, date_signature)%>%
  group_by(id_territoire, lib_territoire, date_signature)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))


#FS
fs_geom<-filter(fs_init,type_fs=='Principal')%>%
  ma_fonction(., type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_fs", "lib_territoire"="lib_fs")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  mutate(id_territoire2= paste0('fs-',id_territoire))%>%
  select(-id_territoire)%>%
  rename('id_territoire'='id_territoire2')%>%
  group_by(id_geo)%>%
  summarise(lib_geo= paste0(unique(lib_geo)),
            id_territoire= paste0(unique(id_territoire), collapse = '; '),
            liste_geo= paste0(unique(lib_geo), ' (', id_geo, ')',collapse = '; '),
            lib_territoire= paste0(unique(lib_territoire), collapse = '; '))

#TI
ti_gpt_data <- ti_groupement %>%
  # rename("lib_groupement"="lib_epci")%>%
  # rename("siren_groupement"="siren_epci")%>%
  group_by(id_ti)%>%
  summarise(liste_geo= paste0(unique(lib_groupement),' (', siren_groupement, ')', collapse = '; '))

ti_geom<-ma_fonction(ti_init, type="polygon")%>% 
  separate_rows(id_ti, sep = " ; ")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_ti", "lib_territoire"="lib_ti")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire)%>%
  summarise()%>%
  left_join(ti_init_list, by = c("id_territoire"="id_ti"))%>%
  left_join(ti_gpt_data, by= c("id_territoire"="id_ti") )%>%
  rename("lib_territoire"="lib_ti")



#AMM
amm_gpt_data <- amm_groupement %>%
  group_by(id_amm)%>%
  summarise(liste_geo= paste0(unique(lib_groupement),' (', siren_groupement, ')', collapse = '; '),
  )

amm_geom<-ma_fonction(amm_init, type="polygon")%>% 
  separate_rows(id_amm, sep = " ; ")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_amm", "lib_territoire"="lib_porteur")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire)%>%
  summarise()%>%
  left_join(amm_init_list, by = c("id_territoire"="id_amm"))%>%
  left_join(amm_gpt_data, by= c("id_territoire"="id_amm") )%>%
  rename("lib_territoire"="lib_porteur")


#AMI
ami_gpt_data <- ami_groupement %>%
  group_by(id_ami, lib_massif)%>%
  summarise(liste_geo= paste0(unique(lib_groupement),' (', siren_groupement, ')', collapse = '; ')
  )

ami_geom<-ma_fonction(ami_init, type="polygon")%>% 
  separate_rows(id_ami, sep = ",") %>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_ami", "lib_territoire"="lib_ami")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire)%>%
  summarise()%>%
  left_join(ami_init_list, by = c("id_territoire"="id_ami"))%>%
  rename("lib_territoire"="lib_ami") %>%
  filter(lib_territoire!= "Sites nordiques des Hautes-Vosges" & lib_territoire!= "PNR Ballon des Vosges")%>%
  left_join(ami_gpt_data, by= c("id_territoire"="id_ami"))
  

#CRTE
crte_gpt_data <- crte_groupement %>%
  group_by(id_crte)%>%
  summarise(liste_geo= paste0(unique(lib_groupement),' (', siren_groupement, ')', collapse = '; '))

crte_geom<-ma_fonction(crte_init, type="polygon")%>% 
  separate_rows(id_crte, sep = " ; ")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_crte", "lib_territoire"="lib_crte")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire)%>%
  summarise()%>%
  left_join(crte_init_list, by = c("id_territoire"="id_crte"))%>%
  left_join(crte_gpt_data, by= c("id_territoire"="id_crte") )%>%
  rename("lib_territoire"="lib_crte")

#Filtrer et retirer les CRTE non signés 

crte_geom <- crte_geom%>%
  filter(id_territoire != 'crte-94-2B-4', id_territoire != 'crte-03-973-03', id_territoire != 'crte-03-973-04', id_territoire != 'crte-32-60-20' , id_territoire != 'crte-28-76-9', id_territoire != 'crte-28-27-13')



cde_geom <- ma_fonction(cde_data, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.x" ,"id_territoire"="id_cde", "lib_territoire"="lib_cde")%>%
  group_by(id_territoire, lib_territoire)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))


#cité éducative 

citeduc_geom<-ma_fonction(citeduc_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.x" ,"id_territoire"="id_cite", "lib_territoire"="lib_cite")%>%
  group_by(id_territoire, lib_territoire)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))



#ACV
acv_geom<-ma_fonction(acv_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_acv", "lib_territoire"="lib_acv")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire, date_signature)%>%
  group_by(id_territoire, lib_territoire, date_signature)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))



#Fabriques prospetives
fabp_gpt_data <- fabp_groupement %>%
  group_by(id_fabp)%>%
  summarise(liste_geo= paste0(unique(lib_groupement),' (', siren_groupement, ')', collapse = '; '))


fabp_geom<-ma_fonction(fabp_init, type="polygon")%>% 
  separate_rows(id_fabp, sep = " ; ")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_fabp", "lib_territoire"="lib_fabp")%>% 
  select(id_geo, lib_geo, id_territoire, lib_territoire)%>%
  group_by(id_territoire)%>%
  summarise()%>%
  left_join(fabp_init_list, by = c("id_territoire"="id_fabp"))%>%
  left_join(fabp_gpt_data, by= c("id_territoire"="id_fabp") )%>%
  rename("lib_territoire"="lib_fabp")

#Fabriques de territoires
fabt_data <- fabt_init %>%
  mutate(n_vague = as.numeric(stringr::str_extract(vague, "\\d+")))%>%
  arrange(n_vague)%>%
  mutate(id_fabt = sprintf("fabt-%02d", row_number()))%>%
  rename('insee_com'='code_insee', 'lib_fabt'='lib_projet')
  
fabt_geom <- ma_fonction(fabt_data, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"id_territoire"="id_fabt", "lib_territoire"="lib_fabt")%>%
  select(id_geo, lib_geo, id_territoire, lib_territoire, Adresse, n_vague)%>%
  group_by(id_geo)%>%
  summarise(lib_geo= paste0(unique(lib_geo)),
            id_territoire= paste0(unique(id_territoire), collapse = '; '),
            liste_geo= paste0(lib_geo, ' (', id_geo[1], ')'),
            lib_territoire= paste0(unique(lib_territoire), collapse = '; '))


#Manufactures de proximité
manuprox_data <- manuprox_init %>% 
  arrange(vague)%>%
  mutate(id_geo= ifelse(!is.na(insee_com), insee_com, insee_arm),
         lib_geo= ifelse(!is.na(lib_com), lib_com, lib_arm),
         id_territoire= paste0("manuprox-",vague,"-",as.character((seq(1:nrow(manuprox_data))))))

  
manuprox_geom <-ma_fonction(manuprox_data, type="ctr")%>%
  rename("lib_territoire"="nom_projet")%>%
  select(id_geo, lib_geo,id_territoire, lib_territoire) %>% 
  group_by(id_geo)%>%
  summarise(lib_geo= paste0(unique(lib_geo)),
            id_territoire= paste0(unique(id_territoire), collapse = '; '),
            liste_geo= paste0(lib_geo, ' (', id_geo[1], ')'),
            lib_territoire= paste0(unique(lib_territoire), collapse = '; '))
  
#FRLA
frla_geom <-ma_fonction(frla_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"lib_territoire"="PERIMETRE")%>%
  distinct(id_geo, lib_geo, lib_territoire, .keep_all = TRUE) %>%
  group_by(id_geo, lib_geo, lib_territoire, id_territoire) %>% 
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))

#Commerces ruraux

comru_geom <- ma_fonction(comru_init,type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.y" ,"lib_territoire"="lib_com.x")

test <- comru_geom %>% 
  select(Commune.du.Projet, lib_com_carto.x, insee_dep.x)
#PROBLEME DANS LES DONNEES : leur libelle de commune different des notres, affaire à suivre

#PAO
pao_geom<-ma_fonction(pao_init, type="ctr")%>%
  rename("id_geo"="insee_com", "lib_geo"="lib_com.x" , "lib_territoire"="lib_com.y")%>% 
  select(id_geo,lib_geo,lib_territoire, id_territoire) %>% 
  group_by(id_territoire,lib_geo, lib_territoire)%>%
  summarise(liste_geo= paste0(unique(lib_geo),' (', id_geo, ')', collapse = '; '))





#EXPORTS FORMAT GEOJSON -----------------

st_write(obj = va_geom,
         dsn = here(paste0("geom/geojsonV2/va_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = acv_geom,
         dsn = here(paste0("geom/geojsonV2/acv_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = acv2_geom,
         dsn = here(paste0("geom/geojsonV2/acv2_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = pvd_geom,
         dsn = here(paste0("geom/geojsonV2/pvd_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = fs_geom,
         dsn = here(paste0("geom/geojsonV2/fs_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = ti_geom,
         dsn = here(paste0("geom/geojsonV2/ti_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = amm_geom,
         dsn = here(paste0("geom/geojsonV2/amm_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = ami_geom,
         dsn = here(paste0("geom/geojsonV2/ami_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = crte_geom,
         dsn = here(paste0("geom/geojsonV2/crte_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = cde_geom,
         dsn = here(paste0("geom/geojsonV2/cde_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = citeduc_geom,
         dsn = here(paste0("geom/geojsonV2/citeduc_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

st_write(obj = fabp_geom,
         dsn = here(paste0("geom/geojsonV2/fabp_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)
st_write(obj = fabt_geom,
         dsn = here(paste0("geom/geojsonV2/fabt_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

st_write(obj = manuprox_geom,
         dsn = here(paste0("geom/geojsonV2/manuprox_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

st_write(obj = frla_geom,
         dsn = here(paste0("geom/geojsonV2/frla_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

st_write(obj = pao_geom,
         dsn = here(paste0("geom/geojsonV2/pao_geom.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)








