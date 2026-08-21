import React, { useState, useEffect } from "react";
import { 
  Stethoscope, Heart, User, UserCheck, Baby, 
  Activity, UserPlus, Phone, Clock, MapPin, Search, ArrowLeft,
  ChevronRight, ShieldCheck, Users, CheckCircle2, Loader2
} from "lucide-react";
import { loadDirectory, loadDirectoryMeta } from "../../data/directoryService";
import "./DoctorsDirectory.css";

const ICON_COLORS = [
  { icon: Activity, color: "#1a5a4a" },
  { icon: Activity, color: "#619a3b" },
  { icon: Heart, color: "#c72929" },
  { icon: Stethoscope, color: "#1d4e9e" },
  { icon: UserCheck, color: "#6b358e" },
  { icon: User, color: "#9a1a47" },
  { icon: UserPlus, color: "#2ea169" },
  { icon: Activity, color: "#17449e" },
  { icon: Activity, color: "#b53535" },
  { icon: Baby, color: "#8a248f" },
  { icon: Activity, color: "#000000" },
  { icon: Activity, color: "#e67e22" },
  { icon: Activity, color: "#82a822" },
  { icon: Baby, color: "#56ab2f" },
  { icon: Activity, color: "#5e35b1" },
  { icon: Activity, color: "#0f4c75" },
  { icon: Activity, color: "#118a7e" }
];

export default function DoctorsDirectory({ onBookClick }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Supabase states
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await loadDirectory();
      if (data) {
        setDoctors(data);
      }
      const metaData = loadDirectoryMeta();
      if (metaData) {
        setMeta(metaData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Compute dynamic specialties from fetched data
  const specialtyNames = [...new Set(doctors.map(d => d.category))].filter(Boolean).sort();
  const dynamicSpecialties = specialtyNames.map((name, idx) => {
    const mapped = ICON_COLORS[idx % ICON_COLORS.length];
    return {
      name,
      icon: mapped.icon,
      color: mapped.color
    };
  });

  const handleSpecialtyClick = (specialtyName) => {
    setSelectedSpecialty(specialtyName);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedSpecialty) {
    const specialtyDoctors = doctors.filter(d => d.category && d.category.toLowerCase() === selectedSpecialty.toLowerCase());
    const filteredDoctors = specialtyDoctors.filter(doc => 
      (doc.names && doc.names.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (doc.type && doc.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="dir-container">
        <div className="dir-header-bar">
          <button className="dir-back-btn" onClick={() => setSelectedSpecialty(null)}>
            <ArrowLeft size={20} /> Back to Index
          </button>
        </div>

        <div className="dir-search-container">
          <Search className="dir-search-icon" size={18} />
          <input 
            type="text" 
            className="dir-search-input"
            placeholder="Search doctor by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dir-specialty-pill-container">
          <div className="dir-specialty-pill">
            {selectedSpecialty.toUpperCase()}
          </div>
        </div>

        <div className="dir-doctor-list">
          {filteredDoctors.map((doc, idx) => (
            <div key={doc.id} className="dir-doctor-card">
              <div className="dir-doctor-number">
                {doc.photo ? (
                  <img 
                    src={doc.photo} 
                    alt={doc.names} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                ) : (
                  idx + 1
                )}
              </div>
              <div className="dir-doctor-content">
                <div className="dir-doctor-header">
                  <h3 className="dir-doctor-name">{doc.names}</h3>
                  <p className="dir-doctor-type">{doc.type}</p>
                </div>
                
                <div className="dir-doctor-details-grid">
                  <div className="dir-detail-item">
                    <User size={16} className="dir-icon" />
                    <span>{doc.qualifications}</span>
                  </div>
                  <div className="dir-detail-item">
                    <Clock size={16} className="dir-icon" />
                    <span>{doc.time}</span>
                  </div>
                  <div className="dir-detail-item">
                    <Phone size={16} className="dir-icon" />
                    <span>{doc.mobile_no}</span>
                  </div>
                  <div className="dir-detail-item">
                    <MapPin size={16} className="dir-icon" />
                    <span>{doc.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="dir-no-results">No doctors found for "{searchQuery}" in this specialty.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dir-container">
      {/* Hero Section */}
      <div className="dir-hero-section">
        <div className="dir-hero-wave"></div>
        <div className="dir-hero-content">
          <h2 className="dir-hero-subtitle">MUMINEEN</h2>
          <h1 className="dir-hero-title">DOCTORS<br/>DIRECTORY</h1>
          <div className="dir-hero-location">- INDORE -</div>
          
          <div className="dir-verified-badge">
            <CheckCircle2 size={24} className="dir-verified-icon" />
            Verified Data Provided by Doctors
          </div>
          
          <p className="dir-hero-footer-text">
            Doctors' Name & Specialty In Alphabetical Order
          </p>
        </div>
      </div>

      {/* Index Banner */}
      <div className="dir-index-banner-wrapper">
        <div className="dir-index-banner">
          <div className="dir-banner-left">
            <MapPin size={28} color="#a1d6ca" />
          </div>
          <div className="dir-banner-center">
            <h2>Mumineen Doctors Directory</h2>
            <p className="section-sub">
              Find specialists, check timings, and view clinic locations in our comprehensive directory.
              {meta?.uploadedAt && (
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  Last updated: {new Date(meta.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
            <p>Indore 2026</p>
          </div>
          <div className="dir-banner-right">
            <Stethoscope size={54} color="#a1d6ca" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="dir-index-title-wrapper">
        <div className="dir-index-line"></div>
        <div className="dir-index-title-diamond"></div>
        <h3 className="dir-index-title">INDEX</h3>
        <div className="dir-index-title-diamond"></div>
        <div className="dir-index-line"></div>
      </div>

      {/* Grid of Specialties */}
      <div className="dir-grid-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Loading directory...</p>
          </div>
        ) : dynamicSpecialties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.2rem' }}>No doctors available.</p>
          </div>
        ) : (
          <div className="dir-grid">
            {dynamicSpecialties.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <button 
                  key={spec.name} 
                  className="dir-grid-item"
                  onClick={() => handleSpecialtyClick(spec.name)}
                >
                  <div className="dir-item-left">
                    <div className="dir-item-icon-circle" style={{ backgroundColor: spec.color }}>
                      <Icon size={18} color="white" />
                    </div>
                    <div className="dir-item-name-group">
                      <span className="dir-item-number">{idx + 1}.</span>
                      <span className="dir-item-name">{spec.name.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="dir-item-right">
                    <div className="dir-item-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Features Footer Section */}
      <div className="dir-features-footer-wrapper">
        <div className="dir-features-footer">
          <div className="dir-feature-item">
            <ShieldCheck size={36} className="dir-feature-icon" />
            <div className="dir-feature-text">
              <h4>Verified Doctors</h4>
              <p>All doctor information<br/>verified & updated</p>
            </div>
          </div>
          <div className="dir-feature-item">
            <Users size={36} className="dir-feature-icon" />
            <div className="dir-feature-text">
              <h4>All Specialities</h4>
              <p>Find doctors across<br/>multiple specialities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
