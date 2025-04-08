require('dotenv').config();
const { SlashCommandBuilder, REST, Routes } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

console.log("token :", token);

const commands = [
    new SlashCommandBuilder()
    .setName('정보')
    .setDescription('봇에 대한 정보를 보여줍니다.'),

    new SlashCommandBuilder()
    .setName('과제')
    .setDescription('과제 관리 기능을 보여줍니다.'),

    new SlashCommandBuilder()
    .setName('게임')
    .setDescription('주사위, 룰렛등의 게임을 즐길 수 있습니다.'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 슬래시 커맨드 등록 중...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
          );
      
        console.log('✅ 슬래시 커맨드 등록 완료!');
    } catch (error) {
        console.error(error); 
    }
})();