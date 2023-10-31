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


/* --------------------------Mise en place carte----------------------------- */

//Fonction pour définir une couleur
function getColor(layerType) {
  if (layerType === 'ti') {
    return "#599AD4";
  } else if (layerType === 'acv') {
    return "#E12A5C";
  } else if (layerType === 'acv2') {
    return "#313778";
  }
  else if (layerType === 'crte') {
    return "#2B7019";
  }
  // Par défaut, retournez une couleur par défaut si nécessaire.
  return "#000000";
};


//Automatiser la création de geojson
function createGeoJSONPolygon(data, color, weight, type) {
  return new L.geoJSON(data, {
    style: {
      fillColor: getColor(type),
      fillOpacity:0.5,
      color: color,
      weight: weight,
    }, 
  }).on('click', (e) => {
    getInfo(e, type);
  }).addTo(map);

};


function createGeoJSONMarker(data, weight, radius, fillOpacity, type) {
  return new L.geoJSON(data,{
    pointToLayer: function(feature,latlng) {
        var marker = L.circleMarker(latlng, {
            color: getColor(type),
            fillColor:getColor(type),
            fillOpacity: fillOpacity,
            radius: radius,
            weight: weight
        })
        return marker
    },
}).on('click', (e) => {
  getInfo(e, type);
}).addTo(map);
};

// Fonction pour récupérer les propriétés des couches geojson
var dataInfos ;

function getInfo(e, layerName) {
  const card = document.getElementById("card");
  const legend =document.getElementById("legend");
  const btnRetour = document.getElementById("bnt-retour");


  legend.style.display ="none";
  card.style.display ="block";

  const dataInfos = e.layer.feature.properties;

  // const libCom = document.getElementById(`lib-com-${layerName}`);
  // const inseeCom = document.getElementById(`insee-com-${layerName}`);
  const libTerr = document.getElementById("lib-territoire");
  const idTerr = document.getElementById("id-territoire");

  // libCom.innerHTML = `<div id="fiche-terr-1"><p>Nom de la commune : </p></span>` + dataInfos.lib_com.x + '</div>';
  // inseeCom.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos.insee_com + '</div>';
  libTerr.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos[`lib_${layerName}`] + '</div>';
  idTerr.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos[`id_${layerName}`] + '</div>';
  sidebar.open('home');

  // Ajoutez un gestionnaire d'événements pour le clic sur le bouton
  btnRetour.addEventListener('click', () => {
    legend.style.display = 'block';
    card.style.display ="none";
  });

  
};



function legendSidebar(e){
    sidebar.open('home');
}

// Fonction pour activer et désactiver les couches dans la sidebar
function toggleLayer(layer, checkbox) {
  checkbox.addEventListener('change', function (e) {
    if (this.checked) {
      map.addLayer(layer);
    } else {
      map.removeLayer(layer);
    }
  });
}



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





/* --------------------------Lecture des données---------------------------- */

// Charger les données
const acvInit = loadData("data/geom/geojson/acv_geom.geojson");
const acv2Init = loadData("data/geom/geojson/acv2_geom.geojson");
const tiInit = loadData("data/geom/geojson/ti_geom.geojson");
const crteInit = loadData("data/geom/geojson/crte_geom.geojson");

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
Promise.all([tiInit, crteInit, acvInit, acv2Init]).then(([tiLayer, crteLayer, acvLayer, acv2Layer])=>{
  
  //POLYGON
  const tiPolygonLayer= createGeoJSONPolygon(tiLayer, null, null , 'ti');
  const crtePolygonLayer= createGeoJSONPolygon(crteLayer, "white", 0.2, 'crte');
  
  //MARKER
  const acvMarkerLayer=  createGeoJSONMarker(acvLayer, 1, 2, 1, 'acv');
  const acv2MarkerLayer=  createGeoJSONMarker(acv2Layer, 1, 2, 1, 'acv2');


  map.removeLayer(tiPolygonLayer);
  map.removeLayer(crtePolygonLayer);
  map.removeLayer(acvMarkerLayer);
  map.removeLayer(acv2MarkerLayer);
 
//Appel à la fonction pour activier et désactiver les couches
  const tiData = document.getElementById('ti-polygon-checkbox')
  const crteData = document.getElementById('crte-polygon-checkbox')
  const acvData = document.getElementById('acv-marker-checkbox')
  const acv2Data = document.getElementById('acv2-marker-checkbox')

  toggleLayer(tiPolygonLayer, tiData);
  toggleLayer(crtePolygonLayer, crteData);
  toggleLayer(acvMarkerLayer, acvData);
  toggleLayer(acv2MarkerLayer, acv2Data);


});




  
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



