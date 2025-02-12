import BusinessCard from "@/components/BusinessCard";
import InviteCard from "@/components/InviteCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState([]); // Holds the business card data
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalCount, setTotalCount] = useState(0); // Total number of records from the DB
  const [loading, setLoading] = useState(false); // Loading state
  const [type, setType] = useState(0); // Type of users (people, business, sponsor)
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState(null);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const limit = 15; // Number of business cards per page

  useEffect(() => {
    // fetchUsers();
  }, [currentPage, type]); // Fetch users when currentPage or type changes

  const handleClick = () => {
    setType(3);
    router.push("/"); // Redirects to /map
  }

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const offset = (currentPage - 1) * limit; // Calculate the offset
      const response = await fetch(`/api/businessCards?type=${type}&limit=${limit}&offset=${offset}`);
      const data = await response.json();

      setUsers(data.cards); // Assuming the response contains a 'cards' key with the data
      setTotalCount(data.totalCount); // Assuming the response contains the total number of records
    } catch (error) {
      console.error("Error fetching business cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit); // Calculate total pages based on totalCount

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Render page numbers around the current page
  const renderPageNumbers = () => {
    const pages = [];
    const range = 2; // Number of pages to show before and after currentPage

    // Add previous pages
    for (let i = Math.max(currentPage - range, 1); i < currentPage; i++) {
      pages.push(i);
    }

    // Add the current page
    pages.push(currentPage);

    // Add next pages
    for (let i = currentPage + 1; i <= Math.min(currentPage + range, totalPages); i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageClick(page)}
        className={`px-4 py-2 ${page === currentPage ? 'bg-black text-white' : 'bg-gray-100'}`}
        style={{ fontFamily: 'American Typewriter' }}
      >
        {page}
      </button>
    ));
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
        onClick={() => setSelectedLetter(letter)}
      >
        {letter}
      </span>
    ))}
  </div>
</div>

        
      <div className="flex flex-wrap justify-center gap-2 sm:gap-8 mb-16 text-xs">
  <button
    onClick={() => setType(0)}
    className={`py-2 px-4 ${
      type === 0 ? "bg-black text-white" : "text-gray-500 bg-gray-100"
    } w-full sm:w-auto text-center`}
    style={{ fontFamily: "Type Machine" }}
  >
    people
  </button>
  <button
    onClick={() => setType(1)}
    className={`py-2 px-4 ${
      type === 1 ? "bg-black text-white" : "text-gray-500 bg-gray-100"
    } w-full sm:w-auto text-center`}
    style={{ fontFamily: "Type Machine" }}
  >
    business
  </button>
  <button
    onClick={() => setType(2)}
    className={`py-2 px-4 ${
      type === 2 ? "bg-black text-white" : "text-gray-500 bg-gray-100"
    } w-full sm:w-auto text-center`}
    style={{ fontFamily: "Type Machine" }}
  >
    sponsor
  </button>
  <button
    onClick={handleClick}
    className={`py-2 px-4 ${
      type === 3 ? "bg-black text-white" : "text-gray-500 bg-gray-100"
    } w-full sm:w-auto text-center`}
    style={{ fontFamily: "Type Machine" }}
  >
    map
  </button>
</div>


        {/* Grid Layout: Responsive for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
          {loading ? (
            <div>Loading...</div>
          ) : (
            users.map((user) => (
              <BusinessCard
                key={user.id} // Assuming each user has a unique 'id'
                name={user.name}
                title={user.title}
                companyName={user.companyName}
                twitter={user.twitter}
                telegram={user.telegram}
                linkedIn={user.linkedIn}
                email={user.email}
                phone={user.phone}
              />
            ))
          )}
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4 items-center text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200"
            style={{ fontFamily: 'Type Machine' }}
          >
            {`< Back`}
          </button>

          <div className="flex space-x-2">
            {renderPageNumbers()}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200"
            style={{ fontFamily: 'Type Machine' }}
          >
            {`Next >`}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
