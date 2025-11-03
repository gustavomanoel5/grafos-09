import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

const FitBounds = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route);
    }
  }, [route, map]);

  return null;
};

const MapComponent = ({ coordinates }) => {
  const [route, setRoute] = useState([]);
  const lastCoords = useRef(null);

  // memoriza para evitar recriação em cada render
  const numericCoords = useMemo(() => {
    return (coordinates || [])
      .map((coord) => {
        if (Array.isArray(coord)) {
          return [Number(coord[0]), Number(coord[1])];
        } else if (coord?.latitude && coord?.longitude) {
          return [Number(coord.latitude), Number(coord.longitude)];
        }
        return null;
      })
      .filter(
        (c) =>
          c &&
          !isNaN(c[0]) &&
          !isNaN(c[1]) &&
          Math.abs(c[0]) <= 90 &&
          Math.abs(c[1]) <= 180
      );
  }, [coordinates]);

  useEffect(() => {
    if (numericCoords.length < 2) {
      if (route.length > 0) setRoute([]); // evita loop desnecessário
      return;
    }

    const coordsString = JSON.stringify(numericCoords);

    if (lastCoords.current === coordsString) return;
    lastCoords.current = coordsString;

    const timeout = setTimeout(() => {
      const osrmBaseUrl = "https://router.project-osrm.org/route/v1/driving/";
      const coordsQuery = numericCoords
        .map(([lat, lng]) => `${lng},${lat}`)
        .join(";");

      const url = `${osrmBaseUrl}${coordsQuery}?overview=full&geometries=geojson`;

      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("Erro na requisição da rota");
          return response.json();
        })
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            setRoute(
              data.routes[0].geometry.coordinates.map(([lng, lat]) => [
                lat,
                lng,
              ])
            );
          } else {
            toast.warn("Nenhuma rota encontrada para os pontos selecionados.");
            setRoute([]);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar rota:", error);
          toast.error("Erro ao buscar rota no servidor de rotas.");
          setRoute([]);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [numericCoords, route]);

  return (
    <MapContainer
      center={numericCoords[0] || [0, 0]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {route.length > 0 && (
        <>
          <Polyline positions={route} color="blue" />
          <FitBounds route={route} />
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;
