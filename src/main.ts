import * as fs from 'fs';
import analyze from './analyze';
import sarif from './sarif';
import compileAndBuildAST from './compile';
import issues from './issues';
import markdown from './markdown';
import { InputType, IssueTypes, Analysis, AnalysisResults, ReportTypes } from './types';
import { recursiveExploration } from './utils';

/*   .---. ,--.  ,--  / ,---.   ,--.   ,--.'  ,-. .----. ,------.,------, 
    / .  | |   \ |  | | \ /`.\  |  |   `\ . '.' /\_.-,  ||  .---'|   /`. ' 
   / /|  | |  . '|  |)'-'|_.' | |  |     \     /   |_  <(|  '--. |  |_.' | 
  / '-'  |||  |\    |(|  .-.  |(|  '_     /   /) .-. \  ||  .--' |  .   .' 
  `---|  |'|  | \   | |  | |  | |     |`-/   /`  \ `-'  /|  `---.|  |\  \  
    `--' `--'  `--' `--' `--' `-----'  `--'     `---'' `------'`--' '--' */

// ============================== GENERATE REPORT ==============================

/**
 * @param basePath Path were the contracts lies
 * @param scopeFile .txt file containing the contest scope
 * @param githubLink github url to generate links to code
 * @param out where to save the report
 * @param scope optional text containing the .sol files in scope. Replaces `scopeFile`
 */
const main = async (
  basePath: string,
  scopeFile: string | null,
  githubLink: string | null,
  out: string,
  scope?: string,
  sarifOut?: string
) => {
  let fileNames: string[] = [];

  if (!!scopeFile || !!scope) {
    // Scope is specified in a .txt file or is passed in a string
    const content = scope ?? fs.readFileSync(scopeFile as string, { encoding: 'utf8', flag: 'r' });
    for (const word of [...content.matchAll(/[a-zA-Z\/\.\-\_0-9]+/g)].map(r => r[0])) {
      if (word.endsWith('.sol') && fs.existsSync(`${basePath}${word}`)) {
        fileNames.push(word);
      }
    }
    if (fileNames.length === 0) throw Error('Scope is empty');
  } else {
    // Scope is not specified: exploration of the folder
    fileNames = recursiveExploration(basePath);
  }

  console.log('Scope: ', fileNames);

  // Uncomment next lines to have the list of analyzed files in the report
  // todo: parameterize this

  // result += '## Files analyzed\n\n';
  // fileNames.forEach(fileName => {
  //   result += ` - ${fileName}\n`;
  // });

  // Read file contents and build AST
  const files: InputType = [];
  const asts = await compileAndBuildAST(basePath, fileNames);
  fileNames.forEach((fileName, index) => {
    files.push({
      content: fs.readFileSync(`${basePath}${fileName}`, { encoding: 'utf8', flag: 'r' }),
      name: fileName,
      ast: asts[index],
    });
  });

  let analysisResultsObj: AnalysisResults = {};

  // todo: parameterize which issue types to run
  for (const t of Object.values(IssueTypes)) {
    let analyses: Analysis[] = analyze(
      files,
      issues.filter(i => i.type === t),
      !!githubLink ? githubLink : undefined,
    );

    // add analyze results for this issue type to the results object
    analysisResultsObj[t] = analyses;
  }

  // Do markdown conversion
  let markdownResult = markdown(analysisResultsObj, fileNames);
  fs.writeFileSync(out, markdownResult);

  if(sarifOut){
    let sarifAnalyses: Analysis[] = [];
  
    for (const t of Object.values(IssueTypes)) {
      sarifAnalyses = sarifAnalyses.concat((analysisResultsObj[t] ?? []));
    }

    let sarifResult = sarif(sarifAnalyses);

    fs.writeFileSync(sarifOut, JSON.stringify(sarifResult, null, 2), 'utf-8');
  }
};

export default main;
