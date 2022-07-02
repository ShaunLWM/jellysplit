import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';

interface Props {
  data: {
    label: string;
    value?: string;
  },
  isConnectable: boolean,
}

export default memo(({ data, isConnectable }: Props) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div onClick={() => alert('hi')}>
        <strong>{data.label}</strong>
        {data?.value && data?.value?.length > 0 && <p>{data.value}</p>}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
