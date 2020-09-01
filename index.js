//Imports
const { CronJob } = require('cron');
const { join } = require('path');
const { readFileSync } = require('fs');
const { exec } = require('child_process');
const readline = require('readline');

//Variables
const PATH = join(__dirname, 'schedule.json');
const rl = readline.createInterface({input : process.stdin, output : process.stdout});

//Helpers
const browser = n => exec(`${(process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open')} ${n}`);
const sorter = {

    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6
};

const schedule = JSON.parse(readFileSync(PATH));

for(const { day, start, link } of schedule){
    
    const [hour, min] = start.split`:`;
    new CronJob({

        cronTime : `00 ${min} ${hour} * * ${sorter[day.toLowerCase()]}`,
        onTick : ()=>browser(link),
        start : true,
        runOnInit : false,
        timeZone : 'US/Eastern'
    });
}

rl.on('line', e => {rl.close(); process.exit();});
