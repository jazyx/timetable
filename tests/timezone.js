const midnightInZone = (timeZone) => {
  // Intl.DateTimeFormat().resolvedOptions().timeZone
  const localMidnight = new Date().setHours(0,0,0,0,0)
  // 2022-12-02T21:00:00.000Z ("Europe/Moscow")

  const isoString = localMidnight.toLocaleString(
    "en-GB", { timeZone }
  )
  // '02/12/2022, 17:00:00'
  // ("Asia/Vladivostok") is seven hours ahead of Moscow
  // and 10 hours ahead of UTC. Midnight in Moscow this
  // morning occurred at 5 p.m. in Vladivostok yesterday.
  const [ date, time ] = isoString.split(", ")
  const [ day, month, year ] = date.split("/")
  const [ hour, minute, second ] = time.split(":")

  const msOffset = (24 - hour) * 3600000
  localMidnight.setTime(localMidnight.getTime() - msOffset)

  return localMidnight
}

const vladivostokMidnight = midnightInZone("Asia/Vladivostok")
console.log("vladivostokMidnight:", vladivostokMidnight);
