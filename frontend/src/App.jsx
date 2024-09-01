import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchedUsers();
  }, []);

  const fetchedUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/users/lists");
      console.log("Data", res.data);
      setUsers(res.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  if (loading) {
    return <h5>Loading...</h5>;
  }
  if (error) {
    return <h5>Error: {error.message}</h5>;
  }
  return (
    <>
      <h4>Users</h4>
      {users.map((user) => (
        <div key={user._id}>
          <h3>{user.email}</h3>
        </div>
      ))}
    </>
  );
}

export default App;
