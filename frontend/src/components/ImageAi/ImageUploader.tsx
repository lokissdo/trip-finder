import React, { useState } from "react";
import axios from "axios";
import { CameraOutlined } from '@ant-design/icons'; // Import camera icon from Ant Design

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/generate-content", formData);
      setResult(response.data.result);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while generating content.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowUploader(false);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed bottom-3 left-5 z-40">
      {!showUploader ? (
        <button
          onClick={() => setShowUploader(true)}
          className="rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-green-400 text-white p-3 shadow-lg font-bold hover:shadow-xl transition-shadow duration-300 mb-2"
          style={{ width: "50px", height: "50px" }} // Thay đổi kích thước của nút
        >
          <CameraOutlined style={{ fontSize: "25px" }} />
        </button>
      ) : (
        <div className="p-4 border rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-100 max-w-xs w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-green-700 hover:text-green-900 text-xl font-bold"
          >
            &times;
          </button>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4" />
          {selectedFile && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="w-32 h-32 object-cover mx-auto mb-2 rounded-lg shadow-sm"
              />
              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-colors duration-300"
              >
                Generate
              </button>
            </div>
          )}
          {loading && <p className="text-center mt-4 text-green-600 font-semibold">Loading...</p>}
          {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
          {result && (
            <div className="mt-4 text-center">
              <h3 className="font-bold text-lg text-green-600">Result:</h3>
              <p className="text-green-700">{result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
