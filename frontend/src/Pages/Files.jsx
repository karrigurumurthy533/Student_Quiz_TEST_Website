import { useEffect, useState } from "react";
import { Plus, Trash, Download, ExternalLink } from "lucide-react";
import { createFile, getAllFiles, deleteFile } from "../services/fileService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Files = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    file: null,
    thumbnail: null,
  });

  const fetchFiles = async () => {
    try {
      const res = await getAllFiles();
      setFiles(res.files || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePdf = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleThumbnail = (e) => {
    setFormData({
      ...formData,
      thumbnail: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadLoading) return;

    try {
      setUploadLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("file", formData.file);
      data.append("thumbnail", formData.thumbnail);

      await createFile(data);

      toast.success("File uploaded successfully");

      setOpen(false);

      setFormData({
        title: "",
        file: null,
        thumbnail: null,
      });

      fetchFiles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload Failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteLoading) return;

    try {
      setDeleteLoading(true);

      await deleteFile(deleteId);

      toast.success("File deleted successfully");

      setDeleteId(null);

      fetchFiles();
    } catch (err) {
      toast.error("Delete Failed");
    } finally {
      setDeleteLoading(false);
    }
  };
  {
    /* ================= HEADER ================= */
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Study Files</h1>

        {user?.role !== "user" && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            Upload File
          </button>
        )}
      </div>

      {/* ================= FILES ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-500">
            No Files Available
          </div>
        )}

        {files.map((file) => (
          <div
            key={file._id}
            className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-xl transition"
          >
            {/* Thumbnail */}

            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={file.thumbnailUrl}
                alt={file.title}
                className="w-full h-52 object-cover hover:scale-105 transition duration-300"
              />
            </a>

            {/* Content */}

            <div className="p-4">
              <h2 className="font-bold text-lg text-slate-800 mb-4 line-clamp-2">
                {file.title}
              </h2>

              <p className="text-xs text-slate-500 mb-5">{file.fileName}</p>

              <div className="flex justify-between items-center">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <ExternalLink size={16} />
                  Open
                </a>

                <a
                  href={file.fileUrl}
                  download
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>

              {user?.role !== "user" && (
                <button
                  onClick={() => setDeleteId(file._id)}
                  className="mt-5 w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  <Trash size={16} />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* ================= Upload Modal ================= */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Study File</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  File Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter File Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Thumbnail Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  PDF File
                </label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdf}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                disabled={uploadLoading}
                onClick={() => setOpen(false)}
                className="border px-5 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={uploadLoading}
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {uploadLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Delete Modal ================= */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-[420px] p-6">
            <h2 className="text-xl font-bold">Delete File</h2>

            <p className="text-slate-600 mt-3">
              Are you sure you want to delete this file?
            </p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                disabled={deleteLoading}
                onClick={() => setDeleteId(null)}
                className="border px-5 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
