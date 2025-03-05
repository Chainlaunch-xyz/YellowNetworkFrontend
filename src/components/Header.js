"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import ProfilePage from "../pages/profile"; // Import Profile Component
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for modal
  const router = useRouter();

  // Use session data directly
  const telegramData = session?.user || {};
  console.log(telegramData, "telegramData");

  // Check if the current route is "/"
  const isHomePage = router.pathname === "/";
  const isSignupPage = router.pathname === "/signup";

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated" && !isSignupPage) {
    if (typeof window !== "undefined") {
      console.log("Unauthenticated, redirecting to /signup from:", router.pathname);
      router.push("/signup");
    }
    return null; // Return nothing while redirecting
  }

  return (
    <div className="w-full flex justify-center">
      <header
        className={`w-[65%] text-white p-4 flex justify-center items-center ${
          isHomePage ? "bg-transparent" : "bg-[rgb(234,179,8)]"
        }`}
      >
        {/* Left Side: Title (Always Visible) */}
        <div
          className={`flex-1 text-center ml-16 z-10 w-full ${
            isHomePage ? "text-[rgb(234,179,8)]" : "text-black"
          }`}
        >
          <Link
            href="/"
            className="font-semibold text-[25px]"
            style={{ fontFamily: "American Typewriter", cursor: "pointer" }}
          >
            <span className="block md:hidden absolute left-0 text-left ml-4 top-[3%] font-meditative">
              N
            </span>{" "}
            {/* Left-aligned on mobile */}
            <span className="hidden md:block text-center">YELLOW NETWORK</span>{" "}
            {/* Centered on medium and larger screens */}
          </Link>
        </div>

        {/* Right Side: User Info (Only if Authenticated) */}
        {status === "authenticated" && (
          <div className="flex items-center space-x-4 z-10 text-black">
            <div className="flex items-center space-x-2">
              <div
                className={`text-sm text-right ${
                  isHomePage ? "text-[rgb(234,179,8)]" : "text-black"
                }`}
                style={{ fontFamily: "American Typewriter" }}
              >
                <p className="text-xs">{telegramData.username || telegramData.name || "Jericho"}</p>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="text-xs hover:text-gray-400 cursor-pointer"
                >
                  View Profile
                </button>
              </div>

              {/* User Avatar */}
              <div className="w-[34px] h-[34px] overflow-hidden border-2 border-gray-500 ml-[64px]">
                <Image
                  src={telegramData.photo_url || "/profile.png"}
                  alt="User Logo"
                  width={34}
                  height={34}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Profile Modal (Only if Authenticated) */}
      {status === "authenticated" && isProfileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsProfileOpen(false)} // Close when clicking background
        >
          <div
            className="relative bg-yellow-500 max-w-[90vw] h-[90vh] rounded-lg shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 bg-gray-300 rounded-full text-black hover:bg-gray-400 z-50"
            >
              ✖
            </button>

            {/* Profile Content */}
            <div className="max-h-full overflow-y-auto">
              <ProfilePage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;