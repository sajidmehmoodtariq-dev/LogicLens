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
    
    // First pass: create all nodes
    Object.entries(variables).forEach(([name, value], index) => {
      // Check if value is an array
      const isArray = Array.isArray(value);
      
      stackNodes.push({
        id: name,
        type: 'default',
        position: { x: 100 + (index * 180), y: 50 },
        data: { 
          label: (
            <div className="stack-node">
              <div className="stack-node-name">{name}</div>
              <div className="stack-node-value">
                {isArray ? (
                  <div className="array-value">
                    [{value.map((v, i) => (
                      <span key={i} className="array-element">
                        {String(v)}{i < value.length - 1 ? ', ' : ''}
                      </span>
                    ))}]
                  </div>
                ) : typeof value === 'string' && value.startsWith('0x') ? (
                  <span className="pointer-value">{value}</span>
                ) : (
                  <span className="primitive-value">{String(value)}</span>
                )}
              </div>
            </div>
          )
        },
        style: {
          background: 'rgba(20, 27, 58, 0.8)',
          border: isArray ? '2px solid rgba(250, 112, 154, 0.5)' : '2px solid rgba(56, 239, 125, 0.5)',
          borderRadius: '12px',
          padding: 0,
          width: isArray ? 160 : 110,
        },
      });
    });
    
    // Second pass: create edges for matching values
    Object.entries(variables).forEach(([varName, varValue]) => {
      // Only create edges for primitive values (not arrays)
      if (!Array.isArray(varValue) && typeof varValue !== 'string') {
        // Check all arrays for matching elements
        Object.entries(variables).forEach(([arrName, arrValue]) => {
          if (Array.isArray(arrValue)) {
            // Check if primitive value matches any array element
            arrValue.forEach((element, index) => {
              if (element === varValue) {
                stackEdges.push({
                  id: `${varName}-to-${arrName}-${index}`,
                  source: varName,
                  target: arrName,
                  type: 'smoothstep',
                  animated: true,
                  label: `[${index}]`,
                  style: {
                    stroke: '#38ef7d',
                    strokeWidth: 2,
                  },
                  labelStyle: {
                    fill: '#38ef7d',
                    fontWeight: 600,
                    fontSize: 11,
                  },
                  labelBgStyle: {
                    fill: 'rgba(20, 27, 58, 0.9)',
                  },
                });
              }
            });
          }
        });
      }
    });
    
    console.log('Generated stack nodes:', stackNodes);
    console.log('Generated stack edges:', stackEdges);
    
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
