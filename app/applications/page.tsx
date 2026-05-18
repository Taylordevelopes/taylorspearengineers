"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Modal, Button, Form } from "react-bootstrap";
import { Apps } from "../types/types";
import { getApps, createApp, updateApp, deleteApp } from "../lib/api/products";
import { useAuth } from "../context/AuthContext";

export default function page() {
  const [selected, setSelected] = useState<Apps | null>(null);
  const [apps, setApps] = useState<Apps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Apps | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    site_url: "",
    download_url: "",
    featured: false,
    is_phone_app: false,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await getApps();
        setApps(response);
      } catch (error) {
        console.error("Failed to fetch apps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newApp = await createApp(formData);
      setApps(Array.isArray(apps) ? [...apps, newApp] : [newApp]);
      setShowCreateModal(false);
      // Reset form
      setFormData({
        title: "",
        description: "",
        image_url: "",
        site_url: "",
        download_url: "",
        featured: false,
        is_phone_app: false,
      });
      alert("App created successfully!");
    } catch (error) {
      console.error("Failed to create app:", error);
      alert(
        `Failed to create app: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Resize and convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement("img");
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set max dimensions (e.g., 512x512 for app icons)
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Base64 with quality compression (0.8 = 80% quality)
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        setFormData({
          ...formData,
          image_url: resizedBase64,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteApp = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;

    try {
      await deleteApp(slug);
      setApps(apps.filter((app) => app.slug !== slug));
      setSelected(null);
      alert("App deleted successfully!");
    } catch (error) {
      console.error("Failed to delete app:", error);
      alert(
        `Failed to delete app: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleEditApp = (app: Apps) => {
    setEditingApp(app);
    setFormData({
      title: app.title,
      description: app.description,
      image_url: app.image_url,
      site_url: app.site_url || "",
      download_url: app.download_url || "",
      featured: app.featured,
      is_phone_app: app.is_phone_app,
    });
    setShowEditModal(true);
    setSelected(null);
  };

  const handleUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      const updatedApp = await updateApp({
        slug: editingApp.slug,
        ...formData,
      });
      setApps(
        apps.map((app) => (app.slug === editingApp.slug ? updatedApp : app)),
      );
      setShowEditModal(false);
      setEditingApp(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        site_url: "",
        download_url: "",
        featured: false,
        is_phone_app: false,
      });
      alert("App updated successfully!");
    } catch (error) {
      console.error("Failed to update app:", error);
      alert(
        `Failed to update app: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-3xl mb-10 ">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Spearitual Applications
        </h1>
        <p className="text-center text-gray-600">
          Developed by Spearitual LLC.
        </p>
        {user && (
          <div className="text-center mb-4">
            <button
              className="mt-4 bg-gray-900 text-white rounded-xl py-2 px-4"
              onClick={() => setShowCreateModal(true)}
            >
              Create App
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {apps
            .sort((a, b) => {
              // Featured apps come first
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return 0;
            })
            .map((app) => (
              <div key={app.id} className="relative">
                <button
                  onClick={() => app.featured && setSelected(app)}
                  disabled={!app.featured}
                  className={`flex flex-col items-center p-2 transition-opacity duration-200 w-full ${
                    app.featured
                      ? "hover:opacity-70 cursor-pointer"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="w-28 h-28 rounded-2xl bg-gray-100 overflow-hidden mb-3 flex items-center justify-center">
                    <Image
                      src={app.image_url}
                      alt={app.title}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <p
                    className={`font-semibold text-sm text-center ${
                      app.featured ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {app.title}
                  </p>
                  <p className="text-xs text-center mt-0.5 text-black font-extrabold">
                    {app.description}
                  </p>
                </button>
                {user && (
                  <div className="absolute top-0 right-0 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditApp(app);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5"
                      title="Edit app"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteApp(app.slug);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                      title="Delete app"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No apps available at this time.
        </p>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src={selected.image_url}
                  alt={selected.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selected.title}
                </h2>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {selected.description}
            </p>

            {selected.is_phone_app ? (
              <a
                href={selected.download_url}
                className="block w-full text-center bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Download
              </a>
            ) : (
              <a
                href={selected.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Visit Site
              </a>
            )}
          </div>
        </div>
      )}

      {/* Create App Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateApp}>
            <Form.Group className="mb-3" controlId="appTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter app title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="appDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter app description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="appImageUrl">
              <Form.Label>Image</Form.Label>
              <div className="mb-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Upload an image (max 2MB) or enter a URL below
                </Form.Text>
              </div>
              <Form.Control
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Or paste image URL here"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="appSiteUrl">
              <Form.Label>Site URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="site_url"
                value={formData.site_url}
                onChange={handleInputChange}
                placeholder="https://yourapp.com"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="appDownloadUrl">
              <Form.Label>Download URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="download_url"
                value={formData.download_url}
                onChange={handleInputChange}
                placeholder="https://example.com/download"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="appFeatured">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured App"
                checked={formData.featured}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="appIsPhoneApp">
              <Form.Check
                type="checkbox"
                name="is_phone_app"
                label="Phone App (shows Download button instead of Visit Site)"
                checked={formData.is_phone_app}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleCreateApp}>
            Create App
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit App Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditingApp(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateApp}>
            <Form.Group className="mb-3" controlId="editAppTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter app title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter app description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppImageUrl">
              <Form.Label>Image</Form.Label>
              <div className="mb-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Upload an image (max 2MB) or enter a URL below
                </Form.Text>
              </div>
              <Form.Control
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Or paste image URL here"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppSiteUrl">
              <Form.Label>Site URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="site_url"
                value={formData.site_url}
                onChange={handleInputChange}
                placeholder="https://yourapp.com"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppDownloadUrl">
              <Form.Label>Download URL (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="download_url"
                value={formData.download_url}
                onChange={handleInputChange}
                placeholder="https://example.com/download"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppFeatured">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured App"
                checked={formData.featured}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAppIsPhoneApp">
              <Form.Check
                type="checkbox"
                name="is_phone_app"
                label="Phone App (shows Download button instead of Visit Site)"
                checked={formData.is_phone_app}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditModal(false);
              setEditingApp(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="dark" onClick={handleUpdateApp}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
