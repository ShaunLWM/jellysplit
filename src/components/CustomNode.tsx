import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';

interface BasePut {
  id: string;
}

interface BaseProp {
  data: any;
  isConnectable: boolean;
}

interface InputProp extends BaseProp {
  type: "input";
  inputs: never;
  outputs: BasePut[];
}

interface OutputProp extends BaseProp {
  type: "input";
  inputs: BasePut[];
  outputs: BasePut[];
}

interface DefaultProp extends BaseProp {
  type: "default";
  inputs: BasePut[];
  outputs: never;
}

type Prop = InputProp | OutputProp | DefaultProp;

export default memo(({ type, data, isConnectable, inputs = [], outputs = [] }: Prop) => {
  return (
    <>
      {inputs.map((input, index) => <Handle
        id={input.id}
        type="target"
        position={Position.Left}
        style={{ background: '#555', top: 10 * (index + 1) }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />)}
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input
        className="nodrag"
        type="color"
        onChange={data.onChange}
        defaultValue={data.color}
      />
      {outputs.map((output, index) => <Handle
        id={output.id}
        type="source"
        position={Position.Right}
        style={{ top: 10 * (index + 1), background: '#555' }}
        isConnectable={isConnectable}
      />)}
    </>
  );
});