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

  const [licenses, setLicenses] = useState([
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
  ]);

  const productsList = [
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

  const clientsList = [
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
            {page === "dashboard" && (
              <>
                <div className="stats">
                  <StatCard
                    title="Active Licenses"
                    value={licenses.filter((l) => l.status === "Active").length}
                    color="#3b82f6"
                    icon={<CheckCircle color="#3b82f6" />}
                  />

                  <StatCard
                    title="Expiring Soon"
                    value={
                      licenses.filter((l) => new Date(l.expiry) < expiringThreshold)
                        .length
                    }
                    color="#f59e0b"
                    icon={<AlertTriangle color="#f59e0b" />}
                  />

                  <StatCard
                    title="Total Products"
                    value={productsList.length}
                    color="#8b5cf6"
                    icon={<Box color="#8b5cf6" />}
                  />

                  <StatCard
                    title="Expired Keys"
                    value={
                      licenses.filter((l) => new Date(l.expiry) < new Date())
                        .length
                    }
                    color="#ef4444"
                    icon={<X color="#ef4444" />}
                  />
                </div>

                <div className="charts">
                  <div className="card">
                    <h3>Active Licenses per Product Category</h3>
                  </div>

                  <div className="card">
                    <h3>License Compliance Share</h3>
                  </div>
                </div>

                <div className="activity">
                  <div className="activity-header">Recent Activity Log</div>

                  <div className="activity-body">
                    No actions tracked within this processing window.
                  </div>
                </div>
              </>
            )}

            {page === "licenses" && (
              <IssuedLicenses
                licenses={licenses}
                onCreate={(newLicense) =>
                  setLicenses((s) => [newLicense, ...s])
                }
              />
            )}

            {page === "products" && <Products products={productsList} />}

            {page === "clients" && <ClientsDirectory clients={clientsList} />}

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
