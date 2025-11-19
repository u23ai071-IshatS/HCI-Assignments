import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, MapPin, Truck, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function CheckoutWireframe() {
  const [step, setStep] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [stepTimes, setStepTimes] = useState({});
  const [stepStartTime, setStepStartTime] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Wireless Headphones', price: 79.99, qty: 1 },
    { id: 2, name: 'Phone Case', price: 19.99, qty: 2 }
  ]);

  // Form states
  const [authMethod, setAuthMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: '', address: '', city: '', zip: ''
  });
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', expiry: '', cvv: '', billingName: ''
  });

  useEffect(() => {
    if (step === 1 && !startTime) {
      setStartTime(Date.now());
      setStepStartTime(Date.now());
    }
  }, [step, startTime]);

  const recordStepTime = (stepNumber) => {
    if (stepStartTime) {
      const duration = Date.now() - stepStartTime;
      setStepTimes(prev => ({ ...prev, [stepNumber]: duration }));
      setStepStartTime(Date.now());
    }
  };

  const nextStep = () => {
    recordStepTime(step);
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const startTest = () => {
    setIsTestMode(true);
    setStep(1);
    setStartTime(Date.now());
    setStepStartTime(Date.now());
    setStepTimes({});
    setCurrentTest({ startTime: Date.now() });
  };

  const completeTest = () => {
    const totalTime = Date.now() - startTime;
    const testResult = {
      id: testResults.length + 1,
      totalTime,
      stepTimes: { ...stepTimes, 7: Date.now() - stepStartTime },
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults([...testResults, testResult]);
    setIsTestMode(false);
    setCurrentTest(null);
  };

  const resetSimulation = () => {
    setStep(1);
    setStartTime(null);
    setStepStartTime(null);
    setStepTimes({});
    setAuthMethod('');
    setShippingAddress({ name: '', address: '', city: '', zip: '' });
    setShippingMethod('');
    setPaymentInfo({ cardNumber: '', expiry: '', cvv: '', billingName: '' });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, qty: newQty } : item
      ));
    }
  };

  const formatTime = (ms) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getBottlenecks = () => {
    if (testResults.length === 0) return [];
    
    const avgTimes = {};
    Object.keys(testResults[0].stepTimes).forEach(step => {
      const times = testResults.map(r => r.stepTimes[step]).filter(t => t);
      avgTimes[step] = times.reduce((a, b) => a + b, 0) / times.length;
    });

    const sorted = Object.entries(avgTimes).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3);
  };

  const stepNames = {
    1: 'Review Cart',
    2: 'Authentication',
    3: 'Shipping Address',
    4: 'Shipping Method',
    5: 'Payment Details',
    6: 'Review Order',
    7: 'Order Confirmation'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">E-Commerce Checkout Wireframe</h1>
            <div className="flex gap-2">
              {!isTestMode ? (
                <button
                  onClick={startTest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Start Test
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  Testing in progress...
                </div>
              )}
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div key={s} className={`flex-1 text-center ${s < 7 ? 'mr-2' : ''}`}>
                  <div className={`h-2 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <p className={`text-xs mt-1 ${step === s ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                    Step {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
              {/* Step 1: Review Cart */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Review Your Cart</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                          <span className="ml-4 font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}

              {/* Step 2: Authentication */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Sign In or Continue as Guest</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAuthMethod('signin')}
                      className={`p-6 border-2 rounded-lg ${authMethod === 'signin' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <User className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold mb-2">Sign In</h3>
                      <p className="text-sm text-gray-600">Access saved addresses and faster checkout</p>
                    </button>

                    <button
                      onClick={() => setAuthMethod('guest')}
                      className={`p-6 border-2 rounded-lg ${authMethod === 'guest' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <h3 className="font-semibold mb-2">Guest Checkout</h3>
                      <p className="text-sm text-gray-600">Continue without an account</p>
                    </button>
                  </div>

                  {authMethod === 'signin' && (
                    <div className="mt-6 space-y-4">
                      <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
                      <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  )}

                  {authMethod === 'guest' && (
                    <div className="mt-6 space-y-4">
                      <input type="email" placeholder="Email for order confirmation" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!authMethod}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Shipping Address */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Shipping Address</h2>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!shippingAddress.name || !shippingAddress.address}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Shipping Method */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Select Shipping Method</h2>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShippingMethod('standard')}
                      className={`w-full p-4 border-2 rounded-lg text-left ${shippingMethod === 'standard' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Standard Shipping</p>
                          <p className="text-sm text-gray-600">5-7 business days</p>
                        </div>
                        <span className="font-semibold">$5.99</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShippingMethod('express')}
                      className={`w-full p-4 border-2 rounded-lg text-left ${shippingMethod === 'express' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Express Shipping</p>
                          <p className="text-sm text-gray-600">2-3 business days</p>
                        </div>
                        <span className="font-semibold">$12.99</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShippingMethod('overnight')}
                      className={`w-full p-4 border-2 rounded-lg text-left ${shippingMethod === 'overnight' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Overnight Shipping</p>
                          <p className="text-sm text-gray-600">Next business day</p>
                        </div>
                        <span className="font-semibold">$24.99</span>
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!shippingMethod}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {step === 5 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Payment Information</h2>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      maxLength="16"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        maxLength="3"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={paymentInfo.billingName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, billingName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!paymentInfo.cardNumber || !paymentInfo.billingName}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Review Order */}
              {step === 6 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold">Review Your Order</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Items</h3>
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm py-1">
                          <span>{item.name} x{item.qty}</span>
                          <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Shipping To</h3>
                      <p className="text-sm text-gray-600">{shippingAddress.name}</p>
                      <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">{shippingAddress.city}, {shippingAddress.zip}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600">Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Shipping:</span>
                        <span>${shippingMethod === 'standard' ? '5.99' : shippingMethod === 'express' ? '12.99' : '24.99'}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${(parseFloat(getTotalPrice()) + (shippingMethod === 'standard' ? 5.99 : shippingMethod === 'express' ? 12.99 : 24.99)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={prevStep} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 7: Confirmation */}
              {step === 7 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">Your order has been successfully placed.</p>
                  <p className="text-sm text-gray-500 mb-8">Order #12345678</p>
                  
                  {startTime && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-blue-900">Total Time: {formatTime(Date.now() - startTime)}</p>
                    </div>
                  )}

                  {isTestMode && (
                    <button
                      onClick={completeTest}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Complete Test & Record Results
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timing Panel */}
            {startTime && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Current Session
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Elapsed Time:</span>
                    <span className="font-semibold">{formatTime(Date.now() - startTime)}</span>
                  </div>
                  {Object.entries(stepTimes).map(([s, time]) => (
                    <div key={s} className="flex justify-between text-sm text-gray-600">
                      <span>Step {s}:</span>
                      <span>{formatTime(time)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold mb-3">Test Results</h3>
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className="border-b pb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">Test #{result.id}</span>
                        <span className="text-gray-600">{result.timestamp}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">Total: </span>
                        <span>{formatTime(result.totalTime)}</span>
                      </div>
                    </div>
                  ))}

                  {testResults.length > 1 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold mb-1">Average Time:</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatTime(testResults.reduce((sum, r) => sum + r.totalTime, 0) / testResults.length)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottlenecks */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Bottlenecks
                </h3>
                <div className="space-y-2">
                  {getBottlenecks().map(([step, time], index) => (
                    <div key={step} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{index + 1}. {stepNames[step]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(time / Math.max(...getBottlenecks().map(b => b[1]))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{formatTime(time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}