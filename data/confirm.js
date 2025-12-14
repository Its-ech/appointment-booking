document.addEventListener("DOMContentLoaded", () => {
    const advisorid = localStorage.getItem("selectedadvisor");
    const box = document.getElementById("confirmation-box");
    box.innerHTML = "<p>loading advisor data...</p>"
  
    fetch("data/advisors.json")
      .then(res => res.json())
      .then(advisors => {
        const advisor = advisors.find(a => a.id === advisorid);
        const box = document.getElementById("confirmation-box");
  
        if (advisor) {
          box.innerHTML = `
            <h3>${advisor.name}</h3>
            <p>${advisor.expertise}</p>
            <p>Are you sure you want to book a session with this advisor?</p>`;
        } else {
          box.innerHTML = "<p>No advisor selected.</p>";
          document.getElementById("confirm-btn").style.display = "none";
        }
      });
  
    document.getElementById("confirm-btn").addEventListener("click", () => {
      alert("your booking has been confirmed!");
      localStorage.removeItem("selectedadvisor");
      window.location.href = "dashboard.html";
    });
  });
  