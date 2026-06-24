export default function Products({ products = null }) {
  const localProducts = products || [
    {
      name: "SoftLS Licensing System",
      category: "License Management",
      version: "v2.0",
      status: "Active",
    },
    {
      name: "Inventory Management System",
      category: "Inventory",
      version: "v1.5",
      status: "Active",
    },
    {
      name: "HR Management System",
      category: "Human Resources",
      version: "v3.1",
      status: "Inactive",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "30px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
            }}
          >
            Products Catalog
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "6px",
            }}
          >
            Manage available software products and licenses.
          </p>
        </div>

        <button
          style={{
            background: "#059669",
            color: "#fff",
            border: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 25px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2>Product Registry</h2>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={thStyle}>PRODUCT NAME</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>VERSION</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {localProducts.map((product, index) => (
              <tr key={index}>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>{product.version}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        product.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color:
                        product.status === "Active" ? "#166534" : "#dc2626",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "16px 24px",
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "700",
};

const tdStyle = {
  padding: "18px 24px",
  borderTop: "1px solid #f1f5f9",
};
