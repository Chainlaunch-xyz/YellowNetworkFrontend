import Link from 'next/link';
import { SearchIcon } from '@heroicons/react/outline';
  // Correct import

export default function Footer() {
  return (
    <footer className="footer w-full bg-black text-white py-10">
      <div className="w-full mx-auto flex flex-wrap items-start justify-between px-50">
        
        {/* Left Section - Logo & Description (30%) */}
        <div className="w-full md:w-[25%]">
          <h2 className="text-3xl font-bold">NTWRKMAG</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Center Section - Links (40%) */}
        <div className="w-full md:w-[45%] grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Company */}
          <div>
            <h3 className="footer-title text-yellow-400 font-semibold">Company</h3>
            <ul className="mt-2 space-y-1">
              <li className='text-sm'><Link href="#">About</Link></li>
              <li className='text-sm'><Link href="#">Contact Us</Link></li>
              <li className='text-sm'><Link href="#">Magazine</Link></li>
              <li className='text-sm'><Link href="#">Advertise</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="footer-title text-yellow-400 font-semibold">Community</h3>
            <ul className="mt-2 space-y-1">
              <li className='text-sm'><Link href="#">Yellow NFT</Link></li>
              <li className='text-sm'><Link href="#">PFP Generator</Link></li>
              <li className='text-sm'><Link href="#">Telegram</Link></li>
              <li className='text-sm'><Link href="#">Discord</Link></li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="footer-title text-yellow-400 font-semibold">Follow</h3>
            <ul className="mt-2 space-y-1">
              <li className='text-sm'><Link href="#">NTWRKYellow</Link></li>
              <li className='text-sm'><Link href="#">NTWRKMag</Link></li>
              <li className='text-sm'><Link href="#">SyndicateAI</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="footer-title text-yellow-400 font-semibold">Resources</h3>
            <ul className="mt-2 space-y-1">
              <li className='text-sm'><Link href="#">Terms of Service</Link></li>
              <li className='text-sm'><Link href="#">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Right Section - Search Bar (30%) */}
        <div className="w-full md:w-[25%] flex justify-end relative">
          <input 
            type="text" 
            placeholder="Search Network..." 
            className="w-full md:w-90 px-4 py-2 rounded-md text-black border-none outline-none pl-10" // Add padding for the icon
          />
          {/* <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> Add Search icon */}
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

        </div>

      </div>
    </footer>
  );
}
