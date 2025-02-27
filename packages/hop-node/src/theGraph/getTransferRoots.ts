import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'
import { padHex } from 'src/utils/padHex'

export default async function getTransferRoots (
  chain: string,
  token: string,
  lastId: string = constants.AddressZero
): Promise<any[]> {
  const query = `
    query TransferRoots($token: String, $lastId: ID) {
      transfersCommitteds(
        where: {
          token: $token,
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        rootHash
        destinationChainId
        totalAmount
        rootCommittedAt

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    lastId: padHex(lastId)
  })

  let roots = jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (roots.length === maxItemsLength) {
    lastId = roots[roots.length - 1].id
    roots = roots.concat(await getTransferRoots(
      chain,
      token,
      lastId
    ))
  }

  return roots
}
