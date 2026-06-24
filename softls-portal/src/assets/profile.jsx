export default function Profile({ onClose, onLogout }) {
  const name = localStorage.getItem("userName") || "Ally Maftah";
  const email = localStorage.getItem("userEmail") || "admin@softnet.co.tz";
  const role = localStorage.getItem("userRole") || "Administrator";

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "30px",
          zIndex: 1000,
          boxShadow: "0 20px 60px rgba(0,0,0,.15)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#1e293b",
            marginBottom: "30px",
          }}
        >
          My Profile
        </h1>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2A0F74 0%,#4c1d95 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            FULL NAME
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            {name}
          </div>
        </div>

        {/* Email */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            EMAIL ADDRESS
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#1e293b",
            }}
          >
            {email}
          </div>
        </div>

        {/* Role */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            ROLE
          </div>

          <div
            style={{
              color: "#6d28d9",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            {role}
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
