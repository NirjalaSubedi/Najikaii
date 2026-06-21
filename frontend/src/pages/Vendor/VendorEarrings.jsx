import React, { useEffect, useState } from 'react';
import { BarChart3, Wallet, Percent, Calendar, Info, ExternalLink } from 'lucide-react';

const Earnings = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    yourEarnings: 0,
    platformFee: 0,
    thisMonthEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vendor/earnings-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setStats({
          totalRevenue: data.totalRevenue || 0,
          yourEarnings: data.yourEarnings || 0,
          platformFee: data.platformFee || 0,
          thisMonthEarnings: data.thisMonthEarnings || 0
        });
      }
    } catch (error) {
      console.error("Error fetching earnings stats:", error);
      setStats({
        totalRevenue: 0,
        yourEarnings: 0,
        platformFee: 0,
        thisMonthEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm animate-pulse">
        Earnings details are loading, please wait...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-2 text-left">
      {/* Page Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings & Commission</h2>

      {/* Top 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 mb-4">
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1">Total Revenue</p>
        </div>

        {/* Your Earnings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Wallet size={20} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Rs. {stats.yourEarnings.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1">Your Earnings (90%)</p>
        </div>

        {/* Platform Fee */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
            <Percent size={20} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Rs. {stats.platformFee.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1">Platform Fee (10%)</p>
        </div>

        {/* This Month */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
            <BarChart3 size={20} className="text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Rs. {stats.thisMonthEarnings.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-400 mt-1">This Month</p>
        </div>
      </div>

      {/* How Commission Works Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-5">How Commission Works</h3>
        
        {/* Progress Breakdown Bar */}
        <div className="w-full h-8 rounded-xl overflow-hidden flex font-semibold text-xs text-white mb-6">
          <div className="bg-emerald-500 h-full flex items-center justify-center transition-all" style={{ width: '90%' }}>
            90% — You
          </div>
          <div className="bg-rose-400 h-full flex items-center justify-center transition-all" style={{ width: '10%' }}>
            10%
          </div>
        </div>

        {/* Example Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl text-center">
            <p className="text-base font-bold text-gray-900">Rs. 1,000</p>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Sale Amount</p>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-100/40 p-4 rounded-xl text-center">
            <p className="text-base font-bold text-emerald-600">Rs. 900</p>
            <p className="text-[11px] font-semibold text-emerald-500 mt-0.5">Your Earning</p>
          </div>
          <div className="bg-rose-50/50 border border-rose-100/40 p-4 rounded-xl text-center">
            <p className="text-base font-bold text-rose-400">Rs. 100</p>
            <p className="text-[11px] font-semibold text-rose-400 mt-0.5">Platform Fee</p>
          </div>
        </div>

        <p className="text-[11px] font-medium text-gray-400">
          * Delivery charges are collected separately and paid to delivery partners based on distance.
        </p>
      </div>

      {/* Delivery Charge Structure Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Delivery Charge Structure</h3>
        
        <div className="max-w-xl space-y-4 mb-6">
          {/* 0 - 1 km */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 py-1 border-b border-gray-50">
            <span>0 - 1 km</span>
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-md font-bold">Rs. 20</span>
          </div>

          {/* 1 - 2 km */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 py-1 border-b border-gray-50">
            <span>1 - 2 km</span>
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-md font-bold">Rs. 30</span>
          </div>

          {/* 2 - 3 km */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 py-1 border-b border-gray-50">
            <span>2 - 3 km</span>
            <span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-md font-bold">Rs. 40</span>
          </div>

          {/* 3 - 5 km */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 py-1 border-b border-gray-50">
            <span>3 - 5 km</span>
            <span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-md font-bold">Rs. 55</span>
          </div>

          {/* 5+ km */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 py-1">
            <span>5+ km</span>
            <span className="bg-rose-50 text-rose-500 px-2.5 py-0.5 rounded-md font-bold">Rs. 70+</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-gray-400">
          * Delivery charges are paid by the customer and go directly to the delivery partner. Not deducted from your earnings.
        </p>
      </div>
    </div>
  );
};

export default Earnings;