import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"; // Add updateDoc and doc
import { db, auth } from "../firebase"; // Import Firestore and Firebase Auth
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Import arrow icons
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state change listener
import "./TechTorque.css"; // Import the CSS file

const Canvas = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    mobile: "",
    allocatedTime: "",
    status: "",
    score: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    branch: "",
    year: "",
    mobile: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [CanvasData, setCanvasData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const navigate = useNavigate(); // Navigate for redirection

  // Fetch data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // If the user is logged in, set the state to true
      } else {
        setIsLoggedIn(false); // If the user is not logged in, redirect to home page
        navigate("/"); // Redirect to home if not logged in
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // Fetch data from Firestore (if logged in)
  useEffect(() => {
    if (!isLoggedIn) return; // Do not fetch data if the user is not logged in

    const fetchData = async () => {
      try {
        // Fetch the data from Firestore
        const querySnapshot = await getDocs(collection(db, "canvas"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Set the fetched data
        setCanvasData(data);
        setLoading(false);

        // Set the initial sorting to ascending by allocatedTime
        const sortedData = data.sort((a, b) => {
          const timeA = a.allocatedTime.split(":").map(Number);
          const timeB = b.allocatedTime.split(":").map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return minutesA - minutesB; // Ascending order by default
        });

        // Update the state with sorted data in ascending order
        setCanvasData(sortedData);

      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]); // Dependency on isLoggedIn, so data is fetched only when logged in

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required!";
      isValid = false;
    }
    if (!formData.branch) {
      newErrors.branch = "Branch is required!";
      isValid = false;
    }
    if (!formData.year) {
      newErrors.year = "Year is required!";
      isValid = false;
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        if (editMode) {
          const participantRef = doc(db, "canvas", currentEditId);
          await updateDoc(participantRef, formData);
        } else {
          const collectionRef = collection(db, "canvas");
          await addDoc(collectionRef, formData);
        }

        setFormData({
          name: "",
          branch: "",
          year: "",
          mobile: "",
          allocatedTime: "",
          status: "",
          score: "",
        });
        setFormVisible(false);
        setEditMode(false);

        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 3000);

        const querySnapshot = await getDocs(collection(db, "canvas"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCanvasData(data);
      } catch (error) {
        console.error("Error saving document: ", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle editing an entry
  const handleEdit = (id) => {
    const participant = CanvasData.find((item) => item.id === id);
    setFormData(participant);
    setCurrentEditId(id);
    setFormVisible(true);
    setEditMode(true);
  };

  const [sortColumn, setSortColumn] = useState("allocatedTime"); // Default to sorting by allocatedTime
  const [sortOrder, setSortOrder] = useState("asc"); // Default order is ascending (arrow should point down initially)
  
  const handleSort = (column) => {
    let newSortOrder = "asc";
    if (sortColumn === column && sortOrder === "asc") {
      newSortOrder = "desc";
    }
  
    setSortColumn(column);
    setSortOrder(newSortOrder);
  
    // Sorting logic remains unchanged
    const sortedData = [...CanvasData].sort((a, b) => {
      if (column === "allocatedTime") {
        // Convert time string (HH:MM) to minutes for accurate comparison
        const timeA = a.allocatedTime.split(":").map(Number);
        const timeB = b.allocatedTime.split(":").map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
  
        return sortOrder === "asc" ? minutesA - minutesB : minutesB - minutesA;
      }
      if (column === "status") {
        return sortOrder === "asc"
          ? a.status === "Not Started" ? -1 : 1
          : a.status === "Not Started" ? 1 : -1;
      }
      if (column === "score") {
        return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
      }
      // Default alphabetical sorting for other columns (Name, Branch, Year)
      return sortOrder === "asc"
        ? a[column].localeCompare(b[column])
        : b[column].localeCompare(a[column]);
    });
  
    setCanvasData(sortedData);
  };
  
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Canvas Page</h2>
  {/* Button to open the form */}
  {!formVisible && !editMode && (
        <button onClick={() => setFormVisible(true)} className="add-participant-btn">
          Add Participant
        </button>
      )}
      {/* Sorting buttons */}
      <div className="sort-buttons">
        <button onClick={() => handleSort("name")}>
          Name{" "}
          {sortColumn === "name" && sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <button onClick={() => handleSort("branch")}>
          Branch{" "}
          {sortColumn === "branch" && sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <button onClick={() => handleSort("year")}>
          Year{" "}
          {sortColumn === "year" && sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <button onClick={() => handleSort("allocatedTime")}>
          Allocated Time{" "}
          {sortColumn === "allocatedTime" && sortOrder === "asc" ? <FaArrowDown /> : <FaArrowUp />}
        </button>
        <button onClick={() => handleSort("status")}>
          Status{" "}
          {sortColumn === "status" && sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <button onClick={() => handleSort("score")}>
          Score{" "}
          {sortColumn === "score" && sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
      </div>

      {/* Form to add or edit participant */}
      {formVisible && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
  <div>
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleInputChange}
    />
    {errors.name && <p className="error-message">{errors.name}</p>}
  </div>
  <div>
    <input
      type="text"
      name="branch"
      placeholder="Branch"
      value={formData.branch}
      onChange={handleInputChange}
    />
    {errors.branch && <p className="error-message">{errors.branch}</p>}
  </div>
  <div>
    <input
      type="text"
      name="year"
      placeholder="Year"
      value={formData.year}
      onChange={handleInputChange}
    />
    {errors.year && <p className="error-message">{errors.year}</p>}
  </div>
  <div>
    <input
      type="text"
      name="mobile"
      placeholder="Mobile"
      value={formData.mobile}
      onChange={handleInputChange}
    />
    {errors.mobile && <p className="error-message">{errors.mobile}</p>}
  </div>
  <div>
    {/* Time picker for Allocated Time */}
    <input
      type="time"
      name="allocatedTime"
      placeholder="Allocated Time"
      value={formData.allocatedTime}
      onChange={handleInputChange}
    />
  </div>
  <div>
    {/* Status dropdown */}
    <select
      name="status"
      value={formData.status}
      onChange={handleInputChange}
    >
      <option value="">Select Status</option>
      <option value="Payment Failed">Payment Failed</option>
      <option value="Payment Initiated">Payment Initiated</option>
      <option value="Payment Successful">Payment Successful</option>
      <option value="Completed">Completed</option>
      <option value="Not Attended">Not Attended</option>
    </select>
  </div>
  <div>
    <input
      type="number"
      name="score"
      placeholder="Score"
      value={formData.score}
      onChange={handleInputChange}
    />
  </div>
  <div>
    <button type="submit" className="submit-btn" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
    <button type="button" onClick={() => setFormVisible(false)} className="cancel-btn">
      Cancel
    </button>
  </div>
</form>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="success-dialog">
          <p>Data successfully added/updated!</p>
        </div>
      )}

      {/* Board displaying Canvas participants */}
      <div className="data-board">
        <h3>Participants List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : CanvasData.length === 0 ? (
          <p>No participants found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Mobile</th>
                <th>Allocated Time</th>
                <th>Status</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {CanvasData.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.name}</td>
                  <td>{participant.branch}</td>
                  <td>{participant.year}</td>
                  <td>{participant.mobile}</td>
                  <td>{participant.allocatedTime}</td>
                  <td>{participant.status}</td>
                  <td>{participant.score}</td>
                  <td>
                    <button onClick={() => handleEdit(participant.id)} className="edit-btn">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Canvas;
