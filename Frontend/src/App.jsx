
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
import Registro from "./pages/Registro";
import EditarPersona from "./pages/EditarPersona";
import EditarAsistencia from "./pages/EditarAsistencia";
import AgregarPersona from "./pages/AgregarPersona";
import PersonasRegistradas from "./pages/PersonasRegistradas";
import Asistencias from "./pages/Asistencias";
import ListadoAsistencias from "./pages/ListadoAsistencias";
import Graficas from "./pages/Graficas";
import AdminFlayers from "./pages/AdminFlayers";
import RequireAuth from "./components/RequireAuth";

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
        {/* Registro protegido, solo para usuarios autenticados */}
        <Route path="/admin/registro" element={
          <RequireAuth>
            <Registro />
          </RequireAuth>
        } />
        {/* Editar persona - Panel de administración protegido */}
        <Route path="/admin/editar/:id" element={
          <RequireAuth>
            <EditarPersona />
          </RequireAuth>
        } />
        {/* Personas registradas - Panel de administración protegido */}
        <Route path="/admin/personas" element={
          <RequireAuth>
            <PersonasRegistradas />
          </RequireAuth>
        } />
        {/* Asistencias - Panel de administración protegido */}
        <Route path="/asistencia/listado" element={
          <RequireAuth>
            <Asistencias />
          </RequireAuth>
        } />
        {/* Agregar Persona - Panel protegido */}
        <Route path="/asistencia/agregar" element={
          <RequireAuth>
            <AgregarPersona />
          </RequireAuth>
        } />
        {/* Editar Persona de Asistencia - Panel protegido */}
        <Route path="/asistencia/editar/:id" element={
          <RequireAuth>
            <EditarAsistencia />
          </RequireAuth>
        } />
        {/* Listado de Asistencias - Panel de registros protegido */}
        <Route path="/asistencia/registros" element={
          <RequireAuth>
            <ListadoAsistencias />
          </RequireAuth>
        } />
        {/* Gráficas - Panel de análisis protegido */}
        <Route path="/asistencia/graficas" element={
          <RequireAuth>
            <Graficas />
          </RequireAuth>
        } />
        {/* Gestor de Flayers - Panel de administración protegido */}
        <Route path="/admin/flayers" element={
          <RequireAuth>
            <AdminFlayers />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;