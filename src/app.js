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
  if (layerType === 'tiPolygonLayer') {
    return "#599AD4";
  } else if (layerType === 'acvMarkerLayer') {
    return "#E12A5C";
  }
  // Par défaut, retournez une couleur par défaut si nécessaire.
  return "#000000";
};

// Fonction pour récupérer les propriétés des couches geojson
var dataInfos ;

function getInfo(e, layerName) {
  const dataInfos = e.layer.feature.properties;

  // const libCom = document.getElementById(`lib-com-${layerName}`);
  // const inseeCom = document.getElementById(`insee-com-${layerName}`);
  const libTerr = document.getElementById("lib-territoire");
  const idTerr = document.getElementById("id-territoire");

  // libCom.innerHTML = `<div id="fiche-terr-1"><p>Nom de la commune : </p></span>` + dataInfos.lib_com.x + '</div>';
  // inseeCom.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos.insee_com + '</div>';
  libTerr.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos[`lib_${layerName}`] + '</div>';
  idTerr.innerHTML = `<div id="fiche-terr-1"><i class="las la-male"></i> <span class="fiche-terr-1"></span>` + dataInfos[`id_${layerName}`] + '</div>';
  sidebar.open('fiche-territoire');

  //vider la liste quand clic dans le vide
};

// function getInfo(e, layerName) {

//   const dataInfos = e.layer.feature.properties;
//   console.log(dataInfos);

//   const layerMappings = {
//     ti: { libTerr: 'lib_ti', idTerr: 'id_ti' },
//     acv: { label: 'lib_com.x', insee: 'insee_com', libTerr: 'lib_acv', idTerr: 'id_acv' }
//     // Ajoutez d'autres couches avec leurs mappages
//   };

//   const mapping = layerMappings[layerName];

//   if (mapping) {
//     const libCom = dataInfos[mapping.label];
//     const inseeCom = dataInfos[mapping.insee];
//     const libTerr = dataInfos[mapping.libTerr];
//     const idTerr = dataInfos[mapping.idTerr];
    

//     // Utilisez les valeurs de libCom, inseeCom, libTerr, idTerr 
//     console.log('Libellé : ' + libCom);
//     console.log('Code commune : ' + inseeCom);
//     console.log('Libellé Territoire : ' + libTerr);
//     console.log('ID Territoire : ' + idTerr);
//   }

//   sidebar.open('fiche-territoire');
// }




// // Change le style des points: augmente le radius à 10
// function highlightFeature(e) {
//     var layer = e.target;
//     layer.setStyle({

//       fillColor: "white"
//     });
// }
  
// //Change le style des points: diminue le radius à 5
// function resetHighlight(e) {
//     var layer = e.target;
//     layer.setStyle({
//      fillColor: getColor()  //ne fonctionne parseFloat, renvoie en noir = indefined
//     });
// }

// function onEachFeatureData(feature,layer){
//     layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//     });
//     //layer.bindTooltip(feature.properties.lib_com, {className: 'TooltipsNAT', closeButton: false});
// }


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


/* -------------------------------------------------------------------------- */
/*                                MAP                                         */
/* -------------------------------------------------------------------------- */


/* --------------------------Mise en place carte----------------------------- */

const map = new L.map('IDsuperMap',{zoomControl: false}).setView([46.603354, 1.888334],6);


// Fonds de cartes 
const basemapFond1 = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
  attribution: '<a href="https://agence-cohesion-territoires.gouv.fr/" target="_blank">ANCT</a> | Fond cartographique &copy;<a href="https://stadiamaps.com/">Stadia Maps</a> &copy;<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy;<a href="http://openstreetmap.org">OpenStreetMap</a>',
});

const basemapFond2 = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
  attribution: 'Fond cartographique &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',   
});

const basemapPhoto = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Ajout du fond de base
map.addLayer(basemapFond1);

//baseLayers est  une couche qui contient tous les fonds
const baseLayers = {
  'fond1' : basemapFond1,
  'fond2': basemapFond2,
  'photo satellite' : basemapPhoto
};

const overlays = {
};

//Ajout d'un control layer qui permet de sélectionner le fond souhaité
const layerControl = L.control.layers(baseLayers, overlays);
layerControl.addTo(map)


// basemapPhoto() {
//   return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//       attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//   });
// },
// basemapFond() {
//   return L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
//       attribution: 'Fond cartographique &copy;<a href="https://stadiamaps.com/">Stadia Maps</a> &copy;<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy;<a href="http://openstreetmap.org">OpenStreetMap</a>',
//   })
// },
// basemapFond2() {
//   return L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
//       attribution: 'Fond cartographique &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
//   })
// },

L.control.scale({ position: 'bottomright', imperial:false }).addTo(map);
L.control.zoom({ position: 'topright'}).addTo(map);




/* --------------------------Lecture des données---------------------------- */

// Charger les données
const acv = loadData("data/geom/geojson/acv_geom.geojson");
const ti = loadData("data/geom/geojson/ti_geom.geojson");

const region= loadData("data/geom/geojson/reg_geom_4326.geojson");
const departement= loadData("data/geom/geojson/dep_geom_4326.geojson");

Promise.all([region, departement]).then(([regPolygon, departementPolygon])=>{
  const regPolygonLayer =new L.geoJSON(regPolygon,{
      style: {
        fillColor: "transparent",
        fillOpacity:0,
        color:"#363636",
        weight: 0.35,
      }, 
  }).addTo(map);

  const departementPolygonLayer =new L.geoJSON(departementPolygon,{
    style: {
      fillColor: "transparent",
      fillOpacity:0,
      color:"#363636",
      weight: 0.15,
    }, 
  }).addTo(map);

});

//Attention à bien afficher les polygon en premier
Promise.all([ti, acv]).then(([tiPolygon, acvMarker])=>{
  
  
  //TI
  const tiPolygonLayer= new L.geoJSON(tiPolygon,{
      style: {
        fillColor: getColor('tiPolygonLayer'),
        fillOpacity:0.5,
        color:null,
        lineWidth: null,
      }, 
      // onEachFeature: function(feature, layer) {
      //   layer.on('click', getInfo(feature, 'ti'));
      // }
  }).on('click', (e) => {
    getInfo(e, 'ti');
  }) 
  .addTo(map);

  // ACV
  const acvMarkerLayer= new L.geoJSON(acvMarker,{
      pointToLayer: function(feature,latlng) {
          var marker = L.circleMarker(latlng, {
              color: getColor('acvMarkerLayer'),
              fillColor:getColor('acvMarkerLayer'),
              fillOpacity:1,
              radius:2,
              weight:1
          })
          return marker
      },
      // onEachFeature: function(feature, layer) {
      //   layer.on('click', getInfo(feature,'acv'));
      // }  
  }).on('click', (e) => {
    getInfo(e, 'acv');
  }) 
  .addTo(map);

  
//Appel à la fonction pour activier et désactiver les couches
  const tiData = document.getElementById('ti-polygon-checkbox')
  const acvData = document.getElementById('acv-marker-checkbox')

  toggleLayer(tiPolygonLayer, tiData, 'ti');
  toggleLayer(acvMarkerLayer, acvData, 'acv');

});





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

// map.on('click', function(){
//   var cardContent = document.getElementById('card');
//   console.log(cardContent)
//   // if(card) {
//   //   console.log("hello")
//   // }
// // //   sidebar.close()
// })
  
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



