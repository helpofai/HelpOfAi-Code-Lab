/**
 * Advanced Node.js Express License Manager & OTA Updater
 * 
 * Dependencies required: npm install axios dotenv adm-zip
 * 
 * Usage in app.js:
 * const verifyProductLicense = require('./verifyLicense');
 * app.use(verifyProductLicense);
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Temporary Memory Cache
let licenseCache = null;
let cacheExpiry = 0;

const verifyProductLicense = async (req, res, next) => {
    const apiUrl = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
    const licenseKey = process.env.HELP_OF_AI_LICENSE_KEY;

    // 1. Handle Activation Form Submission
    if (req.method === 'POST' && req.body && req.body.hoai_license_key) {
        return await processActivation(req, res, req.body.hoai_license_key, apiUrl);
    }

    // 2. Handle OTA Update Trigger
    if (req.method === 'POST' && req.query.trigger_ota_update === '1') {
        return await processOtaUpdate(req, res);
    }

    // 3. Verify License (Cache for 24 hours)
    let licenseData = getCache();
    if (!licenseData) {
        if (!licenseKey) {
            return res.status(403).send(getActivationUI());
        }

        try {
            const response = await axios.post(apiUrl, {
                license_key: licenseKey,
                domain: req.hostname
            }, { timeout: 5000 });

            licenseData = response.data;
            setCache(licenseData);
        } catch (error) {
            // Fail open temporarily if validation server is down
            licenseData = { valid: true, offline_mode: true };
            setCache(licenseData);
        }
    }

    // 4. Enforce Lock Screen UI if invalid
    if (!licenseData || !licenseData.valid) {
        return res.status(403).send(getActivationUI(licenseData.message || 'Invalid License Key.'));
    }

    // 5. Render License Dashboard (Hidden Route)
    if (req.query.license_dashboard === '1') {
        return res.send(getDashboardUI(licenseData));
    }

    next();
};

async function processActivation(req, res, key, apiUrl) {
    try {
        const response = await axios.post(apiUrl, {
            license_key: key,
            domain: req.hostname
        });

        const data = response.data;

        if (data.valid) {
            // Write to .env
            const envPath = path.resolve(process.cwd(), '.env');
            let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
            if (envContent.includes('HELP_OF_AI_LICENSE_KEY=')) {
                envContent = envContent.replace(/^HELP_OF_AI_LICENSE_KEY=.*$/m, 'HELP_OF_AI_LICENSE_KEY=' + key);
            } else {
                envContent += '\nHELP_OF_AI_LICENSE_KEY=' + key + '\n';
            }
            fs.writeFileSync(envPath, envContent);
            
            setCache(data);
            
            // Redirect to GET
            return res.redirect(req.originalUrl);
        }

        return res.status(403).send(getActivationUI(data.message || 'Invalid License Key.'));
    } catch (error) {
        return res.status(500).send(getActivationUI('Failed to connect to license server.'));
    }
}

async function processOtaUpdate(req, res) {
    const data = getCache();
    if (!data || !data.download_url) return res.status(400).json({ error: 'No update URL found.' });

    try {
        const AdmZip = require('adm-zip'); // Requires npm install adm-zip
        
        // Download ZIP
        const response = await axios({
            method: 'get',
            url: data.download_url,
            responseType: 'arraybuffer'
        });

        const zipPath = path.resolve(process.cwd(), 'temp_update.zip');
        fs.writeFileSync(zipPath, response.data);

        // Extract ZIP
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(process.cwd(), true);
        
        // Cleanup
        fs.unlinkSync(zipPath);
        clearCache();

        // Tell PM2 or Nodemon to restart by exiting gracefully
        setTimeout(() => process.exit(0), 1000);

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Update failed: ' + error.message });
    }
}

// Memory Cache Helpers
function setCache(data) {
    licenseCache = data;
    cacheExpiry = Date.now() + 86400000; // 24 hours
}

function getCache() {
    if (licenseCache && Date.now() < cacheExpiry) {
        return licenseCache;
    }
    return null;
}
function clearCache() {
    licenseCache = null;
}

// UI Generators
function getActivationUI(error = null) {
    const errorHtml = error ? `<div class='bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100'>${error}</div>` : '';
    return `
    <!DOCTYPE html>
    <html>
    <head><title>Product Activation</title><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
            <h2 class="text-2xl font-black text-gray-800 mb-2">Activate Product</h2>
            <p class="text-sm text-gray-500 mb-6">This Node.js application requires a valid license key.</p>
            ${errorHtml}
            <form method="POST" action="">
                <!-- Ensure your express app uses express.urlencoded({extended: true}) middleware before this! -->
                <input type="text" name="hoai_license_key" class="w-full border border-gray-300 rounded-lg p-3 mb-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Verify & Activate</button>
            </form>
        </div>
    </body>
    </html>
    `;
}

function getDashboardUI(data) {
    const isUpdateAvailable = data.version && data.latest_version && (data.version !== data.latest_version);
    const updateHtml = isUpdateAvailable ? `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 flex justify-between items-center">
            <div>
                <h3 class="text-amber-800 font-bold">Update Available: v${data.latest_version}</h3>
                <p class="text-amber-600 text-sm">A new version of this product is available for 1-click install.</p>
            </div>
            <button onclick="installUpdate()" id="updateBtn" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">Install Update</button>
        </div>
    ` : '';

    return `
    <!DOCTYPE html>
    <html>
    <head><title>License Dashboard</title><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h1 class="text-2xl font-black mb-6 text-gray-800">System Dashboard</h1>
            ${updateHtml}
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 text-white p-6 rounded-xl mb-6 shadow-lg">
                <h3 class="font-black text-xl">${data.product_name || 'Premium Product'}</h3>
                <p class="text-emerald-50 text-sm">Activated & Verified</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase">Author</p>
                    <p class="font-bold text-gray-800">${data.author_name || 'Unknown'}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase">Current Version</p>
                    <p class="font-bold text-gray-800">v${data.version || '1.0'}</p>
                </div>
            </div>
            <a href="?" class="mt-6 inline-block text-blue-600 hover:underline font-bold">Return to Application</a>
        </div>
        <script>
        function installUpdate() {
            const btn = document.getElementById('updateBtn');
            btn.innerText = 'Downloading & Installing...';
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            
            fetch('?trigger_ota_update=1', { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert('Update installed! The server is restarting...');
                    setTimeout(() => window.location.reload(), 3000);
                } else {
                    alert('Error: ' + data.error);
                    window.location.reload();
                }
            }).catch(() => {
                alert('Network error during update.');
                window.location.reload();
            });
        }
        </script>
    </body>
    </html>
    `;
}

module.exports = verifyProductLicense;
