import { Link } from "react-router-dom";
import { Mascot } from "../components/Mascot";
import { useTitle } from "../components/Layout";

export default function NotFound() {
  useTitle("Lost in space");
  return (
    <div className="container" style={{ textAlign: "center", padding: "96px 20px" }}>
      <Mascot size={160} mood="think" />
      <h1 style={{ fontSize: "3rem", marginTop: 20 }}>404 · Lost in space</h1>
      <p className="lead" style={{ margin: "0 auto 24px" }}>This page drifted past the event horizon. Let's get you back on course.</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link to="/" className="btn primary">Back to home</Link>
        <Link to="/learn" className="btn">Browse lessons</Link>
      </div>
    </div>
  );
}
