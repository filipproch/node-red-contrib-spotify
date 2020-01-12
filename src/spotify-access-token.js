const { spawn } = require('child_process');

const pythonScript = (__dirname + "/spotify-access-token.py");

function spawnAsync(command, args, opts) {
   return new Promise((resolve, reject) => {
      const instance = spawn(command, args, opts);

      let stdout = '';
      let stderr = '';

      instance.stdout.on('data', (data) => {
         stdout += data;
      });
      
      instance.stderr.on('data', (data) => {
         stderr += data;
      });
      
      instance.on('close', (code) => {
         resolve({
            code,
            stdout,
            stderr,
         });
      });
   });
}

module.exports = {
  getAccessToken: async function(username, password) {
    await spawnAsync('pip3', ['install', '-r', '--user', 'requirements.txt']);
    const result = await spawnAsync('python3', [pythonScript], {
        env: {
          ...process.env,
          SPOTIFY_USERNAME: username,
          SPOTIFY_PASS: password,
        },
    });

    const data = JSON.parse(result.stdout);
    return data[0];
  },
};