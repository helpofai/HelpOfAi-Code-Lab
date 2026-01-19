You are a senior full-stack architect and SaaS product engineer. my website name is HOACodeLab.

Your task is to help me design and reason about a
**CodePen-like online code editor platform**
built with **Laravel as the backend** and a **modern frontend editor**.

IMPORTANT CONSTRAINTS (DO NOT VIOLATE):
- ❌ Do NOT use Docker
- ❌ Do NOT use remote sandbox services
- ❌ Do NOT execute user code on the server
- ❌ Do NOT suggest server-side JS/PHP execution
- ✅ All user code MUST run only in the browser
- ✅ Live preview MUST use iframe `srcdoc` sandboxing
- ✅ Security is a top priority

--------------------------------------------------
🎯 PRODUCT GOAL
--------------------------------------------------
Build a modern, production-ready **CodePen clone** where users can:
- Write HTML, CSS, and JavaScript
- See live preview instantly
- Save projects
- Share public/private links
- Use a professional VS Code–level editor experience

--------------------------------------------------
🏗️ CORE ARCHITECTURE (LOCKED)
--------------------------------------------------
Browser:
- Monaco Editor (VS Code engine)
- React + Vite
- iframe `srcdoc` live preview

Backend:
- Laravel 12.x
- Sanctum authentication
- REST API only (no code execution)
- MySQL database

Execution Model:
- HTML/CSS/JS combined in browser
- Injected into iframe using `srcdoc`
- iframe uses strict sandbox attributes

--------------------------------------------------
🎨 FRONTEND REQUIREMENTS
--------------------------------------------------
- Framework: React + Vite (inside Laravel `/resources/js`)
- Editor: Monaco Editor
- Styling: Tailwind CSS
- UI patterns inspired by shadcn/ui (tabs, modals, panels)
- State management: Zustand (or lightweight equivalent)
- Editor layout:
  - HTML / CSS / JS tabs
  - Resizable editor + preview panels
  - Dark / light themes using CSS variables

--------------------------------------------------
🧠 CODE EDITOR FEATURES
--------------------------------------------------
- Syntax highlighting (HTML/CSS/JS)
- IntelliSense for JavaScript
- Error markers
- Multiple editor tabs
- Auto-save (debounced)
- Prettier formatting (client-side)
- Custom editor themes

--------------------------------------------------
🖥️ LIVE PREVIEW SYSTEM (CRITICAL)
--------------------------------------------------
- Use `<iframe srcdoc="...">`
- Combine:
  - HTML → body
  - CSS → `<style>`
  - JS → `<script>`
- iframe attributes:
  - sandbox="allow-scripts"
  - NO allow-same-origin
  - NO allow-top-navigation
- Apply strict Content Security Policy (CSP)

--------------------------------------------------
📦 LIBRARY & DEPENDENCY STRATEGY
--------------------------------------------------
- NO npm install inside preview
- ONLY CDN-based libraries
- Allow user to add external libraries via URLs
- Examples:
  - React (CDN)
  - Vue (CDN)
  - Tailwind Play CDN
  - Alpine.js
  - GSAP
  - Three.js

--------------------------------------------------
🗄️ DATABASE & STORAGE
--------------------------------------------------
Database: MySQL

Database name: hoa-code-lab

Project storage format:
- Use JSON column to store code

Example structure:
{
  "html": "<div>Hello</div>",
  "css": "body { margin: 0 }",
  "js": "console.log('Hi')"
}

Laravel handles:
- Projects CRUD
- Ownership & permissions
- Sharing (slug-based URLs)
- Version history (future)

--------------------------------------------------
🔄 REALTIME & COLLAB (OPTIONAL / FUTURE)
--------------------------------------------------
- Laravel WebSockets or Pusher
- Presence indicators
- Live cursor sync (future)
- Shared editing (future)

--------------------------------------------------
🔐 SECURITY REQUIREMENTS
--------------------------------------------------
- iframe sandbox isolation
- Strict CSP headers
- Escape user content
- Rate limit preview rebuilds
- No access to cookies or parent window
- No top-level navigation from iframe

--------------------------------------------------
🚀 EXPECTED OUTPUT FROM YOU
--------------------------------------------------
When responding, you should:
- Respect ALL constraints
- Think like a senior SaaS architect
- Explain architecture, flows, and decisions
- Avoid writing actual code unless explicitly asked
- Focus on scalability, security, and developer experience

If a feature requires server-side execution, clearly state:
"NOT POSSIBLE under current constraints"

--------------------------------------------------

Understood. I will help you design and reason about the CodePen-like online code editor platform using Laravel as the backend and a modern frontend editor, adhering strictly to the constraints and requirements you've outlined.
To design a CodePen-like online code editor platform with Laravel as the backend and a modern frontend editor, we will break down the architecture, workflows, and key decisions while adhering to your constraints.
### Overall Architecture
1. **Frontend (React + Vite)**:
   - The frontend will be built using React and Vite, providing a fast and responsive user interface.
   - The Monaco Editor will be integrated for a VS Code-like experience, allowing users to write HTML, CSS, and JavaScript with features like syntax highlighting, IntelliSense, and error markers.
   - Tailwind CSS will be used for styling, ensuring a modern and responsive design.
   - Zustand will manage the application state, keeping track of the code in the editor, user preferences, and project metadata.
2. **Backend (Laravel 12.x)**:
   - The backend will be a RESTful API built with Laravel 12.x, handling user authentication (using Sanctum), project CRUD operations, and sharing functionalities.
   - The database will be MySQL, with a dedicated database named `hoa-code-lab` to store user projects in a JSON format.
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hoa-code-lab
   DB_USERNAME=hoa-code-lab
   DB_PASSWORD=hoa-code-lab
### Key Features and Workflows    
1. **Code Editor**:
   - Users can switch between HTML, CSS, and JS tabs in the Monaco Editor.
   - The editor will support auto-save functionality, debounced to prevent excessive saves.
   - Prettier will be integrated for client-side code formatting.
2. **Live Preview**:
   - The live preview will be rendered in an iframe using the `srcdoc` attribute.
   - The iframe will combine the user's HTML, CSS, and JS into a single document:
     - HTML will be placed in the `<body>`.
     - CSS will be injected into a `<style>` tag in the `<head>`.
     - JavaScript will be included in a `<script>` tag at the end of the body.
   - The iframe will have strict sandbox attributes (`sandbox="allow-scripts"`) to ensure security, preventing access to cookies or the parent window.
   - A strict Content Security Policy (CSP) will be applied to the iframe to mitigate XSS attacks.
3. **Project Management**:
   - Users can create, read, update, and delete projects via the Laravel API.
   - Projects will be stored in the database with a JSON structure containing the HTML, CSS, and JS code.
   - Users can share projects using slug-based URLs, with options for public or private access.
4. **External Libraries**:
   - Users can add external libraries via CDN URLs, which will be included in the live preview.
   - A predefined list of popular libraries (e.g., React, Vue, Tailwind Play CDN, Alpine.js, GSAP, Three.js) will be available for easy inclusion.
5. **Security Measures**:  
   - The iframe will be sandboxed to isolate user code execution.
   - A strict CSP will be enforced to prevent malicious scripts from executing.
   - User content will be properly escaped before being injected into the iframe.
   - Rate limiting will be implemented on preview rebuilds to prevent abuse.     
### Future Enhancements
1. **Real-time Collaboration**:
   - Implement real-time collaboration features using Laravel WebSockets or Pusher.
   - Features like presence indicators and live cursor sync can be added in future iterations.
2. **Version History**:
   - Implement version history for projects, allowing users to revert to previous versions of their code.   
### Conclusion
This architecture provides a robust foundation for a CodePen-like online code editor platform, ensuring a secure and user-friendly experience. By leveraging Laravel for the backend and React with Monaco Editor for the frontend, we can deliver a scalable and maintainable solution that meets all specified requirements and constraints.
