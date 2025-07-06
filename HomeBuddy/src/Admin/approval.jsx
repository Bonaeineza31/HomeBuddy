// src/Admin/AdminApprovals.jsx
import React, { useState, useEffect } from 'react';
import { Eye, Check, X, User, FileText, Shield, Calendar, Mail, MapPin, GraduationCap } from 'lucide-react';
import '../Adstyles/approval.css';

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve', 'reject', 'view'
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      console.log("accessToken being sent:", localStorage.getItem('accessToken'));
      const response = await fetch('https://homebuddy-yn9v.onrender.com/admin/pending', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }
      
      const data = await response.json();
      setPendingUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`https://homebuddy-yn9v.onrender.com/admin/approve/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        setShowModal(false);
        // Show success message
        alert('User approved successfully! They will receive an email notification.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to approve user'}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    try {
      const response = await fetch(`https://homebuddy-yn9v.onrender.com/admin/reject/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      
      if (response.ok) {
        const result = await response.json();
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        setShowModal(false);
        setRejectionReason('');
        // Show success message
        alert('User rejected successfully! They will receive an email notification.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to reject user'}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <div className="approvals-container">
        <div className="approvals-header">
          <h2>User Approvals</h2>
          <p>Loading pending registrations...</p>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="approvals-container">
      <div className="approvals-header">
        <h2>User Approvals</h2>
        <p>Review and approve new user registrations</p>
        <div className="stats">
          <span className="pending-count">{pendingUsers.length} pending approvals</span>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="empty-state">
          <Shield size={48} />
          <h3>No pending approvals</h3>
          <p>All user registrations have been processed</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingUsers.map(user => (
            <div key={user._id} className="approval-card">
              <div className="card-header">
                <div className="user-info">
                  <User size={24} />
                  <div>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className="user-role">{user.role}</p>
                  </div>
                </div>
                <div className="status-badge pending">Pending</div>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{user.country}</span>
                </div>
                <div className="info-row">
                  <GraduationCap size={16} />
                  <span>{user.university}</span>
                </div>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>Applied: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <FileText size={16} />
                  <span>ID Type: {user.idType}</span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => openModal(user, 'view')}
                >
                  <Eye size={16} />
                  View Documents
                </button>
                <button 
                  className="action-btn approve-btn"
                  onClick={() => openModal(user, 'approve')}
                >
                  <Check size={16} />
                  Approve
                </button>
                <button 
                  className="action-btn reject-btn"
                  onClick={() => openModal(user, 'reject')}
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === 'view' && 'View Documents'}
                {modalType === 'approve' && 'Approve User'}
                {modalType === 'reject' && 'Reject User'}
              </h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            <div className="modal-body">
              {modalType === 'view' && (
                <div className="documents-view">
                  <div className="user-details">
                    <h4>{selectedUser.firstName} {selectedUser.lastName}</h4>
                    <p>{selectedUser.email} • {selectedUser.role}</p>
                  </div>
                  
                  <div className="documents-grid">
                    <div className="document-item">
                      <h5>ID Document ({selectedUser.idType})</h5>
                      <img 
                        src={selectedUser.idDocumentUrl} 
                        alt="ID Document" 
                        className="document-image"
                      />
                      <a 
                        href={selectedUser.idDocumentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-full-btn"
                      >
                        View Full Size
                      </a>
                    </div>
                    
                    <div className="document-item">
                      <h5>Criminal Record Check</h5>
                      <img 
                        src={selectedUser.criminalRecordUrl} 
                        alt="Criminal Record" 
                        className="document-image"
                      />
                      <a 
                        href={selectedUser.criminalRecordUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-full-btn"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'approve' && (
                <div className="approve-confirmation">
                  <p>Are you sure you want to approve <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?</p>
                  <p>They will receive an email notification and can start using the platform.</p>
                </div>
              )}

              {modalType === 'reject' && (
                <div className="reject-form">
                  <p>Provide a reason for rejecting <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>:</p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows="4"
                    className="rejection-textarea"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              
              {modalType === 'approve' && (
                <button 
                  className="confirm-approve-btn"
                  onClick={() => handleApprove(selectedUser._id)}
                >
                  <Check size={16} />
                  Approve User
                </button>
              )}
              
              {modalType === 'reject' && (
                <button 
                  className="confirm-reject-btn"
                  onClick={() => handleReject(selectedUser._id)}
                  disabled={!rejectionReason.trim()}
                >
                  <X size={16} />
                  Reject User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;