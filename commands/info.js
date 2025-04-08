const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { buttons } = require("./game");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('정보')
    .setDescription('봇에 대한 정보를 보여줍니다.'),

    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel('개인 GitHub')
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/HyeonJin127'),
    
            new ButtonBuilder()
            .setLabel('봇 GitHub')
            .setURL('https://github.com/wndr127')
            .setStyle(ButtonStyle.Link),
    
            new ButtonBuilder()
            .setCustomId('delete_btn')
            .setLabel('메세지 삭제')
            .setStyle(ButtonStyle.Danger),
            );

            const embed = new EmbedBuilder()
            .setTitle('봇 정보')
            .setDescription('이 봇은 다양한 기능을 지원해요!')
            .setColor('80E12A')
            .addFields(
                { name: '개발자 👨‍💻', value: "나그네 `_wndr_`" },
                { name: '💬명령어', value: '정보, 버튼, 게임, 과제' }
            );
        
            await interaction.reply({ embeds: [embed], components: [row] });
    },

    buttons: {
        // 메세지 삭제 버튼
        delete_btn: async (interaction) => {
            await interaction.deferUpdate();
            interaction.message.delete().catch(console.error);
        },
    }
};