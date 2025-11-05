# Along

> Move smart. Move easily.

Along is a web application designed to help users find public transport routes in major Nigerian cities. It simplifies commuting by providing clear, step-by-step directions using common local transport options.

## 🎯 Core Goal

The primary goal of Along is to provide an easy-to-use interface for finding public transit routes within Nigeria, starting with key cities like Lagos, Abuja, and Port Harcourt. It leverages geolocation and the Gemini API to generate accurate and context-aware travel directions.

## 🧩 Key Features

- **Current Location Detection**: Automatically uses your browser's geolocation to find your current position.
- **State Selection**: Manually select from a list of supported Nigerian states (Lagos, Abuja, Port Harcourt, etc.).
- **Origin/Destination Input**: Simple text fields for entering your start and end points.
- **Quick Route Reversal**: A swap button to easily reverse the origin and destination.
- **Dynamic Route Generation**: Fetches detailed, step-by-step transit directions from the Gemini API.
- **Visual Step Icons**: Each step in the route is accompanied by an icon representing the mode of transport (bus, walking, etc.).

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need a modern web browser and a Google API key with the Gemini API enabled.

- **Google API Key**:
  1. Go to the [Google AI Studio](https://aistudio.google.com/).
  2. Sign in with your Google account.
  3. Click on **"Get API key"** and then **"Create API key in new project"**.
  4. Copy the generated API key.

### Local Configuration

1.  **Environment File**: For local development, you will need to create a file named `.env` in the root directory of the project.
    
2.  **Add API Key**: Open the `.env` file and add your Google API key as follows:
    
    ```
    API_KEY="YOUR_GOOGLE_API_KEY_HERE"
    ```
    
    Replace `YOUR_GOOGLE_API_KEY_HERE` with the key you obtained from the Google AI Studio.
    
3.  **Run the App**: Once the `.env` file is configured, you can run the application locally.

## 📦 Deployment

This application is ready to be deployed on modern hosting platforms like Vercel or Netlify.

### Deploying on Vercel

1.  Push your project code to a Git repository (e.g., GitHub, GitLab).
2.  Sign up for a Vercel account and connect it to your Git provider.
3.  Import your project repository into Vercel.
4.  **Configure Environment Variables**:
    - In your Vercel project's settings, navigate to the **Environment Variables** section.
    - Add a new variable with the name `API_KEY`.
    - Paste your Google API key into the value field.
    - Vercel will automatically use this key during the build and for server-side functions.
5.  Deploy! Vercel will handle the build process and your app will be live.

## 🛠️ How It Works

The application is built using React and TypeScript. It interacts with the `@google/genai` library to send prompts to the Gemini model. These prompts are carefully constructed to request public transit information based on the user's selected origin, destination, and state. The response from the model is then parsed and displayed in a user-friendly format.
