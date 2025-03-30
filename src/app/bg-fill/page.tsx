"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [tintedImage, setTintedImage] = useState<string | null>(null);
    const [projectType, setProjectType] = useState<string>("base");
    const [backgroundChoice, setBackgroundChoice] = useState<string>("background1.png");
    const [backgrounds, setBackgrounds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Define available project types
    const projectTypes = ["base", "send", "enb"];

    // Fetch available backgrounds for the selected project type
    useEffect(() => {
        async function fetchBackgrounds() {
            try {
                const response = await fetch(`http://localhost:5000/background-count?projectType=${projectType}`);
                const data = await response.json();
                setBackgrounds(data.backgrounds || []);
                if (data.backgrounds.length > 0) {
                    setBackgroundChoice(data.backgrounds[0]); // Default to the first background
                } else {
                    setBackgroundChoice(""); // Reset if no backgrounds
                }
            } catch (err: any) {
                setError(err.message);
            }
        }
        fetchBackgrounds();
    }, [projectType]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setProcessedImage(null);
            setTintedImage(null);
            setError(null);
        }
    };

    const handleProjectTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setProjectType(e.target.value);
    };

    const handleBackgroundChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setBackgroundChoice(e.target.value);
    };

    const handleBackgroundUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setProcessedImage(null);
        setTintedImage(null);

        const formData = new FormData(e.currentTarget);
        formData.append("projectType", projectType);
        formData.append("backgroundChoice", backgroundChoice); // Send full filename (e.g., "background1.png")

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.processedImageUrl) {
                setProcessedImage(data.processedImageUrl);
            } else {
                throw new Error(data.error || "Failed to process image");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTint = async () => {
        if (!processedImage) {
            setError("Please update the background first.");
            return;
        }

        setLoading(true);
        setError(null);
        setTintedImage(null);

        const response = await fetch(processedImage);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("image", blob, "processed-image.png");

        try {
            const tintResponse = await fetch("http://localhost:5000/tint", {
                method: "POST",
                body: formData,
            });

            const data = await tintResponse.json();
            if (data.processedImageUrl) {
                setTintedImage(data.processedImageUrl);
            } else {
                throw new Error(data.error || "Failed to tint image");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (imageUrl: string, filename: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <Header />
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow mt-16 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
                            <h1 className="text-3xl font-bold text-[#1A3CFF] mb-6 text-center">
                                Background Updater
                            </h1>
                            <form onSubmit={handleBackgroundUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="image" className="block mb-2">
                                        Select Image
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                        className="w-full p-2 border-2 border-dashed border-[#66D4FF] rounded-md text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="projectType" className="block mb-2">
                                        Select Project Type
                                    </label>
                                    <select
                                        id="projectType"
                                        value={projectType}
                                        onChange={handleProjectTypeChange}
                                        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                    >
                                        {projectTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="backgroundChoice" className="block mb-2">
                                        Select Background ({backgrounds.length} available)
                                    </label>
                                    <select
                                        id="backgroundChoice"
                                        value={backgroundChoice}
                                        onChange={handleBackgroundChange}
                                        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                        disabled={backgrounds.length === 0}
                                    >
                                        {backgrounds.length > 0 ? (
                                            backgrounds.map((bg) => (
                                                <option key={bg} value={bg}>
                                                    {bg}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No backgrounds available</option>
                                        )}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || backgrounds.length === 0}
                                    className="w-full bg-[#1A3CFF] text-white py-2 px-4 rounded-md hover:bg-[#66D4FF] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Update Background"}
                                </button>
                            </form>

                            {/* Image Previews */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedImage && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Preview</h2>
                                        <Image
                                            src={selectedImage}
                                            alt="Preview"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto rounded-md object-contain"
                                        />
                                    </div>
                                )}
                                {processedImage && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Processed Image</h2>
                                        <Image
                                            src={processedImage}
                                            alt="Processed Image"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto rounded-md object-contain"
                                        />
                                        <div className="mt-4 space-y-2">
                                            <button
                                                onClick={() => handleDownload(processedImage, "processed-image.png")}
                                                className="w-full px-4 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 transition-colors"
                                            >
                                                Download Processed Image
                                            </button>
                                            {!tintedImage && (
                                                <button
                                                    onClick={handleTint}
                                                    disabled={loading}
                                                    className="w-full bg-[#1A3CFF] text-white py-2 px-4 rounded-md hover:bg-[#66D4FF] transition-colors disabled:opacity-50"
                                                >
                                                    {loading ? "Processing..." : "Apply Base Tint"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {tintedImage && (
                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Tinted Image</h2>
                                    <Image
                                        src={tintedImage}
                                        alt="Tinted Image"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto rounded-md object-contain"
                                    />
                                    <button
                                        onClick={() => handleDownload(tintedImage, "tinted-image.png")}
                                        className="mt-4 w-full px-4 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 transition-colors"
                                    >
                                        Download Tinted Image
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 text-red-500 text-center">
                                Error: {error}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}