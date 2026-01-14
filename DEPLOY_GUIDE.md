# 🚀 How to Launch SneakPeak (Go Public)

## 1. Get Off "Demo Mode" (Fixing the AI Styles)
To make the AI give real, unique advice for every shoe instead of the "Demo" text:

1.  Go to [Google AI Studio](https://aistudio.google.com/) and click "Get API key".
2.  Copy your new API Key.
3.  When you deploy (see step 2), you will add this as an **Environment Variable** named `API_KEY`.

## 2. Host the App (Going Online)
We recommend **Vercel** for hosting. It's free and optimized for this code.

1.  Push this code to a GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up.
3.  Click "Add New Project" -> "Import" your GitHub repo.
4.  **CRITICAL:** In the Vercel Project Settings, find "Environment Variables".
    *   Key: `API_KEY`
    *   Value: `(Paste your Google Gemini Key here)`
5.  Click **Deploy**.

Your app will now be live at `https://sneakpeak-yourname.vercel.app`.

## 3. Fix the "Admin Sync" Issue (The Database)
*Problem:* Currently, the app uses `localStorage`. This means if you add a shoe as Admin, it only saves to *your* phone/computer. Other users won't see it.

*Solution:* You need a centralized Cloud Database.

**Recommended Stack:**
*   **Supabase:** For the Database (to store the list of shoes).
*   **Supabase Auth:** For handling User Accounts (instead of the mock login).
*   **Supabase Storage:** For hosting the sneaker images (instead of using Base64 strings which are slow).

**Steps to Implement:**
1.  Create a project at [Supabase.com](https://supabase.com).
2.  Create a table called `sneakers`.
3.  Update `src/App.tsx` to fetch data from Supabase instead of `localStorage`.

```typescript
// Example of how the code changes:
import { supabase } from './supabaseClient'

// Old Way
// const [sneakers, setSneakers] = useState(MOCK_SNEAKERS);

// New Way
useEffect(() => {
  async function fetchSneakers() {
    const { data, error } = await supabase.from('sneakers').select('*');
    if (data) setSneakers(data);
  }
  fetchSneakers();
}, []);
```

Once this is connected, when the Admin adds a shoe, it saves to the Cloud, and everyone's phone will pull the new list instantly.