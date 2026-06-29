const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'resources', 'js');

const replacements = [
    { from: /Execute_Neural_Command\.\.\./g, to: 'Enter command...' },
    { from: /Neural Lock/g, to: 'Lock Settings' },
    { from: /Unlock Node/g, to: 'Unlock Project' },
    { from: /Neural_Minimap/g, to: 'Minimap' },
    { from: /Neural_Loading\.\.\./g, to: 'Loading...' },
    { from: /Uplink_Failed:/g, to: 'Error:' },
    { from: /Handshake_Successful:/g, to: 'Success:' },
    { from: /Neural_Core_Active/g, to: 'Editor Active' },
    { from: /AES-256 Encrypted Neural Uplink/g, to: 'Secure Encrypted Connection' },
    { from: /Uplink failed\./g, to: 'Connection failed.' },
    { from: /Verify_Uplink/g, to: 'Test Connection' },
    { from: /System_Uplink \/\/ CodePen_Advanced_Core/g, to: 'System Notification' },
    { from: /Admin Command Center/g, to: 'Admin Dashboard' },
    { from: /Email Command Center/g, to: 'Email Settings' },
    { from: /Neural_Role_Balance/g, to: 'User Roles Overview' },
    { from: /Recent_Node_Arrivals/g, to: 'Recent Users' },
    { from: /Node_Identity \(Title\)/g, to: 'Page Title' },
    { from: /Initialize_Node/g, to: 'Create Page' },
    { from: /Update_Protocol/g, to: 'Update Page' },
    { from: /De-replicate this page node from the system\?/g, to: 'Are you sure you want to delete this page?' },
    { from: /HOACodeLab \/\/ Neural_Core/g, to: 'HOACodeLab' },
    { from: /Cloud_Uplink_Refused/g, to: 'Connection_Refused' },
    { from: /Establish_Uplink/g, to: 'Connect' },
    { from: /Sync_Local_Node/g, to: 'Sync Data' },
    { from: /Only you can view this node\./g, to: 'Only you can view this project.' },
    { from: /Visible to the entire network\./g, to: 'Visible to everyone.' },
    { from: /This node is hidden from the explore grid and search protocols\./g, to: 'This project is hidden from the explore page and search.' },
    { from: /This node is visible to the entire community matrix\./g, to: 'This project is visible to the entire community.' },
    { from: /Inject images or scripts into node/g, to: 'Add images or scripts to your project' },
    { from: /No historical nodes found\./g, to: 'No projects found.' },
    { from: /Technical_Prototyping_Node/g, to: 'Prototyping Environment' },
    { from: /Protocol: Active/g, to: 'Status: Active' },
    { from: /NODE_STATUS: OPTIMIZED/g, to: 'STATUS: OPTIMIZED' },
    { from: /NEURAL_CORE_v2/g, to: 'SYSTEM CORE' },
    { from: /INTERACTIVE_PARTICLE_MATRIX/g, to: 'INTERACTIVE MATRIX' },
    { from: /Generative Core Online\./g, to: 'System Online.' },
    { from: /INITIALIZING NEURAL_LINK\.\.\./g, to: 'INITIALIZING SYSTEM...' },
    { from: /SCANNING GLOBAL NODES \[OK\]/g, to: 'SCANNING SYSTEM [OK]' },
    { from: /Node_Profile/g, to: 'User Profile' },
    { from: />Node</g, to: '>Project<' },
    { from: /# Node Empty\\nThis module contains no data\./g, to: '# Empty\\nThis page contains no data.' }
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { from, to } of replacements) {
                if (from.test(content)) {
                    content = content.replace(from, to);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directoryPath);
console.log('Done replacing language.');
