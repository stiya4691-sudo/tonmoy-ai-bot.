TONMOY AI BOT — K3 Historical Analysis

IMPORTANT SECURITY:
- Do NOT use either API key you pasted into chat earlier. Revoke those keys in your OpenAI API dashboard.
- Create a NEW API key and put it only in this server's .env file.
- Never paste the key into index.html, GitHub, Netlify static hosting, or chat.
- Keep .env private. Do not upload it publicly.

SETUP (computer/VPS):
1. Install Node.js 20 or newer.
2. Extract this ZIP.
3. Open a terminal in this folder.
4. Copy .env.example to .env.
5. Edit .env and put your NEW API key after OPENAI_API_KEY=.
6. Run: npm install
7. Run: npm start
8. Open: http://localhost:3000

The page includes the 80 historical rows transcribed from your screenshots.
You can edit/paste more rows in Period,Sum format, one per line.
Example:
709,13
710,8

This app calls the OpenAI Responses API from the server; the browser never receives your API key.
The app does not connect to DK Win and cannot guarantee or reliably forecast random K3 outcomes.
API usage may incur charges. See https://platform.openai.com/docs
