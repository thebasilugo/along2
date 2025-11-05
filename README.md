# Along

> Move smart. Move easily.

Along is a web application designed to help users find public transport routes in major Nigerian cities. It simplifies commuting by providing clear, step-by-step directions using common local transport options.

## Architecture

This application is built with **Next.js** and uses a secure backend proxy architecture. The frontend React application does not directly communicate with the Gemini API. Instead, it sends requests to a Next.js API Route (`/api/get-route`) that runs on the server. This backend function is the only component that has access to the secret API key, ensuring the key is never exposed in the user's browser.

**Flow**: User on Frontend → Calls `/api/get-route` → Next.js API Route (with API Key) → Calls Google Gemini API → Returns Response to Frontend

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need Node.js and npm installed, plus a Google API key with the Gemini API enabled.

- **Google API Key**:
  1. Go to the [Google AI Studio](https://aistudio.google.com/).
  2. Sign in with your Google account.
  3. Click on **"Get API key"** and then **"Create API key in new project"**.
  4. Copy the generated API key.

### Local Configuration

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment File**: Create a file named `.env.local` in the root directory of the project.

3.  **Add API Key**: Open the `.env.local` file and add your Google API key as follows:
    ```
    API_KEY="YOUR_GOOGLE_API_KEY_HERE"
    ```
    Replace `YOUR_GOOGLE_API_KEY_HERE` with your key.

4.  **Run the App**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Deployment

This application is perfectly configured for deployment on Vercel.

### Deploying on Vercel

1.  Push your project code to a Git repository (e.g., GitHub, GitLab).
2.  Import your project repository into Vercel. Vercel will automatically detect that it's a Next.js project.
3.  **Configure Environment Variables**:
    - In your Vercel project's settings, navigate to the **Environment Variables** section.
    - Add a new variable with the name `API_KEY`.
    - Paste your Google API key into the value field. This is a **server-side only** variable and will not be exposed to the browser.
4.  Deploy! Vercel will handle the build process and your app will be live.
