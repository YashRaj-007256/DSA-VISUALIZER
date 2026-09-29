import { useState, useRef, useEffect, useCallback } from 'react';

export function useAlgorithmRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(5); // 1 to 10 scale
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('STANDBY');

  const generatorRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const tickCallbackRef = useRef(null);
  const finishCallbackRef = useRef(null);
  
  // Timer references
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const getDelay = useCallback(() => {
    // Speed 1: ~1000ms, Speed 10: ~5ms
    return Math.max(5, 1050 - speedRef.current * 104);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = performance.now();
    timerIntervalRef.current = setInterval(() => {
      const current = performance.now();
      const delta = (current - startTimeRef.current) / 1000;
      setElapsedTime(accumulatedTimeRef.current + delta);
    }, 50);
  }, [stopTimer]);

  const pauseTimer = useCallback(() => {
    stopTimer();
    if (startTimeRef.current > 0) {
      accumulatedTimeRef.current += (performance.now() - startTimeRef.current) / 1000;
    }
  }, [stopTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    setElapsedTime(0);
  }, [stopTimer]);

  const stop = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    stopTimer();
    generatorRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setStatus('STANDBY');
  }, [stopTimer]);

  const step = useCallback(async () => {
    if (!generatorRef.current) return { done: true };
    const res = generatorRef.current.next();
    if (res.done) {
      stopTimer();
      setIsRunning(false);
      setIsPaused(false);
      setStatus('COMPLETE');
      if (finishCallbackRef.current) finishCallbackRef.current();
      return { done: true };
    }
    if (tickCallbackRef.current) {
      tickCallbackRef.current(res.value);
    }
    return { done: false, value: res.value };
  }, [stopTimer]);

  const runLoop = useCallback(async () => {
    const res = await step();
    if (res.done) return;
    
    timeoutIdRef.current = setTimeout(() => {
      runLoop();
    }, getDelay());
  }, [step, getDelay]);

  const start = useCallback((generatorInstance, onTick, onFinish) => {
    stop();
    generatorRef.current = generatorInstance;
    tickCallbackRef.current = onTick;
    finishCallbackRef.current = onFinish;
    
    resetTimer();
    setIsRunning(true);
    setIsPaused(false);
    setStatus('RUNNING');
    startTimer();
    
    // Initial run trigger
    timeoutIdRef.current = setTimeout(() => {
      runLoop();
    }, 10);
  }, [stop, resetTimer, startTimer, runLoop]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    pauseTimer();
    setIsPaused(true);
    setStatus('PAUSED');
  }, [isRunning, isPaused, pauseTimer]);

  const resume = useCallback(() => {
    if (!isRunning || !isPaused) return;
    setIsPaused(false);
    setStatus('RUNNING');
    startTimer();
    runLoop();
  }, [isRunning, isPaused, startTimer, runLoop]);

  const stepNext = useCallback(async () => {
    if (!isRunning || !isPaused) return;
    // Step forward exactly one frame
    startTimer();
    await step();
    pauseTimer();
  }, [isRunning, isPaused, startTimer, step, pauseTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isRunning,
    isPaused,
    speed,
    setSpeed,
    elapsedTime,
    status,
    start,
    pause,
    resume,
    stepNext,
    stop,
    resetTimer
  };
}
