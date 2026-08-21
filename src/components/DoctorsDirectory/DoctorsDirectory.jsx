import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, Phone, Stethoscope, ChevronRight, ArrowLeft } from "lucide-react";
import { loadDirectory } from "../../data/directoryService";
import "./DoctorsDirectory.css";

export default function DoctorsDirectory({ onBookClick }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDirectory() {
      const data = await loadDirectory();
      if (data) {
        setDoctors(data);
      }
      setLoading(false);
    }
    fetchDirectory();
  }, []);

  // Group doctors by category
  const specialties = doctors.reduce((acc, doc) => {
    const spec = doc.category || "General";
    if (!acc[spec]) acc[spec] = [];
    acc[spec].push(doc);
    return acc;
  }, {});

  const specialtyKeys = Object.keys(specialties).sort();

  if (loading) {
    return (
      <div className="directory-loading">
        <div className="spinner"></div>
        <p>Loading Doctors Directory...</p>
      </div>
    );
  }

  if (selectedSpecialty) {
    const specialtyDoctors = specialties[selectedSpecialty] || [];
    const filteredDoctors = specialtyDoctors.filter(doc => 
      (doc.names && doc.names.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.type && doc.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="directory-container">
        <div className="directory-header">
          <button className="btn-back" onClick={() => { setSelectedSpecialty(null); setSearchQuery(""); }}>
            <ArrowLeft size={20} /> Back to Index
          </button>
          <h2>{selectedSpecialty.toUpperCase()}</h2>
        </div>

        <div className="directory-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search doctor by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="doctor-list">
          {filteredDoctors.map((doc, idx) => (
            <div key={doc.id || idx} className="doctor-list-card">
              <div className="doctor-list-card-header">
                <div className="doctor-number">{idx + 1}</div>
                <div className="doctor-info">
                  <h3>{doc.names}</h3>
                  {doc.type && <p className="doctor-title">{doc.type}</p>}
                </div>
              </div>
              <div className="doctor-details">
                <div className="detail-item">
                  <Stethoscope size={16} className="icon" />
                  <span>{doc.qualifications || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} className="icon" />
                  <span>{doc.time || "Consultation Timings"}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} className="icon" />
                  <span>{doc.mobile_no || "N/A"}</span>
                </div>
                <div className="detail-item address">
                  <MapPin size={16} className="icon" />
                  <span>{doc.address || "Indore"}</span>
                </div>
              </div>
              {onBookClick && (
                <button className="btn btn-outline" onClick={() => onBookClick({ doctorName: doc.names, specialty: doc.category })}>
                  Book Visit
                </button>
              )}
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <p className="no-results">No doctors found for your search.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="directory-container">
      <div className="directory-hero">
        <h1>Mumineen Doctors Directory</h1>
        <p>Indore 2026</p>
        <span className="badge-verified">✔ Verified Data Provided by Doctors</span>
      </div>

      <h2 className="index-title">INDEX</h2>

      <div className="specialty-grid">
        {specialtyKeys.map((spec, idx) => (
          <button 
            key={spec} 
            className="specialty-card" 
            onClick={() => setSelectedSpecialty(spec)}
          >
            <div className="specialty-card-left">
              <div className="specialty-icon-wrapper">
                <Stethoscope size={24} />
              </div>
              <span className="specialty-number">{idx + 1}.</span>
              <span className="specialty-name">{spec.toUpperCase()}</span>
            </div>
            <div className="specialty-card-right">
              <span className="specialty-count">{specialties[spec].length}</span>
              <ChevronRight size={18} className="chevron" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
