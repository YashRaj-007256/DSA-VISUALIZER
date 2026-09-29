import React, { useState, useEffect, useRef } from 'react';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';

export const dsPseudocode = {
  stack_push: {
    pseudocode: [
      'function push(stack, value) {',
      '  if (size >= LIMIT) return OVERFLOW',
      '  stack[top] = value',
      '  top = top + 1',
      '}'
    ],
    python: [
      'def push(stack, value):',
      '  if len(stack) >= LIMIT: return OVERFLOW',
      '  stack.append(value)',
      '  top = top + 1',
      '# end def'
    ],
    java: [
      'void push(Stack stack, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  stack[top] = value;',
      '  top = top + 1;',
      '}'
    ],
    cpp: [
      'void push(Stack& stack, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  stack[top] = value;',
      '  top = top + 1;',
      '}'
    ],
    c: [
      'void push(Stack* stack, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  stack->data[top] = value;',
      '  top = top + 1;',
      '}'
    ]
  },
  stack_pop: {
    pseudocode: [
      'function pop(stack) {',
      '  if (top == 0) return UNDERFLOW',
      '  top = top - 1',
      '  popped = stack[top]',
      '  return popped',
      '}'
    ],
    python: [
      'def pop(stack):',
      '  if len(stack) == 0: return UNDERFLOW',
      '  top = top - 1',
      '  popped = stack.pop()',
      '  return popped',
      '# end def'
    ],
    java: [
      'int pop(Stack stack) {',
      '  if (top == 0) return UNDERFLOW;',
      '  top = top - 1;',
      '  int popped = stack[top];',
      '  return popped;',
      '}'
    ],
    cpp: [
      'int pop(Stack& stack) {',
      '  if (top == 0) return UNDERFLOW;',
      '  top = top - 1;',
      '  int popped = stack[top];',
      '  return popped;',
      '}'
    ],
    c: [
      'int pop(Stack* stack) {',
      '  if (top == 0) return UNDERFLOW;',
      '  top = top - 1;',
      '  int popped = stack->data[top];',
      '  return popped;',
      '}'
    ]
  },
  queue_enqueue: {
    pseudocode: [
      'function enqueue(queue, value) {',
      '  if (size >= LIMIT) return OVERFLOW',
      '  queue[rear] = value',
      '  rear = rear + 1',
      '}'
    ],
    python: [
      'def enqueue(queue, value):',
      '  if len(queue) >= LIMIT: return OVERFLOW',
      '  queue.append(value)',
      '  rear = rear + 1',
      '# end def'
    ],
    java: [
      'void enqueue(Queue queue, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  queue[rear] = value;',
      '  rear = rear + 1;',
      '}'
    ],
    cpp: [
      'void enqueue(Queue& queue, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  queue[rear] = value;',
      '  rear = rear + 1;',
      '}'
    ],
    c: [
      'void enqueue(Queue* queue, int value) {',
      '  if (size >= LIMIT) return OVERFLOW;',
      '  queue->data[rear] = value;',
      '  rear = rear + 1;',
      '}'
    ]
  },
  queue_dequeue: {
    pseudocode: [
      'function dequeue(queue) {',
      '  if (front == rear) return UNDERFLOW',
      '  dequeued = queue[front]',
      '  front = front + 1',
      '  return dequeued',
      '}'
    ],
    python: [
      'def dequeue(queue):',
      '  if front == rear: return UNDERFLOW',
      '  dequeued = queue.pop(0)',
      '  front = front + 1',
      '  return dequeued',
      '# end def'
    ],
    java: [
      'int dequeue(Queue queue) {',
      '  if (front == rear) return UNDERFLOW;',
      '  int dequeued = queue[front];',
      '  front = front + 1;',
      '  return dequeued;',
      '}'
    ],
    cpp: [
      'int dequeue(Queue& queue) {',
      '  if (front == rear) return UNDERFLOW;',
      '  int dequeued = queue[front];',
      '  front = front + 1;',
      '  return dequeued;',
      '}'
    ],
    c: [
      'int dequeue(Queue* queue) {',
      '  if (front == rear) return UNDERFLOW;',
      '  int dequeued = queue->data[front];',
      '  front = front + 1;',
      '  return dequeued;',
      '}'
    ]
  }
};

const MAX_LIMIT = 8;

export default function DataStructuresVisualizer({ setGlobalTelemetry, runner, setHighlightedLine, updateCodeLines }) {
  const [dsType, setDsType] = useState('stack'); // 'stack' | 'queue'
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]); // holds elements: { id, val, status: 'new' | 'active' | 'popping' | 'idle' }
  const [logs, setLogs] = useState([]); // log statements

  const [opCount, setOpCount] = useState(0);
  const nextIdRef = useRef(1);

  // Synchronize telemetry
  useEffect(() => {
    setGlobalTelemetry({
      status: runner.status,
      comparisons: 0,
      swaps: list.length,
      elapsedTime: runner.elapsedTime,
      complexity: { time: 'O(1)', space: 'O(N)' },
      swapsLabel: 'ELEMENT COUNT'
    });
  }, [runner.status, runner.elapsedTime, list.length]);

  const addLog = (msg) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleClear = () => {
    runner.stop();
    setList([]);
    setLogs([]);
    setHighlightedLine(-1);
    addLog(`Cleared the ${dsType}`);
  };

  // Stack Push Generator
  function* stackPushGen(val) {
    yield { line: 0 };
    yield { line: 1 };
    if (list.length >= MAX_LIMIT) {
      addLog(`[ERROR] Stack Overflow! Maximum size is ${MAX_LIMIT}.`);
      return;
    }

    yield { line: 2 };
    const newItem = { id: nextIdRef.current++, val, status: 'new' };
    list.push(newItem);
    setList([...list]);
    addLog(`Pushing ${val} onto Stack.`);

    yield { line: 3 };
    newItem.status = 'idle';
    setList([...list]);
    setOpCount(prev => prev + 1);
  }

  // Stack Pop Generator
  function* stackPopGen() {
    yield { line: 0 };
    yield { line: 1 };
    if (list.length === 0) {
      addLog('[ERROR] Stack Underflow! Stack is empty.');
      return;
    }

    yield { line: 2 };
    const poppingNode = list[list.length - 1];
    poppingNode.status = 'popping';
    setList([...list]);
    addLog(`Popping ${poppingNode.val} from Stack.`);

    yield { line: 3 };
    yield { line: 4 };
    list.pop();
    setList([...list]);
    setOpCount(prev => prev + 1);
  }

  // Queue Enqueue Generator
  function* queueEnqueueGen(val) {
    yield { line: 0 };
    yield { line: 1 };
    if (list.length >= MAX_LIMIT) {
      addLog(`[ERROR] Queue Overflow! Maximum size is ${MAX_LIMIT}.`);
      return;
    }

    yield { line: 2 };
    const newItem = { id: nextIdRef.current++, val, status: 'new' };
    list.push(newItem);
    setList([...list]);
    addLog(`Enqueueing ${val} into Queue.`);

    yield { line: 3 };
    newItem.status = 'idle';
    setList([...list]);
    setOpCount(prev => prev + 1);
  }

  // Queue Dequeue Generator
  function* queueDequeueGen() {
    yield { line: 0 };
    yield { line: 1 };
    if (list.length === 0) {
      addLog('[ERROR] Queue Underflow! Queue is empty.');
      return;
    }

    yield { line: 2 };
    const dequeNode = list[0];
    dequeNode.status = 'popping';
    setList([...list]);
    addLog(`Dequeueing ${dequeNode.val} from Queue.`);

    yield { line: 3 };
    yield { line: 4 };
    list.shift();
    setList([...list]);
    setOpCount(prev => prev + 1);
  }

  const handlePush = () => {
    if (runner.isRunning) return;
    const val = inputValue.trim();
    if (!val) return;
    setInputValue('');

    updateCodeLines(dsPseudocode.stack_push);
    const generator = stackPushGen(val);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
      }
    );
  };

  const handlePop = () => {
    if (runner.isRunning) return;
    updateCodeLines(dsPseudocode.stack_pop);
    const generator = stackPopGen();
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
      }
    );
  };

  const handleEnqueue = () => {
    if (runner.isRunning) return;
    const val = inputValue.trim();
    if (!val) return;
    setInputValue('');

    updateCodeLines(dsPseudocode.queue_enqueue);
    const generator = queueEnqueueGen(val);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
      }
    );
  };

  const handleDequeue = () => {
    if (runner.isRunning) return;
    updateCodeLines(dsPseudocode.queue_dequeue);
    const generator = queueDequeueGen();
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
      }
    );
  };

  const currentPseudocode = () => {
    // Return dummy empty lines if not running, otherwise return action specific code
    return [];
  };

  return (
    <div className="visualizer-container">
      <aside className="controls">
        <div className="control-group">
          <label>Data Structure</label>
          <div className="btn-row">
            <button
              onClick={() => {
                runner.stop();
                setDsType('stack');
                setList([]);
                updateCodeLines(dsPseudocode.stack_push);
              }}
              className={`btn btn-toggle ${dsType === 'stack' ? 'active' : ''}`}
              disabled={runner.isRunning}
            >
              Stack
            </button>
            <button
              onClick={() => {
                runner.stop();
                setDsType('queue');
                setList([]);
                updateCodeLines(dsPseudocode.queue_enqueue);
              }}
              className={`btn btn-toggle ${dsType === 'queue' ? 'active' : ''}`}
              disabled={runner.isRunning}
            >
              Queue
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="ds-value">Insert Value</label>
          <div className="flex-row">
            <input
              type="text"
              id="ds-value"
              maxLength="5"
              placeholder="e.g. 42, A"
              value={inputValue}
              disabled={runner.isRunning}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {dsType === 'stack' ? (
              <button onClick={handlePush} className="btn btn-primary" disabled={runner.isRunning}>
                Push
              </button>
            ) : (
              <button onClick={handleEnqueue} className="btn btn-primary" disabled={runner.isRunning}>
                Enqueue
              </button>
            )}
          </div>
        </div>

        <div className="control-group btn-row">
          {dsType === 'stack' ? (
            <button onClick={handlePop} className="btn btn-ghost" disabled={runner.isRunning || list.length === 0}>
              Pop Element
            </button>
          ) : (
            <button onClick={handleDequeue} className="btn btn-ghost" disabled={runner.isRunning || list.length === 0}>
              Dequeue Element
            </button>
          )}

          <button onClick={handleClear} className="btn btn-ghost" disabled={runner.isRunning}>
            Clear
          </button>
        </div>

        <div className="control-group">
          <label>Operation logs</label>
          <div className="ds-logs-panel">
            {logs.length === 0 && <span className="trace-status">// Console empty</span>}
            {logs.map((log, idx) => (
              <div key={idx} className="ds-log-item">
                {log}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="viewport">
        <div className="ds-viewport-inner">
          {dsType === 'stack' ? (
            <div className="stack-container-wrapper">
              <div className="stack-container">
                {list.slice().reverse().map((item) => (
                  <div
                    key={item.id}
                    className={`ds-node stack-node ${item.status}`}
                  >
                    <span className="node-val">{item.val}</span>
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="empty-placeholder">STACK EMPTY</div>
                )}
              </div>
              <span className="ds-label"> Stack Beaker (LIFO)</span>
            </div>
          ) : (
            <div className="queue-container-wrapper">
              <div className="queue-conveyor">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className={`ds-node queue-node ${item.status}`}
                  >
                    <span className="node-val">{item.val}</span>
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="empty-placeholder">QUEUE EMPTY</div>
                )}
              </div>
              <span className="ds-label"> Queue conveyor (FIFO)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
