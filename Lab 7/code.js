import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';

const FittsLawTester = () => {
  const [phase, setPhase] = useState('setup'); // setup, testing, results, optimized, finalResults
  const [currentTest, setCurrentTest] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [optimizedResults, setOptimizedResults] = useState([]);
  const [layout, setLayout] = useState('original');
  const [showInstructions, setShowInstructions] = useState(true);
  const canvasRef = useRef(null);
  
  // Test configurations - varying sizes and distances
  const originalTests = [
    { id: 1, size: 80, distance: 400, x: 600, y: 300, label: "Large/Far" },
    { id: 2, size: 40, distance: 400, x: 600, y: 300, label: "Small/Far" },
    { id: 3, size: 80, distance: 200, x: 400, y: 300, label: "Large/Near" },
    { id: 4, size: 40, distance: 200, x: 400, y: 300, label: "Small/Near" },
    { id: 5, size: 60, distance: 300, x: 500, y: 300, label: "Medium/Medium" },
    { id: 6, size: 30, distance: 500, x: 700, y: 300, label: "Tiny/Very Far" },
  ];

  // Optimized layout - targets closer and larger where frequently used
  const optimizedTests = [
    { id: 1, size: 100, distance: 250, x: 450, y: 300, label: "Large/Near" },
    { id: 2, size: 60, distance: 300, x: 500, y: 300, label: "Medium/Near" },
    { id: 3, size: 100, distance: 200, x: 400, y: 300, label: "Large/Close" },
    { id: 4, size: 60, distance: 250, x: 450, y: 280, label: "Medium/Close" },
    { id: 5, size: 80, distance: 200, x: 400, y: 320, label: "Large/Close" },
    { id: 6, size: 50, distance: 350, x: 550, y: 300, label: "Medium/Medium" },
  ];

  const tests = layout === 'original' ? originalTests : optimizedTests;
  const startPos = { x: 200, y: 300 };

  useEffect(() => {
    if (phase === 'testing' && startTime === null) {
      setStartTime(Date.now());
    }
  }, [phase, startTime]);

  const calculateFittsLaw = (distance, size) => {
    // Fitts' Law: MT = a + b * log2(D/W + 1)
    // where MT = movement time, D = distance, W = width (size)
    const a = 50; // empirical constant (ms)
    const b = 150; // empirical constant (ms)
    const ID = Math.log2(distance / size + 1); // Index of Difficulty
    const MT = a + b * ID;
    return { MT: Math.round(MT), ID: ID.toFixed(2) };
  };

  const handleTargetClick = (e) => {
    if (phase !== 'testing' && phase !== 'optimized') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const test = tests[currentTest];
    const dx = clickX - test.x;
    const dy = clickY - test.y;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceFromCenter <= test.size / 2) {
      const clickTime = Date.now() - startTime;
      const fittsCalc = calculateFittsLaw(test.distance, test.size);
      
      const result = {
        testId: test.id,
        label: test.label,
        size: test.size,
        distance: test.distance,
        actualTime: clickTime,
        predictedTime: fittsCalc.MT,
        indexOfDifficulty: fittsCalc.ID,
        error: 0
      };
      
      if (phase === 'testing') {
        setResults([...results, result]);
      } else {
        setOptimizedResults([...optimizedResults, result]);
      }
      
      if (currentTest < tests.length - 1) {
        setCurrentTest(currentTest + 1);
        setStartTime(Date.now());
      } else {
        if (phase === 'testing') {
          setPhase('results');
        } else {
          setPhase('finalResults');
        }
      }
    } else {
      // Missed click - record error
      const clickTime = Date.now() - startTime;
      const fittsCalc = calculateFittsLaw(test.distance, test.size);
      
      const result = {
        testId: test.id,
        label: test.label,
        size: test.size,
        distance: test.distance,
        actualTime: clickTime,
        predictedTime: fittsCalc.MT,
        indexOfDifficulty: fittsCalc.ID,
        error: 1
      };
      
      if (phase === 'testing') {
        setResults([...results, result]);
      } else {
        setOptimizedResults([...optimizedResults, result]);
      }
      
      if (currentTest < tests.length - 1) {
        setCurrentTest(currentTest + 1);
        setStartTime(Date.now());
      } else {
        if (phase === 'testing') {
          setPhase('results');
        } else {
          setPhase('finalResults');
        }
      }
    }
  };

  const startTest = (layoutType) => {
    setLayout(layoutType);
    setCurrentTest(0);
    setStartTime(null);
    if (layoutType === 'original') {
      setPhase('testing');
      setResults([]);
    } else {
      setPhase('optimized');
      setOptimizedResults([]);
    }
    setShowInstructions(false);
  };

  const resetAll = () => {
    setPhase('setup');
    setCurrentTest(0);
    setStartTime(null);
    setResults([]);
    setOptimizedResults([]);
    setShowInstructions(true);
  };

  const renderCanvas = () => {
    const test = tests[currentTest];
    
    return (
      <div className="relative bg-gray-100 border-2 border-gray-300 rounded" style={{ width: '800px', height: '600px' }}>
        <svg ref={canvasRef} width="800" height="600" onClick={handleTargetClick} className="cursor-crosshair">
          {/* Start position */}
          <circle cx={startPos.x} cy={startPos.y} r="15" fill="#10b981" opacity="0.5" />
          <text x={startPos.x} y={startPos.y - 25} textAnchor="middle" fill="#059669" fontSize="14" fontWeight="bold">START</text>
          
          {/* Distance line */}
          <line x1={startPos.x} y1={startPos.y} x2={test.x} y2={test.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Target */}
          <circle cx={test.x} cy={test.y} r={test.size / 2} fill="#3b82f6" opacity="0.7" stroke="#1e40af" strokeWidth="3" />
          <text x={test.x} y={test.y + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">CLICK</text>
          
          {/* Labels */}
          <text x={test.x} y={test.y + test.size / 2 + 25} textAnchor="middle" fill="#1e293b" fontSize="12">
            Size: {test.size}px | Distance: {test.distance}px
          </text>
        </svg>
        
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow">
          <p className="text-sm font-semibold">Target {currentTest + 1} of {tests.length}</p>
          <p className="text-xs text-gray-600 mt-1">{test.label}</p>
        </div>
      </div>
    );
  };

  const calculateStats = (data) => {
    if (data.length === 0) return null;
    
    const avgActual = data.reduce((sum, r) => sum + r.actualTime, 0) / data.length;
    const avgPredicted = data.reduce((sum, r) => sum + r.predictedTime, 0) / data.length;
    const totalErrors = data.reduce((sum, r) => sum + r.error, 0);
    const errorRate = (totalErrors / data.length * 100).toFixed(1);
    
    return {
      avgActual: Math.round(avgActual),
      avgPredicted: Math.round(avgPredicted),
      totalErrors,
      errorRate
    };
  };

  const renderResults = () => {
    const stats = calculateStats(results);
    const chartData = results.map(r => ({
      name: r.label,
      actual: r.actualTime,
      predicted: r.predictedTime,
      id: r.indexOfDifficulty
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Original Layout Results</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Avg Actual Time</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgActual}ms</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Avg Predicted Time</p>
              <p className="text-2xl font-bold text-green-600">{stats.avgPredicted}ms</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Errors</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalErrors}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.errorRate}%</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual Time" />
              <Bar dataKey="predicted" fill="#10b981" name="Predicted Time (Fitts' Law)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Fitts' Law Calculations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Target</th>
                    <th className="p-2 text-right">Size (px)</th>
                    <th className="p-2 text-right">Distance (px)</th>
                    <th className="p-2 text-right">ID</th>
                    <th className="p-2 text-right">Predicted (ms)</th>
                    <th className="p-2 text-right">Actual (ms)</th>
                    <th className="p-2 text-right">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{r.label}</td>
                      <td className="p-2 text-right">{r.size}</td>
                      <td className="p-2 text-right">{r.distance}</td>
                      <td className="p-2 text-right">{r.indexOfDifficulty}</td>
                      <td className="p-2 text-right">{r.predictedTime}</td>
                      <td className="p-2 text-right">{r.actualTime}</td>
                      <td className="p-2 text-right">{r.error ? '✗' : '✓'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <h3 className="text-xl font-bold mb-3">Optimization Recommendations</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Increase target sizes for frequently used elements</li>
            <li>✓ Reduce distances between common interactions</li>
            <li>✓ Place important actions closer to starting positions</li>
            <li>✓ Group related functions to minimize cursor travel</li>
          </ul>
        </div>

        <button
          onClick={() => startTest('optimized')}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Test Optimized Layout
        </button>
      </div>
    );
  };

  const renderFinalResults = () => {
    const originalStats = calculateStats(results);
    const optimizedStats = calculateStats(optimizedResults);
    
    const improvement = {
      time: ((originalStats.avgActual - optimizedStats.avgActual) / originalStats.avgActual * 100).toFixed(1),
      errors: originalStats.totalErrors - optimizedStats.totalErrors
    };

    const comparisonData = [
      { name: 'Original', avgTime: originalStats.avgActual, errors: originalStats.totalErrors },
      { name: 'Optimized', avgTime: optimizedStats.avgActual, errors: optimizedStats.totalErrors }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Comparison: Original vs Optimized</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded border-2 border-blue-200">
              <h3 className="font-semibold mb-2">Original Layout</h3>
              <p className="text-sm text-gray-600">Avg Time: <span className="font-bold">{originalStats.avgActual}ms</span></p>
              <p className="text-sm text-gray-600">Errors: <span className="font-bold">{originalStats.totalErrors}</span></p>
              <p className="text-sm text-gray-600">Error Rate: <span className="font-bold">{originalStats.errorRate}%</span></p>
            </div>
            
            <div className="bg-green-50 p-4 rounded border-2 border-green-200">
              <h3 className="font-semibold mb-2">Optimized Layout</h3>
              <p className="text-sm text-gray-600">Avg Time: <span className="font-bold">{optimizedStats.avgActual}ms</span></p>
              <p className="text-sm text-gray-600">Errors: <span className="font-bold">{optimizedStats.totalErrors}</span></p>
              <p className="text-sm text-gray-600">Error Rate: <span className="font-bold">{optimizedStats.errorRate}%</span></p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-300 mb-6">
            <h3 className="text-xl font-bold mb-3 text-green-800">Performance Improvement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-green-600">{improvement.time}%</p>
                <p className="text-sm text-gray-700">Faster Average Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{improvement.errors}</p>
                <p className="text-sm text-gray-700">Fewer Errors</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Errors', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="avgTime" fill="#3b82f6" name="Avg Time (ms)" />
              <Bar yAxisId="right" dataKey="errors" fill="#ef4444" name="Errors" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Original Layout Data</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 text-left">Target</th>
                      <th className="p-1 text-right">Time</th>
                      <th className="p-1 text-right">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-1">{r.label}</td>
                        <td className="p-1 text-right">{r.actualTime}ms</td>
                        <td className="p-1 text-right">{r.indexOfDifficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Optimized Layout Data</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 text-left">Target</th>
                      <th className="p-1 text-right">Time</th>
                      <th className="p-1 text-right">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizedResults.map((r, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-1">{r.label}</td>
                        <td className="p-1 text-right">{r.actualTime}ms</td>
                        <td className="p-1 text-right">{r.indexOfDifficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold mb-3">Key Findings</h3>
          <ul className="space-y-2 text-sm">
            <li>• Larger targets and shorter distances significantly reduced interaction time</li>
            <li>• Lower Index of Difficulty (ID) values correlated with faster, more accurate clicks</li>
            <li>• Fitts' Law successfully predicted relative difficulty across different target configurations</li>
            <li>• Optimized layout demonstrates measurable improvements in user efficiency</li>
          </ul>
        </div>

        <button
          onClick={resetAll}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Start New Test
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">Fitts' Law UI Optimization Tool</h1>
        <p className="text-gray-600">Measure interaction speed and optimize UI layout using Fitts' Law</p>
      </div>

      {phase === 'setup' && (
        <div className="bg-white p-6 rounded-lg shadow">
          {showInstructions && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Instructions</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">About Fitts' Law</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Fitts' Law predicts the time required to move to a target: <strong>MT = a + b × log₂(D/W + 1)</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• MT = Movement Time</li>
                  <li>• D = Distance to target</li>
                  <li>• W = Width (size) of target</li>
                  <li>• ID = Index of Difficulty = log₂(D/W + 1)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Test Procedure</h3>
                <ol className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>1. Click targets as quickly and accurately as possible</li>
                  <li>2. Start from the green START circle each time</li>
                  <li>3. Complete all 6 targets in the original layout</li>
                  <li>4. Review results and Fitts' Law calculations</li>
                  <li>5. Test the optimized layout</li>
                  <li>6. Compare performance improvements</li>
                </ol>
              </div>
            </div>
          )}
          
          <button
            onClick={() => startTest('original')}
            className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
          >
            Start Original Layout Test
          </button>
        </div>
      )}

      {(phase === 'testing' || phase === 'optimized') && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              {phase === 'testing' ? 'Original Layout' : 'Optimized Layout'} - Testing in Progress
            </h2>
            <p className="text-gray-600">Click the blue target as quickly as possible. Start from the green circle.</p>
          </div>
          
          <div className="flex justify-center">
            {renderCanvas()}
          </div>
        </div>
      )}

      {phase === 'results' && renderResults()}
      {phase === 'finalResults' && renderFinalResults()}
    </div>
  );
};

export default FittsLawTester;