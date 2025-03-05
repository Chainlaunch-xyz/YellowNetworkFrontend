import BusinessCard from "@/components/BusinessCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]); // Holds the business card data
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalCount, setTotalCount] = useState(0); // Total number of records from the DB
  const [loading, setLoading] = useState(false); // Loading state
  const [type, setType] = useState(0); // Type of users (people, business, sponsor)
  const [selectedLetter, setSelectedLetter] = useState(null); // Selected letter filter
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const limit = 15; // Number of business cards per page

  useEffect(() => {
    fetchUsers();
  }, [currentPage, type, selectedLetter]); // Fetch users when these values change

  const handleClick = () => {
    setType(3);
    router.push("/");
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        perPage: limit,
      });

      // Add letter filter if a letter is selected
      if (selectedLetter) {
        params.append("alphabet", selectedLetter);
      }

      const response = await fetch(`${domain}/api/users?${params.toString()}`);
      const data = await response.json();
      setUsers(data.users);
      setTotalCount(data.totalUsers); // Ensure backend sends `totalUsers`
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex justify-center min-h-screen mb-2">
        <div className="w-[70%]">
          <div className="text-center text-black text-lg mb-4 mt-2" style={{ fontFamily: "American Typewriter" }}>
            <div className="flex flex-wrap justify-center">
              {letters.map((letter) => (
                <span
                  key={letter}
                  className={`cursor-pointer px-2 ${
                    selectedLetter === letter ? "font-bold text-black" : "text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setCurrentPage(1); // Reset to page 1 when selecting a new letter
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-8 mb-16 text-xs">
            <button onClick={() => setType(0)} className={`py-2 px-4 ${type === 0 ? "bg-black text-white" : "text-gray-500 bg-gray-100"} w-full sm:w-auto text-center`} style={{ fontFamily: "Type Machine" }}>people</button>
            <button onClick={() => setType(1)} className={`py-2 px-4 ${type === 1 ? "bg-black text-white" : "text-gray-500 bg-gray-100"} w-full sm:w-auto text-center`} style={{ fontFamily: "Type Machine" }}>business</button>
            <button onClick={() => setType(2)} className={`py-2 px-4 ${type === 2 ? "bg-black text-white" : "text-gray-500 bg-gray-100"} w-full sm:w-auto text-center`} style={{ fontFamily: "Type Machine" }}>sponsor</button>
            <button onClick={handleClick} className={`py-2 px-4 ${type === 3 ? "bg-black text-white" : "text-gray-500 bg-gray-100"} w-full sm:w-auto text-center`} style={{ fontFamily: "Type Machine" }}>map</button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
            {loading ? <div>Loading...</div> : users.map((user) => (
              <BusinessCard
                key={user.id} 
                name={user.name}
                image={user.image}
                title={user.title}
                companyName={user.organization}
                twitter={user.twitter}
                telegram={user.telegramUsername}
                linkedIn={user.linkedIn}
                email={user.email}
                phone={user.phone}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4 items-center text-xs">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200" style={{ fontFamily: 'Type Machine' }}>
              {`< Back`}
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => handlePageClick(index + 1)} className={`px-4 py-2 ${index + 1 === currentPage ? 'bg-black text-white' : 'bg-gray-100'}`} style={{ fontFamily: 'American Typewriter' }}>
                  {index + 1}
                </button>
              ))}
            </div>

            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200" style={{ fontFamily: 'Type Machine' }}>
              {`Next >`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
