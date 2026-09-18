# Publish EcoPulse on Vercel

1. Create a GitHub account if you do not have one, then create a new repository and upload every file from this project.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and choose **Add New → Project**.
3. Select the repository with EcoPulse and click **Deploy**. No build command is needed.
4. In the project on Vercel, open **Settings → Environment Variables** and add:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key
5. Redeploy the project. Vercel will give you a public link. Share that link — everyone can open it directly in a browser.

Optional: add `OPENAI_MODEL` as an environment variable if you want to select a different model available to your account.

Never put the API key in `index.html`, JavaScript, or GitHub. Vercel keeps environment variables server-side.
