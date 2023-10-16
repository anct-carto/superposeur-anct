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

//Créer une fonction pour créer le style de chaque couche? 


/* --------------------------Mise en place carte----------------------------- */

// Change le style des points: augmente le radius à 10
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
      fillColor: "white"
    });
}
  
//Change le style des points: diminue le radius à 5
function resetHighlight(e) {
    var layer = e.target;
    layer.setStyle({});
}

function onEachFeatureData(feature,layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
    layer.bindTooltip(feature.properties.lib_com, {className: 'TooltipsNAT', closeButton: false});
}


function legendSidebar(e){
    sidebar.open('home');

}

/* -------------------------------------------------------------------------- */
/*                                MAP                                         */
/* -------------------------------------------------------------------------- */


/* --------------------------Mise en place carte----------------------------- */

const map = new L.map('IDsuperMap',{zoomControl: false}).setView([46.603354, 1.888334],6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{
    attribution: '<a href="https://agence-cohesion-territoires.gouv.fr/" target="_blank">ANCT</a> | Fond cartographique &copy;<a href="https://stadiamaps.com/">Stadia Maps</a> &copy;<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy;<a href="http://openstreetmap.org">OpenStreetMap</a>',
}).addTo(map);

L.control.scale({ position: 'bottomright', imperial:false }).addTo(map);
L.control.zoom({ position: 'topright'}).addTo(map);


/* --------------------------Lecture des données---------------------------- */

// Charger les données
const acv = loadData("data/geom/geojson/acv_geom.geojson");
const ti = loadData("data/geom/geojson/ti_geom.geojson");



//Attention à bien afficher les polygon en premier
Promise.all([ti, acv]).then(e=>{

    //TI
    const tiPolygon = e[0];
    const tiColor= "#599AD4";
    const tiPolygonLayer= new L.geoJSON(tiPolygon,{
        style: {
          fillColor: tiColor,
          fillOpacity:0.5,
          color:null,
          lineWidth: null,
        },
    }).addTo(map);

    // ACV
    const acvMarker = e[1];
    const acvMarkerLayer= new L.geoJSON(acvMarker,{
        pointToLayer: function(feature,latlng) {
            const dispositifColor= "#E12A5C";
            var marker = L.circleMarker(latlng, {
                color: dispositifColor,
                fillColor:dispositifColor,
                fillOpacity:1,
                radius:2,
                weight:1
            })
            return marker
        },
    }).addTo(map);

    // Activer et désactiver les couches dans la légende 
    document.getElementById('acv-marker-checkbox').addEventListener('change', function () {
        if (this.checked) {
            map.addLayer(acvMarkerLayer);
        } else {
            map.removeLayer(acvMarkerLayer);
        }
    });
    
    document.getElementById('ti-polygon-checkbox').addEventListener('change', function () {
        if (this.checked) {
            map.addLayer(tiPolygonLayer);
        } else {
            map.removeLayer(tiPolygonLayer);
        }
    });
    
});

// //Creation d'une fonction pour lire et afficher les donnees
// const acvData = document.getElementById(acv)

// acvData.addEventListener('change', function (e) {
//     console.log(this.id);
//     if (this.checked) {
//         map.addLayer(tiPolygonLayer);
//     } else {
//         map.removeLayer(tiPolygonLayer);
//     }
// });

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



