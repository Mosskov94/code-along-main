import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../context/useAuthContext";

const useStays = () => {
  const [stays, setStays] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  // HENT ALLE OPHOLD
  const fetchStays = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3042/stays");
      const data = await response.json();
      setStays(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching stays:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion
  const refetch = useCallback(() => {
    fetchStays();
  }, [fetchStays]);

  // OPRET OPHOLD
  const createStay = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/stay", {
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
  const updateStay = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/stay", {
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
  const deleteStay = async (params) => {
    await fetch(`http://localhost:3042/stay/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Filtrer stays uden det slettede ID
    const filteredArray = stays.filter((stay) => stay._id !== params);
    setStays(filteredArray);
  };

  // HENT OPHOLD BASERET PÅ ID
  const fetchStayById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3042/stay/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stay: ${errorText}`);
      }

      const stay = await response.json();
      return stay.data[0];
    } catch (error) {
      setError(error.message);
      console.error("Error fetching stay:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  return {
    stays,
    createStay,
    deleteStay,
    setStays,
    fetchStays,
    fetchStayById,
    updateStay,
    isLoading,
    refetch,
    error,
  };
};

export { useStays };
