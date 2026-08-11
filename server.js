const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

// Ensure course_data.json exists before serving
const dataFile = path.join(publicDir, 'course_data.json');
if (!fs.existsSync(dataFile)) {
  console.log('course_data.json missing. Running compiler...');
  require('./compile.js');
}

app.use(express.static(publicDir));

// API Endpoint for course data
app.get('/api/course-data', (req, res) => {
  if (fs.existsSync(dataFile)) {
    res.sendFile(dataFile);
  } else {
    res.status(404).json({ error: 'Course data not found. Run npm run build first.' });
  }
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Islamic Studies LMS Server is running!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});
