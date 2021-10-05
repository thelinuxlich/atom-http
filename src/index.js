import RedisStreamHelper from "redis-stream-helper"
import { enrichStandardFields } from "atom-helper"

const { listenForMessages, createStreamGroup, addStreamData, addListener } =
  RedisStreamHelper(process.env.REDIS_PORT, process.env.REDIS_HOST)

await createStreamGroup("atom:http:trigger")
await createStreamGroup("atom:http:complete")
addListener("atom:http:trigger")

const run = async () => {
  await listenForMessages(async (key, streamId, data) => {
    enrichStandardFields("http", data, addStreamData)
    console.log("http executed with data", key, streamId, data)
  })
  run()
}

run()
