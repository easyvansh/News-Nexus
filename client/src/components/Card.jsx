function Card(props) {
  return (
    <article className="everything-card">
      <a href={props.url} target="_blank" rel="noreferrer" className="card-anchor" aria-label={`Open source article: ${props.title}`}>
        <div className="everything-card-img-wrap">
          <img
            className="everything-card-img"
            src={props.imgUrl || "https://placehold.co/600x400?text=No+Image"}
            alt={props.title || "article"}
          />
        </div>
        <div className="card-content">
          <h3 className="title">{props.title}</h3>
          <div className="description">
            <p className="description-text">
              {(props.description || "No description available.").substring(0, 120)}
            </p>
          </div>
          <div className="info">
            <div className="source-info">
              <span className="info-label">Source</span>
              <span className="link">{(props.source || "Unknown").substring(0, 70)}</span>
            </div>
            <div className="origin">
              <p className="origin-item">
                <span className="info-label">Author</span>
                {props.author || "Unknown"}
              </p>
              <p className="origin-item">
                <span className="info-label">Published</span>
                {(props.publishedAt || "").substring(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

export default Card;
