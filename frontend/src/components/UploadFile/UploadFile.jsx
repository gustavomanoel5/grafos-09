import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import api from "../../api";
import "./UploadFile.css";

const UploadFile = ({
  label = "Arquivo",
  value,
  onChange,
  uploadUrl = "/files",
  accept = "*",
  maxSize = 5, // MB
  className = "",
  style = {},
  required = true,
  ...rest
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  // Estado de erro visual (campo obrigatório não preenchido)
  const [hasError, setHasError] = useState(required && !value);

  useEffect(() => {
    setHasError(required && !value && !uploading);
  }, [value, uploading, required]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`📦 Arquivo maior que ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);
    await handleUpload(file);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mime", file.type);

    try {
      setUploading(true);
      setProgress(0);

      const response = await api.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      const fileId = response.data.files?.[0]?.id || response.data.id;
      if (!fileId) throw new Error("ID do arquivo não retornado.");

      onChange?.(String(fileId));
      toast.success("✅ Upload concluído com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("❌ Erro ao enviar arquivo");
      onChange?.(null);
    } finally {
      setUploading(false);
      setProgress(0);
      setSelectedFile(null);
    }
  };

  return (
    <div
      className={`upload-container ${className} ${hasError ? "error" : ""}`}
      style={style}
      {...rest}
    >
      <label className={`upload-label ${uploading ? "disabled" : ""}`}>
        <IoCloudUploadOutline
          size={30}
          color={hasError ? "#dc2626" : "#2563eb"}
        />
        <span>{label}</span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          required={required}
        />
      </label>

      {uploading && (
        <div className="upload-progress">
          <div
            className="upload-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {value && !uploading && (
        <p className="upload-files-list">✅ Arquivo salvo</p>
      )}

      {selectedFile && uploading && (
        <p className="upload-files-list">
          Enviando: {selectedFile.name} ({progress}%)
        </p>
      )}

      {hasError && !uploading && !value && (
        <p className="upload-error-text">⚠️ Este campo é obrigatório</p>
      )}
    </div>
  );
};

export default UploadFile;
