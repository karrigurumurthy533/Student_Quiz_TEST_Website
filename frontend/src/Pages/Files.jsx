import { useEffect, useState } from "react";
import { Plus, Trash, FileText } from "lucide-react";
import {
  createFile,
  getAllFiles,
  deleteFile,
} from "../services/fileService";
import { useAuth } from "../context/AuthContext";

const Files = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  // ================= FETCH FILES =================
  const fetchFiles = async () => {
    try {
      const res = await getAllFiles();
      setFiles(res?.files || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= INPUT HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  // ================= CREATE FILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("file", formData.file);

      await createFile(data);

      setOpen(false);

      setFormData({
        title: "",
        description: "",
        file: null,
      });

      fetchFiles();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE FILE =================
  const handleDelete = async () => {
    try {
      await deleteFile(deleteId);

      setDeleteId(null);

      fetchFiles();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Files</h1>

        {user?.role !== "user" && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600"
          >
            <Plus size={18} />
            Upload File
          </button>
        )}
      </div>

      {/* ================= FILE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-5"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileText className="text-emerald-500" size={22} />
                <h2 className="font-semibold text-lg">
                  {file.title}
                </h2>
              </div>

              {user?.role !== "user" && (
                <button
                  onClick={() => setDeleteId(file._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-3">
              {file.description || "No Description"}
            </p>

            <p className="text-xs text-slate-500 mt-4">
              {file.fileName || "Uploaded File"}
            </p>
          </div>
        ))}
      </div>

      {/* ================= CREATE MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-[600px] rounded-xl shadow-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-5">
              Upload File
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="File Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md p-2"
              />

              <textarea
                rows={4}
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-md p-2"
              />

              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border border-slate-200 rounded-md p-2"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-bold mb-3">
              Confirm Delete
            </h2>

            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to delete this file?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;