"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "JERICHO",
    organization: "NTWRK MEDIA",
    title: "CEO",
    country: "INDIA",
    city: "MUMBAI",
  });

  const [verified, setVerified] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [isStamped, setIsStamped] = useState(false);


  // Ensure the component is only mounted on the client
  useEffect(() => {
    setIsClient(true);

    // Format date only on the client
    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const randomPassportNumber = Math.floor(100000000 + Math.random() * 900000000);
    setPassportNumber(randomPassportNumber.toString());
    setFormattedDate(today.toLocaleDateString("en-GB", options).toUpperCase());
  }, []);

  const { publicKey, signMessage, connected } = useWallet();

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsStamped(true); // Show stamp animation
    setTimeout(() => {
      router.push("/recommend"); // Redirect after 3 seconds
    }, 2000);
  };


  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Wallet Verification
  const verifyWallet = async () => {
    if (!publicKey || !signMessage) {
      alert("Wallet not connected. Please connect your Solana wallet.");
      return;
    }
    try {
      const message = `Sign this message to verify wallet ownership: ${publicKey.toBase58()}`;
      const encodedMessage = new TextEncoder().encode(message);
      await signMessage(encodedMessage);
      setVerified(true);
      alert("Wallet successfully verified!");
    } catch (error) {
      console.error("Signature verification failed:", error);
      alert("Signature verification failed. Please try again.");
    }
  };
  

  // Prevent rendering on the server
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-yellow-500 flex items-center justify-center px-4 py-8 md:px-6 md:py-12" style={{ fontFamily: "American Typewriter" }}>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-4 md:gap-6">
        
        {/* Left Section: Form */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Issue your <span className="underline">Passport</span></h1>

          {/* Profile Picture Upload */}
          <label className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 flex items-center justify-center mb-4 border border-black cursor-pointer">
            {profileImage ? (
              <Image src={profileImage} alt="Uploaded Image" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <span className="text-black text-lg">🖼️</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          {/* Form Inputs */}
          <div className="space-y-2 md:space-y-3">
            <label className="block text-xs md:text-sm">
              <span className="font-bold">Name *</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"/>
            </label>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <label className="block text-xs md:text-sm">
                <span className="font-bold">Organization *</span>
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"/>
              </label>

              <label className="block text-xs md:text-sm">
                <span className="font-bold">Title *</span>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"/>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
              <label className="block text-xs md:text-sm">
                <span className="font-bold">Country *</span>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"/>
              </label>

              <label className="block text-xs md:text-sm">
                <span className="font-bold">City *</span>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-black p-1 md:p-2 bg-white text-xs md:text-sm"/>
              </label>
            </div>

          {/* Connect Wallet Button */}
          <div className="mt-6">
            <WalletMultiButton className="w-full bg-black text-white px-4 py-2 border border-black" />
          </div>

          {/* Verify Wallet Button */}
          {!verified ? (
            <button onClick={verifyWallet} className="mt-4 w-full bg-green-600 text-white py-2">
              Verify Wallet Ownership
            </button>
          ) : (
            <p className="mt-2 text-green-600 text-sm font-bold">✅ Wallet Verified</p>
          )}

          {/* Submit Button */}
          <button onClick={handleSubmit} className="mt-6 w-full bg-black text-white py-2 md:py-3 flex items-center justify-between px-4 md:px-6 text-xs md:text-sm">
            <span>SUBMIT</span> <span>→</span>
          </button>
        </div>

        {/* 🔹 Vertical Separator Line */}
        <div className="hidden md:block w-[2px] bg-black mx-2"></div>

        {/* Right Section: Passport Preview */}
        <div className="ml-8 relative bg-gray-200 border-4 border-black p-4 md:p-6 shadow-lg flex flex-col ml-4 md:ml-6 overflow-hidden">
  {/* Header Section: PASSPORT and Barcode */}
  <div className="flex flex-col items-center justify-center mb-2 md:mb-4">
  <p className="text-lg md:text-2xl font-extrabold">PASSPORT</p>
  
  {/* Three items in a single row */}
  <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm font-bold mt-1">
    <p>Type: <span className="font-normal">CITIZEN</span></p>
    <p>Country: <span className="font-normal">{formData.country}</span></p>
    <p>Passport No: <span className="font-normal">{passportNumber}</span></p>
  </div>
</div>

  {/* Passport Details */}
  <div className="pb-2 flex flex-row-reverse md:flex-row items-start gap-2 md:gap-4 text-xs md:text-sm">
    {/* Profile Image on Right (Mobile) & Left (Desktop) */}
    <div className="w-16 h-16 md:w-24 md:h-24 border border-black flex-shrink-0">
      {profileImage ? (
        <Image src={profileImage} width={64} height={64} mdWidth={96} mdHeight={96} alt="Uploaded Profile" className="w-full h-full object-cover"/>
      ) : (
        <Image src="/profile.png" width={64} height={64} mdWidth={96} mdHeight={96} alt="Default Avatar" className="w-full h-full"/>
      )}
    </div>

    {/* Profile Details */}
    <div className="w-full break-words md:pb-[10%]">
      <p className="font-bold">Name <span className="font-normal">{formData.name}</span></p>
      <p className="font-bold">Organization <span className="font-normal">{formData.organization}</span></p>
      <p className="font-bold">Title <span className="font-normal">{formData.title}</span></p>
      <p className="font-bold">Location <span className="font-normal">{formData.city}, {formData.country}</span></p>
      <p className="font-bold">Date issued <span className="font-normal">{formattedDate}</span></p>
    </div>
  </div>

  {/* 🔹 Passport Code */}
  <div className="bg-gray-00 text-xs md:text-sm font-mono break-words border-b-2 border-gray-500 mb-2">
    C&lt;NTWRKCOMMUNITY&lt;&lt;YELLOW&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
    <br/>
    Y000077303NTWRK6502056Y3010149500101920&lt;0020
  </div>

  {/* Stamps Placeholder */}
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
                <Image 
                  src="/issued.png" // Replace with actual path
                  alt="Approved Stamp"
                  width={150} // Adjust size
                  height={150} 
                  className="opacity-80"
                />
              </motion.div>
              )}

  {/* Watermark */}
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
