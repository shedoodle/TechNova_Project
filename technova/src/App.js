import React, { useEffect, useState } from "react";

function App() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch("/data/donations.json")
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Political Donations</h1>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>MP Name</th>
            <th>Riding</th>
            <th>Party</th>
            <th>Donor</th>
            <th>Donor Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d, i) => (
            <tr key={i}>
              <td>{d.mp_name}</td>
              <td>{d.riding}</td>
              <td>{d.party}</td>
              <td>{d.donor_name}</td>
              <td>{d.donor_type}</td>
              <td>${d.amount}</td>
              <td>{d.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
