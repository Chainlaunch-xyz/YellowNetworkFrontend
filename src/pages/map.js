"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaTwitter, FaTelegramPlane, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const users = [
    { id: 1, name: "Alice", coordinates: [77.5946, 12.9716], telegram: "@jericho.xyz", twitter: "@jericho.xyz" }, // Bangalore
    { id: 2, name: "Bob", coordinates: [-74.006, 40.7128], telegram: "@jericho.xyz", twitter: "@jericho.xyz" }, // New York
    { id: 3, name: "Charlie", coordinates: [139.6917, 35.6895], telegram: "@jericho.xyz", twitter: "@jericho.xyz" }, // Tokyo
    { id: 4, name: "Alice", coordinates: [45.5946, 12.9716], telegram: "@jericho.xyz", twitter: "@jericho.xyz" }, // Bangalore
    { id: 5, name: "Bob", coordinates: [-25.006, 40.7128], telegram: "@jericho.xyz", twitter: "@jericho.xyz" }, // New York
    { id: 6, name: "Charlie", coordinates: [150.6917, 35.6895], telegram: "@jericho.xyz", twitter: "@jericho.xyz" } // Tokyo
];

export default function Map() {
    const mapContainerRef = useRef(null);
    const [isGlobe, setIsGlobe] = useState(false)


    function toggleMap(){
        setIsGlobe((prev) => !prev);
    }

    useEffect(() => {
        if (!mapContainerRef.current) return;
        let map
        if(!isGlobe){
            mapboxgl.accessToken = MAPBOX_TOKEN;
            map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/dark-v11", // 🔥 Dark Theme
                center: [0, 0], // Longitude, Latitude
                zoom: 2,
                projection: "mercator", // 🌍 Flat map projection
                renderWorldCopies: false, // Prevents globe effect
            });
        }else{
            mapboxgl.accessToken = MAPBOX_TOKEN;
            map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/dark-v11", // 🔥 Dark Theme
                center: [0, 0], // Longitude, Latitude
                zoom: 2,
            });
        }
       
        map.on("load", () => {
            // 🔥 Add User Points as a GeoJSON Source
            map.addSource("user-points", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: users.map((user) => ({
                        type: "Feature",
                        properties: { name: user.name, telegram: user.telegram, twitter: user.twitter, profileImage:"./yellow-pfp.jpeg" },
                        geometry: {
                            type: "Point",
                            coordinates: user.coordinates,
                        },
                    })),
                },
            });

            // ✅ Add Circle Layer for Small Yellow Points
            map.addLayer({
                id: "user-points-layer",
                type: "circle",
                source: "user-points",
                paint: {
                    "circle-radius": 5, // Size of the point
                    "circle-color": "#eab308", 
                    "circle-stroke-width": 1, // Border width
                    "circle-stroke-color": "black", // Border color
                },
            });

            // ✅ Add Popup on Click
            map.on("click", "user-points-layer", (e) => {
                const coordinates = e.features[0].geometry.coordinates;
                const name = e.features[0].properties.name;
                const twitter = e.features[0].properties.twitter;
                const telegram = e.features[0].properties.telegram;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(`
                <div style="display: flex; align-items: center;">
                    <img src="./yellow-pfp.jpeg" alt="${name}" width="50" height="50" 
                        style="border-radius: 50%; margin-right: 10px;" />
                <div>
                <b style="font-size: 16px; display: block; margin-bottom: 10px;">${name}</b>

                    <a href="https://twitter.com/${twitter}" target="_blank" style="display: flex; align-items: center; text-decoration: none; color: gray;">
                        <img src="/X_logo.jpg" alt="Twitter" width="16" height="16" style="margin-right: 5px;" />
                        ${twitter}
                    </a><br>
                    <a href="https://t.me/${telegram}" target="_blank" style="display: flex; align-items: center; text-decoration: none; color: gray;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" width="16" height="16" style="margin-right: 5px;" />
                        ${telegram}
                    </a>
                </div>
            </div>
        `)
        .addTo(map);
            });

            // ✅ Change Cursor to Pointer on Hover
            map.on("mouseenter", "user-points-layer", () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "user-points-layer", () => {
                map.getCanvas().style.cursor = "";
            });
        });
        
        
        
    }, [isGlobe]);

    return (
        <div className="relative h-screen w-full">
            {/* 🔥 Top-Left Button */}
            <button
                className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition z-50"
                onClick={toggleMap}
            >
                 <img src="/globe.png" alt="Globe Icon" className="w-6 h-6" />
            </button>

            {/* Map Container */}
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
    );
}
