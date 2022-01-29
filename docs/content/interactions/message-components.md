---
id: message-components

title: Message Components

sidebar_position: 3
---

**Message components** — we'll call them "components" moving forward—are a framework for adding interactive elements to the messages your app or bot sends. They're accessible, customizable, and easy to use.

There are several different types of components; this documentation will outline the basics of this new framework and each example.

## Button
**Buttons** are interactive components that render on messages. They can be clicked by users, and send an [interaction](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object) to your app when clicked.

<img src="https://support.discord.com/hc/article_attachments/1500019725621/buttons.png" alt="Buttons" width="500" />

```typescript
@Button('BUTTON')
public onButton(@Context() [interaction]: [ButtonInteraction]) {
    return interaction.reply({ content: 'Button clicked!' });
}
```

## Select Menu
**Select menus** are another interactive component that renders on messages. On desktop, clicking on a select menu opens a dropdown-style UI; on mobile, tapping a select menu opens up a half-sheet with the options.

<img src="https://support.discord.com/hc/article_attachments/4403374488087/mceclip0.png" alt="Select Menu" width="500" />

```typescript
@SelectMenu('SELECT_MENU')
public onSelectMenu(@Context() [interaction]: [SelectMenuInteraction], @Options() options: string[]) {
    return interaction.reply({ content: `Your selected color - ${options.join(' ')}` });
}
```
