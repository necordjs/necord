import { NestFactory } from "@nestjs/core";
import { NecordModule, On } from "../src";
import { Injectable, Module } from "@nestjs/common";

@Injectable()
export class AppService {
    @On('ready')
    public onReady() {
        console.log('Ready!');
    }

    @On('ready', ['bot2'])
    public onReadyForBot2Only() {
        console.log('Ready for bot2 only');
    }
}

@Module({
    imports: [
        NecordModule.forRoot({
            token: process.env.DISCORD_TOKEN,
            intents: [
                'Guilds',
                'GuildMessages',
            ],
        }),
        NecordModule.forRoot({
            token: process.env.DISCORD_TOKEN2,
            intents: [
                'Guilds',
                'GuildMembers',
            ],
            botName: 'bot2'
        })
    ],
    providers: [AppService]
})
class AppModule {}

NestFactory.createApplicationContext(AppModule);