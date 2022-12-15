import { config } from 'src/config'
import messageHandlers from 'src/handler'
import { ChatGPTHandler } from 'src/handler/chatgpt'
import { ChatGPTOfficialHandler } from 'src/handler/chatgpt-official'
import { writeConfig } from 'src/util/config'
import { writeEnv } from 'src/util/env'
import { Sender } from '../../model/sender'
import { BaseCommand } from '../command'

class TokenCommand extends BaseCommand {
  label = 'token'
  usage = [
    'set [token] // 设置token',
    'setkey [key] // 设置官方api key'
  ]

  requiredAdministrator = true

  description = 'token相关命令'

  async execute (sender: Sender, params: string[]) {
    switch (params[0]) {
      case 'set':
        if (!config.api.enable) {
          sender.reply('未启用三方api, 无需设置!')
          return
        }
        // 长度小于2000直接判错吧...
        if (!params[1] || params[1].length < 2000) {
          sender.reply('请输入正确的token!')
          break
        }
        config.api.token = params[1]
        await writeEnv(config)
        sender.reply('token重置成功!')
        break
      case 'setkey':
        const handler = messageHandlers.find(item => item instanceof ChatGPTOfficialHandler) as ChatGPTOfficialHandler
        if (!handler) return
        handler.load({ ...handler.config, key: params[1] })
        await writeConfig({ ...config, [handler.name]: handler.config })
        sender.reply('key重置成功!')
        break
      default:
        sender.reply(this.helpDoc, true)
    }
  }
}

export default TokenCommand
