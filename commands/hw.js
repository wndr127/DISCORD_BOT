const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('과제')
    .setDescription('과제 정리를 도와드리겠습니다!'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor('80E12A')
        .setTitle('과제')
        .setDescription("과제를 돕기 위한 명령어")
        .setFields(
        { name: '**+ 등록**', value: '과제를 등록합니다.' },
        { name: '**+ 수정**', value: '등록된 과제 내용을 수정합니다.' },
        { name: '**+ 완료**', value: '등록된 과제를 완료상태로 표시합니다.' },
        { name: '**+ 삭제**', value: '등록된 과제를 삭제합니다.' },
        )

        const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('add_hw')
        .setLabel('📕 등록')
        .setStyle(ButtonStyle.Primary),
        
        new ButtonBuilder()
        .setCustomId('modify_hw')
        .setLabel('🔧 수정')
        .setStyle(ButtonStyle.Primary),
        
        new ButtonBuilder()
        .setCustomId('complete_hw')
        .setLabel('🏆 완료')
        .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
        .setCustomId('remove_hw')
        .setLabel('❌ 삭제')
        .setStyle(ButtonStyle.Danger),
      
        new ButtonBuilder()
        .setCustomId('delete_btn')
        .setLabel('메세지 삭제')
        .setStyle(ButtonStyle.Danger)
        )

    await interaction.reply({ embeds: [embed], components: [row] });
  
    }
}