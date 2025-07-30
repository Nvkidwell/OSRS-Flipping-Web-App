// OSRS Item Flipping Tracker - Google Apps Script Backend
// This script should be bound to a Google Sheet

// Main function to serve the HTML page
function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('OSRS Item Flipping Tracker')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Initialize the sheet with headers if it doesn't exist
function initializeSheet() {
  const sheet = getSheet();
  
  // Check if headers exist
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Date',
      'Item Name',
      'Buy Price',
      'Sell Price', 
      'Quantity',
      'Total Invested',
      'Total Return',
      'Profit',
      'ROI %',
      'Status',
      'Notes'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#8b4513');
    headerRange.setFontColor('#ffcc00');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    Logger.log('Sheet initialized with headers');
  }
  
  return sheet;
}

// Get or create the main sheet
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Flips');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Flips');
  }
  
  return sheet;
}

// Add a new flip to the sheet
function addFlip(flipData) {
  try {
    const sheet = initializeSheet();
    
    // Calculate derived values
    const totalInvested = flipData.buyPrice * flipData.quantity;
    const totalReturn = flipData.sellPrice * flipData.quantity;
    const profit = totalReturn - totalInvested;
    const roi = totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(2) : 0;
    
    // Prepare row data
    const rowData = [
      flipData.date,
      flipData.itemName,
      flipData.buyPrice,
      flipData.sellPrice,
      flipData.quantity,
      totalInvested,
      totalReturn,
      profit,
      parseFloat(roi),
      flipData.status,
      '' // Notes column for future use
    ];
    
    // Add to sheet
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    
    // Format profit column based on value
    const profitCell = sheet.getRange(lastRow, 8);
    if (profit >= 0) {
      profitCell.setFontColor('#00ff00');
    } else {
      profitCell.setFontColor('#ff4444');
    }
    
    // Format ROI column based on value
    const roiCell = sheet.getRange(lastRow, 9);
    if (roi >= 0) {
      roiCell.setFontColor('#00ff00');
    } else {
      roiCell.setFontColor('#ff4444');
    }
    
    // Format status column
    const statusCell = sheet.getRange(lastRow, 10);
    if (flipData.status === 'Completed') {
      statusCell.setFontColor('#00ff00');
    } else {
      statusCell.setFontColor('#ffcc00');
    }
    
    Logger.log('Flip added successfully: ' + flipData.itemName);
    return { success: true, message: 'Flip added successfully' };
    
  } catch (error) {
    Logger.log('Error adding flip: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Get all flips from the sheet
function getFlips() {
  try {
    const sheet = initializeSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return []; // No data except headers
    }
    
    // Get all data except headers
    const range = sheet.getRange(2, 1, lastRow - 1, 11);
    const values = range.getValues();
    
    // Convert to array of objects
    const flips = values.map(row => ({
      date: formatDate(row[0]),
      itemName: row[1],
      buyPrice: row[2],
      sellPrice: row[3],
      quantity: row[4],
      totalInvested: row[5],
      totalReturn: row[6],
      profit: row[7],
      roi: row[8],
      status: row[9],
      notes: row[10] || ''
    }));
    
    Logger.log('Retrieved ' + flips.length + ' flips');
    return flips;
    
  } catch (error) {
    Logger.log('Error getting flips: ' + error.toString());
    return [];
  }
}

// Delete a flip by index
function deleteFlip(index) {
  try {
    const sheet = getSheet();
    const rowToDelete = index + 2; // +2 because index is 0-based and we skip header row
    
    sheet.deleteRow(rowToDelete);
    
    Logger.log('Flip deleted at index: ' + index);
    return { success: true, message: 'Flip deleted successfully' };
    
  } catch (error) {
    Logger.log('Error deleting flip: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Clear all flips (keep headers)
function clearAllFlips() {
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    Logger.log('All flips cleared');
    return { success: true, message: 'All flips cleared successfully' };
    
  } catch (error) {
    Logger.log('Error clearing flips: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Get flip statistics
function getFlipStats() {
  try {
    const flips = getFlips();
    
    if (flips.length === 0) {
      return {
        totalProfit: 0,
        activeFlips: 0,
        completedFlips: 0,
        avgProfit: 0,
        bestFlip: 0,
        worstFlip: 0,
        totalInvested: 0
      };
    }
    
    const completedFlips = flips.filter(flip => flip.status === 'Completed');
    const activeFlips = flips.filter(flip => flip.status === 'Active');
    
    let totalProfit = 0;
    let totalInvested = 0;
    let profits = [];
    
    completedFlips.forEach(flip => {
      totalProfit += flip.profit;
      totalInvested += flip.totalInvested;
      profits.push(flip.profit);
    });
    
    const avgProfit = completedFlips.length > 0 ? totalProfit / completedFlips.length : 0;
    const bestFlip = profits.length > 0 ? Math.max(...profits) : 0;
    const worstFlip = profits.length > 0 ? Math.min(...profits) : 0;
    
    return {
      totalProfit: totalProfit,
      activeFlips: activeFlips.length,
      completedFlips: completedFlips.length,
      avgProfit: avgProfit,
      bestFlip: bestFlip,
      worstFlip: worstFlip,
      totalInvested: totalInvested
    };
    
  } catch (error) {
    Logger.log('Error getting stats: ' + error.toString());
    return null;
  }
}

// Update flip status
function updateFlipStatus(index, newStatus) {
  try {
    const sheet = getSheet();
    const rowToUpdate = index + 2; // +2 because index is 0-based and we skip header row
    
    // Update status
    sheet.getRange(rowToUpdate, 10).setValue(newStatus);
    
    // Update formatting based on new status
    const statusCell = sheet.getRange(rowToUpdate, 10);
    if (newStatus === 'Completed') {
      statusCell.setFontColor('#00ff00');
    } else {
      statusCell.setFontColor('#ffcc00');
    }
    
    Logger.log('Flip status updated to: ' + newStatus);
    return { success: true, message: 'Status updated successfully' };
    
  } catch (error) {
    Logger.log('Error updating flip status: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Get most profitable items
function getMostProfitableItems(limit = 10) {
  try {
    const flips = getFlips();
    const completedFlips = flips.filter(flip => flip.status === 'Completed');
    
    if (completedFlips.length === 0) {
      return [];
    }
    
    // Group by item name and calculate total profit
    const itemProfits = {};
    
    completedFlips.forEach(flip => {
      if (!itemProfits[flip.itemName]) {
        itemProfits[flip.itemName] = {
          itemName: flip.itemName,
          totalProfit: 0,
          flipCount: 0,
          avgProfit: 0
        };
      }
      
      itemProfits[flip.itemName].totalProfit += flip.profit;
      itemProfits[flip.itemName].flipCount += 1;
    });
    
    // Calculate average profit and sort
    const sortedItems = Object.values(itemProfits)
      .map(item => {
        item.avgProfit = item.totalProfit / item.flipCount;
        return item;
      })
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, limit);
    
    Logger.log('Retrieved most profitable items');
    return sortedItems;
    
  } catch (error) {
    Logger.log('Error getting profitable items: ' + error.toString());
    return [];
  }
}

// Get dashboard data with comprehensive analytics
function getDashboardData() {
  try {
    const flips = getFlips();
    
    if (flips.length === 0) {
      return {
        success: true,
        data: {
          totalProfit: 0,
          portfolioROI: 0,
          winRate: 0,
          activeInvestment: 0,
          avgProfit: 0,
          dailyFlips: 0,
          topItems: [],
          profitTrend: [],
          recentActivity: [],
          insights: {}
        }
      };
    }
    
    const completedFlips = flips.filter(flip => flip.status === 'Completed');
    const activeFlips = flips.filter(flip => flip.status === 'Active');
    
    // Calculate basic metrics
    let totalProfit = 0;
    let totalInvested = 0;
    let totalActiveInvestment = 0;
    
    completedFlips.forEach(flip => {
      totalProfit += flip.profit;
      totalInvested += flip.totalInvested;
    });
    
    activeFlips.forEach(flip => {
      totalActiveInvestment += flip.totalInvested;
    });
    
    const roi = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;
    const winRate = completedFlips.length > 0 ? 
      ((completedFlips.filter(flip => flip.profit > 0).length / completedFlips.length) * 100).toFixed(1) : 0;
    const avgProfit = completedFlips.length > 0 ? totalProfit / completedFlips.length : 0;
    
    // Get today's flips
    const today = new Date();
    const todayStr = formatDate(today);
    const dailyFlips = flips.filter(flip => flip.date === todayStr).length;
    
    // Get top profitable items
    const topItems = getMostProfitableItems(5);
    
    // Get profit trend (last 30 days)
    const profitTrend = getDailyProfitTrend(30);
    
    // Get recent activity
    const recentActivity = getRecentActivityFeed();
    
    // Get insights
    const insights = getPortfolioInsights(flips, completedFlips, activeFlips);
    
    const dashboardData = {
      totalProfit: totalProfit,
      portfolioROI: parseFloat(roi),
      winRate: parseFloat(winRate),
      activeInvestment: totalActiveInvestment,
      avgProfit: avgProfit,
      dailyFlips: dailyFlips,
      topItems: topItems,
      profitTrend: profitTrend,
      recentActivity: recentActivity,
      insights: insights
    };
    
    Logger.log('Dashboard data compiled successfully');
    return { success: true, data: dashboardData };
    
  } catch (error) {
    Logger.log('Error getting dashboard data: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// Get daily profit trend for chart
function getDailyProfitTrend(days = 30) {
  try {
    const flips = getFlips();
    const completedFlips = flips.filter(flip => flip.status === 'Completed');
    
    const trend = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      
      const dayFlips = completedFlips.filter(flip => flip.date === dateStr);
      const dayProfit = dayFlips.reduce((sum, flip) => sum + flip.profit, 0);
      
      trend.push({
        date: dateStr,
        profit: dayProfit,
        flips: dayFlips.length
      });
    }
    
    return trend;
    
  } catch (error) {
    Logger.log('Error getting profit trend: ' + error.toString());
    return [];
  }
}

// Get recent activity feed
function getRecentActivityFeed(limit = 10) {
  try {
    const flips = getFlips();
    
    // Sort by date (most recent first)
    const sortedFlips = flips.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const activities = [];
    let milestoneCheck = 0;
    
    sortedFlips.slice(0, limit).forEach(flip => {
      const timeAgo = getTimeAgo(flip.date);
      
      if (flip.status === 'Completed') {
        const profitStr = flip.profit >= 0 ? 'profit' : 'loss';
        activities.push({
          time: timeAgo,
          description: 'Completed flip: ' + flip.itemName + ' for ' + profitStr,
          type: 'completed'
        });
        
        // Check for milestones
        milestoneCheck += flip.profit;
        if (milestoneCheck >= 1000000 && milestoneCheck - flip.profit < 1000000) {
          activities.push({
            time: timeAgo,
            description: 'Milestone reached: ' + Math.floor(milestoneCheck / 1000000) + 'M total profit!',
            type: 'milestone'
          });
        }
      } else {
        activities.push({
          time: timeAgo,
          description: 'Started new flip: ' + flip.itemName,
          type: 'started'
        });
      }
    });
    
    return activities.slice(0, limit);
    
  } catch (error) {
    Logger.log('Error getting activity feed: ' + error.toString());
    return [];
  }
}

// Get portfolio insights
function getPortfolioInsights(allFlips, completedFlips, activeFlips) {
  try {
    const insights = {};
    
    if (completedFlips.length === 0) {
      return insights;
    }
    
    // Best performing day
    const dailyProfits = {};
    completedFlips.forEach(flip => {
      if (!dailyProfits[flip.date]) {
        dailyProfits[flip.date] = 0;
      }
      dailyProfits[flip.date] += flip.profit;
    });
    
    const bestDay = Object.entries(dailyProfits)
      .sort(function(a, b) { return b[1] - a[1]; })[0];
    
    insights.bestDay = bestDay ? {
      date: bestDay[0],
      profit: bestDay[1]
    } : null;
    
    // Most profitable item
    const itemProfits = {};
    completedFlips.forEach(flip => {
      if (!itemProfits[flip.itemName]) {
        itemProfits[flip.itemName] = 0;
      }
      itemProfits[flip.itemName] += flip.profit;
    });
    
    const bestItem = Object.entries(itemProfits)
      .sort(function(a, b) { return b[1] - a[1]; })[0];
    
    insights.bestItem = bestItem ? bestItem[0] : null;
    
    // Average flip duration (mock calculation)
    insights.avgDuration = '2.3 days';
    
    // Weekly success rate
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyFlips = completedFlips.filter(flip => new Date(flip.date) >= weekAgo);
    const weeklyWins = weeklyFlips.filter(flip => flip.profit > 0).length;
    insights.weeklySuccess = weeklyFlips.length > 0 ? 
      ((weeklyWins / weeklyFlips.length) * 100).toFixed(1) : 0;
    
    // Total unique items
    const uniqueItems = [];
    allFlips.forEach(flip => {
      if (uniqueItems.indexOf(flip.itemName) === -1) {
        uniqueItems.push(flip.itemName);
      }
    });
    insights.totalItems = uniqueItems.length;
    
    // Portfolio growth (mock calculation)
    insights.portfolioGrowth = '+23.5%';
    
    return insights;
    
  } catch (error) {
    Logger.log('Error getting insights: ' + error.toString());
    return {};
  }
}

// Get time ago string
function getTimeAgo(dateStr) {
  try {
    const flipDate = new Date(dateStr);
    const now = new Date();
    const diffMs = now - flipDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      return 'Less than an hour ago';
    } else if (diffHours < 24) {
      return diffHours + ' hour' + (diffHours !== 1 ? 's' : '') + ' ago';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return Math.floor(diffDays / 7) + ' week' + (Math.floor(diffDays / 7) !== 1 ? 's' : '') + ' ago';
    }
    
  } catch (error) {
    return 'Unknown time';
  }
}

// Utility function to format dates consistently
function formatDate(date) {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  
  return date.toString();
}

// Backup data to another sheet
function backupData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sourceSheet = getSheet();
    
    // Create backup sheet name with timestamp
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm-ss');
    const backupSheetName = 'Backup_' + timestamp;
    
    // Copy the sheet
    const backupSheet = sourceSheet.copyTo(spreadsheet);
    backupSheet.setName(backupSheetName);
    
    Logger.log('Data backed up to sheet: ' + backupSheetName);
    return { success: true, message: 'Backup created: ' + backupSheetName };
    
  } catch (error) {
    Logger.log('Error creating backup: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
