<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GoogleDriveController extends Controller
{
    private function getClient()
    {
        $user = Auth::user();
        if (!$user->personal_google_client_id || !$user->personal_google_client_secret) {
            throw new \Exception("Personal_Credentials_Missing");
        }

        $client = new GoogleClient();
        $client->setClientId($user->personal_google_client_id);
        $client->setClientSecret($user->personal_google_client_secret);
        $client->setRedirectUri(route('google-drive.callback')); // System callback remains fixed
        $client->addScope(GoogleDrive::DRIVE_FILE);
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');

        return $client;
    }

    /**
     * Redirect to Google OAuth
     */
    public function auth()
    {
        $client = $this->getClient();
        $authUrl = $client->createAuthUrl();
        return response()->json(['url' => $authUrl]);
    }

    /**
     * Handle OAuth Callback
     */
    public function callback(Request $request)
    {
        $code = $request->get('code');
        if (!$code) {
            return redirect('/dashboard')->with('error', 'Google Auth failed.');
        }

        try {
            $client = $this->getClient();
            $token = $client->fetchAccessTokenWithAuthCode($code);
            
            $user = Auth::user();
            $user->google_drive_token = json_encode($token);
            $user->save();

            // Create HOACodeLab folder if not exists
            $this->ensureRootFolder($client);

            return redirect('/dashboard')->with('success', 'Google Drive linked.');
        } catch (\Exception $e) {
            return redirect('/dashboard')->with('error', $e->getMessage());
        }
    }

        /**

         * Fetch content of a specific Drive file

         */

        public function fetch($fileId)

        {

            $user = Auth::user();

            try {

                $client = $this->getClient();

                $client->setAccessToken(json_decode($user->google_drive_token, true));

                $service = new GoogleDrive($client);

                

                $content = $service->files->get($fileId, ['alt' => 'media']);

                $data = json_decode($content->getBody()->getContents(), true);

                

                return response()->json($data);

            } catch (\Exception $e) {

                return response()->json(['error' => $e->getMessage()], 500);

            }

        }

    

        /**

         * Terminate the uplink and clear local tokens

         */

        public function disconnect()

        {

            $user = Auth::user();

            $user->google_drive_token = null;

            $user->google_drive_folder_id = null;

            $user->save();

            return response()->json(['status' => 'Uplink_Terminated']);

        }

    

        private function ensureRootFolder($client) {
        $user = Auth::user();
        if ($user->google_drive_folder_id) return $user->google_drive_folder_id;

        $service = new GoogleDrive($client);
        $fileMetadata = new DriveFile([
            'name' => 'HOACodeLab_Nodes',
            'mimeType' => 'application/vnd.google-apps.folder'
        ]);

        try {
            $folder = $service->files->create($fileMetadata, ['fields' => 'id']);
            $user->google_drive_folder_id = $folder->id;
            $user->save();
            return $folder->id;
        } catch (\Exception $e) {
            Log::error("Drive Folder Creation Failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * List project files in Drive
     */
    public function list()
    {
        $user = Auth::user();
        if (!$user->google_drive_token) return response()->json([], 401);

        try {
            $client = $this->getClient();
            $client->setAccessToken(json_decode($user->google_drive_token, true));

            if ($client->isAccessTokenExpired()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
                $user->google_drive_token = json_encode($client->getAccessToken());
                $user->save();
            }

            $service = new GoogleDrive($client);
            $query = "'{$user->google_drive_folder_id}' in parents and trashed = false";
            $results = $service->files->listFiles([
                'q' => $query,
                'fields' => 'files(id, name, webViewLink, modifiedTime)'
            ]);

            return response()->json($results->getFiles());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Save/Update project to Drive
     */
    public function save(Request $request)
    {
        $user = Auth::user();
        if (!$user->google_drive_token) return response()->json(['error' => 'Not linked'], 401);

        $validated = $request->validate([
            'title' => 'required|string',
            'code' => 'required|array',
            'drive_file_id' => 'nullable|string'
        ]);

        try {
            $client = $this->getClient();
            $client->setAccessToken(json_decode($user->google_drive_token, true));

            $service = new GoogleDrive($client);
            $content = json_encode([
                'title' => $validated['title'],
                'code' => $validated['code'],
                'synced_at' => now()->toIso8601String()
            ]);

            if ($validated['drive_file_id']) {
                // Update
                $file = new DriveFile();
                $service->files->update($validated['drive_file_id'], $file, [
                    'data' => $content,
                    'mimeType' => 'application/json',
                    'uploadType' => 'multipart'
                ]);
                $fileId = $validated['drive_file_id'];
            } else {
                // Create
                $fileMetadata = new DriveFile([
                    'name' => $validated['title'] . '.hoa.json',
                    'parents' => [$user->google_drive_folder_id]
                ]);
                $file = $service->files->create($fileMetadata, [
                    'data' => $content,
                    'mimeType' => 'application/json',
                    'uploadType' => 'multipart',
                    'fields' => 'id'
                ]);
                $fileId = $file->id;
            }

            return response()->json(['id' => $fileId, 'status' => 'Synced_to_Cloud']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete from Drive
     */
    public function destroy($fileId)
    {
        $user = Auth::user();
        try {
            $client = $this->getClient();
            $client->setAccessToken(json_decode($user->google_drive_token, true));
            $service = new GoogleDrive($client);
            $service->files->delete($fileId);
            return response()->json(['status' => 'Cloud_Node_Terminated']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}