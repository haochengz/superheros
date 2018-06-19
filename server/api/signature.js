
import { getWechat } from '../wechat'

const client = getWechat()

export async function getSignatureAsync(url) {
  const token = await client.fetchAccessToken().token
  const ticket = await client.fetchTicket(token).ticket

  let param = client.sign(ticket, url)
  param.appId = client.appID
  return param
}
