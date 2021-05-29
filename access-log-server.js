const fs = require('fs');
const { exec } = require('child_process');

const express = require('express');

const app = express();
const PORT = 5710;

const rawAccessToJSON = (string, totLines) => {
  const accessLines = string.split(/\n/).map(line => { try { return JSON.parse(line) } catch { return null; } }).filter(item => !!item);
  const accessByIp = accessLines.slice(accessLines.length - totLines).reduce((acc, { time, ClientHost, RequestPath, ...rest }) => {
    if (!acc[ClientHost]) {
        acc[ClientHost] = [{ time, path: RequestPath, ...rest }];
    } else {
        acc[ClientHost].push({ time, path: RequestPath, ...rest });
    }

    return acc;
  }, {});

  return {
    accessByIp,
    sorted: Object.values(accessByIp).sort((a, b) => {
      if (a.length > b.length) {
        return -1;
      }
      if (a.length < b.length) {
        return 1;
      }
      return 0;
    }),
  };
};

app.get('/access-logs/:key/:tot', async (req, res) => {
  if (req.params.key === 'b425365nsjeka;aebhiav5465a') {
    try {
      const logs = fs.readFileSync('/log/traefik/access.log.json', 'utf-8');
      const totLines = +req.params.tot;
      // could also get logs using exec(`docker logs traefik --tail ${totLines}`);

      const accessByIp = rawAccessToJSON(logs, totLines);
      res.send(`<script>data = ${JSON.stringify(accessByIp)}</script>`);
    } catch (error) {
      res.json({ error: 'Something went wrong', message: error.message });
    }
  } else {
    res.status(404).end();
  }
});

app.listen(PORT, () => console.log(`Access logs server listening on port ${PORT}`));
