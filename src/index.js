const { exec: defaultExec } = require('child_process')

function main() {
    launch(doBackup, 'shortterm') // Initial backup

    setInterval(() => {
        launch(doBackup, 'shortterm')
    }, 10 * 60 * 1000)

    setInterval(() => {
        launch(doBackup, 'hourly')
    }, 60 * 60 * 1000)

    setInterval(() => {
        launch(doBackup, 'daily')
    }, 24 * 60 * 60 * 1000)
}

async function doBackup(prefix) {
    const filename = `backup-${prefix}-${new Date().getTime()}.zip`
    await exec(`zip -r9 /home/node/minecraft/backup/${filename} /home/node/minecraft/world`)

    log(`Emitted ${filename}`)

    const backupFiles = (await exec(`ls -t /home/node/minecraft/backup`))
        .trim()
        .split('\n')
        .filter(filename => filename.startsWith(`backup-${prefix}`))

    const deleteBackupFiles = backupFiles.slice(10)

    for (const file of deleteBackupFiles) {
        await exec(`rm /home/node/minecraft/backup/${file}`)
    }

    log(`Deleted ${deleteBackupFiles}`)
}

async function exec(command) {
    return new Promise((resolve, reject) => {
        defaultExec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else if (stderr) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}

function log(msg) {
    console.log(`[${new Date().toISOString()}] ${msg}`)
}

function launch(asyncFunction, ...args) {
    asyncFunction(...args).catch(err => {
        log('ERROR CAUSED')
        log(err)
    })
}

main()
