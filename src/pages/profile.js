"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "JERICHO",
    organization: "NTWRK MEDIA",
    title: "CEO",
    country: "USA",
    city: "LOS ANGELES",
    dateIssued: "18 FEB 2024",
    passportNo: "YLW0123456",
    photoUrl: "/yellow-pfp.jpeg",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup"); // Redirect to signup if not logged in
    } else if (status === "authenticated" && session?.user) {
      // Update userData with Telegram session data
      const telegramData = session.user;
      console.log("Telegram Data:", telegramData); // Debug log
      const today = new Date();
      const options = { day: "2-digit", month: "short", year: "numeric" };
      const formattedDate = today.toLocaleDateString("en-GB", options).toUpperCase();
      const randomPassportNumber = `YLW${Math.floor(1000000 + Math.random() * 9000000)}`;

      setUserData({
        name: telegramData.first_name || telegramData.username || "JERICHO",
        organization: telegramData.organization || "NTWRK MEDIA", // Use session data or fallback
        title: telegramData.title || "CEO",
        country: telegramData.country || "USA",
        city: telegramData.city || "LOS ANGELES",
        dateIssued: formattedDate,
        passportNo: randomPassportNumber,
        photoUrl: telegramData.photo_url || "/yellow-pfp.jpeg",
      });
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-yellow-500 flex flex-col items-center" style={{ fontFamily: "American Typewriter" }}>
      {/* 🔹 Content Wrapper */}
      <div className="relative flex bg-gray-200 p-2 flex-col w-full max-w-[90vh] max-h-[90vh] overflow-y-auto flex-1">
        {/* 🔹 Passport Section (Top) */}
        <div className="relative bg-gray-300 w-full shadow-lg border-4 border-yellow-600 p-6 flex flex-col min-h-[50vh] z-10 overflow-hidden">
          {/* 🔹 Watermark (Inside the Wrapper) */}
          <div className="absolute inset-0 flex justify-end items-center pointer-events-none z-0 ml-[25%]">
            <p className="text-[7vh] font-extrabold text-black opacity-10 rotate-[-30deg] select-none">
              NTWRK
            </p>
          </div>

          {/* 🔹 Header (Fixed Spacing) */}
          <div className="flex justify-between items-center text-sm font-bold text-gray-700">
            <div className="flex-1">
              <p>PASSPORT</p>
              <p className="tracking-widest text-xs">.-. .--. .- .</p>
            </div>
            {/* Type & Country */}
            <div className="flex-1 text-center">
              <p>Type: <span className="font-normal">CITIZEN</span></p>
              <p>Country: <span className="font-normal">{userData.country}</span></p>
            </div>
            {/* Passport No (Fixed Inside) */}
            <div className="flex-1 text-right overflow-hidden">
              <p>Passport No</p>
              <p className="font-bold text-black truncate">{userData.passportNo}</p>
            </div>
          </div>

          {/* 🔹 Profile Info */}
          <div className="flex items-center mt-4 flex-1">
            {/* Profile Image */}
            <div className="w-24 h-24 border-2 border-gray-500">
              <Image
                src={userData.photoUrl}
                alt="Profile Picture"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text Details */}
            <div className="ml-6 text-sm">
              <h2 className="font-bold">
                Name: <span className="font-normal">{userData.name}</span>
              </h2>
              <p className="font-bold">
                Organization: <span className="font-normal">{userData.organization}</span>
              </p>
              <p className="font-bold">
                Title: <span className="font-normal">{userData.title}</span>
              </p>
              <p className="font-bold">
                Date Issued: <span className="font-normal">{userData.dateIssued}</span>
              </p>
              <p className="font-bold">
                Location: <span className="font-normal">{userData.city}, {userData.country}</span>
              </p>
            </div>
          </div>

          {/* 🔹 Passport Code */}
          <div className="mt-4 p-3 bg-gray-300 text-xs overflow-hidden font-mono text-wrap border-t border-gray-400">
            C&lt;NTWRKCOMMUNITY&lt;&lt;YELLOW&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;AbcEfcDeasdigkdsfYEllowNTWRK
            <br />
            Y000077303NTWRK6502056Y3010149500101920&lt;0020&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;YeLLOOOOOW
          </div>
        </div>

        {/* 🔹 Dotted Line Separator */}
        <div className="border-t border-dotted border-gray-500 my-2 w-full"></div>

        {/* 🔹 Stamps Section (Bottom) */}
        <div className="stamp-container bg-gray-300 w-full border-4 border-yellow-600 shadow-lg p-4 grid grid-cols-4 gap-2 min-h-[50vh] z-10">
          {[
            { id: 1, name: "EDITION 1", location: "HONG KONG" },
            { id: 2, name: "EDITION 2", location: "HONG KONG", grayscale: true },
            { id: 3, name: "EDITION 3", location: "DUBAI" },
            { id: 4, name: "EDITION 4", location: "LAS VEGAS", grayscale: true },
            { id: 5, name: "EDITION 5", location: "NYC" },
            { id: 6, name: "EDITION 6", location: "HONG KONG" },
          ].map((stamp) => (
            <div key={stamp.id} className="relative p-1 flex flex-col items-center">
              <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1 py-[2px] rounded">
                {stamp.id}
              </span>
              <Image
                src={stamp.grayscale ? "/stamp.png" : "/stamp.png"}
                alt={stamp.name}
                width={60}
                height={60}
                className="w-[15vh] h-auto rounded-lg"
              />
              <p className="text-black text-xs font-bold mt-1 text-center">{stamp.name}</p>
              <p className="text-gray-600 text-[10px] text-center">{stamp.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}