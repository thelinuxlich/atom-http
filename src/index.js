import RedisStreamHelper from "redis-stream-helper"

const { listenForMessages, createStreamGroup, addStreamData, addListener } =
  RedisStreamHelper(process.env.REDIS_PORT, process.env.REDIS_HOST)

await createStreamGroup("atom:http:trigger")
await createStreamGroup("atom:http:complete")
addListener("atom:http:trigger")

const run = async () => {
  await listenForMessages(async (key, streamId, data) => {
    data.generatedValue =
      typeof data.generatedValue === "number" ? ++data.generatedValue : 1
    console.log("http executed with data", key, streamId, data)
    await addStreamData("atom:http:complete", data)
    // treating only WS for now
    if (data.transport && data.transport === "ws") {
      data.origin = "atom:http:trigger"
      addStreamData("transport:ws:trigger", data)
    }
    if (data.execution && data.process) {
      addStreamData("execution:trigger", {
        process: data.process,
        id: data.execution,
        payload: data.payload + " - " + data.generatedValue,
      })
    }
  })
  run()
}

run()
