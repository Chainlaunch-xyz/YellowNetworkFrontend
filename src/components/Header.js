import { useState, useEffect } from 'react';
import Image from 'next/image';
import useUserProfile from '../hooks/userProfile';
import Link from 'next/link';

const Header = () => {
  const { user, loading, error } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user profile</div>;


  return (
    <div className="w-100% flex justify-center">
      <header className="header w-[70%] text-white p-4 flex justify-center items-center">
        {/* Left side: Site Title with American Typewriter font */}
        <div className="flex-1 text-center ml-16">
          <Link href="/" className="font-semibold text-[25px]" style={{ fontFamily: "American Typewriter", cursor: "pointer" }}>
            YELLOW NETWORK
          </Link>
        </div>

        {/* Right side: User Info */}
        <div className="flex items-center space-x-4">
            
          <div className="flex items-center space-x-2">
            <div className="text-sm text-right" style={{ fontFamily: 'American Typewriter' }}>
                <p className="text-xs">{user?.name || 'Jericho'}</p>
                <Link href="/profile" className="text-xs hover:text-gray-400 cursor-pointer">
                  View Profile
                </Link>
            </div>
            {/* User logo with styles */}
            <div className="w-[34px] h-[34px] overflow-hidden border-2 border-gray-500 ml-[64px]">
                <Image
                src={user?.profileImage || '/profile.png'} // Use fallback image if user profile image is not available
                alt="User Logo"
                width={34}
                height={34}
                
                />
            </div>

            {/* User name and profile text */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
