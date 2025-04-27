import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Smile, Truck, Users, Clock } from 'lucide-react';

const Counter = ({ end, label, Icon }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 3500;
        const incrementTime = 100;
        const totalIncrements = duration / incrementTime;
        const increment = end / totalIncrements;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setCount(Math.floor(start));
        }, incrementTime);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="relative aspect-square bg-white/20 backdrop-blur-md border border-gray-200 rounded-3xl p-4 shadow-xl hover:scale-105 transition-transform duration-500 group overflow-hidden w-full">

            <div className="absolute inset-0  rounded-3xl border-2 border-transparent group-hover:border-primary animate-border-gradient"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <Icon className="w-8 h-8 md:w-12 md:h-12 text-primary mb-4"
                />
                <span className="text-2xl md:text-4xl font-extrabold text-gray-800"
                >{count}</span>
                <span className="text-sm md:text-lg text-gray-700 mt-2"
                >{label}</span>
            </div>
        </div>
    );
};

const StatsCounters = ({ children }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/site-stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching site stats:', error);
            }
        };

        fetchStats();
    }, []);

    if (!stats) {
        return <p className="text-center my-10 text-gray-600">טוען נתונים...</p>;
    }

    return (
        <div className="relative  grid grid-cols-2 md:grid-cols-4 gap-4 p-16 md:gap-10 md:p-16 mx-auto max-w-7xl bg-gradient-to-r from-green-100 via-white to-red-100 rounded-3xl shadow-2xl">
            {children}
            <Counter end={stats.clients} label="לקוחות מרוצים" Icon={Smile} />
            <Counter end={stats.supplyPoints} label="נקודות אספקה" Icon={Truck} />
            <Counter end={stats.onlineUsers} label="מחוברים כרגע" Icon={Users} />
            <Counter end={stats.lastOrderMinutes} label="דקות מההזמנה האחרונה" Icon={Clock} />
        </div>
    );
};

export default StatsCounters;
