
import React from "react";

function Membership() {
  const plans = [
    {
      name: "Basic",
      price: "₱499",
      description: "Perfect for beginners",
      features: ["Gym access", "Basic equipment", "Locker access"],
    },
    {
      name: "Premium",
      price: "₱999",
      description: "For serious fitness goals",
      features: [
        "Full gym access",
        "All equipment",
        "Locker access",
        "Workout programs",
      ],
    },
    {
      name: "VIP",
      price: "₱1,499",
      description: "Your premium fitness experience",
      features: [
        "Full gym access",
        "All equipment",
        "Personal training",
        "Customized workout plan",
      ],
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Membership Plans</h1>
      <p style={styles.subtitle}>
        Choose the right membership for your fitness journey.
      </p>

      <div style={styles.grid}>
        {plans.map((plan) => (
          <div key={plan.name} style={styles.card}>
            <h2>{plan.name}</h2>
            <h1 style={styles.price}>{plan.price}</h1>
            <p>{plan.description}</p>

            <ul style={styles.features}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button
              style={styles.button}
              onClick={() =>
                alert(`${plan.name} membership selected!`)
              }
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 24px",
    color: "#ffffff",
    backgroundColor: "#111827",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#22c55e",
    fontSize: "36px",
  },
  subtitle: {
    textAlign: "center",
    color: "#d1d5db",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "28px",
    textAlign: "center",
  },
  price: {
    color: "#22c55e",
    fontSize: "32px",
  },
  features: {
    textAlign: "left",
    lineHeight: "2",
    paddingLeft: "24px",
    margin: "24px 0",
  },
  button: {
    backgroundColor: "#22c55e",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
};

export default Membership;