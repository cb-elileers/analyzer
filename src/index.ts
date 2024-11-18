import main from './main';

/*   .---. ,--.  ,--  / ,---.   ,--.   ,--.'  ,-. .----. ,------.,------, 
    / .  | |   \ |  | | \ /`.\  |  |   `\ . '.' /\_.-,  ||  .---'|   /`. ' 
   / /|  | |  . '|  |)'-'|_.' | |  |     \     /   |_  <(|  '--. |  |_.' | 
  / '-'  |||  |\    |(|  .-.  |(|  '_     /   /) .-. \  ||  .--' |  .   .' 
  `---|  |'|  | \   | |  | |  | |     |`-/   /`  \ `-'  /|  `---.|  |\  \  
    `--' `--'  `--' `--' `--' `-----'  `--'     `---'' `------'`--' '--' */

// ================================= PARAMETERS ================================

// process parameter flags
const argv = key => {
  // Return true if the key exists and a value is undefined
  // if ( process.argv.includes( `--${ key }` ) ) return true;

  const value = process.argv.find( element => element.startsWith( `--${ key }=` ) );

  // Return undefined if the key does not exist and a value is undefined
  if ( !value ) return undefined;
  
  return value.replace( `--${ key }=` , '' );
}

const basePath =
  process.argv.length > 2 ? (process.argv[2].endsWith('/') ? process.argv[2] : process.argv[2] + '/') : 'contracts/';
const scopeFile = process.argv.length > 3 && process.argv[3].endsWith('txt') ? process.argv[3] : null;
const githubLink = process.argv.length > 4 && process.argv[4] ? process.argv[4] : null;
const out = argv("out") ?? 'report.md';
const scope = argv("scope");
const sarif = argv("sarif");


// ============================== GENERATE REPORT ==============================

main(basePath, scopeFile, githubLink, out, scope, 'sarif.sarif');
