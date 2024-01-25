#Telecharger les librairie
library(sf)
library(rgdal)
library(tidyverse)
library(readxl)
library(writexl)
library(RSQLite)
library(here)

reg_geom <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/fr-drom-3395-gen.gpkg",
                    layer = "reg")

dep_geom <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/fr-drom-3395-gen.gpkg",
                    layer = "dep")

com_geom <- st_read("N://Transverse/Donnees_Obs/Donnees_SIG/ADMIN_STAT/map-process/public/france/2023/fr-drom/fr-drom-3395-gen.gpkg",
                    layer = "com")

#REGIONS

reg_geom_4326<- st_transform(reg_geom, crs= 4326)


plot(reg_geom$geom)
plot(reg_geom_4326$geom)

st_write(obj = reg_geom_4326,
         dsn = here(paste0("geom/geojson/reg_geom_4326.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)

#DEPARTEMENTS

dep_geom_4326<- st_transform(dep_geom, crs= 4326)


plot(dep_geom$geom)
plot(dep_geom_4326$geom)

st_write(obj = dep_geom_4326,
         dsn = here(paste0("geom/geojson/dep_geom_4326.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)


#COMMUNES

com_geom_4326<- st_transform(com_geom, crs= 4326)


plot(com_geom$geom)
plot(com_geom_4326$geom)

st_write(obj = com_geom_4326,
         dsn = here(paste0("geom/geojson/com_geom_4326.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)






