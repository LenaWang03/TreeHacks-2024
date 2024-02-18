import "./DefaultPrompt.css";

export default function DefaultPrompt({
  prompt,
  description,
  icon,
}: {
  prompt: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="prompt-box">
      <div className="prompt-text">
        <div className="promptTitle">
          <h1
            style={{ padding: "0px", fontSize: "25px" }}
          >
            {prompt}
          </h1>
          <div className="promptIcon" style={{ fontSize: "30px" }}>{icon}</div>
        </div>
        <div style={{paddingTop:"20px", fontWeight:"300"}}>{description}</div>
      </div>
    </div>
  );
}
