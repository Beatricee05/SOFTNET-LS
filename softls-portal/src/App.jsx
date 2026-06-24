import { useState } from "react";
import IssuedLicenses from "./assets/issuedlicenses";
import Products from "./assets/products";
import ClientsDirectory from "./assets/clientsdirectory";
import Profile from "./assets/profile";
import Login from "./assets/login";
import {
  Home,
  Key,
  Package,
  Users,
  RefreshCw,
  Bell,
  User,
  LogOut,
  CheckCircle,
  AlertTriangle,
  X,
  Box,
} from "lucide-react";

function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + "20" }}>
        {icon}
      </div>

      <div>
        <p className="stat-title">{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true",
  );

  const initialLicenses = [
    {
      client: "SoftNet Technologies",
      product: "SoftLS Licensing System",
      status: "Active",
      expiry: "2027-03-14",
    },
    {
      client: "ABC Bank",
      product: "Core Banking",
      status: "Expiring",
      expiry: "2026-09-01",
    },
  ];

  const initialProducts = [
    {
      name: "SoftLS Licensing System",
      code: "SL-SYS",
      description: "Core software licensing registry, auditing, and compliance manager.",
      category: "License Management",
      version: "v2.0",
      status: "Active",
    },
    {
      name: "Inventory Management System",
      code: "INV-MGT",
      description: "Real-time stock tracking, purchase orders, and warehouse analytics catalog.",
      category: "Inventory",
      version: "v1.5",
      status: "Active",
    },
    {
      name: "HR Management System",
      code: "HR-CORE",
      description: "Employee records ledger, payroll configurations, and performance metrics system.",
      category: "Human Resources",
      version: "v3.1",
      status: "Inactive",
    },
  ];

  const initialClients = [
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

  const [licenses, setLicenses] = useState(() => {
    const saved = localStorage.getItem("licenses");
    return saved ? JSON.parse(saved) : initialLicenses;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("activityLog");
    return saved ? JSON.parse(saved) : [
      { id: 1, action: "User Login", detail: "Ally Maftah logged in successfully", timestamp: new Date().toLocaleTimeString() },
      { id: 2, action: "System Check", detail: "Active license status verification completed", timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() }
    ];
  });

  const addActivity = (action, detail) => {
    const newLog = [
      {
        id: Date.now(),
        action,
        detail,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...activityLog
    ].slice(0, 15);
    setActivityLog(newLog);
    localStorage.setItem("activityLog", JSON.stringify(newLog));
  };

  const updateLicensesState = (newLicenses) => {
    setLicenses(newLicenses);
    localStorage.setItem("licenses", JSON.stringify(newLicenses));
  };

  const updateProductsState = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  };

  const updateClientsState = (newClients) => {
    setClients(newClients);
    localStorage.setItem("clients", JSON.stringify(newClients));
  };

  const [expiringThreshold] = useState(
    () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
  );

  const handleLogout = () => {
    localStorage.clear();
    setShowProfile(false);
    setPage("dashboard");
    setLoggedIn(false);
  };
  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setPage("dashboard");
          setLoggedIn(true);
        }}
      />
    );
  }
  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Inter,sans-serif;
        }

        body{
          background:#f5f7fb;
        }

        .container{
          display:flex;
          height:100vh;
        }

        /* SIDEBAR */

        .sidebar{
          width:300px;
          background:white;
          border-right:1px solid #e5e7eb;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:20px;
        }

        .logo{
          font-size:36px;
          font-weight:700;
          color:#0f766e;
          margin-bottom:30px;
        }

        .section-title{
          font-size:12px;
          color:#94a3b8;
          font-weight:700;
          margin:25px 0 15px;
          letter-spacing:1px;
        }

        .menu-item{
          display:flex;
          align-items:center;
          gap:12px;
          padding:14px;
          border-radius:14px;
          margin-bottom:10px;
          color:#334155;
          cursor:pointer;
        }

        .menu-item.active{
          background:#311b92;
          color:white;
        }

        .profile{
          border-top:1px solid #e5e7eb;
          padding-top:20px;
        }

        .user-card{
          display:flex;
          align-items:center;
          gap:12px;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:12px;
        }

        .avatar{
          width:42px;
          height:42px;
          border-radius:50%;
          background:#6d28d9;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:bold;
        }

        .profile-buttons{
          display:flex;
          gap:10px;
          margin-top:12px;
        }

        .profile-buttons button{
          flex:1;
          padding:10px;
          border-radius:12px;
          border:none;
          cursor:pointer;
        }

        .btn-outline{
          background:white;
          border:1px solid #d1d5db !important;
        }

        .btn-danger{
          color:#ef4444;
          background:white;
          border:1px solid #fecaca !important;
        }

        /* MAIN */

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .header{
          height:80px;
          background:white;
          border-bottom:1px solid #e5e7eb;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 25px;
        }

        .title h1{
          font-size:40px;
          font-weight:700;
        }

        .title p{
          color:#94a3b8;
        }

        .header-right{
          display:flex;
          gap:15px;
          align-items:center;
        }

        .status{
          display:flex;
          align-items:center;
          gap:10px;
          background:#ecfdf5;
          color:#10b981;
          padding:10px 18px;
          border-radius:16px;
          border:1px solid #a7f3d0;
        }

        .dot{
          width:10px;
          height:10px;
          background:#10b981;
          border-radius:50%;
        }

        .notification{
          width:50px;
          height:50px;
          background:white;
          border-radius:50%;
          border:1px solid #e5e7eb;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .content{
          padding:28px;
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:22px;
        }

        .stat-card{
          background:white;
          border-radius:24px;
          padding:28px;
          display:flex;
          gap:20px;
          align-items:center;
          border:1px solid #eef2f7;
        }

        .stat-icon{
          width:48px;
          height:48px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .stat-title{
          font-size:13px;
          color:#94a3b8;
          text-transform:uppercase;
          margin-bottom:8px;
        }

        .charts{
          margin-top:30px;
          display:grid;
          grid-template-columns:2fr 1fr;
          gap:25px;
        }

        .card{
          background:white;
          border-radius:24px;
          padding:28px;
          min-height:140px;
          border:1px solid #eef2f7;
        }

        .card h3{
          margin-bottom:20px;
          color:#1e293b;
        }

        .activity{
          margin-top:30px;
          background:white;
          border-radius:24px;
          border:1px solid #eef2f7;
          overflow:hidden;
        }

        .activity-header{
          padding:22px 28px;
          border-bottom:1px solid #eef2f7;
          font-weight:600;
        }

        .activity-body{
          height:170px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#94a3b8;
        }
      `}</style>

      <div className="container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            <div className="logo">SoftNet</div>

            <div className="section-title">OVERVIEW</div>

            <div
              className={`menu-item ${page === "dashboard" ? "active" : ""}`}
              onClick={() => setPage("dashboard")}
            >
              <Home size={18} />
              Home Dashboard
            </div>

            <div className="section-title">MANAGEMENT</div>

            <div
              className={`menu-item ${page === "licenses" ? "active" : ""}`}
              onClick={() => setPage("licenses")}
            >
              <Key size={18} />
              Issued Licenses
            </div>

            <div
              className={`menu-item ${page === "products" ? "active" : ""}`}
              onClick={() => setPage("products")}
            >
              <Package size={18} />
              Products Catalog
            </div>

            <div
              className={`menu-item ${page === "clients" ? "active" : ""}`}
              onClick={() => setPage("clients")}
            >
              <Users size={18} />
              Clients Directory
            </div>

            <div className="section-title">UPDATES</div>

            <div
              className={`menu-item ${page === "renewals" ? "active" : ""}`}
              onClick={() => setPage("renewals")}
            >
              <RefreshCw size={18} />
              Renewal Requests
            </div>
          </div>

          <div className="profile">
            <div className="user-card">
              <div className="avatar">
                {(localStorage.getItem("userName") || "Ally Maftah")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <strong>
                  {localStorage.getItem("userName") || "Ally Maftah"}
                </strong>
                <div style={{ color: "#94a3b8" }}>
                  {localStorage.getItem("userRole") || "Admin"}
                </div>
              </div>
            </div>

            <div className="profile-buttons">
              <button
                className="btn-outline"
                onClick={() => setShowProfile(true)}
              >
                <User size={16} /> Profile
              </button>

              <button className="btn-danger" onClick={handleLogout}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="header">
            <div className="title">
              <h1>Softnet Licensing System</h1>
              <p>Products License Management Platform</p>
            </div>

            <div className="header-right">
              <div className="status">
                <div className="dot"></div>
                Running
              </div>

              <div className="notification">
                <Bell />
              </div>
            </div>
          </div>

          <div className="content">
            {page === "dashboard" && (() => {
              const activeCount = licenses.filter((l) => l.status === "Active" && new Date(l.expiry) >= new Date()).length;
              const expiringCount = licenses.filter((l) => l.status !== "Suspended" && new Date(l.expiry) >= new Date() && new Date(l.expiry) < expiringThreshold).length;
              const expiredCount = licenses.filter((l) => l.status !== "Suspended" && new Date(l.expiry) < new Date()).length;
              const suspendedCount = licenses.filter((l) => l.status === "Suspended").length;
              
              // Calculate category stats
              const getCategoryStats = () => {
                const stats = {};
                licenses.forEach((lic) => {
                  if (lic.status === "Active" && new Date(lic.expiry) >= new Date()) {
                    const prod = products.find((p) => p.name === lic.product);
                    const cat = prod ? prod.category : "Other";
                    stats[cat] = (stats[cat] || 0) + 1;
                  }
                });
                return stats;
              };
              const categoryStats = getCategoryStats();
              const maxVal = Math.max(...Object.values(categoryStats), 1);
              
              const totalLics = licenses.length || 1;
              const activePct = (activeCount / totalLics) * 100;
              const expiringPct = (expiringCount / totalLics) * 100;
              const expiredPct = (expiredCount / totalLics) * 100;
              const suspendedPct = (suspendedCount / totalLics) * 100;

              return (
                <>
                  <div className="stats">
                    <StatCard
                      title="Active Licenses"
                      value={activeCount}
                      color="#10b981"
                      icon={<CheckCircle color="#10b981" />}
                    />

                    <StatCard
                      title="Expiring Soon"
                      value={expiringCount}
                      color="#f59e0b"
                      icon={<AlertTriangle color="#f59e0b" />}
                    />

                    <StatCard
                      title="Total Products"
                      value={products.length}
                      color="#8b5cf6"
                      icon={<Box color="#8b5cf6" />}
                    />

                    <StatCard
                      title="Expired Keys"
                      value={expiredCount}
                      color="#ef4444"
                      icon={<X color="#ef4444" />}
                    />
                  </div>

                  <div className="charts">
                    <div className="card">
                      <h3>Active Licenses per Product Category</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                        {Object.entries(categoryStats).map(([cat, val]) => (
                          <div key={cat}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                              <span>{cat}</span>
                              <strong>{val}</strong>
                            </div>
                            <div style={{ background: "#e5e7eb", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                              <div style={{ background: "#8b5cf6", width: `${(val / maxVal) * 100}%`, height: "100%", borderRadius: "10px" }} />
                            </div>
                          </div>
                        ))}
                        {Object.keys(categoryStats).length === 0 && (
                          <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "10px" }}>No active licenses found.</div>
                        )}
                      </div>
                    </div>

                    <div className="card">
                      <h3>License Compliance Share</h3>
                      <div style={{ marginTop: "20px" }}>
                        <div style={{ display: "flex", height: "24px", borderRadius: "12px", overflow: "hidden", background: "#e5e7eb", marginBottom: "20px" }}>
                          {activeCount > 0 && <div style={{ background: "#10b981", width: `${activePct}%` }} title={`Active: ${activeCount}`} />}
                          {expiringCount > 0 && <div style={{ background: "#f59e0b", width: `${expiringPct}%` }} title={`Expiring: ${expiringCount}`} />}
                          {expiredCount > 0 && <div style={{ background: "#ef4444", width: `${expiredPct}%` }} title={`Expired: ${expiredCount}`} />}
                          {suspendedCount > 0 && <div style={{ background: "#64748b", width: `${suspendedPct}%` }} title={`Suspended: ${suspendedCount}`} />}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", fontSize: "13px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                            Active ({activeCount})
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                            Expiring ({expiringCount})
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                            Expired ({expiredCount})
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#64748b" }} />
                            Suspended ({suspendedCount})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-header">Recent Activity Log</div>

                    <div className="activity-body" style={{ height: "auto", display: "block", padding: "20px", color: "inherit" }}>
                      {activityLog.map((log) => (
                        <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                          <div>
                            <strong>{log.action}</strong>: <span style={{ color: "#64748b" }}>{log.detail}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{log.timestamp}</span>
                        </div>
                      ))}
                      {activityLog.length === 0 && (
                        <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
                          No actions tracked within this processing window.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}

            {page === "licenses" && (
              <IssuedLicenses
                licenses={licenses}
                products={products}
                clients={clients}
                onLicensesChange={updateLicensesState}
                addActivity={addActivity}
              />
            )}

            {page === "products" && (
              <Products
                products={products}
                onProductsChange={updateProductsState}
                addActivity={addActivity}
              />
            )}

            {page === "clients" && (
              <ClientsDirectory
                clients={clients}
                products={products}
                onClientsChange={updateClientsState}
                addActivity={addActivity}
              />
            )}

            {showProfile && (
              <Profile
                onClose={() => setShowProfile(false)}
                onLogout={handleLogout}
              />
            )}

            {page === "renewals" && (
              <div className="card">
                <h1>Renewal Requests</h1>
                <p>Manage renewal requests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
