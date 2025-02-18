"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiUserPlus, FiMail } from "react-icons/fi";

export default function RecommendPage() {
  const [inviteLink] = useState("https://ntwrk.com/jericho983");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Animation duration (3 seconds)
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
           <h1 className="text-yellow-500 text-4xl md:text-6xl lg:text-8xl font-bold font-meditative">
            NTWRK
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-500 p-6" style={{ fontFamily: "American Typewriter"}}>
      <div className="text-center w-full max-w-3xl relative flex flex-col items-center">
        {/* Early Access Label - Positioned on Top */}
        <div className="absolute top-[-12px] left-[24px] transform -translate-x-1/2 rotate-[-30deg] bg-black text-yellow-400 px-4 py-1 text-sm font-bold z-10">
          Early Access
        </div>

        {/* Title Box - Placed Under Early Access */}
        <h1 className="text-2xl md:text-5xl bg-white inline-block px-6 w-full py-2 border-2 border-black" style={{ fontFamily: "Montserrat" }}>
          Invite your network on <span className="font-meditative font-extrabold">NTWRK</span>
        </h1>

        {/* Invite Link */}
        <div className="mt-24 flex flex-col items-center space-y-4">
          <div className="flex items-center w-full max-w-lg border border-black px-4 py-3 bg-white">
            <FiUserPlus className="text-black mr-2" />
            <span className="flex-1 text-black text-sm md:text-lg">{inviteLink}</span>
            <button onClick={copyToClipboard} className="ml-3 p-1">
              <FiCopy className={`text-black ${copied ? "text-green-500" : ""}`} />
            </button>
          </div>

          {/* Invite by Email */}
          <div className="flex items-center w-full max-w-lg border border-black px-4 py-3 bg-white">
            <FiMail className="text-black mr-2" />
            <input
              type="email"
              placeholder="Invite others by email"
              className="flex-1 bg-transparent outline-none placeholder-gray-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && (
              <button onClick={() => setEmail("")} className="ml-3 p-1 text-gray-500">
                ✖
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
