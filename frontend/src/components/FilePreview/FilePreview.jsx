import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { API_URL } from "../../services/api";
import Modal from "../Modal/Modal";
import Loading from "../Loading/Loading";
import Button from "../Button/Button"; // 👈 usa seu componente
import "./FilePreview.css";

export default function FilePreview({ fileId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const previewUrl = `${API_URL}/files/${fileId}/preview`;
  const downloadUrl = `${API_URL}/files/${fileId}/download`;

  const openPreview = () => {
    setLoading(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setLoading(false);
  };

  const handleDownload = () => {
    // abre o download em uma nova aba
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="file-preview">
      {/* Botão único de Visualizar */}{" "}
      <button onClick={openPreview} className="btn btn-view">
        {" "}
        <Eye size={16} /> Visualizar{" "}
      </button>
      {/* Modal de pré-visualização */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Pré-visualização do arquivo"
        size="large"
        closable
        closeOnOverlayClick
      >
        {/* Botão de download no topo direito */}
        <div className="modal-header-actions">
          <Button
            onClick={handleDownload}
            variant="success"
            startIcon={<Download size={16} />}
          >
            Baixar
          </Button>
        </div>

        <div className="preview-box">
          {loading && (
            <div className="loading-container">
              <Loading />
            </div>
          )}

          <iframe
            src={previewUrl}
            title="Pré-visualização"
            style={{ width: "100%", height: "80vh", border: "none" }}
            onLoad={() => setLoading(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
