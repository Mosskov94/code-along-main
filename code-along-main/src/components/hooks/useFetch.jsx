import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../context/useAuthContext";

const useFetch = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthContext();

  // HENT ALLE AKTIVITETER – memoiseret med useCallback, så referencen forbliver stabil (dvs at den ikke bliver genoprettet ved hver render)
  const fetchActivities = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3042/activities");
      const data = await response.json();
      setActivities(data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch-funktion, der blot kalder fetchActivities
  const refetch = useCallback(() => {
    fetchActivities();
  }, [fetchActivities]);

  // OPRET AKTIVITET
  const createActivity = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/activity", {
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

  // OPDATER AKTIVITET
  const updateActivity = async (formData) => {
    try {
      const response = await fetch("http://localhost:3042/activity", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Fejl ved opdatering af aktivitet");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
      throw error;
    }
  };

  // SLET AKTIVITET
  const deleteActivity = async (params) => {
    await fetch(`http://localhost:3042/activity/${params}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /* Filter all the activities without the matching ID. */
    const filteredArray = activities.filter((act) => act._id !== params);

    setActivities(filteredArray);
  };

  // HENT AKTIVITET BASERET PÅ ID
  const fetchActivityById = async (id) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3042/activity/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch activity: ${errorText}`);
      }

      const activity = await response.json();
      return activity.data[0];
    } catch (error) {
      setError(error.message);
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    createActivity,
    deleteActivity,
    setActivities,
    fetchActivities,
    fetchActivityById,
    updateActivity,
    isLoading,
    refetch,
    error,
  };
};

export { useFetch };
