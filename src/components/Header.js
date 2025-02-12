import { useState } from "react";
import Image from "next/image";
import useUserProfile from "../hooks/userProfile";
import Link from "next/link";
import ProfilePage from "../pages/profile"; // Import Profile Component

const Header = () => {
  const { user, loading, error } = useUserProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for modal

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user profile</div>;

  return (
    <div className="w-100% flex justify-center">
      <header className="header w-[70%] text-white p-4 flex justify-center items-center">
        {/* Left Side: Title */}
        <div className="flex-1 text-center ml-16">
          <Link href="/" className="font-semibold text-[25px]" style={{ fontFamily: "American Typewriter", cursor: "pointer" }}>
            YELLOW NETWORK
          </Link>
        </div>

        {/* Right Side: User Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-right" style={{ fontFamily: "American Typewriter" }}>
              <p className="text-xs">{user?.name || "Jericho"}</p>
              <button onClick={() => setIsProfileOpen(true)} className="text-xs hover:text-gray-400 cursor-pointer">
                View Profile
              </button>
            </div>

            {/* User Avatar */}
            <div className="w-[34px] h-[34px] overflow-hidden border-2 border-gray-500 ml-[64px]">
              <Image
                src={user?.profileImage || "/profile.png"}
                alt="User Logo"
                width={34}
                height={34}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
     {/* Profile Modal */}
{isProfileOpen && (
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
