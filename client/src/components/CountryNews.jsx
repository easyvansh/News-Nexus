import { useParams } from "react-router-dom";
import FeedPage from "./FeedPage";

function CountryNews() {
  const params = useParams();
  return <FeedPage mode="headlines" routeCountry={params.iso} />;
}

export default CountryNews;
