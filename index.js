const dotenv = require('dotenv');
let SlackBot = require('slackbots');
dotenv.config();

let countTask = 0;
// task object
let tasksObj = [
	{
		message: {
			"blocks": [
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Hi :wave: Welcome to ACME Inc! We use slack to communicate, check out this https://internal.acme.inc/groups our slack communities! Try joining a community that looks interesting to you and say hello! :smile:",
						"emoji": true
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Your Onboarding Buddy is Eddy Fi, and they can be reached on slack by their handle @eddy. Schedule your first meeting with them this week for 30 minutes via Zoom :movie_camera: to get introduced!",
						"emoji": true
					}
				},
				{
					"type": "actions",
					"elements": [
						{
							"type": "button",
							"text": {
								"type": "plain_text",
								"text": "Schedule a meeting",
								"emoji": true
							},
							"value": "click_me_123"
						}
					]
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Our engineering group has our development guidelines and ways we work documented here https://internal.acme.inc/teams/engineering. Give that a read and let your onboarding buddy know if you have any questions! :thinking_face: :sparkles:",
						"emoji": true
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "“We are so excited about having you on our team! With your experience, you will be a great addition. Welcome aboard! :airplane: :computer: :male-technologist: :female-technologist:”",
						"emoji": true
					}
				}
			], 
		},
		status: false
	},{
		message: {
			"blocks": [
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Your team is the MagicCode group, and their team information is here: https://internal.acme.inc/teams/MagicCode. Mark this completed when you've had your first team daily standup.",
						"emoji": true
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "All your engineering accounts and security access will be granted by your team lead in MagicCode, and your onboarding buddy will help confirm you have access to all needed accounts. Mark this done when that is complete!",
						"emoji": true
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {
						"type": "plain_text",
						"text": "Pair with your Buddy to complete a code review together for a PR. Discuss what is expected and normal in PRs, and how we ask for, and give approval for them.",
						"emoji": true
					}
				},
				{
					"type": "divider"
				}
			]
		},
		status: false
	}
]

const BOT_TOKEN = process.env.BOT_TOKEN;

let bot = new SlackBot({
	token: `${BOT_TOKEN}`,
	name: 'Eddy'
})

// Start Handler
bot.on('start', () => {
	// send first task and on boarding message
	const params = tasksObj[0].message;

	// bot send message to slack
	bot.postMessageToUser('nadtakan.jones', '' ,params);

	console.log(`first tasksObj`, tasksObj);
	
})

// Error Handler
bot.on('error', (err) => {
	console.log(err);
})

// Message Handler
bot.on('message', (data) => {
	if(data.type !== 'message') {
			return;
	}
	handleMessage(data.text);
})

// Response Handler
async function handleMessage(message) {
	console.log(`message =>`, message);
	if(message.includes('tasks')) {
		await tasks()
	} else if(message.includes('task done')) {
		await taskDone()
	} 
}

async function tasks() {
	const params = {}
	tasksObj.forEach(el => {
		if(el.status) {
			let status = 'Done :white_check_mark:';
			bot.postMessageToUser('nadtakan.jones', `Task:     ${el.task}      Status: ${status}`  ,params);
		} {
			let status = 'In Progress :keyboard:';
			bot.postMessageToUser('nadtakan.jones', `Task:     ${el.task}      Status: ${status}`  ,params);
		}
	})
}

async function taskDone() {

	tasksObj.map((el, index) => {
		if(!el.status) {
			// set complete task to true
			el.status = true;

			// sending next message
			const params = tasksObj[index+1].message;

			// bot send message to slack
			bot.postMessageToUser('nadtakan.jones', '' ,params);
		}
	})

	let complete = tasksObj.map(el => {
		return el.status === true
	})

	// send complete message
	if(complete === tasksObj.length) {
		bot.postMessageToUser('nadtakan.jones', '' ,'Complete your first code submission to production!');
	}	

	console.log(`task done`, tasksObj);
}


// resource https://github.com/slackapi/hubot-slack/issues/584#issuecomment-611808704