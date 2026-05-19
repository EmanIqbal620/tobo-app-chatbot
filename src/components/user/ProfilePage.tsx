// frontend/src/components/user/ProfilePage.tsx
// User profile page component

import React, { useState, useEffect } from 'react';
import api from '@/services/api';

interface UserProfile {
  user_id: string;
  email: string;
  name?: string;
  created_at?: string;
}

interface ProfilePageProps {
  userId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the centralized API service
      const response = await api.get('/user/profile');

      const data: UserProfile = response.data;
      setUserProfile(data);
    } catch (error: any) {
      let errorMessage = 'Failed to fetch user profile';

      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        errorMessage = errorData.detail || errorData.message || 'Failed to fetch user profile';
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userProfile) {
    return <div>No user profile found</div>;
  }

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-info">
        <div className="info-item">
          <strong>ID:</strong> {userProfile.user_id}
        </div>
        <div className="info-item">
          <strong>Email:</strong> {userProfile.email}
        </div>
        {userProfile.name && (
          <div className="info-item">
            <strong>Name:</strong> {userProfile.name}
          </div>
        )}
        {userProfile.created_at && (
          <div className="info-item">
            <strong>Member Since:</strong> {new Date(userProfile.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;