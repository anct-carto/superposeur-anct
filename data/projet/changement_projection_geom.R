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

reg_geom_4326<- st_transform(reg_geom, crs= 4326)


plot(reg_geom$geom)
plot(reg_geom_4326$geom)

st_write(obj = reg_geom_4326,
         dsn = here(paste0("geom/geojson/reg_geom_4326.geojson")),
         driver = "GeoJSON", delete_layer = TRUE, append = FALSE)











