import { useEffect, useState } from "react";
import { Plus, Download } from "lucide-react";
import { createFile, getAllFiles } from "../services/fileService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Files = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

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
    if (e.target.files.length > 0) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleThumbnail = (e) => {
    if (e.target.files.length > 0) {
      setFormData({
        ...formData,
        thumbnail: e.target.files[0],
      });
    }
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

      setFormData({
        title: "",
        file: null,
        thumbnail: null,
      });

      setOpen(false);

      fetchFiles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload Failed");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Study Files
        </h1>

        {user?.role !== "user" && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow transition"
          >
            <Plus size={18} />
            Upload
          </button>
        )}
      </div>

      {/* Files */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No Files Available
          </div>
        )}

        {files.map((file) => (
          <div
            key={file._id}
            className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >
            {/* Thumbnail */}

            <img
              src={file.thumbnailUrl}
              alt={file.title}
              className="w-full h-44 object-cover"
            />

            {/* Content */}

            <div className="p-4">

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="font-semibold text-lg text-slate-800 line-clamp-2">
                    {file.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {file.fileName}
                  </p>

                </div>

                <a
                  href={file.fileUrl}
                  download
                  className="p-2 rounded-full hover:bg-emerald-100 transition"
                >
                  <Download
                    size={20}
                    className="text-emerald-600"
                  />
                </a>

              </div>

            </div>

          </div>
        ))}
      </div>
            {/* ================= Upload Modal ================= */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Upload Study File
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter file title"
                  required
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Thumbnail */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail
                </label>

                <label className="flex items-center justify-center h-28 rounded-xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition">
                  <span className="text-sm text-gray-700 font-medium">
                    {formData.thumbnail
                      ? formData.thumbnail.name
                      : "Upload Thumbnail"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnail}
                    className="hidden"
                  />
                </label>
              </div>

              {/* PDF */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File
                </label>

                <label className="flex items-center justify-center h-28 rounded-xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition">
                  <span className="text-sm text-gray-700 font-medium">
                    {formData.file
                      ? formData.file.name
                      : "Upload PDF"}
                  </span>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdf}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-60"
                >
                  {uploadLoading ? "Uploading..." : "Upload"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Files;