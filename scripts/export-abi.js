const fs = require('fs');
const path = require('path');

// Export ABIs for frontend consumption
function main() {
  const artifactsDir = path.join(__dirname, '../artifacts/contracts');
  const outDir = path.join(__dirname, '../abi');
  if (!fs.existsSync(artifactsDir)) {
    console.error('Artifacts not found. Run `npm run compile` first.');
    process.exit(1);
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const targets = [
    ['VotingFactory.sol', 'VotingFactory'],
    ['Election.sol', 'Election']
  ];

  for (const [file, name] of targets) {
    const p = path.join(artifactsDir, file, `${name}.json`);
    const json = JSON.parse(fs.readFileSync(p));
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(json.abi, null, 2));
    console.log(`Exported ABI: ${name}`);
  }
}

main();


