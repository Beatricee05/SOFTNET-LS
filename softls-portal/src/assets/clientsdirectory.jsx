import { useState } from "react";
import { Search, Grid, List, Edit2, Trash2, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function ClientsDirectory({ clients, products, onClientsChange, addActivity }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewType, setViewType] = useState("table"); // 'table' or 'grid'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // stores client object when editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const defaultForm = {
    name: "",
    country: "Tanzania",
    category: "",
    email: "",
    phone: "",
    purchasedProducts: []
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

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "" || client.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories list for filter dropdown
  const categories = Array.from(new Set(clients.map(c => c.category)));

  // Pagination calculation
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setFormData(defaultForm);
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (client) => {
    setFormData({
      name: client.name,
      country: client.country,
      category: client.category,
      email: client.email,
      phone: client.phone,
      purchasedProducts: client.products || []
    });
    setFormErrors({});
    setEditingClient(client);
  };

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = "Client name must be at least 3 characters.";
    }
    if (!formData.country.trim()) {
      errors.country = "Country is required.";
    }
    if (!formData.category) {
      errors.category = "Category is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number (7-15 digits).";
    }
    if (!formData.purchasedProducts || formData.purchasedProducts.length === 0) {
      errors.products = "Select at least one product.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate Backend API delay (SL-26 Integration simulation)
    setTimeout(() => {
      const savedClient = {
        name: formData.name,
        country: formData.country,
        category: formData.category,
        email: formData.email,
        phone: formData.phone,
        products: formData.purchasedProducts
      };

      if (editingClient) {
        // Edit flow
        const updated = clients.map(c => c.name === editingClient.name ? savedClient : c);
        onClientsChange(updated);
        addActivity("Client Updated", `Updated client profile: ${formData.name}`);
        triggerToast("Client profile updated successfully!");
        setEditingClient(null);
      } else {
        // Add flow
        if (clients.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
          setFormErrors({ name: "A client with this name already exists." });
          setIsSubmitting(false);
          return;
        }
        onClientsChange([savedClient, ...clients]);
        addActivity("Client Created", `Registered new client: ${formData.name}`);
        triggerToast("Client profile created successfully!");
        setShowAddModal(false);
      }
      setIsSubmitting(false);
    }, 600); // 600ms simulated API delay
  };

  const handleDelete = (clientName) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}?`)) {
      const updated = clients.filter(c => c.name !== clientName);
      onClientsChange(updated);
      addActivity("Client Deleted", `Removed client: ${clientName}`);
      triggerToast("Client profile deleted.");
    }
  };

  const toggleProductCheckbox = (prodName) => {
    setFormData(prev => {
      const list = prev.purchasedProducts.includes(prodName)
        ? prev.purchasedProducts.filter(p => p !== prodName)
        : [...prev.purchasedProducts, prodName];
      return { ...prev, purchasedProducts: list };
    });
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "#10b981",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          zIndex: 1001,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          fontWeight: "600",
          transition: "all 0.3s ease"
        }}>
          ✓ {toastMessage}
        </div>
      )}

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
          <h1 style={{ fontSize: "28px", marginBottom: "6px", color: "#1e293b" }}>
            Clients Directory
          </h1>
          <p style={{ color: "#64748b" }}>
            Manage client profiles and software licenses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: "#2A0F74",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          + Add New Client
        </button>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "18px 24px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "24px"
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search clients by name, email, country..."
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

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            background: "white",
            fontSize: "14px",
            minWidth: "180px"
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {/* View Switcher */}
        <div style={{ display: "flex", border: "1px solid #d1d5db", borderRadius: "12px", overflow: "hidden" }}>
          <button
            onClick={() => setViewType("table")}
            style={{
              background: viewType === "table" ? "#ede9fe" : "white",
              border: "none",
              padding: "10px 14px",
              cursor: "pointer",
              color: viewType === "table" ? "#5b21b6" : "#64748b"
            }}
            title="Table View"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewType("grid")}
            style={{
              background: viewType === "grid" ? "#ede9fe" : "white",
              border: "none",
              padding: "10px 14px",
              cursor: "pointer",
              color: viewType === "grid" ? "#5b21b6" : "#64748b"
            }}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {paginatedClients.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "60px",
          textAlign: "center",
          border: "1px solid #e5e7eb",
          color: "#64748b"
        }}>
          <p style={{ fontSize: "16px" }}>No clients found matching the selected filters.</p>
        </div>
      ) : viewType === "table" ? (
        /* Data Grid Table View */
        <div style={{ background: "white", borderRadius: "24px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>CLIENT NAME</th>
                <th style={thStyle}>LOCATION</th>
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>CONTACT INFO</th>
                <th style={thStyle}>CONTRACTED PRODUCTS</th>
                <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client, index) => (
                <tr key={index} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>
                    <strong style={{ color: "#1e293b" }}>{client.name}</strong>
                  </td>
                  <td style={tdStyle}>📍 {client.country}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: "#ede9fe",
                      color: "#5b21b6",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {client.category}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: "13px" }}>📧 {client.email}</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>📞 {client.phone}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {client.products && client.products.map((p, idx) => (
                        <span key={idx} style={{
                          background: "#ecfdf5",
                          color: "#047857",
                          padding: "3px 6px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "500"
                        }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        onClick={() => handleOpenEdit(client)}
                        style={actionBtnStyle}
                        title="Edit Profile"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.name)}
                        style={{ ...actionBtnStyle, color: "#ef4444", borderColor: "#fecaca" }}
                        title="Delete Profile"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "#f8fafc",
            borderTop: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredClients.length} total clients)
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
        </div>
      ) : (
        /* Grid Cards View */
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "20px",
            }}
          >
            {paginatedClients.map((client, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ height: "6px", background: "#2A0F74" }} />
                  <div style={{ padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>{client.name}</h3>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => handleOpenEdit(client)} style={{ ...actionBtnStyle, padding: "5px" }}><Edit2 size={12} /></button>
                        <button onClick={() => handleDelete(client.name)} style={{ ...actionBtnStyle, color: "#ef4444", borderColor: "#fecaca", padding: "5px" }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: "10px", color: "#64748b", fontSize: "14px" }}>
                      📍 {client.country}
                    </div>

                    <div style={{
                      marginTop: "8px",
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: "#ede9fe",
                      color: "#5b21b6",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {client.category}
                    </div>

                    <div style={{ marginTop: "15px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div>📧 {client.email}</div>
                      <div>📞 {client.phone}</div>
                    </div>

                    <div style={{ marginTop: "15px" }}>
                      <strong>Contracted Products</strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {client.products && client.products.map((product, idx) => (
                          <span key={idx} style={{
                            background: "#ecfdf5",
                            color: "#047857",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}>
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Pagination Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "16px 24px",
            background: "white",
            borderRadius: "20px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
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
        </div>
      )}

      {/* Add & Edit Modal Popup */}
      {(showAddModal || editingClient) && (
        <>
          {/* Overlay */}
          <div
            onClick={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setEditingClient(null);
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
            width: "550px",
            maxHeight: "85vh",
            overflowY: "auto",
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
                {editingClient ? "Edit Client Profile" : "Register New Client"}
              </h2>
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClient(null);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              {/* Client Name */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. SoftNet Technologies"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.name ? "#ef4444" : "#d1d5db" }}
                  disabled={isSubmitting}
                />
                {formErrors.name && <p style={errorStyle}>{formErrors.name}</p>}
              </div>

              {/* Country & Category Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={labelStyle}>Country Location *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{ ...inputStyle, borderColor: formErrors.country ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.country && <p style={errorStyle}>{formErrors.country}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Industry Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ ...inputStyle, borderColor: formErrors.category ? "#ef4444" : "#d1d5db", height: "45px" }}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    <option value="ICT & Software">ICT & Software</option>
                    <option value="Financial Institutions & Banking">Financial Institutions & Banking</option>
                    <option value="Government & Public Sector">Government & Public Sector</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                  {formErrors.category && <p style={errorStyle}>{formErrors.category}</p>}
                </div>
              </div>

              {/* Contact Email & Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={labelStyle}>Contact Email Address *</label>
                  <input
                    type="email"
                    placeholder="info@client.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ ...inputStyle, borderColor: formErrors.email ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <p style={errorStyle}>{formErrors.email}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Contact Phone Number *</label>
                  <input
                    type="text"
                    placeholder="+255 700 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ ...inputStyle, borderColor: formErrors.phone ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.phone && <p style={errorStyle}>{formErrors.phone}</p>}
                </div>
              </div>

              {/* Contracted Products selection checkboxes */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Contracted Products *</label>
                <div style={{
                  border: "1px solid #d1d5db",
                  borderColor: formErrors.products ? "#ef4444" : "#d1d5db",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  maxHeight: "130px",
                  overflowY: "auto"
                }}>
                  {products.map((prod, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.purchasedProducts.includes(prod.name)}
                        onChange={() => toggleProductCheckbox(prod.name)}
                        disabled={isSubmitting}
                        style={{ width: "16px", height: "16px", accentColor: "#2A0F74" }}
                      />
                      <span style={{ fontSize: "14px" }}>{prod.name}</span>
                    </label>
                  ))}
                  {products.length === 0 && (
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>No products in registry. Create products in catalog first.</p>
                  )}
                </div>
                {formErrors.products && <p style={errorStyle}>{formErrors.products}</p>}
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClient(null);
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
                    background: "#2A0F74",
                    color: "white",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />}
                  {editingClient ? "Save Changes" : "Register Client"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Spinner CSS animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Styling Constants
const thStyle = {
  textAlign: "left",
  padding: "16px 24px",
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px"
};

const tdStyle = {
  padding: "16px 24px",
  fontSize: "14px",
  color: "#334155"
};

const actionBtnStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "white",
  color: "#64748b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
