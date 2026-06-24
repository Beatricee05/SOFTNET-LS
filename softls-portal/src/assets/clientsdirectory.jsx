export default function ClientsDirectory({ clients = null }) {
  const localClients = clients || [
    {
      name: "SoftNet Technologies",
      country: "Tanzania",
      category: "ICT & Software",
      email: "info@softnet.co.tz",
      phone: "+255 700 000 000",
      products: ["ERP System", "Licensing System"],
    },
    {
      name: "ABC Bank",
      country: "Tanzania",
      category: "Financial Institutions & Banking",
      email: "support@abcbank.co.tz",
      phone: "+255 711 111 111",
      products: ["Core Banking"],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "6px" }}>
            Clients Directory
          </h1>

          <p style={{ color: "#64748b" }}>
            Manage client profiles and software licenses.
          </p>
        </div>

        <button
          style={{
            background: "#2A0F74",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          + Add New Client
        </button>
      </div>

      {/* Client Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {localClients.map((client, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "18px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "6px",
                background: "#2A0F74",
              }}
            />

            <div style={{ padding: "18px" }}>
              <h3>{client.name}</h3>

              <div
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                📍 {client.country}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "#ede9fe",
                  color: "#5b21b6",
                  fontSize: "12px",
                }}
              >
                {client.category}
              </div>

              <div style={{ marginTop: "15px", fontSize: "14px" }}>
                <div>📧 {client.email}</div>
                <div>📞 {client.phone}</div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <strong>Products</strong>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  {client.products.map((product, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#ecfdf5",
                        color: "#047857",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
