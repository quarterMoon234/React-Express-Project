import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <Link to="/hello">
        <button>HELLO 페이지로 이동</button>
      </Link>
    </div>
  );
}