with open('resources/js/Pages/CloudSync.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert handleGoogleAuth check
old_auth = """    const handleGoogleAuth = async () => {
        try {
            const res = await axios.get('/api/google-drive/auth');
            window.location.href = res.data.url;
        } catch (e) { toast.error('Auth_Failed'); }
    };"""

new_auth = """    const handleGoogleAuth = async () => {
        if (!auth.user.personal_google_client_id) return toast.warning('Config_Required');
        try {
            const res = await axios.get('/api/google-drive/auth');
            window.location.href = res.data.url;
        } catch (e) { toast.error('Auth_Failed'); }
    };"""

if old_auth in content:
    content = content.replace(old_auth, new_auth)
    print('AUTH_REVERTED')
else:
    print('OLD_AUTH_NOT_FOUND')

with open('resources/js/Pages/CloudSync.jsx', 'w', encoding='utf-8') as f:
    f.write(content)