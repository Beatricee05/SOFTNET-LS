import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, ChevronLeft, ChevronRight, Eye, AlertTriangle, ShieldAlert } from "lucide-react";

export default function IssuedLicenses({ licenses, products, clients, onLicensesChange, addActivity }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null); // stores license object when inspecting/editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Autocomplete search states inside Add Modal
  const [clientSearch, setClientSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showClientSuggest, setShowClientSuggest] = useState(false);
  const [showProductSuggest, setShowProductSuggest] = useState(false);

  // Form State
  const defaultForm = {
    client: "",
    product: "",
    status: "Active",
    expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    maxNodes: 10,
    maxUsers: 100
  };
  const [formData, setFormData] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});

  // Show toast utility
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Filter licenses (Simulated ledger GET endpoint loading)
  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch = lic.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lic.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = filterClient === "" || lic.client === filterClient;
    const matchesProduct = filterProduct === "" || lic.product === filterProduct;
    const matchesStatus = filterStatus === "" || lic.status === filterStatus;
    
    return matchesSearch && matchesClient && matchesProduct && matchesStatus;
  });

  // Unique lists for filters dropdown
  const uniqueClients = Array.from(new Set(licenses.map(l => l.client)));
  const uniqueProducts = Array.from(new Set(licenses.map(l => l.product)));

  // Pagination calculation
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage) || 1;
  const paginatedLicenses = filteredLicenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setFormData(defaultForm);
    setClientSearch("");
    setProductSearch("");
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (lic) => {
    setFormData({
      client: lic.client,
      product: lic.product,
      status: lic.status,
      expiry: lic.expiry,
      maxNodes: lic.maxNodes || 10,
      maxUsers: lic.maxUsers || 100
    });
    setClientSearch(lic.client);
    setProductSearch(lic.product);
    setFormErrors({});
    setEditingLicense(lic);
  };

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.client) {
      errors.client = "Please select a client profile.";
    }
    if (!formData.product) {
      errors.product = "Please select a product.";
    }
    if (!formData.expiry) {
      errors.expiry = "Expiry date is required.";
    }
    if (isNaN(formData.maxNodes) || formData.maxNodes <= 0) {
      errors.maxNodes = "Max nodes must be a positive integer.";
    }
    if (isNaN(formData.maxUsers) || formData.maxUsers <= 0) {
      errors.maxUsers = "Max users must be a positive integer.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate Backend API POST/PUT endpoints
    setTimeout(() => {
      const savedLicense = {
        client: formData.client,
        product: formData.product,
        status: formData.status,
        expiry: formData.expiry,
        maxNodes: parseInt(formData.maxNodes),
        maxUsers: parseInt(formData.maxUsers)
      };

      if (editingLicense) {
        // Edit flow (PUT endpoint)
        const updated = licenses.map(l => 
          (l.client === editingLicense.client && l.product === editingLicense.product) ? savedLicense : l
        );
        onLicensesChange(updated);
        addActivity("License Constraints Modified", `Adjusted bounds for ${formData.product} key of ${formData.client}`);
        triggerToast("License constraints updated successfully!");
        setEditingLicense(null);
      } else {
        // Add flow (POST endpoint)
        if (licenses.some(l => l.client === formData.client && l.product === formData.product)) {
          setFormErrors({ product: "This client already has a contract for this product." });
          setIsSubmitting(false);
          return;
        }
        onLicensesChange([savedLicense, ...licenses]);
        addActivity("License Provisioned", `Created key for ${formData.product} bound to ${formData.client}`);
        triggerToast("License provisioned successfully!");
        setShowAddModal(false);
      }
      setIsSubmitting(false);
    }, 600); // 600ms simulated API delay
  };

  // Suspend Row Action (SL-47)
  const handleToggleSuspend = (lic) => {
    const isCurrentlySuspended = lic.status === "Suspended";
    
    if (isCurrentlySuspended) {
      // Activate
      const updated = licenses.map(l => 
        (l.client === lic.client && l.product === lic.product) ? { ...l, status: "Active" } : l
      );
      onLicensesChange(updated);
      addActivity("License Resumed", `Re-activated license for ${lic.product} issued to ${lic.client}`);
      triggerToast("License re-activated successfully.");
    } else {
      // Suspend with warning dialog
      const warningMessage = `⚠️ WARNING: SYSTEM LICENSING SUSPENSION ALERT
--------------------------------------------------
Are you sure you want to SUSPEND the license for "${lic.product}" issued to "${lic.client}"?

This action will:
1. Immediately invalidate the product license key.
2. Terminate all active API requests and user sessions.
3. Lock connected client client nodes in read-only mode.

Click OK to proceed with suspension or Cancel to abort.`;

      if (window.confirm(warningMessage)) {
        const updated = licenses.map(l => 
          (l.client === lic.client && l.product === lic.product) ? { ...l, status: "Suspended" } : l
        );
        onLicensesChange(updated);
        addActivity("License Suspended", `Suspended service license for ${lic.product} of ${lic.client}`);
        triggerToast("License suspended.");
      }
    }
  };

  const handleRevoke = (clientName, productName) => {
    if (window.confirm(`Are you sure you want to revoke the license for "${productName}" issued to "${clientName}"?`)) {
      const updated = licenses.filter(l => !(l.client === clientName && l.product === productName));
      onLicensesChange(updated);
      addActivity("License Revoked", `Revoked license for ${productName} of ${clientName}`);
      triggerToast("License key revoked successfully.");
      setEditingLicense(null);
    }
  };

  // Autocomplete client search filtering
  const matchingClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Autocomplete product search filtering (only products contracted by the selected client)
  const contractedProductsOfClient = () => {
    if (!formData.client) return [];
    const client = clients.find(c => c.name === formData.client);
    return client ? client.products : [];
  };

  const matchingProducts = contractedProductsOfClient().filter(pName => 
    pName.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#059669",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          zIndex: 1001,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          fontWeight: "600"
        }}>
          ✓ {toastMessage}
        </div>
      )}

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
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            Active Client Contracts
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Review status logs, manage renewal history, or instantly adjust usage bounds.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
        >
          + Create License Key
        </button>
      </div>

      {/* Dropdown Filters Ledger Bar (SL-50) */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "18px 24px",
          border: "1px solid #e5e7eb",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "24px"
        }}
      >
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Client Filter */}
        <select
          value={filterClient}
          onChange={(e) => {
            setFilterClient(e.target.value);
            setCurrentPage(1);
          }}
          style={dropdownFilterStyle}
        >
          <option value="">All Clients</option>
          {uniqueClients.map((client, idx) => (
            <option key={idx} value={client}>{client}</option>
          ))}
        </select>

        {/* Product Filter */}
        <select
          value={filterProduct}
          onChange={(e) => {
            setFilterProduct(e.target.value);
            setCurrentPage(1);
          }}
          style={dropdownFilterStyle}
        >
          <option value="">All Products</option>
          {uniqueProducts.map((prod, idx) => (
            <option key={idx} value={prod}>{prod}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          style={dropdownFilterStyle}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expiring">Expiring</option>
          <option value="Expired">Expired</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Registry Card Data Grid (SL-52, SL-51) */}
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
          <h2 style={{ fontSize: "18px", color: "#1e293b", marginBottom: "6px" }}>
            License Registry Overview
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Monitor and manage active, expiring, or suspended client licenses.
          </p>
        </div>

        {paginatedLicenses.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            No licenses found matching the selected filters.
          </div>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={thStyle}>CLIENT NAME</th>
                  <th style={thStyle}>PRODUCT NAME</th>
                  <th style={thStyle}>STATUS BADGE</th>
                  <th style={thStyle}>EXPIRY DATE</th>
                  <th style={thStyle}>CONSTRAINTS</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {paginatedLicenses.map((lic, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      <strong style={{ color: "#1e293b" }}>{lic.client}</strong>
                    </td>
                    <td style={tdStyle}>{lic.product}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: lic.status === "Active" ? "#dcfce7" : 
                                    lic.status === "Expiring" ? "#fef3c7" : 
                                    lic.status === "Suspended" ? "#f1f5f9" : "#fee2e2",
                        color: lic.status === "Active" ? "#166534" : 
                               lic.status === "Expiring" ? "#d97706" : 
                               lic.status === "Suspended" ? "#475569" : "#dc2626",
                        border: lic.status === "Suspended" ? "1px solid #cbd5e1" : "none",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {lic.status}
                      </span>
                    </td>
                    <td style={tdStyle}>📍 {lic.expiry}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Nodes: <strong>{lic.maxNodes || 10}</strong> | Users: <strong>{lic.maxUsers || 100}</strong>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEdit(lic)}
                          style={actionBtnStyle}
                          title="Inspect Constraints"
                        >
                          <Eye size={14} /> Inspect
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(lic)}
                          style={{
                            ...actionBtnStyle,
                            background: lic.status === "Suspended" ? "#ecfdf5" : "#fff5f5",
                            color: lic.status === "Suspended" ? "#059669" : "#dc2626",
                            borderColor: lic.status === "Suspended" ? "#a7f3d0" : "#fecaca"
                          }}
                          title={lic.status === "Suspended" ? "Resume Service" : "Suspend Service"}
                        >
                          {lic.status === "Suspended" ? "Activate" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination footer */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 28px",
              background: "#f8fafc",
              borderTop: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredLicenses.length} total licenses)
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{
                    ...pageBtnStyle,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{
                    ...pageBtnStyle,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add & Edit Modal Popup */}
      {(showAddModal || editingLicense) && (
        <>
          {/* Overlay */}
          <div
            onClick={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setEditingLicense(null);
              }
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 999
            }}
          />

          {/* Modal Container */}
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "520px",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            padding: "30px",
            zIndex: 1000,
            border: "1px solid #e5e7eb"
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "22px", color: "#1e293b", margin: 0 }}>
                {editingLicense ? "Edit License Constraints" : "Issue New License Key"}
              </h2>
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLicense(null);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              
              {/* Autocomplete Client Search (Jira SL-49) */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label style={labelStyle}>Select Client Profile (Autocomplete Search) *</label>
                {editingLicense ? (
                  <input type="text" value={formData.client} disabled style={{ ...inputStyle, background: "#f1f5f9" }} />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Type client name to search..."
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setFormData(prev => ({ ...prev, client: "", product: "" })); // clear selections
                        setProductSearch("");
                        setShowClientSuggest(true);
                      }}
                      onFocus={() => setShowClientSuggest(true)}
                      style={{ ...inputStyle, borderColor: formErrors.client ? "#ef4444" : "#d1d5db" }}
                      disabled={isSubmitting}
                    />
                    
                    {showClientSuggest && clientSearch && (
                      <div style={suggestBoxStyle}>
                        {matchingClients.map((client, idx) => (
                          <div
                            key={idx}
                            style={suggestItemStyle}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, client: client.name }));
                              setClientSearch(client.name);
                              setShowClientSuggest(false);
                            }}
                          >
                            📍 {client.name}
                          </div>
                        ))}
                        {matchingClients.length === 0 && (
                          <div style={{ padding: "10px", color: "#94a3b8", fontSize: "13px" }}>No matching clients found</div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {formErrors.client && <p style={errorStyle}>{formErrors.client}</p>}
              </div>

              {/* Autocomplete Product Search (Jira SL-49) */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label style={labelStyle}>Select Contracted Product (Autocomplete Search) *</label>
                {editingLicense ? (
                  <input type="text" value={formData.product} disabled style={{ ...inputStyle, background: "#f1f5f9" }} />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder={formData.client ? "Type product name to search..." : "Choose client first"}
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setFormData(prev => ({ ...prev, product: "" }));
                        setShowProductSuggest(true);
                      }}
                      onFocus={() => setShowProductSuggest(true)}
                      disabled={isSubmitting || !formData.client}
                      style={{ ...inputStyle, borderColor: formErrors.product ? "#ef4444" : "#d1d5db" }}
                    />
                    
                    {showProductSuggest && productSearch && formData.client && (
                      <div style={suggestBoxStyle}>
                        {matchingProducts.map((prodName, idx) => (
                          <div
                            key={idx}
                            style={suggestItemStyle}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, product: prodName }));
                              setProductSearch(prodName);
                              setShowProductSuggest(false);
                            }}
                          >
                            📦 {prodName}
                          </div>
                        ))}
                        {matchingProducts.length === 0 && (
                          <div style={{ padding: "10px", color: "#94a3b8", fontSize: "13px" }}>No matching contracted products</div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {formErrors.product && <p style={errorStyle}>{formErrors.product}</p>}
              </div>

              {/* Constraints Inputs (Max Nodes, Max Users) (SL-48) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={labelStyle}>Max Connected Nodes/Devices *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxNodes}
                    onChange={(e) => setFormData({ ...formData, maxNodes: parseInt(e.target.value) || "" })}
                    style={{ ...inputStyle, borderColor: formErrors.maxNodes ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.maxNodes && <p style={errorStyle}>{formErrors.maxNodes}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Max Active User Accounts *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || "" })}
                    style={{ ...inputStyle, borderColor: formErrors.maxUsers ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.maxUsers && <p style={errorStyle}>{formErrors.maxUsers}</p>}
                </div>
              </div>

              {/* Expiry Date */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>License Key Expiration Date *</label>
                <input
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.expiry ? "#ef4444" : "#d1d5db" }}
                  disabled={isSubmitting}
                />
                {formErrors.expiry && <p style={errorStyle}>{formErrors.expiry}</p>}
              </div>

              {/* Status */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Compliance Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ ...inputStyle, height: "45px" }}
                  disabled={isSubmitting}
                >
                  <option value="Active">Active</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                <div>
                  {editingLicense && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRevoke(editingLicense.client, editingLicense.product)}
                      style={{
                        padding: "12px 18px",
                        borderRadius: "12px",
                        border: "1px solid #fecaca",
                        background: "#fff5f5",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Revoke Contract
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingLicense(null);
                    }}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#475569"
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#059669",
                      color: "white",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    {isSubmitting && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                    {editingLicense ? "Apply Bounds" : "Provision Key"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Click outside suggest boxes handler */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "24px 28px",
  color: "#94a3b8",
  fontSize: "13px",
  fontWeight: "600",
};

const tdStyle = {
  padding: "16px 28px",
  fontSize: "14px",
  color: "#334155"
};

const dropdownFilterStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "white",
  fontSize: "14px"
};

const actionBtnStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  background: "white",
  color: "#334155",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  fontSize: "13px",
  fontWeight: "500",
  transition: "all 0.2s"
};

const pageBtnStyle = {
  padding: "8px 14px",
  border: "1px solid #d1d5db",
  background: "white",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "500",
  color: "#334155",
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "6px"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  color: "#1e293b"
};

const errorStyle = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "4px",
  marginBottom: 0
};

const suggestBoxStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "white",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  maxHeight: "150px",
  overflowY: "auto",
  zIndex: 1010,
  marginTop: "2px"
};

const suggestItemStyle = {
  padding: "10px 14px",
  fontSize: "14px",
  color: "#1e293b",
  cursor: "pointer",
  transition: "background 0.2s",
  borderBottom: "1px solid #f1f5f9",
  background: "white"
};
suggestItemStyle[":hover"] = {
  background: "#f1f5f9"
};
