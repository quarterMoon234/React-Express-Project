import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HelloPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/hello").then((res) => setMessage(res.data.message));
  }, []);

  return (
    <div>
      <h1>HELLO 페이지</h1>
      <p>{message}</p>
      <Link to="/">
        <button>메인 페이지로 돌아가기</button>
      </Link>
    </div>
  );
}