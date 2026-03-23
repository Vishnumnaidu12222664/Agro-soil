import { motion } from "framer-motion";
import { 
  Sprout, 
  Droplets, 
  TrendingUp, 
  Trees, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar,
  Zap
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const stats = [
  { label: "Total Analysis", value: "1,280", icon: Activity, trend: "+12.5%", positive: true, color: "emerald" },
  { label: "Recommended Crops", value: "342", icon: Sprout, trend: "+5.2%", positive: true, color: "blue" },
  { label: "Avg. Yield Increase", value: "24.5%", icon: Zap, trend: "+18.3%", positive: true, color: "amber" },
  { label: "Market Growth", value: "Rs. 1.2M", icon: TrendingUp, trend: "-2.1%", positive: false, color: "rose" },
];

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const Dashboard = () => {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            Dashboard <span className="text-emerald-600">Overview</span>
          </h1>
          <p className="text-gray-600 font-semibold mt-1">
            Real-time agricultural intelligence and farm performance metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Select Range
          </Button>
          <Button className="gap-2">
            <Activity className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="h-16 w-16" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">{stat.label}</p>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{stat.value}</h3>
                <div className={`flex items-center text-[10px] font-bold ${stat.positive ? "text-emerald-600" : "text-rose-600"} bg-gray-50 px-2 py-1 rounded-lg border border-gray-100`}>
                  {stat.positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800">Yield Analytics</h3>
            <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  cursor={{stroke: '#10b981', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions / Recent Activity */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-none relative overflow-hidden group h-full shadow-lg shadow-gray-900/20">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-200" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Quick Analysis</h3>
                <p className="text-gray-400 font-semibold mt-2">Start a new soil test or crop recommendation instantly.</p>
              </div>
              <div className="space-y-3 mt-8">
                <Button className="w-full justify-between group/btn bg-white/10 text-white hover:bg-emerald-600 hover:text-white border-0">
                  New Soil Test
                  <Droplets className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button className="w-full justify-between group/btn bg-white/10 text-white hover:bg-emerald-600 hover:text-white border-0">
                  Recommended Crops
                  <Trees className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                  View History
                </Button>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500">
              <Trees className="h-24 w-24 text-emerald-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
