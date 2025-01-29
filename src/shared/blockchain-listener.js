import { hash, num } from "starknet";

/**
 * Fetch events from a StarkNet contract between `fromBlock` and `toBlock`.
 *
 * @param {import("starknet").Provider} provider - A StarkNet provider instance.
 * @param {string} contractAddress
 * @param {string} eventName
 * @param {number} fromBlock
 * @param {number} toBlock
 * @param {number} [chunkSize=50] - How many events to fetch at once.
 */
export async function checkForEvents(
  provider,
  contractAddress,
  eventName,
  fromBlock,
  toBlock,
  chunkSize = 50
) {
  const eventKey = hash.starknetKeccak(eventName);
  const allEvents = [];
  let continuationToken = undefined;

  try {
    do {
      const response = await provider.getEvents({
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: contractAddress,
        keys: [[num.toHex(eventKey)]],
        chunk_size: chunkSize,
        continuation_token: continuationToken,
      });

      allEvents.push(...response.events);
      continuationToken = response.continuation_token;
    } while (continuationToken);

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
