import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// IMPORTS IMPORTANTES: garante que o bundler resolva as imagens do marker
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Aplica as URLs importadas ao ícone padrão do Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const MapaPreview = ({ pontos }) => {
  const [rota, setRota] = useState([]);

  // ordena pelos pontos e cria lista de [lon, lat] para o OSRM
  const ordenados = useMemo(() => {
    if (!pontos || pontos.length === 0) return [];
    return [...pontos].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [pontos]);

  const coords = useMemo(
    () =>
      ordenados
        .filter((p) => p.latitude && p.longitude)
        .map((p) => [parseFloat(p.longitude), parseFloat(p.latitude)]), // [lon, lat]
    [ordenados]
  );

  // Consulta OSRM para uma rota que segue a ordem
  useEffect(() => {
    if (coords.length < 2) {
      setRota([]);
      return;
    }

    const coordsString = coords.map(([lon, lat]) => `${lon},${lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    let mounted = true;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.routes && data.routes.length > 0) {
          // converte [lon,lat] -> [lat,lon] para Leaflet
          const routeCoords = data.routes[0].geometry.coordinates.map(
            ([lon, lat]) => [lat, lon]
          );
          setRota(routeCoords);
        } else {
          setRota([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar rota OSRM:", err);
        setRota([]);
      });

    return () => {
      mounted = false;
    };
  }, [coords]);

  if (!coords || coords.length === 0) {
    return <p>Nenhum ponto válido fornecido.</p>;
  }

  const posInicial = [coords[0][1], coords[0][0]]; // [lat, lon]

  return (
    <MapContainer
      center={posInicial}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {ordenados.map((p, i) => (
        <Marker
          key={p.id ?? i}
          position={[parseFloat(p.latitude), parseFloat(p.longitude)]} // [lat, lon]
        >
          <Popup>
            <strong>Ponto {p.ordem ?? i + 1}</strong>
            <br />
            Endereço: {p.endereco}
          </Popup>
        </Marker>
      ))}

      {rota.length > 0 && <Polyline positions={rota} />}
    </MapContainer>
  );
};

export default MapaPreview;
