import { bootstrapAtom } from "atom-helper"
import RedisStreamHelper from "redis-stream-helper"

const { listenForMessages, createStreamGroup, addStreamData, addListener } =
  RedisStreamHelper(process.env.REDIS_PORT, process.env.REDIS_HOST)

export default async ({ key, streamId, data }) => {
  await bootstrapAtom("http", data, addStreamData)
  console.log("http executed with data", key, streamId, data)
}
