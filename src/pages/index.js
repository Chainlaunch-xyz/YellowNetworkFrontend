"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { SearchIcon, CalendarIcon } from "@heroicons/react/outline";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const users = [
    { id: 1, name: "Alice", coordinates: [77.5946, 12.9716], telegram: "@jericho.xyz", twitter: "@jericho.xyz" },
    { id: 2, name: "Bob", coordinates: [-74.006, 40.7128], telegram: "@jericho.xyz", twitter: "@jericho.xyz" },
    { id: 3, name: "Charlie", coordinates: [139.6917, 35.6895], telegram: "@jericho.xyz", twitter: "@jericho.xyz" },
];

const events = [
    { id: 1, name: "Solana Hackathon", hostName: "Jericho", date: "March 10, 2025", location: "New York", link: "/register", image: "/flags/morocco.png" },
    { id: 2, name: "Crypto Expo", hostName: "Jericho", date: "April 5, 2025", location: "Dubai", link: "/register", image: "/flags/morocco.png" },
    { id: 3, name: "Blockchain Summit", hostName: "Jericho", date: "May 20, 2025", location: "Singapore", link: "register", image: "/flags/morocco.png" },
];

export default function Map() {
    const router = useRouter();
    const mapContainerRef = useRef(null);
    const [isGlobe, setIsGlobe] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    function toggleMap() {
        setIsGlobe((prev) => !prev);
    }

    function toggleMenu() {
        console.log("Toggling menu, current state:", menuOpen); // Debug log
        setMenuOpen((prev) => !prev);
    }

    function handleConnect() {
        router.push("/contacts");
    }

    useEffect(() => {
        if (!mapContainerRef.current) return;
        let map;

        if (!isGlobe) {
            mapboxgl.accessToken = MAPBOX_TOKEN;
            map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/dark-v11",
                center: [0, 0],
                zoom: 2,
                projection: "mercator",
                renderWorldCopies: false,
            });
        } else {
            mapboxgl.accessToken = MAPBOX_TOKEN;
            map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/dark-v11",
                center: [0, 0],
                zoom: 2,
            });
        }

        map.on("load", () => {
            map.addSource("user-points", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: users.map((user) => ({
                        type: "Feature",
                        properties: { name: user.name, telegram: user.telegram, twitter: user.twitter },
                        geometry: {
                            type: "Point",
                            coordinates: user.coordinates,
                        },
                    })),
                },
            });

            map.addLayer({
                id: "user-points-layer",
                type: "circle",
                source: "user-points",
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#eab308",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "black",
                },
            });

            map.on("click", "user-points-layer", (e) => {
                const coordinates = e.features[0].geometry.coordinates;
                const name = e.features[0].properties.name;
                const twitter = e.features[0].properties.twitter;
                const telegram = e.features[0].properties.telegram;

                new mapboxgl.Popup({ className: "map-user-popup", closeButton: false, offset: 10 })
                    .setLngLat(coordinates)
                    .setHTML(`
                    <div style="display: flex; align-items: center; background-color: #eab308; 
                border-radius: 8px; overflow: hidden; margin: 0; padding: 0; width: auto; height: auto;">
                
                <img src="./yellow-pfp.jpeg" alt="${name}" width="50" height="50"
                    style="border-radius: 50%; margin: 0; padding: 0; object-fit: cover; display: block;" />
                
                <div style="padding: 8px; margin: 0; text-align: left; line-height: 1.2;">
                    <b style="font-size: 16px; color: black;">${name}</b>
                    
                    <a href="https://twitter.com/${twitter}" target="_blank" 
                        style="display: flex; align-items: center; text-decoration: none; color: black; margin-top: 4px;">
                        <img src="/X_logo.jpg" alt="Twitter" width="16" height="16" 
                            style="margin-right: 5px; object-fit: contain;" />
                        ${twitter}
                    </a>
                    
                    <a href="https://t.me/${telegram}" target="_blank" 
                        style="display: flex; align-items: center; text-decoration: none; color: black; margin-top: 4px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                            alt="Telegram" width="16" height="16" style="margin-right: 5px; object-fit: contain;" />
                        ${telegram}
                    </a>
                </div>
            </div>
                    `)
                    .addTo(map);
            });

            map.on("mouseenter", "user-points-layer", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "user-points-layer", () => {
                map.getCanvas().style.cursor = "";
            });
        });
    }, [isGlobe]);

    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden" style={{ fontFamily: "American Typewriter" }}>
            {/* 🌍 Toggle Globe Button */}
            <button
                className="absolute top-20 right-4 bg-yellow-500 text-black px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition z-50"
                onClick={toggleMap}
            >
                <img src="/globe.png" alt="Globe Icon" className="w-6 h-6" />
            </button>

            {/* 📅 Open Events Menu Button */}
            <button
                className="absolute top-20 left-4 bg-yellow-500 text-black px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition z-50"
                onClick={toggleMenu}
            >
                <CalendarIcon className="w-6 h-6" />
            </button>

            <button
                className="fixed bottom-8 left-4 bg-yellow-500 text-black px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition z-50"
                onClick={handleConnect}
            >
                <SearchIcon className="w-6 h-6" />
            </button>

            {/* 📜 Side Menu Drawer */}
            <div
                className={`absolute top-0 left-0 h-full w-3/4 md:w-[24%] lg:w-[24%] bg-yellow-600 shadow-lg transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                } z-[60]`} // Responsive width: 75% on mobile, 384px on md+
            >
                {/* ❌ Close Button */}
                <button
                    className="absolute top-4 right-4 text-black text-lg z-[70]"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        toggleMenu();
                    }}
                >
                    ✖
                </button>

                {/* 📅 Event Details (Scrollable) */}
                <div className="p-6 mt-12 h-[calc(100vh-80px)] overflow-y-auto">
                    <h2 className="text-black text-xl font-bold mb-4">Events</h2>
                    <ul>
                        {events.map((event) => (
                            <li
                                key={event.id}
                                className="mb-4 p-4 bg-yellow-400 shadow flex flex-col md:flex-row items-center justify-between border rounded-lg" // Stack on mobile, row on md+
                            >
                                {/* 📜 Event Details */}
                                <div className="flex-1 pr-0 md:pr-4 mb-4 md:mb-0"> {/* No padding-right on mobile */}
                                    <h3 className="text-black font-semibold text-lg">{event.name}</h3>
                                    <p className="text-black text-sm">Host: {event.hostName}</p>
                                    <p className="text-black text-sm">{event.date}</p>
                                    <p className="text-black text-sm">{event.location}</p>
                                    <div className="w-full flex justify-start mt-2">
                                        <button className="bg-white text-black px-4 py-2 border border-black shadow-md hover:bg-gray-100 transition">
                                            Register
                                        </button>
                                    </div>
                                </div>

                                {/* 🌍 Event Image */}
                                <div className="flex-shrink-0">
                                    <Image
                                        src={event.image || `/profile.png`}
                                        alt="Event"
                                        width={80}
                                        height={80}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 🌍 Map Container */}
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
    );
}