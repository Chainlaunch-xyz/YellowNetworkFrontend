"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function SignUp() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    title: "",
    country: "",
    city: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [isStamped, setIsStamped] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
  const LOCAL_URL = process.env.NEXT_PUBLIC_AUTH_URL;
  console.log("LOCAL_URL:", LOCAL_URL);
  const { publicKey, signMessage, connected } = useWallet();

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const randomPassportNumber = Math.floor(100000000 + Math.random() * 900000000);
    setPassportNumber(randomPassportNumber.toString());
    setFormattedDate(today.toLocaleDateString("en-GB", options).toUpperCase());

    console.log("Session Status:", status, "Session Data:", session);

    if (status === "authenticated" && session?.user?.telegramId) {
      console.log("User authenticated, setting telegramUser:", session.user);
      setTelegramUser({
        id: session.user.telegramId,
        username: session.user.username || session.user.name,
        first_name: session.user.first_name || ""
      });
      // Populate formData with session data if available
      setFormData({
        name: session.user.first_name || "",
        organization: session.user.organization || "",
        title: session.user.title || "",
        country: session.user.country || "",
        city: session.user.city || "",
      });
      setProfileImage(session.user.photo_url || null);
      if(
        session?.user?.telegramId &&
        session?.user?.username &&
        session?.user?.first_name &&
        session?.user?.organization &&
        session?.user?.title &&
        session?.user?.country &&
        session?.user?.city &&
        session?.user?.photo_url
      ){
        setIsStamped(true);
        setTimeout(() => router.push("/recommend"), 2000)
      }
    }

    // Check localStorage for Telegram data on load
    const storedData = localStorage.getItem("telegramData");
    if (storedData) {
      const telegramData = JSON.parse(storedData);
      console.log("Retrieved Telegram Data from localStorage:", telegramData);
      if (telegramData.id && telegramData.hash && !telegramUser) {
        handleTelegramCallback(telegramData);
        localStorage.removeItem("telegramData"); // Clean up
      }
    }
  }, [status, session, router]);

  const handleTelegramLogin = () => {
    setIsLoading(true);
    const AUTH_URL = `https://oauth.telegram.org/auth?bot_id=${BOT_USERNAME}&origin=${LOCAL_URL}&return_to=${LOCAL_URL}/telegram-callback`;
    console.log("Auth URL:", AUTH_URL);
    window.location.href = AUTH_URL; // Redirect main window
  };

  const handleTelegramCallback = async (telegramData) => {
    console.log("Handling Telegram Callback with data:", telegramData);
    setTelegramUser(telegramData);
    // Populate formData with Telegram data
    setFormData((prev) => ({
      ...prev,
      name: telegramData.first_name || "",
    }));
    setProfileImage(telegramData.photo_url || null);
    const response = await signIn("credentials", {
      redirect: false,
      ...telegramData,
    });
    console.log("SignIn Response:", response);
    setIsLoading(false);
    if (response?.error) {
      console.error("Authentication Error:", response.error);
      alert("Telegram authentication failed: " + response.error);
    } else {
      console.log("success")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      alert("Please authenticate with Telegram first.");
      return;
    }
    // Save additional form data to session or backend
    const updatedUserData = {
      ...telegramUser,
      ...formData,
      photo_url: profileImage, // Include updated photo if changed
    };

    console.log("Submitting updated user data:", updatedUserData);

    // Optionally save to backend or localStorage
    localStorage.setItem("userExtraData", JSON.stringify(updatedUserData));
    console.log("Sending request...");
    const response1 = await fetch("http://localhost:3000/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: telegramUser.first_name,
        email: "john@example.com",
        organization: formData.organization,
        title: formData.title,
        city: formData.city,
        country: formData.country,
        telegramUsername: telegramUser.username,
        image: profileImage,
      }),
    });
    const data = await response1.json();
    console.log(data, "data")
    // Update session with extra data
    const response = await signIn("credentials", {
      redirect: false,
      ...updatedUserData,
    });

    if (response?.error) {
      console.error("Failed to update session:", response.error);
      alert("Failed to update profile: " + response.error);
    } else {
      console.log("Profile updated successfully");
      setIsStamped(true);
      setTimeout(() => router.push("/recommend"), 2000); // Redirect only after submit
    }
  };

  const verifyWallet = async () => {
    if (!publicKey || !signMessage) {
      alert("Wallet not connected. Please connect your Solana wallet.");
      return;
    }
    try {
      const message = `Sign this message to verify wallet ownership: ${publicKey.toBase58()}`;
      const encodedMessage = new TextEncoder().encode(message);
      await signMessage(encodedMessage);
      alert("Wallet successfully verified!");
    } catch (error) {
      console.error("Signature verification failed:", error);
      alert("Signature verification failed. Please try again.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-yellow-500 flex items-center justify-center px-4 py-8 md:px-6 md:py-12" style={{ fontFamily: "American Typewriter" }}>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Issue your <span className="underline">Passport</span></h1>
          <label className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 flex items-center justify-center mb-4 border border-black cursor-pointer">
            {profileImage ? (
              <Image src={profileImage} alt="Uploaded Image" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <span className="text-black text-lg">🖼️</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="space-y-2 md:space-y-3">
            <label className="block text-xs md:text-sm">
              <span className="font-bold">Name *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"
                disabled={status === "authenticated"} // Disable if Telegram provided it
              />
            </label>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <label className="block text-xs md:text-sm">
                <span className="font-bold">Organization *</span>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"
                />
              </label>
              <label className="block text-xs md:text-sm">
                <span className="font-bold">Title *</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <label className="block text-xs md:text-sm">
                <span className="font-bold">Country *</span>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"
                />
              </label>
              <label className="block text-xs md:text-sm">
                <span className="font-bold">City *</span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"
                />
              </label>
            </div>
          </div>
          <div className="mt-6">
            <WalletMultiButton className="w-full bg-black text-white px-4 py-2 border border-black" />
          </div>
          <button onClick={verifyWallet} className="mt-4 w-full bg-green-600 text-white py-2">
            Verify Wallet Ownership
          </button>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-black text-white py-2 md:py-3 flex items-center justify-between px-4 md:px-6 text-xs md:text-sm"
          >
            <span>SUBMIT</span> <span>→</span>
          </button>

          <div className="mt-4 text-center">
            {status === "loading" && <p className="text-gray-800">Checking authentication...</p>}
            {isLoading && <p className="text-blue-600">Logging in with Telegram...</p>}
            {status === "authenticated" && telegramUser ? (
              <p className="text-green-600 font-bold">
                ✅ Logged in as @{telegramUser.username || telegramUser.first_name}
              </p>
            ) : (
              <>
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-t border-gray-800" />
                  <span className="px-3 text-gray-800 text-sm">or</span>
                  <hr className="flex-grow border-t border-gray-800" />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleTelegramLogin}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Login with Telegram"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:block w-[2px] bg-black mx-2"></div>
        <div className="ml-8 relative bg-gray-200 border-4 border-black p-4 md:p-6 shadow-lg flex flex-col ml-4 md:ml-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center mb-2 md:mb-4">
            <p className="text-lg md:text-2xl font-extrabold">PASSPORT</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm font-bold mt-1">
              <p>Type: <span className="font-normal">CITIZEN</span></p>
              <p>Country: <span className="font-normal">{formData.country || "N/A"}</span></p>
              <p>Passport No: <span className="font-normal">{passportNumber}</span></p>
            </div>
          </div>
          <div className="pb-2 flex flex-row-reverse md:flex-row items-start gap-2 md:gap-4 text-xs md:text-sm">
            <div className="w-16 h-16 md:w-24 md:h-24 border border-black flex-shrink-0">
              {profileImage ? (
                <Image src={profileImage} width={64} height={64} alt="Uploaded Profile" className="w-full h-full object-cover" />
              ) : (
                <Image src="/profile.png" width={64} height={64} alt="Default Avatar" className="w-full h-full" />
              )}
            </div>
            <div className="w-full break-words md:pb-[10%]">
              <p className="font-bold">
                Name <span className="font-normal">{formData.name || "N/A"}</span>
              </p>
              <p className="font-bold">
                Organization <span className="font-normal">{formData.organization || "N/A"}</span>
              </p>
              <p className="font-bold">
                Title <span className="font-normal">{formData.title || "N/A"}</span>
              </p>
              <p className="font-bold">
                Location <span className="font-normal">{formData.city ? `${formData.city}, ${formData.country}` : "N/A"}</span>
              </p>
              <p className="font-bold">
                Date issued <span className="font-normal">{formattedDate}</span>
              </p>
            </div>
          </div>
          <div className="bg-gray-00 text-xs md:text-sm font-mono break-words border-b-2 border-gray-500 pb-8 mb-2">
            C&lt;NTWRKCOMMUNITY&lt;&lt;YELLOW&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br/>
            Y000077303NTWRK6502056Y3010149500101920&lt;0020
          </div>
          <div className="w-full flex flex-col justify-center items-center min-h-[25vh] mt-2">
            <p className="text-gray-400 text-xs md:text-sm">Stamps go here*</p>
          </div>
          {isStamped && (
            <motion.div
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1.2, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="absolute bottom-10 right-10 md:bottom-16 md:right-16"
            >
              <Image src="/issued.png" alt="Approved Stamp" width={150} height={150} className="opacity-80" />
            </motion.div>
          )}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <p className="text-[10vh] font-extrabold text-black opacity-10 rotate-[-30deg] select-none">
              NTWRK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}