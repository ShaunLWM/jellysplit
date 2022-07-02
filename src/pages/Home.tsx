import { Flex, Input } from "@chakra-ui/react";
import { fromScriptHex } from "@defichain/jellyfish-address";
import { DfTx, OP_DEFI_TX, toOPCodes } from '@defichain/jellyfish-transaction';
import { TransactionVin, TransactionVout } from "@defichain/whale-api-client/dist/api/transactions";
import BigNumber from "bignumber.js";
import { ChangeEvent, useEffect, useState } from "react";
import ReactFlow, { Position, useEdgesState, useNodesState, Node, Edge } from "react-flow-renderer";
import { SmartBuffer } from 'smart-buffer';
import CustomEdge from "../components/CustomEdge";
import LeftRightHandleNode from "../components/LeftRightHandleNode";
import { cutMiddle } from "../lib/Helper";
import { Whale } from "../lib/WhaleClient";

// 3:2    191070825764ce395226ab524b62264fce7e0e0c5cfbd2c5295ff6a4ea747c71
// 2x:2   474046c2906deef32da81c936c7a2ceef5656d7e9e68810d3b926938556f1e6a
// 3:2    dbc60bcd15f73b9df3e277afeb9382ba32e46a49b09d95353df87d2095a19eb4
// 1:8    2b370b8ded07383b9f23ff7d8c2b3bf7bc2dcb1c7e870ec2e2520e054c7f880e
// 7:2    68303720215978fc55b1c8a0f06d6c3ab1de413a61593eb29354bf2e6d8cfc3b

const txId = '68303720215978fc55b1c8a0f06d6c3ab1de413a61593eb29354bf2e6d8cfc3b';
const txIdKey = txId.substring(0, 10);
const network = 'mainnet';

const nodeTypes = {
  leftRightNode: LeftRightHandleNode,
};
const edgeTypes = {
  customEdge: CustomEdge
}

export function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [value, setValue] = useState('4675cd0aaf1ccf9bd36b0a3919dbf3842b41455ba2d1a845e574a61290e38d5d')
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)

  const search = async () => {
    const vins = await getVins();
    const vouts = await getVouts();
    const dftx = getDfTx(vouts);
    const totalValue = getTotalVinsValue(vins);
    console.log(totalValue.toString());
    const edges: Edge[] = [];
    const nodes: Node[] = [
      ...vins.map((vin, index) => {
        const decoded = vin.vout !== undefined ? fromScriptHex(vin.vout.script?.hex, network) : undefined
        const address = decoded?.address ?? 'N/A';
        edges.push({
          id: `e-vin${index + 1}-${txIdKey}`,
          source: `vin-${index + 1}`,
          target: txIdKey,
          animated: true,
          type: 'customEdge',
          style: { stroke: '#fff' },
          data: { text: vin.vout?.value ?? 0 }
        });

        return {
          id: `vin-${index + 1}`,
          type: 'input',
          data: { label: vin.vout === undefined ? 'Coinbase' : cutMiddle(address), value: vin.vout?.value ?? 0 },
          position: { x: 0, y: 50 * (index + 1) },
          sourcePosition: Position.Right,
        }
      }),
      {
        id: txIdKey,
        type: 'leftRightNode',
        data: { label: cutMiddle(txId), value: totalValue.toString() },
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 300, y: (vins.length * 50) / 2 },
      },
      ...vouts.map((vout, index) => {
        const decoded = vout.script !== undefined ? fromScriptHex(vout.script?.hex, network) : undefined
        let address = decoded?.address ?? 'N/A';
        if (index === 0) {
          address = decoded?.address ?? dftx?.name ?? 'N/A'
        }

        edges.push({
          id: `e-${txIdKey}-vout${index + 1}`,
          source: txIdKey,
          target: `vout-${index + 1}`,
          sourceHandle: 'b',
          animated: true,
          type: 'customEdge',
          style: { stroke: '#fff' },
          data: { text: vout?.value ?? 0 }
        });

        return {
          id: `vout-${index + 1}`,
          type: 'output',
          data: { label: cutMiddle(address), value: vout.value },
          position: { x: 650, y: 50 * (index + 1) },
          targetPosition: Position.Left,
        }
      })
    ];
    setNodes(nodes);
    setEdges(edges);
  }

  async function getVins(): Promise<TransactionVin[]> {
    const vins: TransactionVin[] = []
    let vinsResponse = await Whale.transactions.getVins(txId, 100)
    vins.push(...vinsResponse)
    while (vinsResponse.hasNext) {
      vinsResponse = await Whale.transactions.getVins(txId, 100, vinsResponse.nextToken)
      vins.push(...vinsResponse)
    }
    return vins
  }

  async function getVouts(): Promise<TransactionVout[]> {
    const vouts: TransactionVout[] = []
    let voutsResponse = await Whale.transactions.getVouts(txId, 100)
    vouts.push(...voutsResponse)
    while (voutsResponse.hasNext) {
      voutsResponse = await Whale.transactions.getVouts(txId, 100, voutsResponse.nextToken)
      vouts.push(...voutsResponse)
    }
    return vouts
  }

  function getTotalVinsValue(vins: TransactionVin[]): BigNumber {
    return vins.reduce((acc, vin) => {
      if (vin.vout !== undefined) {
        return acc.plus(new BigNumber(vin.vout.value))
      }

      return acc;
    }, new BigNumber(0))
  }

  function getDfTx(vouts: TransactionVout[]): DfTx<any> | undefined {
    const hex = vouts[0].script.hex
    const buffer = SmartBuffer.fromBuffer(Buffer.from(hex, 'hex'))
    const stack = toOPCodes(buffer)
    if (stack.length !== 2 || stack[1].type !== 'OP_DEFI_TX') {
      return undefined
    }
    return (stack[1] as OP_DEFI_TX).tx
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex justifyContent="center" alignItems="center" w="100%" h="100%" flexDir="column">
      <Input placeholder='Basic usage' value={value} onChange={handleChange} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid={true}
        defaultZoom={1.5}
        fitView
        attributionPosition="bottom-left"
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
    </Flex>
  );
}