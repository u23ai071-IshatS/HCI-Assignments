import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { Download, Play, RotateCcw, FileSpreadsheet } from 'lucide-react';

const ABTestingUI = () => {
  const [currentView, setCurrentView] = useState('setup');
  const [uiVersion, setUiVersion] = useState(null);
  const [participantId, setParticipantId] = useState('');
  const [testData, setTestData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [taskComplete, setTaskComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  
  // UI Version A: Traditional Layout
  const UIVersionA = ({ onComplete, onError }) => {
    const [formData, setFormData] = useState({ name: '', email: '', age: '' });
    
    const handleSubmit = () => {
      if (!formData.name || !formData.email || !formData.age) {
        onError();
        alert('Please fill all fields');
        return;
      }
      onComplete();
    };
    
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">User Registration (Version A)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Submit Registration
          </button>
        </div>
      </div>
    );
  };
  
  // UI Version B: Modern Compact Layout
  const UIVersionB = ({ onComplete, onError }) => {
    const [formData, setFormData] = useState({ name: '', email: '', age: '' });
    
    const handleSubmit = () => {
      if (!formData.name || !formData.email || !formData.age) {
        onError();
        alert('Please fill all fields');
        return;
      }
      onComplete();
    };
    
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Sign Up (Version B)</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, age: e.target.value})}
          />
          <button
            onClick={handleSubmit}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 font-medium text-sm shadow-md"
          >
            Get Started →
          </button>
        </div>
      </div>
    );
  };

  const startTest = () => {
    if (!participantId) {
      alert('Please enter a participant ID');
      return;
    }
    const version = Math.random() < 0.5 ? 'A' : 'B';
    setUiVersion(version);
    setCurrentView('testing');
    setStartTime(Date.now());
    setErrors(0);
    setTaskComplete(false);
  };

  const handleTaskComplete = () => {
    const endTime = Date.now();
    const completionTime = (endTime - startTime) / 1000;
    
    const newData = {
      participantId,
      uiVersion,
      completionTime: completionTime.toFixed(2),
      errors,
      accuracy: ((1 - errors / 5) * 100).toFixed(2),
      distance: uiVersion === 'A' ? 450 : 380,
      targetSize: uiVersion === 'A' ? 200 : 240
    };
    
    setTestData([...testData, newData]);
    setTaskComplete(true);
  };

  const handleError = () => {
    setErrors(errors + 1);
  };

  const resetTest = () => {
    setCurrentView('setup');
    setUiVersion(null);
    setParticipantId('');
    setStartTime(null);
    setTaskComplete(false);
    setErrors(0);
  };

  const calculateFittsLaw = (distance, targetSize) => {
    const a = 0.5;
    const b = 0.2;
    const ID = Math.log2(distance / targetSize + 1);
    const MT = a + b * ID;
    return { ID: ID.toFixed(2), MT: MT.toFixed(2) };
  };

  const calculateANOVA = () => {
    const versionA = testData.filter(d => d.uiVersion === 'A').map(d => parseFloat(d.completionTime));
    const versionB = testData.filter(d => d.uiVersion === 'B').map(d => parseFloat(d.completionTime));
    
    if (versionA.length === 0 || versionB.length === 0) return null;
    
    const meanA = versionA.reduce((a, b) => a + b, 0) / versionA.length;
    const meanB = versionB.reduce((a, b) => a + b, 0) / versionB.length;
    const grandMean = [...versionA, ...versionB].reduce((a, b) => a + b, 0) / (versionA.length + versionB.length);
    
    const SSB = versionA.length * Math.pow(meanA - grandMean, 2) + versionB.length * Math.pow(meanB - grandMean, 2);
    const SSW = versionA.reduce((sum, val) => sum + Math.pow(val - meanA, 2), 0) + 
                versionB.reduce((sum, val) => sum + Math.pow(val - meanB, 2), 0);
    
    const dfB = 1;
    const dfW = versionA.length + versionB.length - 2;
    
    const MSB = SSB / dfB;
    const MSW = SSW / dfW;
    const F = MSB / MSW;
    
    return {
      meanA: meanA.toFixed(2),
      meanB: meanB.toFixed(2),
      F: F.toFixed(2),
      dfB,
      dfW,
      significant: F > 4.0
    };
  };

  const exportToCSV = () => {
    const headers = ['Participant ID', 'UI Version', 'Completion Time (s)', 'Errors', 'Accuracy (%)', 'Distance (px)', 'Target Size (px)', 'Index of Difficulty', 'Movement Time'];
    const rows = testData.map(d => {
      const fitts = calculateFittsLaw(d.distance, d.targetSize);
      return [d.participantId, d.uiVersion, d.completionTime, d.errors, d.accuracy, d.distance, d.targetSize, fitts.ID, fitts.MT];
    });
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ab_test_results.csv';
    a.click();
  };

  const anova = testData.length >= 4 ? calculateANOVA() : null;
  
  const chartData = testData.map(d => ({
    name: d.participantId,
    'Version A': d.uiVersion === 'A' ? parseFloat(d.completionTime) : null,
    'Version B': d.uiVersion === 'B' ? parseFloat(d.completionTime) : null
  }));

  const accuracyData = testData.map(d => ({
    participant: d.participantId,
    accuracy: parseFloat(d.accuracy),
    version: d.uiVersion
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">A/B Testing Lab</h1>
          <p className="text-gray-600">UI Comparison with Fitts' Law & ANOVA Analysis</p>
        </div>

        {currentView === 'setup' && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Setup New Test</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Participant ID</label>
              <input
                type="text"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., P001"
              />
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <Play size={20} /> Start Test
            </button>

            {testData.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Test Results ({testData.length} participants)</h3>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download size={18} /> Export CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Participant</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Version</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Time (s)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Errors</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Accuracy (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testData.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{d.participantId}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded ${d.uiVersion === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                              {d.uiVersion}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{d.completionTime}</td>
                          <td className="border border-gray-300 px-4 py-2">{d.errors}</td>
                          <td className="border border-gray-300 px-4 py-2">{d.accuracy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">Completion Time Comparison</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Version A" fill="#3b82f6" />
                        <Bar dataKey="Version B" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">Accuracy by Version</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="participant" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Scatter name="Version A" data={accuracyData.filter(d => d.version === 'A')} fill="#3b82f6" />
                        <Scatter name="Version B" data={accuracyData.filter(d => d.version === 'B')} fill="#8b5cf6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {anova && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h4 className="font-bold text-xl mb-4">ANOVA Results</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-700"><strong>Mean Time (Version A):</strong> {anova.meanA}s</p>
                        <p className="text-gray-700"><strong>Mean Time (Version B):</strong> {anova.meanB}s</p>
                        <p className="text-gray-700"><strong>F-Statistic:</strong> {anova.F}</p>
                      </div>
                      <div>
                        <p className="text-gray-700"><strong>df (Between):</strong> {anova.dfB}</p>
                        <p className="text-gray-700"><strong>df (Within):</strong> {anova.dfW}</p>
                        <p className={`font-bold ${anova.significant ? 'text-green-600' : 'text-orange-600'}`}>
                          {anova.significant ? '✓ Statistically Significant (p < 0.05)' : '✗ Not Significant'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <h5 className="font-bold mb-2">Recommendation:</h5>
                      <p className="text-gray-700">
                        {anova.significant 
                          ? `Version ${parseFloat(anova.meanA) < parseFloat(anova.meanB) ? 'A' : 'B'} performs significantly better with ${parseFloat(anova.meanA) < parseFloat(anova.meanB) ? anova.meanA : anova.meanB}s average completion time.`
                          : 'No significant difference detected. More data needed or consider other metrics.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-4">Fitts' Law Analysis</h4>
                  <div className="space-y-3">
                    {testData.map((d, i) => {
                      const fitts = calculateFittsLaw(d.distance, d.targetSize);
                      return (
                        <div key={i} className="p-3 bg-white rounded border">
                          <p><strong>{d.participantId} (Version {d.uiVersion}):</strong></p>
                          <p className="text-sm text-gray-600">
                            Distance: {d.distance}px, Target Size: {d.targetSize}px →
                            ID: {fitts.ID}, Predicted MT: {fitts.MT}s, Actual: {d.completionTime}s
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'testing' && !taskComplete && (
          <div>
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Testing: Participant {participantId} - Version {uiVersion}</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Errors: {errors}</p>
                  <p className="text-sm text-gray-600">Time: {startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : 0}s</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-8 min-h-[500px] flex items-center justify-center">
              {uiVersion === 'A' ? (
                <UIVersionA onComplete={handleTaskComplete} onError={handleError} />
              ) : (
                <UIVersionB onComplete={handleTaskComplete} onError={handleError} />
              )}
            </div>
          </div>
        )}

        {taskComplete && (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Test Complete!</h2>
            <p className="text-gray-700 mb-6">Participant {participantId} has completed the test.</p>
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={20} /> Return to Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ABTestingUI;