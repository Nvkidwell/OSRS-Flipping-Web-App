

# ⚔️ OSRS Item Flipping Tracker

A comprehensive Old School RuneScape themed web application for tracking Grand Exchange item flips, built with Google Apps Script and featuring advanced analytics dashboard.

![OSRS Flipping Tracker](https://img.shields.io/badge/OSRS-Flipping%20Tracker-gold?style=for-the-badge&logo=runescape)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Features

### 📊 **Main Tracker**
- **Add & manage flips** with item name, buy/sell prices, quantities
- **Real-time profit calculations** with ROI percentages
- **Status tracking** (Active/Completed flips)
- **Interactive data table** with edit/delete functionality
- **Quick action buttons** for common tasks

- <img width="1187" height="658" alt="image" src="https://github.com/user-attachments/assets/090c748c-0d4a-4775-bd87-c995d18de114" />


### 📈 **Advanced Dashboard**
- **Portfolio overview** with key performance metrics
- **Profit trend visualization** (Chart.js integration ready)
- **Top performing items** leaderboard with ROI data
- **Recent activity feed** with flip milestones
- **Performance insights** and analytics

- <img width="970" height="779" alt="image" src="https://github.com/user-attachments/assets/55fe55ff-088b-44d2-b95a-668afb403b29" />


### 📜 **History & Analytics**
- **Complete flip history** with search and filtering
- **Export functionality** for data backup
- **Portfolio performance analysis** by time periods
- **Win rate calculations** and success metrics
- **Backup and restore** capabilities

### 🎨 **OSRS Themed Design**
- **Medieval color scheme** (browns, golds, deep reds)
- **Cinzel font** for authentic RuneScape feel
- **Gradient backgrounds** and hover effects
- **Responsive design** for desktop and mobile
- **Loading animations** with medieval spinner

## 🚀 Quick Start

### Prerequisites
- Google Account with access to Google Sheets and Apps Script
- Basic understanding of Google Apps Script deployment

### Installation

1. **Create a new Google Sheet**
   ```
   File → New → Google Sheets
   Name it "OSRS Flipping Tracker"
   ```

2. **Open Google Apps Script**
   ```
   Extensions → Apps Script
   ```

3. **Replace default code**
   - Copy the content from `Code.gs` into the script editor
   - Create a new HTML file called `index.html`
   - Copy the web app HTML content into the HTML file

4. **Deploy as Web App**
   ```
   Deploy → New Deployment
   Type: Web app
   Execute as: Me
   Who has access: Anyone (or as preferred)
   ```

5. **Add sample data** (optional)
   - Copy the dummy data from the provided sample
   - Paste into your Google Sheet starting from Row 1

### Configuration

The tracker automatically initializes with these columns:
- Date, Item Name, Buy Price, Sell Price, Quantity
- Total Invested, Total Return, Profit, ROI %, Status, Notes

## 📱 Usage

### Adding a New Flip
1. Navigate to the **Main Tracker** tab
2. Fill in the flip details in the **Add New Flip** panel
3. Click **Add Flip** to save to your sheet
4. View the flip in the data table below

### Viewing Analytics
1. Click the **Dashboard** tab for advanced analytics
2. View portfolio performance metrics
3. Check top performing items and recent activity
4. Analyze profit trends over time

### Managing Data
- **Edit flips** by clicking the Edit button in the table
- **Refresh data** to sync with your Google Sheet
- **Export data** for backup or external analysis
- **Clear all flips** to start fresh (with confirmation)

## 🛠️ Technical Details

### Architecture
```
Google Sheets (Data Storage)
     ↕
Google Apps Script (Backend API)
     ↕
HTML/CSS/JavaScript (Frontend)
```

### Backend Functions
- `addFlip(flipData)` - Add new flip to sheet
- `getFlips()` - Retrieve all flips data
- `getDashboardData()` - Get analytics data
- `deleteFlip(index)` - Remove specific flip
- `clearAllFlips()` - Remove all data
- `getMostProfitableItems()` - Top performers
- `getPortfolioInsights()` - Performance analytics

### Frontend Components
- **Navigation system** with tab switching
- **Real-time data updates** via Google Apps Script API
- **Responsive grid layouts** for different screen sizes
- **Form validation** and error handling
- **Loading states** and user feedback

## 📊 Sample Data

The repository includes comprehensive dummy data with:
- **50 realistic flips** across various OSRS items
- **Mix of high-value and volume trades**
- **Different time periods** for trend analysis
- **Profitable and active flips** for complete testing

Items include:
- High-value: Twisted Bow, Scythe of Vitur, Dragon Claws
- Mid-tier: Bandos armor, Primordial Boots, Ghrazi Rapier  
- Volume: Rune items, Dragon equipment, Barrows pieces

## 🎯 Key Metrics Tracked

### Portfolio Metrics
- **Total Profit** - Sum of all completed flip profits
- **Portfolio ROI** - Overall return on investment percentage
- **Win Rate** - Percentage of profitable flips
- **Active Investment** - Total GP currently invested
- **Average Profit** - Mean profit per completed flip

### Item Analytics
- **Most Profitable Items** - Top performers by total profit
- **Best ROI Items** - Highest percentage returns
- **Flip Frequency** - Most commonly traded items
- **Success Rates** - Win percentage by item type

### Time-based Analysis
- **Daily Profit Trends** - Performance over time
- **Best Performing Days** - Peak profit periods
- **Flip Duration** - Average time per flip
- **Seasonal Patterns** - Long-term market trends

## 🔧 Customization

### Styling
The OSRS theme uses CSS custom properties that can be easily modified:
```css
:root {
  --primary-brown: #8b4513;
  --secondary-brown: #a0522d;
  --gold-accent: #ffcc00;
  --background-dark: #2d1810;
}
```

### Adding New Features
1. **Backend**: Add new functions to `Code.gs`
2. **Frontend**: Update HTML and JavaScript
3. **Data**: Modify Google Sheet structure as needed

### Configuration Options
- Modify profit calculation methods
- Add new item categories
- Customize chart appearances
- Change refresh intervals

## 📁 File Structure

```
osrs-flipping-tracker/
├── Code.gs                 # Google Apps Script backend
├── index.html             # Main web application
├── dashboard.html         # Dashboard view (optional)
├── sample-data.csv        # Dummy data for testing
├── README.md             # This file
└── screenshots/          # Application screenshots
```

## 🐛 Troubleshooting

### Common Issues

**"Script not found" error**
- Ensure the Google Apps Script is deployed as a web app
- Check that execution permissions are set correctly

**Data not loading**
- Verify the Google Sheet has the correct column headers
- Check Google Apps Script logs for errors
- Ensure the sheet is named correctly

**Styling issues**
- Clear browser cache and reload
- Check for JavaScript console errors
- Verify all CSS imports are loading

### Debug Mode
Enable debug logging by adding to your script:
```javascript
Logger.log('Debug: Function called with data: ' + JSON.stringify(data));
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex functionality
- Test thoroughly with various data scenarios
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Happy Flipping! 💰⚔️**

---
