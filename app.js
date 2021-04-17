var map = L.map('map', {
    center: [47.66, 13.71],
    zoom: 8,
  });
 
var bezirke = false;
var gemeinden = false;
  L.tileLayer('https://maps.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg', {
    maxZoom: 20,
    attribution: 'Grundkarte: <a href="https://www.basemap.at/" target="_blank">basemap.at</a> | Daten: <a href="https://github.com/ginseng666/GeoJSON-TopoJSON-Austria" target="_blank">Flooh Perlot</a>, <a href="https://data.statistik.gv.at/web/meta.jsp?dataset=OGDEXT_GEM_1" target="_blank">Statistik Austria</a>',
    id: 'wien.gv.at'
  }).addTo(map);
  
  map.fitBounds([
      [46.621, 9.522],
      [49.011, 16.971]
  ]);
  
  
  function onEachFeature(feature, layer) {
    layer.on('click', function() {
        map.fitBounds(layer.getBounds());



        if(!bezirke)
        {
            bezirke = true;
            const bezirkeLayer = bezirkeLayerHandler.addTo(map);
  
            const overlayLayersBezirke = {
              "Bezirke": bezirkeLayer
    
            };
            
            const layerControlBezirke = L.control.layers(null, overlayLayersBezirke).addTo(map);

        }
        else
        {
            if(!gemeinden)
            {
                gemeinden = true;
                const gemeindenLayer = gemeindenLayerHandler.addTo(map);
      
                const overlayLayersGemeinden = {
                  "Gemeinden": gemeindenLayer
        
                };
                
                const layerControlGemeinden = L.control.layers(null, overlayLayersGemeinden).addTo(map);
    
            }
        }

        var but = document.createElement("button");

        but.value="Bundesland: Steiermark";
        
    });
    let props = feature.properties;
    layer.bindTooltip(
        `
      <p>
        <strong>${props.name}</strong><br>
        ${props.info ? `${props.info}` : ''}
        ${props.klar ? `${props.klar} KLAR Regions` : ''}<br>
        ${props.kem ? `${props.kem} KEM Regions` : ''}
      </p>
      `);

    //layer.bindPopup(`  <p> <strong>${props.name}</strong>`);
  }
  
  const Styling = {
      'color': '#0C8346',
      'weight': 5,
      'opacity': 0.65,
      'fill': '#C1F2AF ',
      'fillOpacity': 0.4
  }
  

  
  function style(feature) {
    return Styling
  }
  
  function filter(feature) {
    return true
  }
  
  const options = {
    onEachFeature: onEachFeature,
    style: style,
    filter: filter,
  }
  

  const laenderLayer = new L.geoJSON.ajax("laender_95_geo.json", options).addTo(map);

  const overlayLayersLaender = {
    "Bundeslaender": laenderLayer
  };
  
  const layerControlLaender = L.control.layers(null, overlayLayersLaender).addTo(map);


  const klarBezirkeList =
  [
    "Weiz",
    "Hartberg", 
    "Murau",
    "Graz-Umgebung"
  ];

  const steiermarkBezirkeOptions = {
    onEachFeature: onEachFeature,
    style: style,
    filter: function(feature, layer) {        
        return +feature.properties.iso >= 600 && +feature.properties.iso <= 699; // && klarRegionsList.includes(feature.properties.name);
    }
  }

  const bezirkeLayerHandler = new L.geoJSON.ajax("bezirke_95_geo.json", steiermarkBezirkeOptions);


  const klarGemeindeList =
  [
    "Übelbach"
  ];

  const guGemeindenOptions = {
    onEachFeature: onEachFeature,
    style: style,
    filter: function(feature, layer) {
        
        return +feature.properties.iso >= 60600 && +feature.properties.iso <= 60699; // && feature.properties.hasOwnProperty("klar");
    }
  }

  const gemeindenLayerHandler = new L.geoJSON.ajax("gemeinden_95_geo.json", guGemeindenOptions);
  
  map.on('zoomend', function() {

    // TODO alert('Zoomend');
 
 });
  
