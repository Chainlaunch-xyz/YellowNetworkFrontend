import { useState, useEffect } from 'react';

const useUserProfile = () => {
  const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        //   setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
        //   setLoading(false);
        });
    }
  }, []);

  return { user, error };
};

export default useUserProfile;
