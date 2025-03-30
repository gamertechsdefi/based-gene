"use client";
import Image from "next/image";
import Link from "next/link"; // For navigation to the tool page

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left: Text Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A3CFF] mb-4">
                Staying Based
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                Generate stunning color effects and custom backgrounds for your profile pictures and images in one click—onchain and powered by Thirdweb.
              </p>
              <Link href="/bg-fill">
                <button className="bg-[#1A3CFF] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#66D4FF] transition-colors">
                  Try the Background Updater Now
                </button>
              </Link>
            </div>
            {/* Right: Hero Image */}
            <div className="md:w-1/2">
              <Image
                src="/images/based self.png" // Placeholder: replace with an actual image
                alt="Example of a processed image with custom background"
                width={400}
                height={400}
                className="w-full h-auto rounded-lg shadow-md object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-neutral-800 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#66D4FF] text-center mb-8">
            Why Use Staying Based?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <Image
                src="/images/bsmort new.png" // Placeholder: replace with an icon or example
                alt="One-click processing"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">One-Click Magic</h3>
              <p className="text-gray-400">
                Transform your images with custom backgrounds and tints instantly.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <Image
                src="/images/based jesse.png" // Placeholder: replace with an icon or example
                alt="Onchain integration"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">Onchain Power</h3>
              <p className="text-gray-400">
                Leverage Thirdweb for secure, decentralized image processing.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <Image
                src="/images/based self.png" // Placeholder: replace with an icon or example
                alt="Customizable options"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">Fully Customizable</h3>
              <p className="text-gray-400">
                Choose from multiple project types and backgrounds to suit your style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#66D4FF] text-center mb-8">
            See It in Action
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Image
                src="/images/based jesse.png" // Placeholder: replace with a processed image
                alt="Example 1: Base background"
                width={300}
                height={300}
                className="w-full h-auto rounded-md shadow-md object-contain"
              />
              <p className="mt-2 text-gray-300">Base Project Background</p>
            </div>
            <div className="text-center">
              <Image
                src="/images/send me.png" // Placeholder: replace with a processed image
                alt="Example 2: Send background"
                width={300}
                height={300}
                className="w-full h-auto rounded-md shadow-md object-contain"
              />
              <p className="mt-2 text-gray-300">Send Project Background</p>
            </div>
            <div className="text-center">
              <Image
                src="/images/tinted-image.png" // Placeholder: replace with a processed image
                alt="Example 3: Tinted image"
                width={300}
                height={300}
                className="w-full h-auto rounded-md shadow-md object-contain"
              />
              <p className="mt-2 text-gray-300">Tinted Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-6 text-center text-gray-500">
        <p>Built with ❤️ using Next.js, Tailwind CSS, and Thirdweb</p>
        <p className="mt-2">
          <Link href="/bg-tools" className="text-[#66D4FF] hover:underline">
            Get Started
          </Link>
          {" | "}
          <a href="https://github.com/your-repo" className="text-[#66D4FF] hover:underline">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}