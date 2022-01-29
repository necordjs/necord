---
id: context-menus

title: Context Menus

sidebar_position: 2
---

**User commands** and **message commands** are now live! These commands appear on context menus for users and messages, with more to come in the future.

## User Commands

**User commands** are application commands that appear on the context menu (right click or tap) of users. They're a great way to surface quick actions for your app that target users.

```typescript
@UserCommand({ name: 'Get avatar' })
public async getUserAvatar(@Context() [interaction]: [ContextMenuInteraction], @Options('user') user: User) {
     return interaction.reply({
          embeds: [
          new MessageEmbed()
               .setTitle(`Avatar ${user.username}`)
               .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
          ]
     });
}
```

If all goes well, you should see something like this:

![User Command](https://i.imgur.com/flpESLP.png)

## Message Commands

**Message commands** are application commands that appear on the context menu (right click or tap) of messages. They're a great way to surface quick actions for your app that target messages.

```typescript
@MessageCommand({ name: 'Copy Message' })
public async copyMessage(@Context() [interaction]: [ContextMenuInteraction], @Options('message') message: Message) {
     return interaction.reply({ content: message.content });
}
```

If all goes well, you should see something like this:

![Message Command](https://i.imgur.com/AaB71Ur.png)
