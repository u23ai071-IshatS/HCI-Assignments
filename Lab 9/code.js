import React, { useState, useEffect } from 'react';
import { Timer, FileText, BarChart3, Download, User, Play, Pause, RotateCcw } from 'lucide-react';

const MHPTypingTest = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [participant, setParticipant] = useState({
    id: '',
    age: '',
    nativeLanguage: '',
    experience: ''
  });
  
  const [testData, setTestData] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState(0);

  const texts = {
    english: "The quick brown fox jumps over the lazy dog near the riverbank.",
    hindi: "तेज भूरी लोमड़ी आलसी कुत्ते के ऊपर नदी किनारे कूदती है।"
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTest = (language) => {
    setCurrentTest({
      language,
      targetText: texts[language],
      startTime: Date.now()
    });
    setTypedText('');
    setTimer(0);
    setErrors(0);
    setIsRunning(true);
    setCurrentScreen('test');
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setTypedText(value);
    
    const target = currentTest.targetText;
    let errorCount = 0;
    
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== target[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
  };

  const finishTest = () => {
    setIsRunning(false);
    
    const finalErrors = errors + Math.max(0, currentTest.targetText.length - typedText.length);
    const accuracy = ((currentTest.targetText.length - finalErrors) / currentTest.targetText.length * 100).toFixed(2);
    const wpm = ((typedText.length / 5) / (timer / 60000)).toFixed(2);
    const timePerChar = (timer / typedText.length).toFixed(2);
    
    const result = {
      participant: participant.id,
      language: currentTest.language,
      totalTime: (timer / 1000).toFixed(2),
      errors: finalErrors,
      accuracy: accuracy,
      wpm: wpm,
      timePerChar: timePerChar,
      targetLength: currentTest.targetText.length,
      typedLength: typedText.length
    };
    
    setTestData([...testData, result]);
    setCurrentScreen('results');
  };

  const calculateMHPStages = (timePerChar) => {
    const perception = (timePerChar * 0.30).toFixed(2);
    const cognition = (timePerChar * 0.25).toFixed(2);
    const motor = (timePerChar * 0.35).toFixed(2);
    const correction = (timePerChar * 0.10).toFixed(2);
    
    return { perception, cognition, motor, correction };
  };

  const exportData = () => {
    const csv = [
      ['Participant', 'Language', 'Time(s)', 'Errors', 'Accuracy(%)', 'WPM', 'Time/Char(ms)'],
      ...testData.map(d => [
        d.participant,
        d.language,
        d.totalTime,
        d.errors,
        d.accuracy,
        d.wpm,
        d.timePerChar
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mhp_typing_test_results.csv';
    a.click();
  };

  const getComparison = () => {
    const englishData = testData.filter(d => d.language === 'english');
    const hindiData = testData.filter(d => d.language === 'hindi');
    
    if (englishData.length === 0 || hindiData.length === 0) return null;
    
    const avgTimeEng = (englishData.reduce((sum, d) => sum + parseFloat(d.totalTime), 0) / englishData.length).toFixed(2);
    const avgTimeHin = (hindiData.reduce((sum, d) => sum + parseFloat(d.totalTime), 0) / hindiData.length).toFixed(2);
    
    const avgErrorsEng = (englishData.reduce((sum, d) => sum + d.errors, 0) / englishData.length).toFixed(2);
    const avgErrorsHin = (hindiData.reduce((sum, d) => sum + d.errors, 0) / hindiData.length).toFixed(2);
    
    const avgWPMEng = (englishData.reduce((sum, d) => sum + parseFloat(d.wpm), 0) / englishData.length).toFixed(2);
    const avgWPMHin = (hindiData.reduce((sum, d) => sum + parseFloat(d.wpm), 0) / hindiData.length).toFixed(2);
    
    return {
      avgTimeEng, avgTimeHin,
      avgErrorsEng, avgErrorsHin,
      avgWPMEng, avgWPMHin,
      timeDiff: ((avgTimeHin - avgTimeEng) / avgTimeEng * 100).toFixed(2)
    };
  };

  if (currentScreen === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">MHP Typing Test Setup</h1>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Participant ID</label>
              <input
                type="text"
                value={participant.id}
                onChange={(e) => setParticipant({...participant, id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., P001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={participant.age}
                onChange={(e) => setParticipant({...participant, age: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 25"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Native Language</label>
              <select
                value={participant.nativeLanguage}
                onChange={(e) => setParticipant({...participant, nativeLanguage: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Typing Experience</label>
              <select
                value={participant.experience}
                onChange={(e) => setParticipant({...participant, experience: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Beginner">Beginner (0-1 year)</option>
                <option value="Intermediate">Intermediate (1-3 years)</option>
                <option value="Advanced">Advanced (3+ years)</option>
              </select>
            </div>
            
            <button
              onClick={() => setCurrentScreen('language')}
              disabled={!participant.id || !participant.age || !participant.nativeLanguage || !participant.experience}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Language to Test</h2>
            <p className="text-gray-600 mb-6">Participant: {participant.id}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => startTest('english')}
                className="bg-blue-500 text-white p-8 rounded-xl hover:bg-blue-600 transition transform hover:scale-105"
              >
                <FileText className="mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-2">English Test</h3>
                <p className="text-sm opacity-90">Type the English text</p>
              </button>
              
              <button
                onClick={() => startTest('hindi')}
                className="bg-orange-500 text-white p-8 rounded-xl hover:bg-orange-600 transition transform hover:scale-105"
              >
                <FileText className="mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-2">Hindi Test</h3>
                <p className="text-sm opacity-90">हिंदी टेक्स्ट टाइप करें</p>
              </button>
            </div>
            
            {testData.length > 0 && (
              <button
                onClick={() => setCurrentScreen('analysis')}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                View Results & Analysis
              </button>
            )}
          </div>
          
          {testData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Completed Tests</h3>
              <div className="space-y-2">
                {testData.map((test, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{test.language}</span>
                    <span className="text-sm text-gray-600">Time: {test.totalTime}s | Errors: {test.errors} | WPM: {test.wpm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'test') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{currentTest.language} Typing Test</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                <Timer className="text-blue-600" />
                <span className="font-mono text-xl font-bold text-blue-600">
                  {Math.floor(timer / 60000)}:{String(Math.floor((timer % 60000) / 1000)).padStart(2, '0')}:{String(Math.floor((timer % 1000) / 10)).padStart(2, '0')}
                </span>
              </div>
              <div className="bg-red-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-red-600">Errors: {errors}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-lg leading-relaxed text-gray-700 font-medium">
              {currentTest.targetText}
            </p>
          </div>
          
          <textarea
            value={typedText}
            onChange={handleTyping}
            className="w-full h-40 p-4 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            placeholder="Start typing here..."
            autoFocus
          />
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={finishTest}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Finish Test
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setCurrentScreen('language');
              }}
              className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Instructions:</strong> Type the text exactly as shown above. Timer started automatically. Click "Finish Test" when done.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results') {
    const lastResult = testData[testData.length - 1];
    const mhpStages = calculateMHPStages(parseFloat(lastResult.timePerChar));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Test Results</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Time</h3>
                <p className="text-3xl font-bold text-blue-600">{lastResult.totalTime}s</p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Errors</h3>
                <p className="text-3xl font-bold text-red-600">{lastResult.errors}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Accuracy</h3>
                <p className="text-3xl font-bold text-green-600">{lastResult.accuracy}%</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Words Per Minute</h3>
                <p className="text-3xl font-bold text-purple-600">{lastResult.wpm}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">MHP Stage Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Perception (30%)</span>
                    <span className="text-sm font-bold">{mhpStages.perception}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Cognition (25%)</span>
                    <span className="text-sm font-bold">{mhpStages.cognition}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Motor (35%)</span>
                    <span className="text-sm font-bold">{mhpStages.motor}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Error Correction (10%)</span>
                    <span className="text-sm font-bold">{mhpStages.correction}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{width: '10%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentScreen('language')}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Take Another Test
              </button>
              <button
                onClick={() => setCurrentScreen('analysis')}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'analysis') {
    const comparison = getComparison();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Complete Analysis</h2>
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Download size={20} />
                Export CSV
              </button>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Test Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Participant</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Language</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time (s)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Errors</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Accuracy (%)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">WPM</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time/Char (ms)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testData.map((test, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{test.participant}</td>
                        <td className="px-4 py-3 text-sm capitalize">{test.language}</td>
                        <td className="px-4 py-3 text-sm font-medium">{test.totalTime}</td>
                        <td className="px-4 py-3 text-sm">{test.errors}</td>
                        <td className="px-4 py-3 text-sm">{test.accuracy}</td>
                        <td className="px-4 py-3 text-sm">{test.wpm}</td>
                        <td className="px-4 py-3 text-sm">{test.timePerChar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {comparison && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Hindi vs English Comparison</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Average Time</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">English:</span>
                        <span className="text-lg font-bold text-blue-600">{comparison.avgTimeEng}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hindi:</span>
                        <span className="text-lg font-bold text-orange-600">{comparison.avgTimeHin}s</span>
                      </div>
                      <div className="pt-2 border-t border-gray-300">
                        <span className="text-xs text-gray-600">Difference: +{comparison.timeDiff}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Average Errors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">English:</span>
                        <span className="text-lg font-bold text-blue-600">{comparison.avgErrorsEng}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hindi:</span>
                        <span className="text-lg font-bold text-orange-600">{comparison.avgErrorsHin}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Average WPM</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">English:</span>
                        <span className="text-lg font-bold text-blue-600">{comparison.avgWPMEng}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hindi:</span>
                        <span className="text-lg font-bold text-orange-600">{comparison.avgWPMHin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Key Findings</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Hindi typing generally takes longer due to complex character formation</li>
                <li>• Cognitive load is higher for Hindi due to multiple keystrokes per character</li>
                <li>• Error rates tend to be higher in Hindi typing, especially for conjuncts and matras</li>
                <li>• Motor stage shows increased time for Hindi due to modifier key usage</li>
                <li>• Practice and familiarity significantly impact performance in both languages</li>
              </ul>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setCurrentScreen('language')}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Add More Tests
              </button>
              <button
                onClick={() => {
                  setTestData([]);
                  setCurrentScreen('setup');
                }}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                New Participant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MHPTypingTest;