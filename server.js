/**
 * Zenith University Admissions Bureau - Local Server
 * Zero external dependencies needed!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  if (pathname === '/process.php' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = querystring.parse(body);
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const randomRef = 'ZIAT-' + now.getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

      let formattedDob = data.candidateDob || '';
      if (data.candidateDob) {
        const d = new Date(data.candidateDob);
        if (!isNaN(d.getTime())) {
          formattedDob = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
      }

      const responsePayload = {
        status: 'success',
        message: 'Candidate application registered successfully.',
        data: {
          regId: randomRef,
          dateIssued: dateStr,
          timestamp: `${dateStr}, ${timeStr}`,
          candidateName: data.candidateName || '',
          candidateEmail: data.candidateEmail || '',
          candidatePhone: data.candidatePhone || '',
          candidateDob: formattedDob,
          candidateGender: data.candidateGender || '',
          targetCourse: data.targetCourse || '',
          studyMode: data.studyMode || '',
          qualExam: data.qualExam || '',
          qualScore: data.qualScore || '',
          homeAddress: data.homeAddress || '',
          homeCity: data.homeCity || '',
          postalZip: data.postalZip || '',
          aspirations: data.aspirations || ''
        }
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responsePayload));
    });
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Zenith University Admissions App is running!`);
  console.log(` Open URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
