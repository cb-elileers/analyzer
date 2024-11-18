import main from './main';

/*   .---. ,--.  ,--  / ,---.   ,--.   ,--.'  ,-. .----. ,------.,------, 
    / .  | |   \ |  | | \ /`.\  |  |   `\ . '.' /\_.-,  ||  .---'|   /`. ' 
   / /|  | |  . '|  |)'-'|_.' | |  |     \     /   |_  <(|  '--. |  |_.' | 
  / '-'  |||  |\    |(|  .-.  |(|  '_     /   /) .-. \  ||  .--' |  .   .' 
  `---|  |'|  | \   | |  | |  | |     |`-/   /`  \ `-'  /|  `---.|  |\  \  
    `--' `--'  `--' `--' `--' `-----'  `--'     `---'' `------'`--' '--' */

// ================================= PARAMETERS ================================

import { program } from 'commander';

program
  .argument('[basePath]', 'Path were the contracts lies')
  .option('-s, --scope <scopeFile>', '.txt file containing the contest scope')
  .option('-g, --github <githubURL>', 'github url to generate links to code')
  .option('-o, --out <reportPath>', 'Path for Markdown report')
  .option('-l, --listfiles', 'List analyzed files in Markdown Report')
  .option('--legacyscope <scopeFile>', 'Path for legacy scope file')
  .option('--sarif [string]', 'Generate SARIF report, optionally include path to report. Default is analyzer.sarif', )
  .action((basePath:string, options) => {
    basePath = basePath ||'contracts/';
    basePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
    console.log(`basePath: ${basePath}`);
    console.log(`scope: ${options.scope||'----'}`);
    console.log(`github: ${options.github||'----'}`);
    console.log(`out: ${options.out||'report.md'}`);
    console.log(`legacyScope: ${options.legacyscope||'----'}`);
    console.log(`sarif: ${options.sarif||'----'}`);

    let sarif;
    if(options.sarif === undefined) sarif = undefined;
    else if(options.sarif === true) sarif = 'analyzer.sarif';
    else sarif = options.sarif;

    console.log('*****************************')
    // ============================== GENERATE REPORT ==============================
    main(basePath, options.scope, options.github, options.out || 'report.md', options.legacyscope, sarif, options.listfiles);
  }).parse();
