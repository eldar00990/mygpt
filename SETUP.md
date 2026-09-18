# EcoPulse AI setup

EcoPulse now uses the OpenAI Responses API, so it can answer free-form questions instead of choosing from prepared answers.

1. Create an OpenAI API key in your OpenAI platform account.
2. In PowerShell, from this project folder, run:

   `$env:OPENAI_API_KEY="your_key_here"`

3. Start the site:

   `npm start`

4. Open `http://localhost:3000`.

The key is deliberately kept on the server and is never placed in `index.html` or `script.js`. You may optionally set `OPENAI_MODEL` before starting the server to use an available model in your account.
