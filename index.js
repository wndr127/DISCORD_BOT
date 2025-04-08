// index.js
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, MessageFlags, SlashCommandBuilder, Collection, ActionRow } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '명령어 실행 중 오류가 발생했어요.' });
  }
});

// 명령어 처리
client.on('messageCreate', message => {
  const prefix = '!';
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // 명령어 즉시 삭제
  message.delete().catch(console.error);

  const [command, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

  // 인사 명령어
  if (command === '버튼') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('hello_btn')
      .setLabel('👋 인사')
      .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
      .setCustomId('bye_btn')
      .setLabel('👋 작별인사')
      .setStyle(ButtonStyle.Danger),
    );

    message.channel.send({
      content: '아래 버튼 중 하나를 눌러 상호작용을 해보세요!',
      components: [row],
    });
  }

  // 채팅창 청소 명령어
  else if (command === '청소') {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('메세지를 삭제할 권한이 없습니다.');
    }

    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('1부터 100 사이 숫자를 입력해주세요.');
    }

    message.channel.bulkDelete(amount + 1, true)
    .then(deleted => {
      message.channel.send(`${deleted.size - 1}개의 메세지를 삭제했어요!`)
      .then(msg => setTimeout(() => msg.delete(), 5000));
    })
    .catch(err => {
      console.error(err);
      message.reply('메세지를 삭제하는 데 실패했어요!');
    });
  }
})

// 버튼 종류
const buttonHandlers = {

  // 인사 버튼
  hello_btn: async (interaction) => {
    const originalMessage = interaction.message;

    originalMessage.delete().catch(console.error);

    await interaction.reply({
      content: '안녕하세요! 👋',
      flags: MessageFlags.Ephemeral,
    });
  },

  // 작별 인사 버튼
  bye_btn: async (interaction) => {
    const originalMessage = interaction.message;

    originalMessage.delete().catch(console.error);

    await interaction.reply({
      content: '안녕히 가세요 👋',
      flags: MessageFlags.Ephemeral,
    });
  },
}

client.on('interactionCreate', async interaction => { 
  if (interaction.isButton()) {
    const command = client.commands.find(cmd => cmd.buttons && cmd.buttons[interaction.customId]);
    if (command) {
      try {
        await command.buttons[interaction.customId](interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '버튼 처리 중 오류가 발생했어요.', ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);