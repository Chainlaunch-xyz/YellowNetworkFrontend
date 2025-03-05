import Image from "next/image";
import { FaTwitter, FaTelegramPlane, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const BusinessCard = ({ 
    name = "John Doe",
    image = null,
    title = "CEO", 
    companyName = "Boring Company", 
    twitter = "#", 
    telegram = "#", 
    linkedIn = "#", 
    email = "john.doe@example.com", 
    phone = "+1234567890" 
  }) => {
    return (
      <div className="flex flex md:flex-row items-center bg-white border-2 border-black shadow-md w-full md:w-full  h-auto md:h-auto font-type-machine mb-4">
        {/* Profile Image */}
        <div className="bg-green-200 w-auto">
          <Image 
            src={image || `/profile.png`} // Replace with actual image path
            alt="Profile"
            width={80}
            height={80}
            className="md:w-20 md:h-20"
          />
        </div>
  
        {/* Info Section */}
        <div className="ml-4 text-center md:text-left">
          <h2 className="text-sm" style={{ fontFamily: 'Type Machine' }}>{name} | {title}</h2>
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Type Machine' }}>{companyName}</p>
  
          {/* Icons Section */}
          <div className="flex space-x-2 mt-2 text-gray-700 text-xs justify-center md:justify-start">
            <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-500">
              <FaTwitter />
            </a>
            <a href={`https://t.me/${twitter}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-blue-400">
              <FaTelegramPlane />
            </a>
            <a href={linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700">
              <FaLinkedin />
            </a>
            <a href={`mailto:${email}`} aria-label="Email" className="hover:text-red-500">
              <FaEnvelope />
            </a>
            <a href={`tel:${phone}`} aria-label="Phone" className="hover:text-green-500">
              <FaPhone />
            </a>
            
          </div>
          
        </div>
        
      </div>
    );
  };

export default BusinessCard;
