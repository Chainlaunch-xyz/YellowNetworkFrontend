import Image from "next/image";

const InviteCard = ({ 
  name = "John Doe", 
  title = "CEO",
  companyName = "Boring Company", 
  profileImage = "/profile.png", 
  country = "ma" // Morocco (ISO 3166-1 alpha-2 country code)
}) => {
  
  return (
    <div className="flex items-center bg-white  w-[100%] h-auto relative" style={{ fontFamily: 'American Typewriter' }}>
      
      {/* Profile Image */}
      <div className="bg-green-200 w-auto h-auto flex items-center justify-center ">
        <Image 
          src={profileImage || `/profile.png`}
          alt="Profile"
          width={70}
          height={70}
          className=""
        />
      </div>

      {/* Info Section */}
      <div className="ml-4 flex-grow">
        <h2 className="text-sm font-bold">{name} | {title}</h2>
        <p className="text-xs text-gray-600">{companyName}</p>
      </div>

      {/* Country Flag */}
      <div className="absolute right-[-20px] top-1/2 translate-y-[-50%]">
        <Image 
          src={`/flags/${"morocco"}.png`} // Loads from /public/flags/
          alt={`${country} flag`}
          width={60}
          height={20}
          className="rounded-sm"
        />
      </div>

    </div>
  );
};

export default InviteCard;
