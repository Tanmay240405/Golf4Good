import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart2 } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await adminService.getReports();
      setReportData(data.chartData || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData.length) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Month,New Users'];
    const rows = reportData.map(item => `${item.name},${item.users}`);
    const csvContent = headers.concat(rows).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `platform_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported Successfully!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Reports</h1>
          <p className="text-text-secondary">Analyze growth and export platform data.</p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2rem] p-8 border border-white/5 min-h-[400px] flex flex-col"
        >
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <BarChart2 className="w-6 h-6 text-accent" /> User Growth by Month
           </h2>
           
           {loading ? (
             <div className="flex-1 flex justify-center items-center">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : reportData.length === 0 ? (
             <div className="flex-1 flex justify-center items-center text-text-muted">No data available</div>
           ) : (
             <div className="flex-1 flex items-end justify-around gap-4 mt-12 px-4 h-[250px]">
               {/* Simple custom bar chart representation for wow effect without complex libraries */}
               {reportData.map((item, index) => {
                 const maxUsers = Math.max(...reportData.map(d => d.users), 1);
                 // Cap height to 90% so label fits above
                 const heightPercent = Math.max((item.users / maxUsers) * 90, 5); 
                 return (
                   <div key={index} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group max-w-[100px]">
                     <div className="w-full relative flex items-end justify-center h-full">
                       <div 
                         className="w-full bg-gradient-to-t from-accent to-gold rounded-t-xl opacity-80 group-hover:opacity-100 transition-all duration-500 relative flex justify-center" 
                         style={{ height: `${heightPercent}%` }}
                       >
                         <div className="absolute -top-8 text-center text-white font-bold text-sm bg-black/50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                           {item.users}
                         </div>
                       </div>
                     </div>
                     <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{item.name}</span>
                   </div>
                 );
               })}
             </div>
           )}
        </motion.div>
      </div>
    </div>
  );
}
