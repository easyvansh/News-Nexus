import { useParams } from "react-router-dom";
import FeedPage from "./FeedPage";

function TopHeadlines() {
  const params = useParams();
  return <FeedPage mode="headlines" routeCategory={params.category} />;
}

export default TopHeadlines;
