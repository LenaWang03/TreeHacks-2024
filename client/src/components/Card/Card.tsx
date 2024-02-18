import "./Card.css";
import Star from "../../imgs/star.svg";

export default function Chat({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card">
      <div className="stepNumber">
        <p>{number}</p>
        <img src={Star} alt="star" />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
