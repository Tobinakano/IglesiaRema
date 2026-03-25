
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import FamiliaRema from "./pages/FamiliaRema";
import Equipos from "./pages/Equipos";
import Donaciones from "./pages/Donaciones";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  useEffect(() => {
    // Segundo ajuste tras pintar, evita restauraciones tardias en algunos navegadores.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname, search, hash]);

  return null;
}

// Layout para páginas normales (con Navbar y Footer)
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Inicio />
            </Layout>
          }
        />
        <Route
          path="/familia"
          element={
            <Layout>
              <FamiliaRema />
            </Layout>
          }
        />
        <Route
          path="/equipos"
          element={
            <Layout>
              <Equipos />
            </Layout>
          }
        />
        <Route
          path="/donaciones"
          element={
            <Layout>
              <Donaciones />
            </Layout>
          }
        />
        <Route
          path="/contacto"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        {/* Login sin Layout, no Navbar/Footer */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;