/* -------------------------------------------------------------------------- */
/*                                FONCTIONS                                   */
/* -------------------------------------------------------------------------- */

/* --------------------------Lecture des données----------------------------- */
// Fonction qui permet de lire les données json
async function loadData(chemin) {
    const response = await fetch(chemin)
    const resultat = await response.json()
    return resultat
};


/* -------------------------- Styles ----------------------------- */

//Fonction pour définir une couleur
function getColor(layerType) {
  if (layerType === 'ti') {
    return "#599AD4";
  } else if (layerType === 'crte') {
    return "#2B7019";
  } else if (layerType === 'ami') {
    return "#427A6F";
  } else if (layerType === 'amm') {
    return "#6D4E47";
  } else if (layerType === 'acv') {
    return "#E12A5C";
  } else if (layerType === 'acv2') {
    return "#313778";
  } else if (layerType === 'pvd') {
    return "#DA7E42";
  } else if (layerType === 'fs') {
    return "#616DAF";
  } else if (layerType === 'cde') {
    return "#C3242B";
  } else if (layerType === 'cite') {
    return "#9A3D77";
  } else if (layerType === 'fabp') {
    return "#FF7D00";
  } else if (layerType === 'fabt') {
    return "#793186";
  }
  
  // Par défaut, retournez une couleur par défaut si nécessaire.
  return "#000000";
};


// Fonction pour récupérer les propriétés des couches geojson
var dataInfos ;


function getInfo(feature, layerName) {
  console.log(layerName)
  const card = document.getElementById("card");
  const legend =document.getElementById("legend");
  const btnRetour = document.getElementById("bnt-retour");
  const checkbox = document.querySelectorAll(".program-checkbox");
  legend.style.display ="none";
  card.style.display ="block";
  btnRetour.style.display ="block";
  
  let libProgramme;
  for(let i =0;i<checkbox.length;i++) {
    const getHtmlElement = checkbox[i].getAttribute("data-layer-type");
    if (getHtmlElement === layerName) {
      libProgramme = checkbox[i].nextElementSibling.innerHTML;
    } 
  }

  console.log(libProgramme)

  const dataInfos = feature.properties;
  
  const cardHeader = document.querySelector(".card-header");
  const cardBody = document.querySelector(".card-body");

  // + labelText
  //Inégration des éléments dans la card en HTML
  cardHeader.innerHTML =`<div id="nom-programme"><span><p class="title-card-header">`+ libProgramme  + `</p></span></div>`;
  cardBody.innerHTML =  `<div"><span><p class="title-card-body">Libellé et code du programme : </p></span>` + dataInfos[`lib_territoire`] + ' ('+ dataInfos[`id_territoire`] + ')'+ '</div>'+`<div><span><p class="title-card-body">Territoires concernés : </p></span>` + dataInfos[`liste_geo`] + '</div>';
  sidebar.open('home');

  // Ajoutez un gestionnaire d'événements pour le clic sur le bouton
  btnRetour.addEventListener('click', () => {
    legend.style.display = 'block';
    card.style.display ="none";
    btnRetour.style.display="none";

    clicFeatureLayer.clearLayers();
  });
  
};
/* --------------------------Mise en place carte----------------------------- */



// Définir une variable pour stocker la référence de la couche GeoJSON sélectionnée



function onEachFeatureMarker(feature, layer) {

  const type = feature.properties.id_territoire.split('-')[0];

  layer.on('click', () => {
    getInfo(feature, type);

    clicFeatureLayer.clearLayers();
    const markerTemp = L.geoJSON(feature, {
      pointToLayer: function (feature, latlng) {
        var marker = L.circleMarker(latlng, {
          color:'#FF0000',
          fillColor: getColor(type),
          fillOpacity: 1,
          radius: 8,
          weight: 3,
        });
        return marker;
      },
    }).addTo(clicFeatureLayer);
  });
};

function onEachFeaturePolygon(feature, layer) {

  const type = feature.properties.id_territoire.split('-')[0];

  layer.on('click', () => {
    getInfo(feature, type);

    clicFeatureLayer.clearLayers();
    const polygonTemp = L.geoJSON(feature, {
      style: {
        fillColor: getColor(type),
        fillOpacity: 1,
        color: '#FF0000',
        weight: 2,
      },
    } ).addTo(clicFeatureLayer);
  });
};

//Automatiser la création de geojson : marker
function createGeoJSONMarker(data, weight, radius, fillOpacity, type) {
  const layer = new L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      var marker = L.circleMarker(latlng, {
        color: getColor(type),
        fillColor: getColor(type),
        fillOpacity: fillOpacity,
        radius: radius,
        weight: weight,
      });
      return marker;
    },
    onEachFeature : onEachFeatureMarker,
  }).addTo(map);

  // Gérer le survol pour chaque élément de la couche
  layer.eachLayer(function (feature) {
    feature.on('mouseover', function (e) {
      // Modifier le style de l'élément survolé
      this.setStyle({
        color: 'white', // Bordure blanche
        fillColor: getColor(type), // Remplissage blanc
        radius: 8,
      });
    });

    // Rétablir le style initial de l'élément une fois le survol terminé
    feature.on('mouseout', function (e) {
      this.setStyle({
        color: getColor(type), // Utilisez la couleur d'origine
        fillColor: getColor(type), // Utilisez la couleur d'origine
        radius: radius,
      });
    });
  });

  return layer;
}


//Automatiser la création de geojson : polygon
function createGeoJSONPolygon(data, color, weight, type) {
  const layer = new L.geoJSON(data, {
    style: {
      fillColor: getColor(type),
      fillOpacity: 0.5,
      color: color,
      weight: weight,
    },
    onEachFeature : onEachFeaturePolygon,
  }).addTo(map);

  // Gérer le survol pour chaque élément de la couche
  layer.eachLayer(function (feature) {
    feature.on('mouseover', function (e) {
      // Modifier le style de l'élément survolé
      this.setStyle({
        color: 'white', // Bordure blanche
        fillOpacity: 1,
        weight: 1,
      });
    });

    // Rétablir le style initial de l'élément une fois le survol terminé
    feature.on('mouseout', function (e) {
      this.setStyle({
        color: color, // Utilisez la couleur d'origine
        fillOpacity: 0.5,
        weight: weight,
      });
    });
    
  });

  return layer;
}




/* -------------------------- Sidebar ----------------------------- */


// Ouverture de la sidebar sur l'onglet "home"
function legendSidebar(e){
    sidebar.open('home');
}

// Activer et désactiver les couches des programmes ANCT dans la sidebar
let count = 0;
function toggleLayer(layer, checkbox) {
  checkbox.addEventListener('change', function (e) {
    console.log(count);
    if (this.checked) {
      count++
      allLayer.addLayer(layer);
      if(count == 6) {
        count--;
        alert("Vous avez coché trop de calques, pour plus de lisibilité, ne pas en cocher plus de 5 à la fois.")
      }
    } else {
      count--;
      allLayer.removeLayer(layer);
    }
  });
}


//Evenement qui permet de modifier la tuile de fond
function setStyleBaseMap(styleReg, styleDep) {
  L.DomEvent.on(document.querySelector('input[id="fond1-checkbox"]'), 'change', function () {
    if (this.checked) {
      styleReg.setStyle({
        color: '#363636'
      });
      styleDep.setStyle({
        color: '#363636',
        weight: 0.15,
      });
    }
  });

  // Code pour changer la couleur des contours de la couche régions en blanc ici
  L.DomEvent.on(document.querySelector('input[id="photo-checkbox"]'), 'change', function () {
    if (this.checked) {
      styleReg.setStyle({
        color: 'white'
      });
      styleDep.setStyle({
        color: 'white',
        weight: 0.25,
      });
    } 
  });
}


/* -------------------------------------------------------------------------- */
/*                                MAP                                         */
/* -------------------------------------------------------------------------- */


/* --------------------------Mise en place carte----------------------------- */

const map = new L.map('IDsuperMap',{zoomControl: false}).setView([46.603354, 1.888334],6);

/* ---------------------Mise en place des fonds de carte--------------------- */

// Fonds de cartes 
const basemapFond1 = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
  attribution: '<a href="https://agence-cohesion-territoires.gouv.fr/" target="_blank">ANCT</a> | Fond cartographique &copy;<a href="https://stadiamaps.com/">Stadia Maps</a> &copy;<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy;<a href="http://openstreetmap.org">OpenStreetMap</a>',
});


const basemapPhoto = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Ajout du fond de base
map.addLayer(basemapFond1);

//baseLayers est  une couche qui contient tous les fonds
const baseLayers = {
  'fond1' : basemapFond1,
  'photo satellite' : basemapPhoto
};

const overlays = {
};

//Ajout d'un control layer qui permet de sélectionner le fond souhaité
const layerControl = L.control.layers(baseLayers, overlays);
// layerControl.addTo(map)

const allLayer = new L.layerGroup().addTo(map);

const clicFeatureLayer = new L.layerGroup().addTo(map);


/* ----------------Mise en place des éléments habillage carte--------------------- */

// Ajout de l'échelle
L.control.scale({ position: 'bottomright', imperial:false }).addTo(map);

//Ajout du zoom
L.control.zoom({ position: 'topright'}).addTo(map);



/* -------------------------------------------------------------------------- */
/*                                   SIDEBAR                                  */
/* -------------------------------------------------------------------------- */
// Création du sidebar
const sidebar = L.control.sidebar({
  autopan: false,
  closeButton: true,
  container: 'sidebar',
  position: 'left',
});


sidebar.on('content', function (ev) {
  switch (ev.id) {
      case 'home':
        sidebar.options.autopan = true;
        break;
      case 'search-tab':
        sidebar.options.autopan = true;
        break;
      case 'a-propos':
      sidebar.options.autopan = true;
      break;
        default:
        sidebar.options.autopan = true;
  }
});
sidebar.addTo(map)

sidebar.open('home');

// Listen for changes in the background tile selection and update the map
document.querySelectorAll('input[name="basemap"]').forEach(function (input) {
  input.addEventListener("change", function () {
    const selectedBasemap = this.value;
    map.eachLayer(function (layer) {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (selectedBasemap === "fond1") {
      map.addLayer(basemapFond1);
    } else if (selectedBasemap === "photo") {
      map.addLayer(basemapPhoto);
      basemapPhoto.setOpacity(0.8);
    }
  });
});

// Sélectionnez les deux cases à cocher
const checkboxes = document.querySelectorAll('input[type="checkbox"].form-check-input');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    checkboxes.forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
    });

    // Assurez-vous que la case cochée reste cochée
    this.checked = true;
  });
});

/* --------------------------Bouton effacer la légende---------------------------- */

function clearLegend() {
  const programCheckboxes = document.querySelectorAll('.program-checkbox');

  programCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkbox.checked = false;
      console.log(checkbox)
      allLayer.clearLayers();
      count=0;
    }
  });
}



/* --------------------------Lecture des données---------------------------- */

// Charger les données

// Marker
const acvInit = loadData("data/geom/geojsonV2/acv_geom.geojson");
const acv2Init = loadData("data/geom/geojsonV2/acv2_geom.geojson");
const pvdInit = loadData("data/geom/geojsonV2/pvd_geom.geojson");
const fsInit = loadData("data/geom/geojsonV2/fs_geom.geojson");
const cdeInit = loadData("data/geom/geojsonV2/cde_geom.geojson");
const citeInit = loadData("data/geom/geojsonV2/citeduc_geom.geojson");
const fabtInit = loadData("data/geom/geojsonV2/fabt_geom.geojson");


// Polygon
const tiInit = loadData("data/geom/geojsonV2/ti_geom.geojson");
const crteInit = loadData("data/geom/geojsonV2/crte_geom.geojson");
const amiInit = loadData("data/geom/geojsonV2/ami_geom.geojson");
const ammInit = loadData("data/geom/geojsonV2/amm_geom.geojson");
const fabpInit = loadData("data/geom/geojsonV2/fabp_geom.geojson");

const regionInit= loadData("data/geom/geojson/reg_geom_4326.geojson");
const departementInit= loadData("data/geom/geojson/dep_geom_4326.geojson");

//Données d'habillage de la carte
Promise.all([regionInit, departementInit]).then(([regPolygon, depPolygon])=>{
  const regPolygonLayer =new L.geoJSON(regPolygon,{
      style: {
        fillColor: "transparent",
        fillOpacity:0,
        color:"#363636",
        weight: 0.35,
      }, 
  }).addTo(map);

  const depPolygonLayer =new L.geoJSON(depPolygon,{
    style: {
      fillColor: "transparent",
      fillOpacity:0,
      color:"#363636",
      weight: 0.15,
    }, 
  }).addTo(map);

  setStyleBaseMap(regPolygonLayer, depPolygonLayer);

});


//Données des programmes ANCT
Promise.all([tiInit, crteInit, amiInit, ammInit, fabpInit, acvInit, acv2Init, pvdInit, fsInit, cdeInit, citeInit, fabtInit]).then(([tiLayer, crteLayer, amiLayer, ammLayer, fabpLayer, acvLayer, acv2Layer, pvdLayer, fsLayer, cdeLayer, citeLayer, fabtLayer])=>{
  
  //POLYGON
  const tiPolygonLayer= createGeoJSONPolygon(tiLayer, "white", 1, 'ti');
  const crtePolygonLayer= createGeoJSONPolygon(crteLayer, "white", 1, 'crte');
  const amiPolygonLayer= createGeoJSONPolygon(amiLayer, "white", 1, 'ami');
  const ammPolygonLayer= createGeoJSONPolygon(ammLayer, "white", 1, 'amm');
  const fabpPolygonLayer= createGeoJSONPolygon(fabpLayer, "white", 1, 'fabp');
  
  //MARKER
  const acvMarkerLayer=  createGeoJSONMarker(acvLayer, 2, 2, 1, 'acv');
  const acv2MarkerLayer=  createGeoJSONMarker(acv2Layer, 2, 2, 1, 'acv2');
  const pvdMarkerLayer=  createGeoJSONMarker(pvdLayer, 2, 2, 1, 'pvd');
  const fsMarkerLayer=  createGeoJSONMarker(fsLayer, 2, 1, 1, 'fs');
  const cdeMarkerLayer=  createGeoJSONMarker(cdeLayer, 2, 2, 1, 'cde');
  const citeMarkerLayer=  createGeoJSONMarker(citeLayer, 2, 2, 1, 'cite');
  const fabtMarkerLayer=  createGeoJSONMarker(fabtLayer, 2, 2, 1, 'fabt');


  map.removeLayer(tiPolygonLayer);
  map.removeLayer(crtePolygonLayer);
  map.removeLayer(amiPolygonLayer);
  map.removeLayer(ammPolygonLayer);
  map.removeLayer(fabpPolygonLayer);

  map.removeLayer(acvMarkerLayer);
  map.removeLayer(acv2MarkerLayer);
  map.removeLayer(pvdMarkerLayer);
  map.removeLayer(fsMarkerLayer);
  map.removeLayer(cdeMarkerLayer);
  map.removeLayer(citeMarkerLayer);
  map.removeLayer(fabtMarkerLayer);

  
 
  //Récupérer les éléments HTML 
  const tiData = document.getElementById('ti-polygon-checkbox');
  const crteData = document.getElementById('crte-polygon-checkbox');
  const amiData = document.getElementById('ami-polygon-checkbox');
  const ammData = document.getElementById('amm-polygon-checkbox');
  const fabpData = document.getElementById('fabp-polygon-checkbox');

  const acvData = document.getElementById('acv-marker-checkbox');
  const acv2Data = document.getElementById('acv2-marker-checkbox');
  const pvdData = document.getElementById('pvd-marker-checkbox');
  const fsData = document.getElementById('fs-marker-checkbox');
  const cdeData = document.getElementById('cde-marker-checkbox');
  const citeData = document.getElementById('cite-marker-checkbox');
  const fabtData = document.getElementById('fabt-marker-checkbox');

  //Appel à la fonction pour activier et désactiver les couches
  toggleLayer(tiPolygonLayer, tiData);
  toggleLayer(crtePolygonLayer, crteData);
  toggleLayer(amiPolygonLayer, amiData);
  toggleLayer(ammPolygonLayer, ammData);
  toggleLayer(fabpPolygonLayer, fabpData);

  toggleLayer(acvMarkerLayer, acvData);
  toggleLayer(acv2MarkerLayer, acv2Data);
  toggleLayer(pvdMarkerLayer, pvdData);
  toggleLayer(fsMarkerLayer, fsData);
  toggleLayer(cdeMarkerLayer, cdeData);
  toggleLayer(citeMarkerLayer, citeData);
  toggleLayer(fabtMarkerLayer, fabtData);


});

//Supprimer les éléments cochés dans la légende
const clearLegendButton = document.getElementById('clear-legend-button');
clearLegendButton.addEventListener('click', clearLegend);
  
/* -------------------------------------------------------------------------- */
/*                                ZOOM DROM                                   */
/* -------------------------------------------------------------------------- */

let liste_drom = document.getElementById("goTo");


liste_drom.addEventListener('change', (e) => {
  option = e.target.selectedOptions[0];
  switch (option.value) {
    case "met":
      return map.flyTo([46.5, -3.55], 5.5555, { animation: true, duration: 1 });     
      // break;
    case "glp":
      return map.setView([16.25, -61.706], 10, { animation: true });
    case "mtq":
      return map.setView([14.68, -61.2], 10, { animation: true });
    case "guf":
      return map.setView([3.92, -54.5], 7.855, { animation: true });
    case "reu":
      return map.setView([-21.11, 55.28], 10, { animation: true });
    case "myt":
      return map.setView([-12.81, 45.06], 11, { animation: true });
    default:
      return map.setView([46.5, 0], 5.5555, { animation: true })
  }
});