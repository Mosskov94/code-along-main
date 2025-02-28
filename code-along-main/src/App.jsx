import ProtectedRoute from "./components/ProtectedRoute";
import Backoffice from "./pages/backoffice/Backoffice";
import { useRoutes } from "react-router-dom";
import Login from "./components/login/Login";
import Footer from "./components/footer/Footer";
import { useAuthContext } from "./context/useAuthContext";
import { BackofficeActivities } from "./pages/backoffice/BackofficeItems";
import ActivityForm from "./pages/backoffice/forms/ActivityForm";
import { BackofficeStays } from "./pages/backoffice/BackofficeStays"; // Backoffice for stays
import StayForm from "./pages/backoffice/forms/StayForm"; // Form for stays
import ReviewForm from "./pages/backoffice/forms/ReviewForm";
import { BackofficeReviews } from "./pages/backoffice/BackofficeReviews"; // Import BackofficeReviews

function App() {
  const { signedIn } = useAuthContext();

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute isAllowed={signedIn}>
          <Backoffice />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "activities",
          element: <BackofficeActivities />,
          children: [
            {
              path: "add",
              element: <ActivityForm />,
            },
            {
              path: "edit/:id",
              element: <ActivityForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "reviews", 
          element: <BackofficeReviews />,
          children: [
            {
              path: "add",
              element: <ReviewForm />,
            },
            {
              path: "edit/:id",
              element: <ReviewForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "stays",
          element: <BackofficeStays />,
          children: [
            {
              path: "add",
              element: <StayForm />,
            },
            {
              path: "edit/:id",
              element: <StayForm isEditMode={true} />,
            },
          ],
        },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return (
    <div className="app">
      <div className="main">{routes}</div>
      <Footer />
    </div>
  );
}

export default App;

