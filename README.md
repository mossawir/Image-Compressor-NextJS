# Image Compressor

A modern, high-performance web application for compressing and converting images locally. Built with Next.js 16 and React 19, it offers a seamless user experience with drag-and-drop functionality, real-time previews, and bulk processing capabilities.

![Image Compressor Preview](https://media.licdn.com/dms/image/v2/D4D22AQFhm3bn0gKW1A/feedshare-shrink_2048_1536/B4DZqt.JONGwAw-/0/1763855341331?e=1765411200&v=beta&t=lprLaCXIU0t87-BE7t3br8AeQ4qka_IjfTrYei0FTuk)

## Features

- **Drag & Drop Interface**: Easily upload multiple images at once using the intuitive dropzone.
- **Multi-Format Support**: Convert images to **JPG**, **PNG**, or **WebP** formats.
- **Customizable Quality**: Adjust compression quality (1-100%) for each image to balance size and fidelity.
- **Real-time Comparison**: Toggle between original and compressed views to visually verify quality changes.
- **Bulk Processing**: Compress all uploaded images simultaneously with a single click.
- **Bulk Download**: Download all processed images as a convenient ZIP file.
- **Smart Stats**: View real-time file size reduction percentages and formatted data sizes.
- **Modern UI/UX**: Features smooth animations with Framer Motion, a responsive grid layout, and a clean, accessible interface.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Server-side optimization)
- **Utilities**: `clsx`, `tailwind-merge`, `uuid`, `file-saver`, `jszip`

## Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd image-compressor
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  **Open the application**

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **`src/app`**: Contains the main application logic, pages, and API routes.
  - `page.tsx`: The main dashboard handling state, file uploads, and orchestration.
  - `api/process`: Server-side API route handling image compression via Sharp.
- **`src/components`**: Reusable UI components.
  - `image-card.tsx`: Individual image component with controls for format, quality, and comparison.
  - `action-bar.tsx`: Floating bottom bar for bulk actions (Clear, Compress All, Download All).
  - `ui/dropzone.tsx`: Drag-and-drop file upload area.
- **`src/lib`**: Utility functions.
  - `utils.ts`: Helper functions for class merging and filename generation.

## Usage

1.  **Upload**: Drag and drop images onto the dropzone or click to select files.
2.  **Configure**: For each image, select the desired output format (JPG, PNG, WebP) and quality level.
3.  **Compress**: Click "Compress Image" on individual cards or "Compress All" in the bottom bar.
4.  **Compare**: Use the "Compare" button on processed images to see a side-by-side view.
5.  **Download**: Save images individually or use "Download All" to get a ZIP archive.

## License

This project is open source and available under the [MIT License](LICENSE).
