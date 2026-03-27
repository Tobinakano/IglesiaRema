import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/auth";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((ok) => {
      setAuthed(ok);
      setLoading(false);
      if (!ok) navigate("/login", { replace: true });
    });
  }, [navigate]);

  if (loading) return <div style={{padding: 40}}>Cargando...</div>;
  if (!authed) return null;
  return children;
}
