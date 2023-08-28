import { Client } from 'discord.js'
import { NecordModuleOptions } from './necord-options.interface'

export class NecordClient extends Client {
  public readonly botName: string

  constructor(options: NecordModuleOptions) {
    super(options)
    this.botName = options.botName ?? 'default'
  }
}
