import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const [content, setContent] = useState(""); 
  const [imageUrl, setImageUrl] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setLoading(true); // Establece el estado de carga a true

    try {
      const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, image_url: imageUrl }), // Envía los datos del post
        }
      );

      if (response.ok) {
        navigate("/posts"); // Navega a la página de posts si la respuesta es exitosa
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al procesar la solicitud"); // Maneja errores de la solicitud
      }
    } catch (error) {
      setError("Error: " + error.message); // Maneja errores de la solicitud
    } finally {
      setLoading(false); // Establece el estado de carga a false
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">Publicar Nuevo Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label className="form-label">Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-textarea"
            placeholder="Escribe el contenido del post"
          />
        </div>
        <div className="form-group">
          <label class="form-label">URL de la Imagen (opcional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="form-input"
            placeholder="https://example.com/imagen.jpg"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading} className="form-button">
          {loading ? "Cargando..." : "Publicar"}
        </button>
      </form>
      <button className="back-button" onClick={() => navigate('/posts')}>
        Volver
      </button>
    </div>
  );
};

export default CreatePost;
