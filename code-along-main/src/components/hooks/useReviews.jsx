import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../context/useAuthContext";

const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  // HENT ALLE OPHOLD
  const fetchReviews = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3042/reviews");
      const data = await response.json();
      setReviews(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching stays:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion
  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  // OPRET OPHOLD
  const createReview = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Fejl ved oprettelse af ophold");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // OPDATER OPHOLD
  const updateReview = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/review", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Fejl ved opdatering af ophold");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved opdatering:", error);
      throw error;
    }
  };

  // SLET OPHOLD
  const deleteReview = async (params) => {
    await fetch(`http://localhost:3042/review/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Filtrer stays uden det slettede ID
    const filteredArray = reviews.filter((review) => review._id !== params);
    setReviews(filteredArray);
  };

  // HENT OPHOLD BASERET PÅ ID
  const fetchReviewById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3042/review/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stay: ${errorText}`);
      }

      const review = await response.json();
      return review.data[0];
    } catch (error) {
      setError(error.message);
      console.error("Error fetching review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    createReview,
    deleteReview,
    setReviews,
    fetchReviews,
    fetchReviewById,
    updateReview,
    isLoading,
    refetch,
    error,
  };
};

export { useReviews };
