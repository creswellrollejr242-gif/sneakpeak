# 👟 SneakPeak - The Hypebeast Terminal

**SneakPeak** is a high-performance progressive web app (PWA) designed for the modern sneaker reseller and collector. Built with the aesthetic of a financial terminal, it provides real-time drop tracking, AI-powered authentication, and portfolio management.

![App Screenshot](https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80)

## ⚡ Features

*   **Terminal Interface:** Dark-mode, high-density data visualization inspired by Bloomberg Terminals.
*   **KickFlip Vision (AI):** Upload a photo of any sneaker to instantly identify the model or check for legitimacy flaws using Google Gemini 2.5 Vision.
*   **KickFlip Stylist:** AI-generated outfit advice based on the specific silhouette and colorway of the sneaker.
*   **Portfolio Tracking:** Track the real-time value of your collection with profit/loss analysis.
*   **Versus Mode:** Compare two sneakers side-by-side to calculate ROI and Hype Score.

## 🚀 Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **AI:** Google Gemini API (`@google/genai`)
*   **Icons:** Lucide React

## 🛠️ Installation & Setup

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/sneakpeak.git
    cd sneakpeak
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_API_KEY=your_google_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📱 Deployment

This app is optimized for deployment on **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add `API_KEY` (or `VITE_API_KEY`) in Vercel Project Settings > Environment Variables.
4.  Deploy.

## 📄 License

MIT License. Built for the sneaker community.