import { lazy, Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/mockApi';
import '../styles/Records.css';

const VitalsChart = lazy(() => import('../components/VitalsChart'));

export const MedicalRecords = () => {
  const { data: records, isLoading } = useQuery({
    queryKey: ['medicalRecords'],
    queryFn: api.getMedicalRecords
  });

  const [activeTab, setActiveTab] = useState('lab');

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading medical records...</p>
      </div>
    );
  }

  const { labResults = [], vitals = [], prescriptions = [] } = records || {};

  return (
    <div className="records-page">
      <div className="records-header">
        <h1>Medical Records</h1>
        <p>Access your health data and test results</p>
      </div>

      <div className="records-tabs">
        <button
          className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab')}
        >
          <span className="tab-icon">🧪</span>
          Lab Results
        </button>
        <button
          className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          <span className="tab-icon">❤️</span>
          Vitals
        </button>
        <button
          className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          <span className="tab-icon">💊</span>
          Prescriptions
        </button>
      </div>

      <div className="records-content">
        {activeTab === 'lab' && (
          <div className="lab-results">
            <div className="section-header">
              <h2>Laboratory Test Results</h2>
              <button className="download-btn">Download PDF</button>
            </div>
            <div className="results-grid">
              {labResults.map(result => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h3>{result.test}</h3>
                    <span className={`result-status ${result.status.toLowerCase()}`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="result-value">
                    <span className="value">{result.value}</span>
                    <span className="unit">{result.unit}</span>
                  </div>
                  <div className="result-meta">
                    <span className="range">Normal Range: {result.range}</span>
                    <span className="date">
                      {new Date(result.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="vitals-section">
            <div className="section-header">
              <h2>Vital Signs History</h2>
              <span className="info-text">Last 4 readings</span>
            </div>

            <Suspense fallback={
              <div className="chart-loading">
                <div className="spinner"></div>
                <p>Loading chart...</p>
              </div>
            }>
              <VitalsChart vitals={vitals} />
            </Suspense>

            <div className="vitals-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th>Height (cm)</th>
                    <th>BMI</th>
                    <th>Heart Rate</th>
                    <th>Temperature (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.map((vital, index) => (
                    <tr key={index}>
                      <td>{new Date(vital.date).toLocaleDateString()}</td>
                      <td>{vital.weight}</td>
                      <td>{vital.height}</td>
                      <td>{vital.bmi}</td>
                      <td>{vital.heartRate} bpm</td>
                      <td>{vital.temperature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="prescriptions-section">
            <div className="section-header">
              <h2>Active Prescriptions</h2>
            </div>
            <div className="prescriptions-list">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-card">
                  <div className="prescription-header">
                    <div>
                      <h3>{prescription.medication}</h3>
                      <p className="dosage">{prescription.dosage} - {prescription.frequency}</p>
                    </div>
                    <span className={`prescription-status ${prescription.status.toLowerCase()}`}>
                      {prescription.status}
                    </span>
                  </div>
                  <div className="prescription-details">
                    <div className="detail-row">
                      <span className="label">Prescribed By:</span>
                      <span className="value">{prescription.prescribedBy}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date Issued:</span>
                      <span className="value">
                        {new Date(prescription.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="prescription-actions">
                    <button className="refill-btn">Request Refill</button>
                    <button className="details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
