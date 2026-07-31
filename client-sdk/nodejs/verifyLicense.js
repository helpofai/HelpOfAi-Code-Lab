// Advanced License Middleware for Express.js
const axios = require('axios');
const NodeCache = require('node-cache');
const licenseCache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache

const verifyLicense = async (req, res, next) => {
    const licenseKey = process.env.LICENSE_KEY;
    const domain = req.hostname;

    // Check Cache
    if (licenseCache.get('is_valid')) {
        return next();
    }

    try {
        const response = await axios.post('YOUR_MARKETPLACE_URL_HERE/api/licenses/validate', {
            license_key: licenseKey,
            domain: domain
        }, { timeout: 5000 });

        if (response.data.valid) {
            licenseCache.set('is_valid', true);
            return next();
        } else {
            // Lock the application
            return res.status(403).send(`
                <div style="text-align:center; padding:50px; font-family:sans-serif;">
                    <h2>🛑 Application Locked</h2>
                    <p>Invalid license key. Please contact support.</p>
                </div>
            `);
        }
    } catch (error) {
        // If validation server is unreachable, allow temporarily
        return next();
    }
};

module.exports = verifyLicense;
