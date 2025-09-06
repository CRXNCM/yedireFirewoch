import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { apiService } from '../../../utils/apiClient.js';

const SponsorEdit = () => {
  const { id } = useParams();
  const history = useHistory();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const response = await apiService.sponsors.getById(id);
        setSponsor(response.sponsor);
      } catch (error) {
        console.error('Error fetching sponsor:', error);
        setError('Failed to load sponsor. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.sponsors.update(id, sponsor);
      history.push('/admin/sponsors'); // Redirect after successful update
    } catch (error) {
      console.error('Error updating sponsor:', error);
      alert('Failed to update sponsor. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Sponsor</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={sponsor.name}
          onChange={(e) => setSponsor({ ...sponsor, name: e.target.value })}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={sponsor.description}
          onChange={(e) => setSponsor({ ...sponsor, description: e.target.value })}
        />
      </div>
      <div>
        <label>Website URL:</label>
        <input
          type="url"
          value={sponsor.website_url}
          onChange={(e) => setSponsor({ ...sponsor, website_url: e.target.value })}
        />
      </div>
      <button type="submit">Update Sponsor</button>
    </form>
  );
};

export default SponsorEdit;
