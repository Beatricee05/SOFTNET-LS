import { useState } from "react";
import { Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function Products({ products, onProductsChange, addActivity }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // stores product object when editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const defaultForm = {
    name: "",
    code: "",
    description: "",
    category: "",
    version: "v1.0",
    status: "Active"
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

  // Filter products (simulated GET load endpoint query)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories list for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setFormData(defaultForm);
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (product) => {
    setFormData({
      name: product.name,
      code: product.code || "",
      description: product.description || "",
      category: product.category,
      version: product.version,
      status: product.status
    });
    setFormErrors({});
    setEditingProduct(product);
  };

  // Form validations
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters.";
    }
    const codeRegex = /^[A-Z0-9-]+$/;
    if (!formData.code || !codeRegex.test(formData.code)) {
      errors.code = "Code must be alphanumeric with uppercase letters and hyphens, e.g. SL-MGT";
    }
    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = "Product description must be at least 10 characters.";
    }
    if (!formData.category.trim()) {
      errors.category = "Category is required.";
    }
    const versionRegex = /^v\d+(\.\d+)*$/;
    if (!formData.version || !versionRegex.test(formData.version)) {
      errors.version = "Please enter version format like v1.0, v2.5.3";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate Backend API POST/PUT endpoints delay
    setTimeout(() => {
      const savedProduct = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        category: formData.category,
        version: formData.version,
        status: formData.status
      };

      if (editingProduct) {
        // Simulated PUT endpoint
        const updated = products.map(p => p.name === editingProduct.name ? savedProduct : p);
        onProductsChange(updated);
        addActivity("Product Updated", `Updated product catalog details for: ${formData.name}`);
        triggerToast("Product details updated successfully!");
        setEditingProduct(null);
      } else {
        // Simulated POST endpoint
        if (products.some(p => p.name.toLowerCase() === formData.name.toLowerCase())) {
          setFormErrors({ name: "A product with this name already exists." });
          setIsSubmitting(false);
          return;
        }
        if (products.some(p => p.code.toLowerCase() === formData.code.toLowerCase())) {
          setFormErrors({ code: "A product with this code already exists." });
          setIsSubmitting(false);
          return;
        }
        onProductsChange([savedProduct, ...products]);
        addActivity("Product Cataloged", `Added new product to catalog: ${formData.name}`);
        triggerToast("Product Added Successfully"); // Exact toast requested by SL-36
        setShowAddModal(false);
      }
      setIsSubmitting(false);
    }, 600); // 600ms simulated API delay
  };

  const handleDelete = (prodName) => {
    if (window.confirm(`Are you sure you want to delete product "${prodName}"?`)) {
      const updated = products.filter(p => p.name !== prodName);
      onProductsChange(updated);
      addActivity("Product Deleted", `Removed product: ${prodName}`);
      triggerToast("Product deleted from registry.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
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
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b" }}>
            Products Catalog
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Manage available software products and licenses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search products by name, code, or category..."
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
            minWidth: "200px"
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table Card */}
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

        {paginatedProducts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            No products found matching the criteria.
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
                  <th style={thStyle}>PRODUCT NAME & DESCRIPTION</th>
                  <th style={thStyle}>PRODUCT CODE</th>
                  <th style={thStyle}>CATEGORY</th>
                  <th style={thStyle}>VERSION</th>
                  <th style={thStyle}>STATUS</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((product, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      <strong style={{ color: "#1e293b", display: "block" }}>{product.name}</strong>
                      <span style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "block",
                        marginTop: "4px",
                        maxWidth: "320px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }} title={product.description}>
                        {product.description || "No description provided."}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace", fontWeight: "650", color: "#0d9488", background: "#f0fdfa", padding: "4px 8px", borderRadius: "6px" }}>
                        {product.code || "N/A"}
                      </span>
                    </td>
                    <td style={tdStyle}>{product.category}</td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "3px 6px", borderRadius: "4px" }}>
                        {product.version}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: product.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color: product.status === "Active" ? "#166534" : "#dc2626",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEdit(product)}
                          style={actionBtnStyle}
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.name)}
                          style={{ ...actionBtnStyle, color: "#ef4444", borderColor: "#fecaca" }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 25px",
              background: "#f8fafc",
              borderTop: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProducts.length} total products)
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
      {(showAddModal || editingProduct) && (
        <>
          {/* Overlay */}
          <div
            onClick={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setEditingProduct(null);
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
                {editingProduct ? "Modify Product Details" : "Add Product to Catalog"}
              </h2>
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. ERP Cloud Suite"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.name ? "#ef4444" : "#d1d5db" }}
                  disabled={isSubmitting}
                />
                {formErrors.name && <p style={errorStyle}>{formErrors.name}</p>}
              </div>

              {/* Product Code */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Product Code (Alphanumeric/Hyphens) *</label>
                <input
                  type="text"
                  placeholder="e.g. SL-MGT"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  style={{ ...inputStyle, borderColor: formErrors.code ? "#ef4444" : "#d1d5db" }}
                  disabled={isSubmitting}
                />
                {formErrors.code && <p style={errorStyle}>{formErrors.code}</p>}
              </div>

              {/* Product Description */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Product Overview Description *</label>
                <textarea
                  placeholder="Write a short summary (at least 10 characters)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical", borderColor: formErrors.description ? "#ef4444" : "#d1d5db" }}
                  disabled={isSubmitting}
                />
                {formErrors.description && <p style={errorStyle}>{formErrors.description}</p>}
              </div>

              {/* Category */}
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Product Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.category ? "#ef4444" : "#d1d5db", height: "45px" }}
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  <option value="License Management">License Management</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="ERP System">ERP System</option>
                  <option value="Core Banking">Core Banking</option>
                  <option value="Customer Portal">Customer Portal</option>
                </select>
                {formErrors.category && <p style={errorStyle}>{formErrors.category}</p>}
              </div>

              {/* Version & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>Initial Version *</label>
                  <input
                    type="text"
                    placeholder="v1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    style={{ ...inputStyle, borderColor: formErrors.version ? "#ef4444" : "#d1d5db" }}
                    disabled={isSubmitting}
                  />
                  {formErrors.version && <p style={errorStyle}>{formErrors.version}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ ...inputStyle, height: "45px" }}
                    disabled={isSubmitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
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
                  {editingProduct ? "Save Changes" : "Create Product"}
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
      `}</style>
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
