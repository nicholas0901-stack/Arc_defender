import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

export default function DefenseGlobe() {
  const globeRef = useRef();

  useEffect(() => {
    const globe = globeRef.current;
    if (globe) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.6;
      globe.controls().enableZoom = false;
    }
  }, []);

  const attackData = [
    { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
    { lat: 51.5074, lng: -0.1278, name: "London" },
    { lat: 35.6895, lng: 139.6917, name: "Tokyo" },
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center mt-8">
      {/* 🌍 Centered Globe */}
      <div className="w-[80vw] max-w-[700px] h-[400px] md:h-[500px] mx-auto -mt-4">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          arcsData={attackData.map((d) => ({
            startLat: d.lat,
            startLng: d.lng,
            endLat: 0,
            endLng: 0,
            color: ["#00ffff", "#ff00ff"][Math.floor(Math.random() * 2)],
          }))}
          arcColor={"color"}
          arcDashLength={0.4}
          arcDashGap={1}
          arcDashAnimateTime={2000}
          pointsData={attackData}
          pointAltitude={0.02}
          pointColor={() => "#00ffff"}
          pointLabel={(d) => `${d.name}: Active Defense Node`}
        />
      </div>

     
    </div>
  );
}
