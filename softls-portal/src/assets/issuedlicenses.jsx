export default function IssuedLicenses({ licenses = [], onCreate }) {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {/* Top Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "24px",
          padding: "34px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            Active Client Contracts
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Review status logs, manage renewal history, or instantly adjust
            usage bounds.
          </p>
        </div>

        <button
          style={{
            background: "#059669",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 28px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "15px",
          }}
          onClick={() => {
            if (onCreate) {
              const mock = {
                client: "New Client",
                product: "New Product",
                status: "Active",
                expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
                  .toISOString()
                  .slice(0, 10),
              };
              onCreate(mock);
            }
          }}
        >
          + Create License Key
        </button>
      </div>

      {/* Registry Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            License Registry Overview
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Click any row to inspect full lifecycle, compliance state, and audit
            trail.
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "24px 28px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                CLIENT
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "24px 28px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                PRODUCT
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "24px 28px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                STATUS
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "24px 28px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                EXPIRY
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "24px 28px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {licenses.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "28px", color: "#94a3b8" }}>
                  No licenses found. Click "Create License Key" to add one.
                </td>
              </tr>
            )}

            {licenses.map((lic, i) => (
              <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "16px 28px" }}>{lic.client}</td>
                <td style={{ padding: "16px 28px" }}>{lic.product}</td>
                <td style={{ padding: "16px 28px" }}>{lic.status}</td>
                <td style={{ padding: "16px 28px" }}>{lic.expiry}</td>
                <td style={{ padding: "16px 28px" }}>
                  <button
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            height: "55px",
            borderTop: "1px solid #f8fafc",
          }}
        />
      </div>
    </div>
  );
}
