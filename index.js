require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
});

//Function to get a response from Python Server
async function getResponse(prompt) {
    try {
        const response = await axios.post('http://localhost:5000/generate', {
            prompt: prompt,
        });
        return response.data.text;
    } catch (error) {
        console.error('Error getting response from EleutherAI:', error.message);
        return 'Sorry, I am having trouble connecting to my brain right now!';
    }
}

client.on('messageCreate', async message => {
    if (!message.author.bot && message.content.startsWith('!ask')) {
        const question = message.content.replace('!ask', '').trim();
        if (question) {
            message.channel.sendTyping();
            const typingInterval = setInterval(() => {
                message.channel.sendTyping();
            }, 9000);
            const chatResponse = await getResponse(question);
            clearInterval(typingInterval);
            message.channel.send(chatResponse);
        } else {
            message.channel.send('Please provide a question.');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);