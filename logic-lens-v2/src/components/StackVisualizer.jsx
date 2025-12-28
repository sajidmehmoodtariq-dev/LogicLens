import ReactFlow, { 
  Background, 
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './StackVisualizer.css';
import { useMemo } from 'react';

export default function StackVisualizer({ variables }) {
  const { nodes, edges } = useMemo(() => {
    const stackNodes = [];
    const stackEdges = [];
    
    console.log('Building stack nodes from variables:', variables);
    
    // Convert variables to React Flow nodes
    Object.entries(variables).forEach(([name, value], index) => {
      stackNodes.push({
        id: name,
        type: 'default',
        position: { x: 100 + (index * 180), y: 50 },
        data: { 
          label: (
            <div className="stack-node">
              <div className="stack-node-name">{name}</div>
              <div className="stack-node-value">
                {typeof value === 'string' && value.startsWith('0x') 
                  ? <span className="pointer-value">{value}</span>
                  : <span className="primitive-value">{String(value)}</span>}
              </div>
            </div>
          )
        },
        style: {
          background: 'rgba(20, 27, 58, 0.8)',
          border: '2px solid rgba(56, 239, 125, 0.5)',
          borderRadius: '12px',
          padding: 0,
          width: 110,
        },
      });
    });
    
    console.log('Generated stack nodes:', stackNodes);
    
    return { nodes: stackNodes, edges: stackEdges };
  }, [variables]);

  const hasVariables = Object.keys(variables).length > 0;

  return (
    <div className="stack-visualizer">
      {hasVariables ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color="#1a2347" gap={16} />
          <Controls />
        </ReactFlow>
      ) : (
        <div className="stack-placeholder">
          <p>Variables will appear here</p>
        </div>
      )}
    </div>
  );
}
