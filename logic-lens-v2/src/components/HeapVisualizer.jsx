import { useEffect, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './HeapVisualizer.css';

export default function HeapVisualizer({ heap }) {
  console.log('HeapVisualizer received heap:', heap);
  
  const { nodes, edges } = useMemo(() => {
    const heapNodes = [];
    const heapEdges = [];
    
    console.log('Building nodes/edges from heap:', heap);
    
    // Convert heap objects to React Flow nodes
    Object.entries(heap).forEach(([address, obj], index) => {
      // Create node for heap object
      heapNodes.push({
        id: address,
        type: 'default',
        position: { x: 150 + (index * 250), y: 100 },
        data: { 
          label: (
            <div className="heap-node">
              <div className="heap-node-header">{obj.type}</div>
              <div className="heap-node-address">{address}</div>
              <div className="heap-node-fields">
                {Object.entries(obj.fields).map(([key, value]) => (
                  <div key={key} className="heap-field">
                    <span className="field-name">{key}:</span>
                    <span className="field-value">
                      {typeof value === 'string' && value.startsWith('0x') 
                        ? value 
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        style: {
          background: 'rgba(20, 27, 58, 0.8)',
          border: '2px solid rgba(79, 172, 254, 0.5)',
          borderRadius: '12px',
          padding: 0,
          width: 160,
        },
      });
      
      // Create edges for pointer fields
      Object.entries(obj.fields).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('0x') && heap[value]) {
          heapEdges.push({
            id: `${address}-${key}-${value}`,
            source: address,
            target: value,
            label: key,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#38ef7d',
            },
            style: {
              stroke: '#38ef7d',
              strokeWidth: 2,
            },
            labelStyle: {
              fill: '#00f2fe',
              fontWeight: 600,
              fontSize: 12,
            },
            labelBgStyle: {
              fill: 'rgba(20, 27, 58, 0.9)',
            },
          });
        }
      });
    });
    
    console.log('Generated nodes:', heapNodes);
    console.log('Generated edges:', heapEdges);
    
    return { nodes: heapNodes, edges: heapEdges };
  }, [heap]);

  const hasHeapData = Object.keys(heap).length > 0;

  return (
    <div className="heap-visualizer">
      {hasHeapData ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1a2347" gap={16} />
          <Controls />
        </ReactFlow>
      ) : (
        <div className="heap-placeholder">
          <h3>Heap Memory</h3>
          <p>Pointer-based structures will appear here</p>
        </div>
      )}
    </div>
  );
}
