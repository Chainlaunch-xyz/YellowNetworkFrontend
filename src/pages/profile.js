"use client";
import Image from "next/image";

export default function ProfilePage() {
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
              <p>Country: <span className="font-normal">USA</span></p>
            </div>

            {/* Passport No (Fixed Inside) */}
            <div className="flex-1 text-right overflow-hidden">
              <p>Passport No</p>
              <p className="font-bold text-black truncate">YLW0123456</p>
            </div>
          </div>

          {/* 🔹 Profile Info */}
          <div className="flex items-center mt-4 flex-1">
            {/* Profile Image */}
            <div className="w-24 h-24 border-2 border-gray-500">
              <Image
                src="/yellow-pfp.jpeg"
                alt="Profile Picture"
                width={96}
                height={96}
                className="w-full h-full"
              />
            </div>

            {/* Text Details */}
            <div className="ml-6 text-sm">
              <h2 className="font-bold">Name: <span className="font-normal">JERICHO</span></h2>
              <p className="font-bold">Organization: <span className="font-normal">NTWRK MEDIA</span></p>
              <p className="font-bold">Title: <span className="font-normal">CEO</span></p>
              <p className="font-bold">Date Issued: <span className="font-normal">18 FEB 2024</span></p>
              <p className="font-bold">Location: <span className="font-normal">LOS ANGELES, USA</span></p>
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
